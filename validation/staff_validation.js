import Joi from 'joi';

const staffValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
  .min(6)
  .pattern(/^[a-zA-Z0-9]{3,30}$/).allow('') 
  .when('role', {
    is: Joi.not('employee'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
confirmPassword: Joi.string()
  .valid(Joi.ref('password'))
  .when('role', {
    is: Joi.not('employee'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  role: Joi.string()
    .valid('advisor', 'reviewer', 'employee')
    .required(),
  stacks: Joi.array()
    .items(Joi.string())
    .when('role', {
      is: 'reviewer',
      then: Joi.array().items(Joi.string()).required(),
      otherwise: Joi.array().items(Joi.string()).optional().allow(null)
    }),
  batches: Joi.array()
    .items(Joi.string())
    .when('role', {
      is: 'advisor',
      then: Joi.array().items(Joi.string()).required(),
      otherwise: Joi.array().items(Joi.string()).optional().allow(null)
    }),
  position: Joi.string().allow('')
    .when('role', {
      is: 'employee',
      then: Joi.string().required(),
      otherwise: Joi.string().optional().allow(null)
    }),
  count: Joi.number()
    .when('role', {
      is: 'reviewer',
      then: Joi.number().optional(),
      otherwise: Joi.optional().allow(null)
    }),
  hire: Joi.number()
    .when('role', {
      is: 'reviewer',
      then: Joi.number().optional(),
      otherwise: Joi.optional().allow(null)
    }),
});


const updateStaffSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  role: Joi.string()
    .valid('reviewer', 'advisor', 'employee')
    .optional(),
    stack: Joi.array()
    .items(Joi.string())
    .optional()
    .when('role', {
      is: 'reviewer',
      then: Joi.array().items(Joi.string()).optional(),
      otherwise: Joi.array().items(Joi.string()).optional(),
    }),
    batch: Joi.array()
  .items(Joi.string())
  .optional()
  .when('role', {
    is: 'advisor',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.array().items(Joi.string()).optional(),
    }),
  position: Joi.string()
    .allow('')
    .optional()
    .when('role', {
      is: 'employee',
      then: Joi.string().optional(),
      otherwise: Joi.optional().allow(null),
    }),
  hire: Joi.number()
    .optional()
    .when('role', {
      is: 'reviewer',
      then: Joi.number().optional(),
      otherwise: Joi.optional().allow(null),
    }),
  count: Joi.number()
    .optional()
    .when('role', {
      is: 'reviewer',
      then: Joi.number().optional(),
      otherwise: Joi.optional(),
    }),

});

export { staffValidationSchema, updateStaffSchema };
