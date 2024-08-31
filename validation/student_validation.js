import Joi from 'joi';

 const studentValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name should be a type of string',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a type of string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.base': 'Phone should be a type of string',
    'string.pattern.base': 'Phone number must be a valid 10-digit number',
    'any.required': 'Phone number is required'
  }),
  batch: Joi.string().required().messages({
    'string.base': 'Batch should be a type of string',
    'any.required': 'Batch is required'
  }),
  stack: Joi.string().required().messages({
    'string.base': 'Stack should be a type of string',
    'any.required': 'Stack is required'
  }),
  week: Joi.string().required().messages({
    'string.base': 'Week should be a type of string',
    'any.required': 'Week is required'
  }),
});


const updateStudentValidationSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': 'Name should be a type of string'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.base': 'Phone should be a type of string',
    'string.pattern.base': 'Phone number must be a valid 10-digit number'
  }),
  batch: Joi.string().optional().messages({
    'string.base': 'Batch should be a type of string'
  }),
  stack: Joi.string().optional().messages({
    'string.base': 'Stack should be a type of string'
  }),
  week: Joi.string().optional().messages({
    'string.base': 'Week should be a type of string'
  }),
});


export {studentValidationSchema,updateStudentValidationSchema};