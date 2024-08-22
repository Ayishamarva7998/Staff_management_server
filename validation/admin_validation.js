import Joi from 'joi';

const adminSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),
  
  email: Joi.string()
    .email()
    .required(),
  
  password: Joi.string()
    .min(6)
    .required(),
  
  batches: Joi.array()
    .items(Joi.string().min(1))
    .default([]),  
   
    stacks: Joi.array()
    .items(Joi.string().min(1))
    .default([]),
});




export { adminSchema };
