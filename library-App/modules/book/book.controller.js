import bookModel from '../../DB/models/book.js'
import userModel from '../../DB/models/user.js'
import moment from 'moment';

////// insert books
export const insertBooks = async (req,res)=>{
    try{
     const { name , description , writer } = req.body;
     const book = await bookModel.findOne({name})
     if(book){
         res.json({message:'book already exist'})
     }else{
         const newBook = new bookModel({ name , description , writer})
         const saveBook =await newBook.save();
         if(saveBook){
            res.json({message:'Done' , saveBook})
         }else{
            res.json({message:'Fail to add'})
         }
     }
    }
     catch (error) {
         console.log(error);
         res.json({ message: "error" ,error });
       }
 }
///// get all books
export const getAllBooks = async (req,res)=>{
    try{
     const books = await bookModel.find()
     if(books.length){
         res.json({message:'Done' , books})
     }else{
        res.json({message:'no books to show'})
    }
}
     catch (error) {
         console.log(error);
         res.json({ message: "error" ,error });
       }
 }
  ///////// borrow Book
  export const borrowBook = async (req, res) => {
    try {
      const { bookId } = req.params;
      const { _id } = req.user;
        const book = await bookModel.findById(bookId);

            const issuedDate =moment();
            const returnDate =moment().add(10, 'days');
            console.log(returnDate)

            if(!book.isBorrowed){
                const updatedbook = await bookModel.updateOne({ _id: bookId },
                     {BorrowBy:_id, isBorrowed:true ,issuedDate,returnDate});
                if(updatedbook.modifiedCount){
                  res.json({ message: "done" ,  updatedbook} );
                }else{
                  res.json({ message: "fail"} );
                }      
            }else{
                res.json({ message: "book already borrowed"} );
            }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"} , error);
    }
  };
 ///////// get all issued Books
 export const getIssuedBooks= async (req,res)=>{
    try{
        const {_id} = req.user;

            const books = await bookModel.find({BorrowBy:_id , isBorrowed:true})
            if(books.length){
                res.json({message:'Done' , books})
            }else{
               res.json({message:'no books to show'})
           }

        }
     catch (error) {
         console.log(error);
         res.json({ message: "error" ,error });
       }
 }
 ////////////// search by name in issued Books
 export const searchByName = async (req, res) => {  
    try {
        const { _id } = req.user;
            const { name } = req.body;
            const books = await bookModel.find({"name": { $regex: `(^${name})`} ,
                                 "BorrowBy":{ _id} , "isBorrowed":true});
            if(books.length>0){
                res.json({message:'Done' , data:books})
            }else{
                res.json({message:'sorry, No match books'})
            }
    } catch (error) {
      res.json({ message: " catch error"  , error});
    }
    };  
/////////////// Not returned books
export const getNotReturnedBooks= async (req,res)=>{
    try{
        const {_id} = req.user;
        const {BorrowBy} = req.params;

        if(_id == BorrowBy.toString()){
            const now = moment().toDate();

            const books = await bookModel.find({BorrowBy:_id , isBorrowed:true , returnDate:{$lt:now}})
            if(books.length){
                let final = books.map((item) => ({ name: item.name, issuedDate: item.issuedDate.toString(),
                    returnDate:item.returnDate.toString() , late:moment().subtract(item.returnDate).format('D') }));
                    //console.log(moment().toDate());
                    //console.log(final[0].returnDate);
                let finalArr = final.map((item) => ({ name: item.name, issuedDate: item.issuedDate,
                    returnDate:item.returnDate , late:item.late , FindIn:item.late*50 }));
                res.json({message:'Done' , finalArr})
            }else{
               res.json({message:'no books to show'})
           }
       
        }else{
            res.json({message:'not allowed ...'})

        }
}
     catch (error) {
         console.log(error);
         res.json({ message: "error" ,error });
       }
 }
/////////// search in returnDate 
export const searchByName2 = async (req, res) => {  
    try {
        const { _id } = req.user;
            const { name } = req.body;

            const now = moment().toDate();
                console.log(now);

            const books = await bookModel.find({"name": { $regex: `(^${name})`} ,
                                 "BorrowBy":{ _id} , "isBorrowed":true ,"returnDate":{$lt:now}});
            if(books.length>0){
                res.json({message:'Done' , data:books})
            }else{
                res.json({message:'sorry, No match books'})
            }
    } catch (error) {
      res.json({ message: " catch error"  , error});
    }
    };  
//////////// uploadImage
export const uploadImage = async (req, res) => {
    try {
      if(req.file){
        const {bookId} = req.params;
        const {_id} = req.user;
        const checkUser = await userModel.findOne(_id)
        if(checkUser){
            const updatedbook = await bookModel.findByIdAndUpdate({_id:bookId} , {bookPic : req.file.path})
            res.json({message:'Done', Data:req.file})
        }else{
          res.json({message:'can not update book pic'})
        }
      }else{
        res.json({message:'please choose a picture'})
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "catch error"});
    }
  };