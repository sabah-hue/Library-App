import Joi from 'joi';

export const signupValidate = {
    body:Joi.object().required().keys({
        name: Joi.string().min(4).max(15).alphanum().messages({
          "string.min": "Username must contain at least 4 char",
        }),
        email: Joi.string().required().messages({"any.required": "please enter your email"}),
        password: Joi.string().min(4).max(15).required().messages({
          "string.min": "password must contain at least 4 char",
        }),
        cpass: Joi.string().valid(Joi.ref("password")).messages({
          "any.only": "confirmation password must match password",
        }),
        phone: Joi.number().optional(),
        age: Joi.number().optional(),
      })
}

////  verifyEmailValidate
export const verifyEmailValidate = {
  body:Joi.object().required().keys({
      email: Joi.string().required().messages({"any.required": "please enter your email"}),
      code: Joi.number()
    })
}

//// signInValidate
export const signInValidate = {
  body:Joi.object().required().keys({
      email: Joi.string().required().messages({"any.required": "please enter your email"}),
      password: Joi.string().min(4).max(15).required().messages({
        "string.min": "password must contain at least 4 char",
      }),
  })
}
////// forgetPasswordvalidate
export const forgetPasswordvalidate = {
  body:Joi.object().required().keys({
      email: Joi.string().required().messages({"any.required": "please enter your email"})
  })
}

////// checkCodeNewPasswordvalidate
export const checkCodeNewPasswordvalidate = {
  body:Joi.object().required().keys({
    email: Joi.string().required().messages({"any.required": "please enter your email"}),
    newpassword: Joi.string().min(4).max(15).required().messages({
      "string.min": "password must contain at least 4 char",
    }), 
    code: Joi.number()
  })
}

////// updateUservalidate
export const updateUservalidate = {
  body:Joi.object().required().keys({
      name: Joi.string().min(4).max(15).alphanum().messages({
        "string.min": "Username must contain at least 4 char",
      }),
      phone: Joi.number().optional(),
      age: Joi.number().optional(),
    })
}

///// changePasswordvalidate
export const changePasswordvalidate = {
  body:Joi.object().required().keys({
    email: Joi.string().required().messages({"any.required": "please enter your email"}),
    password: Joi.string().min(4).max(15).required().messages({
      "string.min": "password must contain at least 4 char",
    }),
    newpassword: Joi.string().min(4).max(15).required().messages({
      "string.min": "password must contain at least 4 char",
    })
    })
}