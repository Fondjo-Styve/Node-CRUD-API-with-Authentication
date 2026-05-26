import {createBlogSchema,updateBlogchema, searchValidator, idSchema} from '../validators/blogValidator.js';
import { Blog } from '../models/blogModel.js';

// create blog
export const createBlog=async(req,res,next)=>{
    const userId=req.user.userId;
    const {error,value}=createBlogSchema.validate(req.body);
    if(error){
       const err=new Error(error.details[0].message);
       err.status=400;
       return next(err)
    }
    const {body,description,title}=value;
  try {
    
      const newBlog=await Blog.create({
        title,
        body,
        description,
        author:userId
    })
    return res.status(201)
              .json({
                success:true,
                message:'Blog created',
                data:newBlog
              })
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// get all blogs per user
export const getUserBlog=async(req,res,next)=>{
    const {userId}=req.user;
    const {error,value}=searchValidator.validate(req.query)
  
    if(error){
      const err=new Error(error.details[0].message);
      err.status=403;
      return next(err)
    }
  
    const {search=""}=value;
    const {page,limit,skip}=req.pagination;
    let query={author:userId};
   
    if(search && search.trim()){
      const keyword=search.trim();
      query.$or=[
        {title:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword, $options:"i"}},
        {body:{$regex:keyword,$options:"i"}}
       ]
    }

    try {
      const totalBlog=await Blog.countDocuments(query);
      const existingBlog=await Blog.find(query)
                                 .skip(skip)
                                 .limit(limit)
                                 .sort({createdAt:-1});
    if(existingBlog.length===0){
        return res.status(200)
                  .json({
                    success:true,
                    message:'No blog found',
                    data:[]
                  })
    }
    return res.status(200)
              .json({
                success:true,
                data:existingBlog,
                pagination:{
                  page,
                  totalBlog,
                  limit
                }
              })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// get all user blogs
export const getAllBlogs=async(req,res,next)=>{
  const {error,value}=searchValidator.validate(req.query)
  if(error){
   const error=new Error(error.details[0].message);
   error.status=403;
   return next(error);
  };
  const {search=""}=value;
  const {page,limit,skip}=req.pagination;
  let query={};
  if(search && search.trim()){
    const keyword=search.trim()
    query={
      $or:[
        {title:{$regex:keyword, $options:"i"}},
        {description:{$regex:keyword, $options:"i"}},
        {body:{$regex:keyword,$options:"i"}}
      ]
  }
}
    try {

       const totalBlogs=await Blog.countDocuments(query);

       const existingBlogs=await Blog.find(query)
               .skip(skip)
               .limit(limit)
               .sort({createdAt:-1});
       if(existingBlogs.length===0){
        return res.status(200)
                  .json({
                    success:true,
                    message:'no blog found',
                    data:[]
                  })
       } 

       return res.status(200)
                 .json({
                    success:true,
                    data:existingBlogs,
                    pagination:{
                      page,
                      totalBlogs,
                      limit
                    }
                 });
    } catch (error) {
       console.error(error)
       next(error);
    }
}

// update blog 
export const updateBlog=async(req,res,next)=>{
  const {userId,role}=req.user;
  const blogId = req.params.id;
  const {error,value}=updateBlogchema.validate(req.body);
  
  if(error){
    const err=new Error(error.details[0].message);
    err.status=400;
    return next(err);
   
  };
  // const{body,description,title}=value;
  try {
    const existingBlog=await Blog.findById(blogId);
    if(!existingBlog){
       const err=new Error('No blog found');
       err.status=404;
       return next(err);
    };

  const isAdmin=role=='admin';
  const isAuthor=existingBlog.author.toString() === userId;
  if(!isAuthor && !isAdmin){
       const err=new Error('you are not permitted to do this');
       err.status=403;
       return next(err);
   
  };
 
  //Takes all the values that has been validated by joi and put in the existing blog 
  // It acts like a patch an only overwrites what has been sent by the user and sucessfully validated by joi
  Object.assign(existingBlog,value);
  //It takes the value object that contains the data sent by the user which  has been validated by joi 
  // and assigns it to existing blog 
  // It replaces this 
  // if(title !==undefined){
  //   existingBlog.title=title;
  // }
  // if(body!==undefined){
  //   existingBlog.body=body;
  // }
  // if(description!==undefined){
  //   existingBlog.description=description;
  // }
     
  
  await existingBlog.save();
return res.status(200)
          .json({
            success:true,
            message:'Blog successfully updated',
            data:existingBlog
          })
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// delete blog per user
export const deleteBlog=async(req,res,next)=>{
    const {userId,role}=req.user;

    const {error,value}=idSchema.validate(req.params);
    if(error){
      const err=new Error(error.details[0].message);
      err.status=400;
      return next(err);
    }
    // blog id
    const{id}=value;
    try {
        const existingBlog=await Blog.findById(id);
        
        if(!existingBlog){
          const error=new Error('Blog not found');
          error.status=404;
          return next(error);
        };
     
        const isAuthor=existingBlog.author.toString()==userId;
        const isAdmin=role=='admin';
        if(!isAdmin && !isAuthor){
            const err=new Error('Action not authorized')
            err.status=403;
            return next(err)
        }

        await Blog.findByIdAndDelete(id);
        return res.status(200)
                  .json({
                    success:true,
                    message:'Blog deleted successfully'
                  });

    } catch (err) {
        console.error(err);
        next(err);
    };
}

// delete all blogs
export const deleteAllBlogs=async(req,res,next)=>{
  const {role}=req.user;
  try {
     
    const isAdmin=role=='admin';
    if(!isAdmin){
      const err=new Error('Forbidened request only admin can delete all blogs');
      err.status=(403);
      return next(err);
    }

    const blogCount=await Blog.countDocuments();

    if(blogCount==0){
      const err=new Error('No blog found');
      err.status=404;
      return next(err);
    }
   

    const deleteAll=await Blog.deleteMany({});
    return res.status(200)
              .json({
                success:true,
                message:'All blogs in the database has been sucessfully deleted',
                count:deleteAll.deleteCount
              })
  } catch (err) {
    console.error(err);
    next(err);
  }
}