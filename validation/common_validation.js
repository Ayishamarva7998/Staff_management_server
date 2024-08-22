import Joi from "joi";

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'Current password should be a string',
      'string.min': 'Current password should be at least 6 characters long',
      'any.required': 'Current password is required',
    }),
  
  newPassword: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'New password should be a string',
      'string.min': 'New password should be at least 6 characters long',
      'any.required': 'New password is required',
    }),
  
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.only': 'Confirm password must match the new password',
      'any.required': 'Confirm password is required',
    }),
});

export { updatePasswordSchema };
