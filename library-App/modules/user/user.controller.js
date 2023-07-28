import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../service/sendEmail.js";
import userModel from "../../DB/models/user.js";
import { generateToken } from '../../utils/GenerateAndVerifyToken.js';
import {cloudinary} from '../../service/cloudinaryConn.js';

///////////////// sign up 
export const signUp = async (req,res,next)=>{
    try{
     const { name , email , password , age , phone } = req.body;
     const checkUser = await userModel.findOne({email})
     if(checkUser){
         res.json({message:'email already exist'})
     }else{
         const hashPass = bcryptjs.hashSync(password , 8 ) 
         const generateCode = Math.floor(Math.random()*90000+10000);
         const registerUser = new userModel({ name , email , password:hashPass , 
                                age ,phone , code:generateCode})
         const newUser =await registerUser.save();
         if(newUser){
            await sendEmail({to:newUser.email , subject: "verification mail" ,
                    message:`<p>your verification code is <b> ${newUser.code} </b> </p>`});
             res.json({message:'done' , data : newUser})
         }else{
             res.json({message:'fail'})
         }
     }
    }
     catch (error) {
         console.log(error);
         res.json({ message: "error" ,error });
       }
 }
 
//////////// verify Email
export const verifyEmail = async (req, res) => {
    try {
      const { email , code } = req.body;
      const userCheck = await userModel.findOne({ email });
      if (userCheck && userCheck.code == code) {
          await userModel.updateOne({_id:userCheck._id} , {status:"verify"})
          res.json({ message: " verify Successfuly" });
        } else {
          res.json({ message: "invalid code" });
        }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };
 ////////////  sign In
 export const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userCheck = await userModel.findOne({ email });
      if (userCheck) {
        if(userCheck.status=="verify"){
            const checkMatch =bcryptjs.compareSync(password, userCheck.password);
            if (checkMatch) {
              const token = generateToken(
                { payload:{id: userCheck._id, email: userCheck.email , name: userCheck.name}});
              await userModel.updateOne({_id:userCheck._id} , {isLogged:true})
              res.json({ message: "Login Successfuly", token  });
            } else {
              res.json({ message: "invalid information 1" });
            }

        }else{
            res.json({ message: "verify your email first" });

        }
      } else {
        res.json({ message: "invalid information" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };
////////////// forget password part1 'recive mail and create code'
export const forgetPassword = async (req, res) => {
    try {
      const { email  } = req.body;
      const userCheck = await userModel.findOne({ email });
      if (userCheck) {
         if(userCheck.status=="verify"){
           const generateCode = Math.floor(Math.random()*90000+10000);

           await userModel.updateOne({_id:userCheck._id} , {code:generateCode})

            await sendEmail({to:email , subject: "change your password" ,
            message:`<p>your verification code is <b> ${generateCode} </b> </p>`});

            res.json({message:"done , enter the code send on your email"})
         }else{
            res.json({ message: "verify your email first" });
         }
        } else {
          res.json({ message: "invalid user" });
        }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };
  ////////////// forget password part2 check code and change password

  export const checkCodeNewPassword = async (req, res) => {
    try {
      const { email , newpassword , code } = req.body;
      const userCheck = await userModel.findOne({ email });
      if (userCheck) {
         if(userCheck.status=="verify"){
            if(userCheck.code == code){
                const hashPass = bcryptjs.hashSync(newpassword , 8 );
                const generateCode = Math.floor(Math.random()*90000+10000); 
                await userModel.updateOne({_id:userCheck._id} , {password:hashPass , code:generateCode})
                res.json({ message: " your password changed Successfully" });
              }else{
                res.json({ message:"wrong code"});
              }
         }else{
            res.json({ message: "verify your email first" });
         }
        } else {
          res.json({ message: "invalid user" });
        }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };

////////// update user
export const updateUser = async (req,res)=>{
  try{
      const {name , age ,phone}=req.body;
      const { _id } = req.user;
      const userCheck = await userModel.findOne({_id})
      if(userCheck){
        if(userCheck.profileStatus=="Active"){
          const updateUser = await userModel.updateOne({_id},{name,age ,phone})
          if(updateUser.modifiedCount){
            res.json({message:'updated successfuly' , data:updateUser})
          }else{
            res.json({message:'can not find this user'})
        }  
        }else{
          res.json({message:'fail .. deleted user'})
        }
    }else{
      res.json({message:'fail'})
      }
  }catch(error){
      res.json({message:'catch error',error})
  }
}

////////////// delete user
export const deleteUser = async (req,res)=>{
  try{
  const { _id} = req.user;

    const deleteUser = await userModel.deleteOne({_id})
    if(deleteUser.deletedCount){
      res.json({message:'deleted successfuly'})
    }else{
      res.json({message:'can not find this user' , deleteUser})
    }
  
  }catch(error){
  res.json({message:'error',error})
  }
  }
  //////////////  log out  //////////////
  export const logout = async (req,res)=>{
    try{
    const { _id } = req.user;
    const userCheck = await userModel.findOne({ _id });  
    if(userCheck){
        await userModel.updateOne({_id:userCheck._id} , {isLogged:false})
        res.json({message:'logged out successfuly'})
      }else{
      res.json({message:'fail to logout'})
    }
    }catch(error){
      res.json({message:'error',error})
  }
  }
  ////////////// delete user
export const softDelete = async (req,res)=>{
  try{
  const { _id} = req.user;

    const deleteUser = await userModel.updateOne({_id} , {profileStatus:"Not-Active"})
    if(deleteUser.modifiedCount){
      res.json({message:'soft delete successfuly'})
    }else{
      res.json({message:'can not find this user' , deleteUser})
    }
  
  }catch(error){
  res.json({message:'error',error})
  }
  }
  /////////////// change password
  export const changePassword = async (req, res) => {
    try {
      const { email, password , newpassword } = req.body;
      const userCheck = await userModel.findOne({ email });
      if (userCheck) {
            const checkMatch =bcryptjs.compareSync(password, userCheck.password);
            if (checkMatch) {
              const hashPass = bcryptjs.hashSync(newpassword , 8 ) 
              await userModel.updateOne({_id:userCheck._id} , {password:hashPass})
              res.json({ message: "changed Successfuly" });
            } else {
              res.json({ message: "invalid information 1" });
            }

      } else {
        res.json({ message: "invalid information" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };
//////////// uploadImage
export const uploadImage = async (req, res) => {
  try {
    if(req.file){
      const {_id} = req.user;
      
      const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`user/${req.user._id}/profile`});

      // const checkUser = await userModel.findByIdAndUpdate(_id , {profilePic : `${req.file.dest}`},{new:true})

      const checkUser = await userModel.findByIdAndUpdate(_id , {profilePic : secure_url ,profilePicId : public_id },{new:true})
      if(checkUser){
        res.json({message:'Done', Data: checkUser})
      }else{
        res.json({message:'can not update profile pic'})
      }
    }else{
      res.json({message:'please choose a picture'})
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "catch error"});
  }
};
/////////// cover image
export const uploadImageCover = async (req, res) => {
  try {
    if(req.files){
      const {_id} = req.user;
      // const imgArr = [];
      // for(const file of req.files){
      //   imgArr.push(`${file.dest}`)
      // }
      // const checkUser = await userModel.findByIdAndUpdate(_id , {profileCoverPic : imgArr})

      const imgArr = [];
      for(const file of req.files){
        imgArr.push(`${file.dest}`)
      }
      const checkUser = await userModel.findByIdAndUpdate(_id , {profileCoverPic : imgArr})
      if(checkUser){
        res.json({message:'Done', Data:checkUser})
      }else{
        res.json({message:'can not update profile pic'})
      }
    }else{
      res.json({message:'please choose a picture'})
     }
  } catch (error) {
    console.log(error);
    res.json({ message: "catch error"});
  }
};