import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log(__dirname)

export const fileValidation = {
    image : ['image/jpeg','image/jpg','image/gif','image/png'],
    file : ['application/pdf','application/msword']
}

export const myMulter = (customPath='general',customValidation=[])=>{
    const fullpath = path.join(__dirname,`../upload/${customPath}`);

    if(!fs.existsSync(fullpath)){
        fs.mkdirSync(fullpath,{recursive:true})
    }

    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
           cb(null,fullpath) 
        },
        filename:(req,file,cb)=>{
            const uniqueName = nanoid()+'_'+file.originalname;
            file.dest = `upload/${customPath}/${uniqueName}`

            cb(null,uniqueName)
        }
    })

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