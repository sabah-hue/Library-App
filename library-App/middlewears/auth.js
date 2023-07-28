import userModel from '../DB/models/user.js'
import jwt from 'jsonwebtoken'

export const auth = async(req,res,next)=>{
    try{
        const {auth} = req.headers;

        if(!auth){
            return res.json({ message: "not authorized .. no token" });
        }
        
        const decode = jwt.verify(auth,'TOKEN_SIGNATURE' );
        if (!decode || !decode.id) {
          return res.json({ message: "wrong token" });
        }
        const user = await userModel.findById(decode.id);
        if (user) {
            if(user.isLogged && user.status=="verify" && user.profileStatus == "Active"){
                req.user = user
                next()
            }else{
                return res.json({message:'you should login first'})
            }
         
        } else {
          res.json({ message: "invalid userId" });
        }
      

    }catch(error){
        res.json({message:'catch error from auth'});
    }
}