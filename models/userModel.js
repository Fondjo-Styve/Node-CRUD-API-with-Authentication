import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true 
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'name is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false
    },
    role:{
        type:String,
        default:'user',
        enum:['user','admin']
    },
    verified: {
        type: Boolean,
        default: false
    },
    // Reset Password Fields
    forgotPasswordResetCode: {
        type: String, // Changed to String to allow for hashing
        select: false
    },
    forgotPasswordResetCodeExpiresAt: {
        type: Date,
    },
    // Email Verification Fields
    emailVerificationCode: {
        type: String,
        select: false
    },
    emailVerificationCodeExpiresAt: {
        type: Date,
    }
}, { 
    timestamps: true 
});

export const User = mongoose.model('User', userSchema);