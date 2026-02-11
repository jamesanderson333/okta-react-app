/**
 * Input validation schemas using Joi
 */

const Joi = require('joi');

const emailUpdateSchema = Joi.object({
  newEmail: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email address is required'
  })
});

const profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).messages({
    'string.min': 'First name must be at least 1 character',
    'string.max': 'First name must not exceed 100 characters'
  }),
  lastName: Joi.string().min(1).max(100).messages({
    'string.min': 'Last name must be at least 1 character',
    'string.max': 'Last name must not exceed 100 characters'
  }),
  mobilePhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  city: Joi.string().max(100).messages({
    'string.max': 'City must not exceed 100 characters'
  }),
  state: Joi.string().max(50).messages({
    'string.max': 'State must not exceed 50 characters'
  }),
  zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).messages({
    'string.pattern.base': 'Please provide a valid zip code (e.g., 12345 or 12345-6789)'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().min(8).required().messages({
    'string.min': 'Old password must be at least 8 characters',
    'any.required': 'Old password is required'
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters',
    'any.required': 'New password is required'
  })
});

const customAttributesSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean()
  )
).min(1).messages({
  'object.min': 'At least one custom attribute must be provided'
});

module.exports = {
  emailUpdateSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  customAttributesSchema
};
