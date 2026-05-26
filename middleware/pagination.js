export const pagination=(req,res,next)=>{
    const page= parseInt(req.query.page) || 1;
    const limit=10;

    const skip=(page-1)*limit;

    req.pagination={
        page,limit,skip
    };

    next();
};