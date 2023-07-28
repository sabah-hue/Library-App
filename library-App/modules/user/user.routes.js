import { Router } from "express";
import * as userController from './user.controller.js'
import { validate } from "../../middlewears/validation.js";
import { signupValidate ,verifyEmailValidate ,signInValidate ,forgetPasswordvalidate,
         checkCodeNewPasswordvalidate,updateUservalidate , changePasswordvalidate} from "./user.validate.js";
import {auth} from '../../middlewears/auth.js'
import {myMulter,fileValidation} from '../../service/cloudinary.js'

const router=Router();

router.post('/signup' , validate(signupValidate) , userController.signUp)
router.post('/verifyEmail' ,validate(verifyEmailValidate), userController.verifyEmail)
router.post('/signin' , validate(signInValidate) , userController.signIn)
router.post('/forgetpassword' ,validate(forgetPasswordvalidate), userController.forgetPassword)
router.post('/checkCodeNewPassword' ,validate(checkCodeNewPasswordvalidate), userController.checkCodeNewPassword)
router.post('/logout' ,auth, userController.logout)

router.put('/update' ,auth,validate(updateUservalidate), userController.updateUser)
router.delete('/delete' ,auth, userController.deleteUser)
router.patch('/softdelete' ,auth, userController.softDelete)
router.patch('/changePass',validate(changePasswordvalidate) ,auth, userController.changePassword)

router.patch('/profilePic' , auth, myMulter(fileValidation.image).single('userprofileImage'), userController.uploadImage )
router.patch('/profilCoverePic' , auth, myMulter(fileValidation.image).array('coverimages'), userController.uploadImageCover )

// router.patch('/profilePic' , auth, myMulter('profile',fileValidation.image).single('userprofileImage'), userController.uploadImage )
// router.patch('/profilCoverePic' , auth, myMulter('cover/7',fileValidation.image).array('coverimages'), userController.uploadImageCover )

export default router;