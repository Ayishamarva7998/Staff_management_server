import joi from 'joi';

const adminSchema=joi.object({
    username:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).required()
});
export {adminSchema};