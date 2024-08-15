import Joi from 'joi';

// creating a time slot
const createTimeslotSchema = Joi.object({
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date.',
    'any.required': 'Date is required.'
  }),
  time: Joi.string().required().messages({
    'string.base': 'Time must be a string.',
    'any.required': 'Time is required.'
  }),
  reviewer: Joi.string().required().messages({
    'string.base': 'Reviewer must be a string.',
    'any.required': 'Reviewer is required.'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description can be up to 500 characters long.'
  })
});

// updating a time slot
const updateTimeslotSchema = Joi.object({
  date: Joi.date().optional().messages({
    'date.base': 'Date must be a valid date.'
  }),
  time: Joi.string().optional().messages({
    'string.base': 'Time must be a string.'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description can be up to 500 characters long.'
  })
});



export { createTimeslotSchema, updateTimeslotSchema };
