import mongoose, { Schema } from "mongoose";

const userSchema =new Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    isLogged:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'Not-verify'
    },
    code:{
        type:Number,
        default:null 
    },
    profileStatus:{
        type:String,
        default:"Active"
    },
    profilePic:{
        type:String
    },
    profileCoverPic:{
        type:[String]
    },
    age:Number
},{timestamps:true});

const userModel = mongoose.model('User',userSchema)
export default userModel;