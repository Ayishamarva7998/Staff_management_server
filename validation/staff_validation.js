import Joi from 'joi';

const staffValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  confirmPassword: Joi.string()
  .valid(Joi.ref('password'))
  .required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  role: Joi.string().valid('advisor', 'reviewer').required(),
  stack: Joi.string().when('role', {
    is: 'reviewer',
    then: Joi.string().allow('').required(), // Allow empty string for reviewers
    otherwise: Joi.string().allow('').optional()
  }),
  batch: Joi.array().items(Joi.string()).when('role', {
    is: 'advisor',
    then: Joi.array().items(Joi.string()).required(), // Required as array for advisors
    otherwise: Joi.array().items(Joi.string()).optional()
  }),
  count: Joi.string().optional(),
  hire: Joi.string().when('role', {
    is: 'reviewer',
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional()
  }),
  profileImg: Joi.string().optional(),
});

 const updateStaffSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('reviewer', 'advisor').optional(),
  stack: Joi.string().when('role', {
    is: 'reviewer',
    then: Joi.string().optional(),
    otherwise: Joi.string().optional()
  }),
  batch: Joi.array().items(Joi.string()).when('role', {
    is: 'advisor',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.array().items(Joi.string()).optional()
  }),
  hire: Joi.date().when('role', {
    is: 'reviewer',
    then: Joi.date().optional(),
    otherwise: Joi.date().optional()
  }),
  count: Joi.number().when('role', {
    is: 'reviewer',
    then: Joi.number().optional(),
    otherwise: Joi.number().optional()
  }),
  removeBatch: Joi.array().items(Joi.string()).when('role', {
    is: 'advisor',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.array().items(Joi.string()).optional()
  }),
});

export { staffValidationSchema,updateStaffSchema };
