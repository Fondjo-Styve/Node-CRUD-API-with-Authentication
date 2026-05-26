import { sendMail } from "../configs.js/sendMail.js";
import { 
  verificationCodeSchema,
  forgotPasswordSchema,
  verifyVerificationCodeSchema,
  signInSchema,
  changePasswordSchema,
  signUpSchema,
  forgotPasswordVerificationCodeSchema,
  resetPasswordSchema
 } from "../validators/authValidator.js"
import {User} from '../models/userModel.js';
import { 
  passwordCompare, 
  passwordHash, 
  VerificationCodeCompare,
  VerificationCodeHash 
} from "../utils/hashing.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
// signUp controller
export const signUp=async (req,res,next)=>{
  const {error,value}=signUpSchema.validate(req.body)
  if(error){

    const error=new Error(error.details[0].message);
    error.status(400)
    return next(error);
            }
  const {name,email,password}=value;
  try {
    const existingUser=await User.findOne({email})
  
    if(existingUser){
      const error=new Error('user with this email already exists');
      error.status=403;
      return next(error)
    }

    const hashedPassword=await passwordHash(password,12);
    const newUser=new User({
      email,
      name,
      password:hashedPassword
    })
 
    const saveUser = await newUser.save()
    saveUser.password=undefined;
    return res.status(201)
            .json({success:true,message:`You've successully signedUp ${name}`,data:saveUser})
    } catch (error) {
      next(error);
   }
 
}

// signIn controller
export const signIn=async(req,res,next)=>{
    const {error,value}=signInSchema.validate(req.body);
    if(error){
      const err=new Error(error.details[0].message);
      err.status(400);
      return next(err);
    } 

      const{email,password}=value;
    try {
       
        const existingUser=await User.findOne({email}).select('+password +verified +role');
      
        if(!existingUser){
           const err=new Error('user not found');
           err.status=404;
           return next(err);
        }

        if(!existingUser.verified){
            const err=new Error('User not yet verified');
            err.status=403;
            return next(err);
        }
      
        const passwordMatch=await passwordCompare(password,existingUser.password);
        if(!passwordMatch){
            const err=new Error('Invalid credentials')
            err.status=401;
            return next(err);
        }

        const token=jwt.sign({
          userId:existingUser._id,
          email:existingUser.email,
          role:existingUser.role,
          verified:existingUser.verified
        },process.env.TOKEN_SECRET,{expiresIn:'1h'})

       return res.status(200)
                 .cookie('Authorization',token,{
                         httpOnly:true,
                         expires:new Date(Date.now() + 3600000) })
                 .json({
                    success:true,
                    token,
                    message:'signIn successful'
               })
   
    } catch (err) {
       next(err);
 }
}

// signOut controller
export const signOut=async (req,res,next)=>{
 try {
    
      return res
       .clearCookie('Authorization',{
         httpOnly:true,
       })
       .status(200)
       .json({
         success:true,
         message:'youve successfully signed out'
       })
 } catch (error) {
   next(error);
 }
}

