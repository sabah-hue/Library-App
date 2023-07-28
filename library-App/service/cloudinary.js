import multer from 'multer';

export const fileValidation = {
    image : ['image/jpeg','image/jpg','image/gif','image/png'],
    file : ['application/pdf','application/msword']
}

export const myMulter = (customValidation=[])=>{

    const storage = multer.diskStorage({})

    const fileFilter =(req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb("in valid formate",false);
        }
    }

    const upload = multer({fileFilter,storage});
    return upload;
}