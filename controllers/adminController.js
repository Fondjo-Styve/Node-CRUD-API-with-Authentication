import { User } from "../models/userModel.js";
import { idSchema } from "../validators/blogValidator.js";

// delete single user 
export const deleteUSer=async(req,res,next)=>{
    const adminId=req.user.userId;

    const {error,value}=idSchema.validate(req.params)
    if(error){
        const validationError=new Error(error.details[0].message)
        validationError.status=400;
        return next(validationError);
    }
        const targetUserId=value.id;
    try {
        const existingAdmin=await User.findById(adminId);
        if(!existingAdmin || existingAdmin.role !=='admin')
        {
            const error=new Error('Unauthorized access you are no longer an admin');
            error.status=403;
            return next(error);
        }

        const userToDelete=await User.findByIdAndDelete(targetUserId);
        if(!userToDelete){
            const error=new Error('No user found to delete');
            error.status=404;
            return next(error);
        }

        if(adminId==targetUserId){
            const error=new Error('You cannot delete your self');
            error.status=403;
            return next(error);
        }
        res.status(200)
           .json({
            success:true,
            message:`${userToDelete.email} has been deleted sucessfully`
           })
    } catch (error) {
        next(error);
    }
}

// delete multiple users
export const deleteAllUsers=async(req,res,next)=>{
    const adminId=req.user.userId;
    try {
        const existingAdmin=await User.findById(adminId);

        if(!existingAdmin || existingAdmin.role !=='admin'){
          const error=new Error('Unauthorized access you are not an admin');
          error.status=403;
          return next(error);
        }

        const userCount=await User.countDocument()
        if(userCount==0){
            return res.status(200)
                      .json({
                        success:true,
                        message:'No user found in the database'
                      })
        }

        const deleteAll=await User.deleteMany({role:'user'});
        return res.status(200)
                  .json({
                    success:true,
                    message:`Sucessfully cleared ${deleteAll.deletedCount} from the database`,
                    count:deleteAll.deletedCount
                  })
    } catch (error) {
        next(error);
    }
}
