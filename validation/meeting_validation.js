import Joi from "joi";

const meetingSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    date: Joi.date().iso().required(),
    time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:mm format
    participants: Joi.array().items(Joi.string().email()).min(1).required(),
    // meetingType: Joi.string().valid('online', 'offline').required(),
    description: Joi.string().optional().allow(''),
    agenda: Joi.string().optional().allow(''), // Optional field for meeting agenda
    location: Joi.string().optional().allow('') // Optional field for meeting location
  });


  export default meetingSchema;