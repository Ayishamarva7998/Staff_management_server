import Joi from 'joi';

const staffValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirmPassword: Joi.string().min(6),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  role: Joi.string().valid('advisor', 'reviewer').required(),
  stack: Joi.string().when('role', {
    is: 'reviewer',
    then: Joi.string().allow('').required(), // Allow empty string for reviewers
    otherwise: Joi.string().allow('').optional()
  }),
  batch: Joi.string().when('role', {
    is: 'advisor',
    then: Joi.string().allow('').required(), // Allow empty string for advisors
    otherwise: Joi.string().allow('').optional()
  }),
  count: Joi.string().optional(),
  hire: Joi.string().when('role', {
    is: 'reviewer',
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional()
  }),
  profileImg: Joi.string().optional(),
});

export { staffValidationSchema };