// send verification code
export const sendVerificationCode=async (req,res,next)=>{
    const {error,value}=verificationCodeSchema.validate(req.body);
   
    if(error){
      const error=new Error(error.details[0].message);
      error.status=400;
      return next(error);
    }

    const {email}=value;
    try {
        const existingUser=await User.findOne({email}).select('+verified');
        if(!existingUser){
          const error=new Error('User not found');
          error.status=404;
          return next(error);
        }
       
        if(existingUser.verified){
           const error=new Error('User already verified')
           error.status=403;
           return next(error);
        }
    
        const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode=await VerificationCodeHash(VerificationCode,10)
        
        existingUser.emailVerificationCode=hashedCode;
        existingUser.emailVerificationCodeExpiresAt=Date.now() + 5 * 60 * 1000;

        await sendMail(
            email,
            "Your Verification Code",
            `<h1>Your code is: ${VerificationCode}</h1><p>It expires in 5 minutes.</p>`
        )
        await existingUser.save()
        return res.status(201)
                  .json({
                    success:true,
                    message:'verification code sent sucesfully it expires in 5 minutes'
                  })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// verify verification code
export const verifyVerificationCode = async (req, res, next) => {
    const { error, value } = verifyVerificationCodeSchema.validate(req.body);
    
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 403;
        return next(err);
    }

    const { email, verificationCode } = value;
   
    try {
        const existingUser = await User.findOne({ email }).select('+verified +emailVerificationCodeExpiresAt +emailVerificationCode');
        
        if (!existingUser) {
            const err = new Error('User does not exist');
            err.statusCode = 404; // Changed from 403 to 404 (Not Found)
            return next(err);
        }

        if (existingUser.verified) {
           const err = new Error('User already verified');
           err.statusCode = 403;
           return next(err);
        }
       
        if (Date.now() > existingUser.emailVerificationCodeExpiresAt) {
            const err = new Error('Code expired');
            err.statusCode = 400; // Changed from 402 to 400 (Bad Request)
            return next(err);
        }
 
        const isMatch = await VerificationCodeCompare(verificationCode, existingUser.emailVerificationCode);
        if (!isMatch) {
            const err = new Error('Verification code is invalid or has expired');
            err.statusCode = 400;
            return next(err);
        }
        
        existingUser.emailVerificationCode = undefined;
        existingUser.verified = true;
        existingUser.emailVerificationCodeExpiresAt = undefined;
    
        await existingUser.save();

        // ONLY success responses stay as res.status().json()
        return res.status(200).json({
            success: true,
            message: 'verification successful'
        });

    } catch (error) {
        // Unplanned errors (DB crashes, etc.) teleport to the Global Handler
        next(error);
    }
}

// change password
export const changePassword = async (req, res, next) => {
  const userId = req.user.userId;
  const { error, value } = changePasswordSchema.validate(req.body);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  const { oldPassword, newPassword } = value;
 
  try {
    const existingUser = await User.findById(userId).select('+password +verified');
    
    if (!existingUser) {
      const err = new Error('User does not exist');
      err.statusCode = 404;
      return next(err);
    }

    if (!existingUser.verified) {
      const err = new Error('User not verified');
      err.statusCode = 403;
      return next(err);
    }
    
    const isPasswordMatch = await passwordCompare(oldPassword, existingUser.password);
    if (!isPasswordMatch) {
      const err = new Error('password does not match');
      err.statusCode = 401;
      return next(err);
    }

    const hashedNewPassword = await passwordHash(newPassword, 12);
    existingUser.password = hashedNewPassword;
    await existingUser.save();

    res.clearCookie("Authorization");
    
    return res.status(200).json({
      success: true,
      message: 'your password has been successfully changed'
    });
  } catch (error) {
    next(error);
  }
};

// forgot password
export const forgotPassword = async (req, res, next) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400; // Changed from 401 to 400 for validation errors
    return next(err);
  }

  const { email } = value;
  
  try {
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      const err = new Error('User does not exist');
      err.statusCode = 404;
      return next(err);
    }

    const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await sendMail(
      email,
      "Your forgot password Verification Code",
      `<h1>Your code is: ${VerificationCode}</h1><p>It expires in 5 minutes.</p>`
    );
    
    const hashedCode = await VerificationCodeHash(VerificationCode, 10);
    existingUser.forgotPasswordResetCode = hashedCode;
    existingUser.forgotPasswordResetCodeExpiresAt = Date.now() + 5 * 60 * 1000;

    await existingUser.save();
    
    return res.status(201).json({
      success: true,
      message: 'forgot password code sent successfully it expires in 5 minutes'
    });
          
  } catch (error) {
    next(error);
  }
};

// verifiy forgot password
export const verifyForgotPasswordCode = async (req, res, next) => {
  const { error, value } = forgotPasswordVerificationCodeSchema.validate(req.body);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400; // Changed from 401
    return next(err);
  }

  const { email, verificationCode } = value;
  
  try {
    const existingUser = await User.findOne({ email }).select('+forgotPasswordResetCodeExpiresAt +forgotPasswordResetCode');
    
    if (!existingUser) {
      const err = new Error('User does not exist');
      err.statusCode = 404;
      return next(err);
    }

    if (!existingUser.forgotPasswordResetCode || !existingUser.forgotPasswordResetCodeExpiresAt) {
      const err = new Error('something is wrong with the code');
      err.statusCode = 400;
      return next(err);
    }

    if (Date.now() > existingUser.forgotPasswordResetCodeExpiresAt) {
      const err = new Error('verification code expired');
      err.statusCode = 400; // Changed from 401
      return next(err);
    }

    const isVerificationCodeMatch = await VerificationCodeCompare(verificationCode, existingUser.forgotPasswordResetCode);
    
    if (!isVerificationCodeMatch) {
      const err = new Error('verification code does not match');
      err.statusCode = 401;
      return next(err);
    }
 
    const resetToken = jwt.sign(
      { userId: existingUser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: '5m' }
    );

    existingUser.forgotPasswordResetCode = undefined;
    existingUser.forgotPasswordResetCodeExpiresAt = undefined;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: 'verification successful',
      resetToken
    });   
  } catch (error) {
    next(error);
  }
};

// reset password
export const resetPassword = async (req, res, next) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  const { newPassword, resetToken } = value;

  try {
    const decode = jwt.verify(resetToken, process.env.TOKEN_SECRET);
    const existingUser = await User.findById(decode.userId);

    if (!existingUser) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    const hashedNewPassword = await passwordHash(newPassword, 12);
    existingUser.password = hashedNewPassword;
    existingUser.forgotPasswordResetCode = undefined;
    await existingUser.save();
    
    return res.status(200).json({
      success: true,
      message: 'password reset successful'
    });
  } catch (error) {
    next(error);
  }
};