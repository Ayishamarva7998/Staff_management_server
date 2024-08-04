import Joi from "joi";

const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid('admin','staff').required()
});

export {loginSchema}