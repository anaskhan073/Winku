import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        default: ""
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailverificationCode: Number,
    emailverificationCodeExpire: {
        type: Date,
    },
    courntryCode: {
        type: String,
    },
    phone: {
        type: String,
        default: null,
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    phoneVerificationCode: Number,
    phoneverificationCodeExpire: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    // accountVerified: { type: Boolean, default: false },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    profilePic: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin'],
        default: 'user',
    },
    authProviders: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    lastSeenAt: {
        type: Date,
    },
    settings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
    },
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // Normalize email & phone
    if (this.email) {
        this.email = this.email.trim().toLowerCase();
    }
    // Generate username if not exists
    if (!this.username || this.username.trim() === "") {
        const emailPart = this.email ? this.email.split("@")[0] : "user";
        let username;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            username = `${emailPart}${randomNum}`.slice(0, 25);
            const existing = await mongoose.models.User.findOne({ username });
            if (!existing) isUnique = true;
            attempts++;
        }
        this.username = username || `${emailPart}${Date.now().toString().slice(-4)}`;
    }

    // Hash password
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateemailVerificationCode = function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, 0);
        return parseInt(firstDigit + remainingDigits);
    }

    const emailverificationCode = generateRandomFiveDigitNumber();
    this.emailverificationCode = emailverificationCode;
    this.emailverificationCodeExpire = Date.now() + 10 * 60 * 1000;
    return emailverificationCode;
};

// userSchema.methods.generatephoneVerificationCode = function () {
//     function generateRandomFiveDigitNumber() {
//         const firstDigit = Math.floor(Math.random() * 9) + 1;
//         const remainingDigits = Math.floor(Math.random() * 10000)
//             .toString()
//             .padStart(4, 0);
//         return parseInt(firstDigit + remainingDigits);
//     }

//     const phoneverificationCode = generateRandomFiveDigitNumber();

//     this.phoneverificationCode = phoneverificationCode;

//     this.phoneverificationCodeExpire = Date.now() + 10 * 60 * 1000;
//     return phoneverificationCode;
// };

userSchema.methods.generateToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
    });
};


userSchema.methods.generateResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

export const User = mongoose.model("User", userSchema);


