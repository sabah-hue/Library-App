import Joi from 'joi';

export const insertBooksValidate = {
    body:Joi.object().required().keys({
        name: Joi.string().min(4).max(15).alphanum().messages({
          "string.min": "bookname must contain at least 4 char",
        }),
        writer: Joi.string().min(4).max(15).alphanum().messages({
            "string.min": "writer must contain at least 4 char",
          }),
        description: Joi.string().optional(),
      })
}

////searchIssuedBooksValidate
export const searchIssuedBooksValidate = {
  body:Joi.object().required().keys({
      name: Joi.string().min(4).max(15).alphanum().messages({
        "string.min": "bookname must contain at least 4 char",
      })
    })
}
