import { sendEmailOTP, ForgetPasswordEmail } from "../lib/sendEmail.js"
import { sendToken } from "../lib/SendToken.js"
import { CatchAsyncError } from "../middleware/CatchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from '../models/user.model.js'
import twilio from 'twilio'
import crypto from 'crypto';
import { OAuth2Client } from "google-auth-library";
import axios from "axios";


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// register controller - STRONG PASSWORD VALIDATION
export const register = CatchAsyncError(async (req, res, next) => {
    const { fullname, email, password, confirmPassword, role, termsAccepted } = req.body;

    // === Basic Required Fields ===
    if (!fullname?.trim()) return next(new ErrorHandler("Full Name is required.", 400));

    if (!email?.trim()) return next(new ErrorHandler("Email is required.", 400));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return next(new ErrorHandler("Invalid email format.", 400));

    if (!password) return next(new ErrorHandler("Password is required.", 400));

    // === STRONG PASSWORD VALIDATION ===
    if (password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long.", 400));
    }

    if (!/[A-Z]/.test(password)) {
        return next(new ErrorHandler("Password must contain at least one uppercase letter.", 400));
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
        return next(new ErrorHandler("Password must contain at least one special character.", 400));
    }

    if (!/[0-9]/.test(password)) {
        return next(new ErrorHandler("Password must contain at least one number.", 400));
    }

    if (!confirmPassword) return next(new ErrorHandler("Confirm Password is required.", 400));

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400));
    }

    // === Role Validation ===
    if (!role || !['user', 'creator', 'admin'].includes(role)) {
        return next(new ErrorHandler("Valid role is required (user/creator).", 400));
    }

    // === Terms Acceptance ===
    if (termsAccepted !== true) {
        return next(new ErrorHandler("You must accept the Terms & Privacy Policy.", 400));
    }

    // === Check if email already registered & verified ===
    const existingVerifiedUser = await User.findOne({ email: email.toLowerCase(), emailVerified: true });
    if (existingVerifiedUser) {
        return next(new ErrorHandler("This email is already registered and verified.", 409));
    }

    // === Rate limiting unverified accounts (optional but smart) ===
    const unverifiedCount = await User.countDocuments({
        email: email.toLowerCase(),
        emailVerified: false
    });
    if (unverifiedCount >= 3) {
        return next(new ErrorHandler("Too many pending registrations. Please check your email or try again later.", 429));
    }

    // === Create User ===
    const user = await User.create({
        fullname: fullname.trim(),
        email: email.toLowerCase().trim(),
        password, // will be hashed by pre-save middleware
        role,
        termsAccepted: true
    });

    // === Generate OTP for email verification ===
    const verificationCode = user.generateemailVerificationCode();
    await user.save({ validateBeforeSave: false });

    // === Send Verification Email ===
    try {
        await emailsendVerificationCode(verificationCode, fullname, email, role);
    } catch (error) {
        user.emailVerificationCode = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler("Failed to send verification email. Try again.", 500));
    }

    // === Success Response ===
    return res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
    });
});


// send verificationcode code
async function emailsendVerificationCode(
    verificationCode,
    name,
    email,
    role,
    res
) {
    try {
        await sendEmailOTP({
            email,
            verificationCode,
            logo: "https://www.wpkixx.com/html/winku/images/logo.png",
        });
        console.log("Email sent successfully222", email, verificationCode);
        return res.status(200).json({
            success: true,
            message: `Verification email successfully sent to ${name}`,
        });
    } catch (error) {
        console.error("Email Error:", {
            message: error.message,
            code: error.code,
            status: error.status,
        });
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP.",
            error: error.message,
        });
    }
}

