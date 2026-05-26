import express from 'express'
import { signIn,
        forgotPassword,
        verifyForgotPasswordCode,
        resetPassword,signUp,
        signOut,sendVerificationCode,
        changePassword,verifyVerificationCode} 
        from '../controllers/authController.js';
import { deleteAllUsers,deleteUSer } from '../controllers/adminController.js';
import { identifier } from '../middleware/identifier.js';
import {authLimiter } from '../middleware/rateLimiter.js';
import { authorize } from '../middleware/authorize.js';

export const router=express.Router();

// signUp router
router.post('/signUp',authLimiter,signUp);
// signin router 
router.post('/signIn',authLimiter,signIn);
// signOut router
router.post('/signOut',identifier,signOut)
// sending verification code router
router.post('/sendVerificationCode',authLimiter,sendVerificationCode)
// verifying verification code router
router.post('/verifyVerificationCode',authLimiter,verifyVerificationCode)
// change oassword router
router.post('/changePassword',authLimiter,identifier,authorize('user','admin'),changePassword)
// forgot passwprd router
router.post('/forgotPassword',authLimiter,forgotPassword)
// verify forgot password otp router
router.post('/verifyForgotPasswordCode',authLimiter,verifyForgotPasswordCode)
// reset password router
router.post('/resetPassword',authLimiter,resetPassword)
// Delete all users router
router.delete('/deleteAllUsers',authLimiter,identifier,authorize('admin'),deleteAllUsers);
// delete single user router 
router.delete('/deleteUser/:id',authLimiter,identifier,authorize('admin'),deleteUSer);