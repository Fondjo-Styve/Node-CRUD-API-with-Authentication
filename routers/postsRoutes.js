import express from 'express';
import {
     createBlog,
     getUserBlog,
     getAllBlogs,
     updateBlog,
     deleteBlog,
     deleteAllBlogs,
     } 
     from '../controllers/blogController.js';
import {pagination} from '../middleware/pagination.js';
import { identifier } from '../middleware/identifier.js';
import { authorize } from '../middleware/authorize.js';
import {readLimiter,cudLimiter } from '../middleware/rateLimiter.js';

export const router=express.Router();

// router to create posts
router.post('/createBlog',cudLimiter,identifier,createBlog);
// for each user can view only his blog after login 
router.get('/getUsersBlog',readLimiter,identifier,pagination,authorize('user'),getUserBlog);
// for all users to view all blogs either logged in or not
router.get('/getAllBlogs',readLimiter,pagination,getAllBlogs);
// each user update his blog
router.post('/updateBlog/:id',cudLimiter,identifier,authorize('admin','user'),updateBlog);
// each user deletes only his blog
router.delete('/deleteBlog/:id',cudLimiter,identifier,authorize('admin','user'),deleteBlog);
// delete all blogs
router.delete('/deleteAllBlogs',cudLimiter,identifier,authorize('admin'),deleteAllBlogs);