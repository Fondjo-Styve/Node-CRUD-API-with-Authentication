import jwt from 'jsonwebtoken';
import 'dotenv/config';

 export const identifier = (req,res,next)=>{
    let token = req.cookies.Authorization || req.headers.authorization

    if (!token) {
        const error = new Error('no token found');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const verifyToken=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verifyToken;
        next();

    } catch (error) {
      error.message=`invalid or expired token: ${error.message}`;
      error.statusCode=401;
      return next(error);   
 }
}

