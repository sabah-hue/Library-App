import { Router } from "express";
import * as bookController from './book.controller.js'
import { validate } from "../../middlewears/validation.js";
import  {insertBooksValidate,searchIssuedBooksValidate}  from "./book.validate.js";
import {auth} from '../../middlewears/auth.js'
import {myMulter} from '../../service/uploadImage.js'

const router=Router();

router.post('/addbook', validate(insertBooksValidate) , bookController.insertBooks)
router.get('/getallBooks' ,auth, bookController.getAllBooks) 
router.put('/borrowBook/:bookId' ,auth, bookController.borrowBook) 
router.get('/getIssuedBooks' ,auth, bookController.getIssuedBooks) 
router.get('/issuedBooks/searchByName',auth, validate(searchIssuedBooksValidate), bookController.searchByName) 
router.get('/returnBooks/searchByName',auth, validate(searchIssuedBooksValidate), bookController.searchByName2) 

router.get('/getNotReturnedBooks/:BorrowBy' ,auth, bookController.getNotReturnedBooks) 

router.patch('/bookPic/:bookId' ,auth,myMulter().single('bookImage'), bookController.uploadImage )



export default router;
