import { sendEmailOTP, ForgetPasswordEmail } from "../lib/sendEmail.js"
import { sendToken } from "../lib/SendToken.js"
import { CatchAsyncError } from "../middleware/CatchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from '../models/user.model.js'
import twilio from 'twilio'
import crypto from 'crypto';


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

// sign up function 
export const register = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name) {
            return next(new ErrorHandler("Name is Required.", 400));
        }

        if (!email) {
            return next(new ErrorHandler("Email is Required.", 400));
        }
        if (!password) {
            return next(new ErrorHandler("Password is Required.", 400));
        }

        // function validatePhoneNumber(phone) {
        //     const phoneRegex = /^\+91\d{10}$/;
        //     return phoneRegex.test(phone);
        // }
        // if (!validatePhoneNumber(phone)) {
        //     return next(new ErrorHandler("Invalid phone number.", 400));
        // }

        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    emailVerified: true,
                },
            ],
        });

        if (existingUser) {
            return next(new ErrorHandler("Email is already used.", 400));
        }

        const registerationAttemptsByUser = await User.find({
            $or: [
                // { phone, accountVerified: false },
                { email, emailVerified: false },
            ],
        });

        if (registerationAttemptsByUser.length > 3) {
            return next(
                new ErrorHandler(
                    "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
                    400
                )
            );
        }
        const userData = {
            name,
            email,
            role,
            password,
        };

        const user = await User.create(userData);
        const emailverificationCode = user.generateemailVerificationCode();
        await user.save();
        emailsendVerificationCode(
            "email",
            emailverificationCode,
            name,
            email,
            role,
            res
        );
    } catch (error) {
        next(error);
    }
});

// send verificationcode code
async function emailsendVerificationCode(
    verificationMethod,
    verificationCode,
    name,
    email,
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

        else {
            return res.status(400).json({
                success: false,
                message: "Invalid verification method.",
            });
        }
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

    if (!emailOrPhone || !password) {
        return next(new ErrorHandler("Email/Phone & password required", 400));
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
            phoneVerified: true,     // Must be verified
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
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true,
    });

    if (!user) {
        return next(new ErrorHandler("User not found.", 400));
    }

    const resetToken = await user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your Reset Password is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

    try {
        await ForgetPasswordEmail({
            email: user.email,
            message,
            logo: "https://www.wpkixx.com/html/winku/images/logo.png",
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
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
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    console.log("resetPasswordToken", resetPasswordToken)
    console.log("user", user)
    if (!user) {
        return next(new ErrorHandler("Reset password token or has been expired.", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password & Confirm Password do not match.", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, "Reset Password Successfully.", res);
});


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