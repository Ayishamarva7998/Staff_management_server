import Joi from 'joi';

const staffValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(), // Ensuring phone number is exactly 10 digits
  calendarId: Joi.string(),
  position: Joi.string().required(),
  stack: Joi.string().optional(),
  hire: Joi.string().optional(),
  batch: Joi.string().optional(),
  profileImg: Joi.string().optional(),
  programs: Joi.array().items(
    Joi.object({
      date: Joi.date().optional(),
      details: Joi.string().optional(),
    })
  ).optional(),
  notification: Joi.string().optional(),
  created_at: Joi.date().default(Date.now),
  is_active: Joi.boolean().default(true),
  updated_at: Joi.date().default(Date.now),
  is_deleted: Joi.boolean().default(false),
});

export default staffValidationSchema;
