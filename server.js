import express from 'express';
import 'dotenv/config';
import { dbConnect } from './configs.js/dbConnect.js';
import {router as authRouter} from './routers/userAuthRouters.js';
import {router as postsRouter} from './routers/postsRoutes.js';
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js';


const app=express();
const port=process.env.PORT || 3500;

app.use(cookieParser())
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/posts',postsRouter);
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send('hello and welcome to my express server');
})

dbConnect().then(()=>{
    app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
  })
})