// resend OTP
export const resendEmailOTP = CatchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    // === INPUT VALIDATION ===
    if (!email?.trim()) {
        return next(new ErrorHandler("Email is required.", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    // === CHECK IF ALREADY VERIFIED ===
    const verifiedUser = await User.findOne({
        email: normalizedEmail,
        emailVerified: true
    });

    if (verifiedUser) {
        return next(new ErrorHandler("Email is already verified. No need to resend OTP.", 400));
    }

    // === FIND LATEST UNVERIFIED USER ===
    const user = await User.findOne({
        email: normalizedEmail,
        emailVerified: false
    }).sort({ createdAt: -1 });

    if (!user) {
        return next(new ErrorHandler("No registration found. Please register first.", 404));
    }

    // === RATE LIMIT: Max 3 resends per user (customize as needed) ===
    const recentOTPs = await User.countDocuments({
        email: normalizedEmail,
        emailVerified: false,
        emailverificationCodeExpire: { $gt: Date.now() - 2 * 60 * 1000 } // Last 2 mins
    });

    if (recentOTPs >= 3) {
        return next(new ErrorHandler("Too many OTP requests. Please try again after 2 minutes.", 429));
    }

    // === GENERATE NEW OTP ===
    const newVerificationCode = user.generateemailVerificationCode();
    await user.save({ validateBeforeSave: false });

    // === SEND OTP VIA EMAIL ===
    try {
        await sendEmailOTP({
            email: normalizedEmail,
            verificationCode: newVerificationCode,
            logo: "https://www.wpkixx.com/html/winku/images/logo.png",
        });

        return res.status(200).json({
            success: true,
            message: "New verification code sent successfully.",
        });
    } catch (error) {
        // Cleanup on failure
        user.emailverificationCode = undefined;
        user.emailverificationCodeExpire = undefined;
        await user.save({ validateBeforeSave: false });

        console.error("Resend OTP Email Error:", error);
        return next(new ErrorHandler("Failed to send OTP. Please try again.", 500));
    }
});

// send phone verification code
async function phonesendVerificationCode(
    verificationMethod,
    verificationCode,
    name,
    phone,
    role,
    res
) {
    try {
        if (verificationMethod === "email") {
            await sendEmailOTP({
                email,
                verificationCode,
                logo: "https://www.wpkixx.com/html/winku/images/logo.png",
            });
            return res.status(200).json({
                success: true,
                message: `Verification email successfully sent to ${name}`,
            });
        }

        else if (verificationMethod === "phone") {
            // === DYNAMIC CLIENT CREATION ===
            if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
                throw new Error("Twilio credentials are missing in environment variables.");
            }

            const twilio = (await import('twilio')).default;
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

            await client.messages.create({
                body: `Your verification code is ${verificationCode}. It expires in 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });

            return res.status(200).json({
                success: true,
                message: `OTP sent via SMS to ${phone}`,
            });
        }

        else {
            return res.status(400).json({
                success: false,
                message: "Invalid verification method.",
            });
        }
    } catch (error) {
        console.error("Twilio Error:", {
            message: error.message,
            code: error.code,
            status: error.status,
        });
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP.",
            error: error.message,
        });
    }
}


// verify code 
export const emailverifyOTP = CatchAsyncError(async (req, res, next) => {
    let { email, otp } = req.body;

    // === INPUT NORMALIZATION ===
    email = email?.trim().toLowerCase();
    otp = otp?.trim();

    if (!email || !otp) {
        return next(new ErrorHandler("Email and OTP are required.", 400));
    }

    // === VALIDATE OTP ===
    const otpNumber = Number(otp);
    if (isNaN(otpNumber) || otp.length !== 5) {
        return next(new ErrorHandler("OTP must be a 5-digit number.", 400));
    }

    try {
        // === CHECK IF ALREADY VERIFIED ===
        const alreadyVerified = await User.findOne({
            $or: [
                { email, emailVerified: true },
            ]
        });

        if (alreadyVerified) {
            return next(new ErrorHandler("Email is already verified.", 400));
        }

        // === FIND UNVERIFIED USER ENTRIES (Case-insensitive) ===
        const userAllEntries = await User.find({
            $or: [
                { email, emailVerified: false },
            ]
        })
            .collation({ locale: 'en', strength: 2 }) // Case-insensitive
            .sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending verification found. Please register again."
            });
        }

        // === KEEP LATEST ENTRY, DELETE OLD ONES ===
        const user = userAllEntries[0];
        if (userAllEntries.length > 1) {
            const idsToDelete = userAllEntries.slice(1).map(u => u._id);
            await User.deleteMany({ _id: { $in: idsToDelete } });
        }

        // === VERIFY OTP ===
        if (user.emailverificationCode !== otpNumber) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // === CHECK EXPIRY ===
        if (!user.emailverificationCodeExpire || Date.now() > new Date(user.emailverificationCodeExpire).getTime()) {
            return next(new ErrorHandler("OTP has expired.", 400));
        }

        // === FINALIZE VERIFICATION ===
        user.emailVerified = true;
        user.emailverificationCode = null;
        user.emailverificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        // === SEND JWT TOKEN ===
        sendToken(user, 200, "Email verified successfully!", res);

    } catch (error) {
        console.error("verifyOTP Error:", error);
        return next(new ErrorHandler("Verification failed. Please try again.", 500));
    }
});


// email verify code
export const verifyOTP = CatchAsyncError(async (req, res, next) => {
    let { email, otp, phone } = req.body;

    // === INPUT NORMALIZATION ===
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    otp = otp?.trim();

    if (!email || !phone || !otp) {
        return next(new ErrorHandler("Email, phone, and OTP are required.", 400));
    }

    // === VALIDATE PHONE ===
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return next(new ErrorHandler("Invalid phone number format. Use +91XXXXXXXXXX", 400));
    }

    // === VALIDATE OTP ===
    const otpNumber = Number(otp);
    if (isNaN(otpNumber) || otp.length !== 5) {
        return next(new ErrorHandler("OTP must be a 5-digit number.", 400));
    }

    try {
        // === CHECK IF ALREADY VERIFIED ===
        const alreadyVerified = await User.findOne({
            $or: [
                { email, accountVerified: true },
                { phone, accountVerified: true }
            ]
        });

        if (alreadyVerified) {
            return next(new ErrorHandler("Account is already verified.", 400));
        }

        // === FIND UNVERIFIED USER ENTRIES (Case-insensitive) ===
        const userAllEntries = await User.find({
            $or: [
                { email, accountVerified: false },
                { phone, accountVerified: false }
            ]
        })
            .collation({ locale: 'en', strength: 2 }) // Case-insensitive
            .sort({ createdAt: -1 });

        if (userAllEntries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending verification found. Please register again."
            });
        }

        // === KEEP LATEST ENTRY, DELETE OLD ONES ===
        const user = userAllEntries[0];
        if (userAllEntries.length > 1) {
            const idsToDelete = userAllEntries.slice(1).map(u => u._id);
            await User.deleteMany({ _id: { $in: idsToDelete } });
        }

        // === VERIFY OTP ===
        if (user.verificationCode !== otpNumber) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // === CHECK EXPIRY ===
        if (!user.verificationCodeExpire || Date.now() > new Date(user.verificationCodeExpire).getTime()) {
            return next(new ErrorHandler("OTP has expired.", 400));
        }

        // === FINALIZE VERIFICATION ===
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        // === SEND JWT TOKEN ===
        sendToken(user, 200, "Account verified successfully!", res);

    } catch (error) {
        console.error("verifyOTP Error:", error);
        return next(new ErrorHandler("Verification failed. Please try again.", 500));
    }
});


// login 
export const login = CatchAsyncError(async (req, res, next) => {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone) {
        return next(new ErrorHandler("Email or Phone is required", 400));
    }

    if (!password) {
        return next(new ErrorHandler("Password is required", 400));
    }

    let user = null;

    // Step 1: Try to find user by email
    user = await User.findOne({
        email: emailOrPhone,
        emailVerified: true
    }).select("+password");

    // Step 2: If not found by email, try by phone (only if phone is verified)
    if (!user) {
        user = await User.findOne({
            phone: emailOrPhone,
            phoneVerified: true,
            emailVerified: true
        }).select("+password");

        if (!user) {
            // Check if phone exists but not verified
            const unverifiedUser = await User.findOne({ phone: emailOrPhone });
            if (unverifiedUser && !unverifiedUser.phoneVerified) {
                return next(new ErrorHandler("Phone number not verified. Please verify your phone first.", 403));
            }
        }
    }

    // Step 3: If no user found at all
    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Step 4: Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Step 5: Login successful
    sendToken(user, 200, "Login successful!", res);
});


// logout
export const logout = CatchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(Date.now()) // Expire immediately
        })
        .json({
            success: true,
            message: "Logged out successfully!"
        });
});


// get user data
export const getUser = CatchAsyncError(async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profilePic: user.profilePic,
            bio: user.bio,
            accountVerified: user.accountVerified,
            createdAt: user.createdAt,
        },
    });
});


//forget password
export const forgotPassword = CatchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Email is required.", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return next(new ErrorHandler("Invalid email format.", 400));

    const user = await User.findOne({
        email: email,
        emailVerified: true,
    });

    if (!user) {
        return next(new ErrorHandler("User not found.", 400));
    }

    const resetToken = await user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // const message = `Your Reset Password is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

    try {
        await ForgetPasswordEmail({
            email: user.email,
            resetPasswordUrl,
            logo: "https://www.wpkixx.com/html/winku/images/logo.png",
        });

        res.status(200).json({
            success: true,
            message: `Password reset link sent to your email ${user.email}.`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new ErrorHandler(
                error.message ?? "Cannot send reset password token.",
                500
            )
        );
    }
});


// reset password
export const resetPassword = CatchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password) {
        return next(new ErrorHandler("Password is required.", 400));
    }
    if (password.length < 6) {
        return next(new ErrorHandler("Password must be at least 6 characters.", 400));
    }
    if (!confirmPassword) {
        return next(new ErrorHandler("Confirm Password is required.", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400));
    }

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
        return next(new ErrorHandler("User Not Found! Try again", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, "Reset Password Successfully.", res);
});


// check auth
export const checkAuth = (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.json({ success: true, authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Optional: fetch fresh user
        User.findById(decoded.id).then(user => {
            if (user) {
                return res.json({
                    success: true,
                    authenticated: true,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                    },
                });
            }
            res.json({ success: true, authenticated: false });
        });
    } catch {
        res.json({ success: true, authenticated: false });
    }
};


// social login
export const socialLogin = CatchAsyncError(async (req, res, next) => {
    const { provider, token } = req.body;

    if (!provider || !token) {
        return next(new ErrorHandler("Provider and token are required.", 400));
    }

    let userData;

    if (provider === "google") {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        userData = {
            providerId: payload.sub,
            email: payload.email,
            fullname: payload.name,
            avatar: payload.picture,
        };
    }

    else if (provider === "facebook") {
        const fbRes = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
        );
        const data = fbRes.data;
        userData = {
            providerId: data.id,
            email: data.email,
            fullname: data.name,
            avatar: data.picture?.data?.url || "",
        };
    }

    else if (provider === "github") {
        const ghRes = await axios.get(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = ghRes.data;
        userData = {
            providerId: data.id,
            email: data.email || `${data.login}@github.com`,
            fullname: data.name || data.login,
            avatar: data.avatar_url,
        };
    }

    else if (provider === "linkedin") {
        const profileRes = await axios.get(
            "https://api.linkedin.com/v2/me",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const emailRes = await axios.get(
            "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        userData = {
            providerId: profileRes.data.id,
            fullname: profileRes.data.localizedFirstName + " " + profileRes.data.localizedLastName,
            email: emailRes.data.elements[0]["handle~"].emailAddress,
        };
    }

    else {
        return next(new ErrorHandler("Invalid provider", 400));
    }

    // 🔎 Check if user already exists
    let user = await User.findOne({ providerId: userData.providerId });

    if (!user) {
        user = await User.create({
            fullname: userData.fullname,
            email: userData.email,
            avatar: userData.avatar,
            provider,
            providerId: userData.providerId,
            emailVerified: true,
            password: crypto.randomBytes(16).toString("hex") // dummy password
        });
    }

    // Send JWT token
    sendToken(user, 200, "Login Successful!", res);
});


