import mongoose from "mongoose";

export const connectDB =async ()=>{
 return await mongoose.connect("mongodb://0.0.0.0:27017/library")
  .then(()=>{console.log('connect to DB')})
  .catch((error)=>{console.log('fail to DB');console.log(error)})
}