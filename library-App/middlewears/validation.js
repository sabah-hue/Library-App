
export const validate = (data)=>{
    return (req,res,next)=>{
        const valideDataPlace = ["body", "params", "query", "headers", "file", "files"];
        let validateError = [];
        for(const key of valideDataPlace){
            if(data[key]){
                const validateResult = data[key].validate(req[key],{abortEarly:false});
                if(validateResult?.error?.details){
                    validateError.push(validateResult.error.details);
                }
            }
        }
        if(validateError.length){
            return res.json({
                validation_Erorr: "Validation Error",
                Errors: validateError,
              });
        }
        return next();
    }
}