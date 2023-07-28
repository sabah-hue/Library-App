import {config} from 'dotenv'
 config()
import express from 'express';
import { connectDB } from './DB/connection.js';
import * as allRouter from './modules/index.routes.js'
const app=express();
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json());
app.use('/upload',express.static(path.join(__dirname,'./upload')));
app.use('/user',allRouter.userRouter);
app.use('/book',allRouter.bookRouter);

app.all('*',(req,res)=>{
    res.json({message:'404 page not found'})
})

connectDB();
app.listen(5000,()=>{
    console.log('server is running ... ')
})