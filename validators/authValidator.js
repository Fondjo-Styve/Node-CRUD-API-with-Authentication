import joi from 'joi';
export const signUpSchema=joi.object({
    email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim(),
    password:joi.string()
              .required()
              .min(8)
              .max(16)
              .trim(),
    name:joi.string()
            .required() 
            .min(3)
            .max(45) 
            .trim()  
}) 

export const signInSchema=joi.object({
     email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim(),
    password:joi.string()
              .required()
              .min(8)
              .max(16)
              .trim()
})

export const verificationCodeSchema=joi.object({
    email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim(),
})

export const verifyVerificationCodeSchema=joi.object({
    email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim(),
verificationCode:joi.string()
                    .required()
                    .trim()
})

export const changePasswordSchema=joi.object({
     oldPassword:joi.string()
              .required()
              .min(8)
              .max(16)
              .trim(),
     newPassword:joi.string()
              .required()
              .min(8)
              .max(16)
              .trim()
})

export const forgotPasswordSchema=joi.object({
    email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim()
})

export const forgotPasswordVerificationCodeSchema=joi.object({
    email:joi.string()
             .required()
             .max(60)
             .lowercase()
             .email()
             .trim(),
    verificationCode:joi.string()
                        .required()
                        .trim()
})

export const resetPasswordSchema=joi.object({
  newPassword:joi.string()
                 .required()
                 .min(8)
                 .max(16)
                 .trim(),
  resetToken: joi.string()
                 .required(),
})