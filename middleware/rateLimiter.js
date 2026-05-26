import rateLimit from 'express-rate-limit';

const createRateLimiter=(limit,minutes,message)=>{
    return rateLimit({
        windowMs:minutes*60*1000,
        max:limit,
        message:{
            success:false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false
    })
}

// limiter for auth routes
export const authLimiter=createRateLimiter(5,15,'Too many login attempts try again after 15 minutes');
// limiter for read routes
export const readLimiter=createRateLimiter(100,15,'Too many attempts try again in 15 minutes');
// limiter for create,update and delete routes
export const cudLimiter=createRateLimiter(10,15,'Too many login attempts try again after 15 minutes');