import mongoose, { Schema } from "mongoose";

const bookSchema =new Schema({
    name:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    writer:{
        type:String,
        require:true,
    },
    isBorrowed:{
        type:Boolean,
        default:false
    },
    BorrowBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    issuedDate:{
        type:Date,
        default:null
    },
    returnDate:{
        type:Date,
        default:null
    },
    bookPic:{
        type:String
    }
},{timestamps:true});

const bookModel = mongoose.model('Book',bookSchema)
export default bookModel;