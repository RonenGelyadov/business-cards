import Joi from 'joi';

const nameSchema = Joi.object({
  first: Joi.string().min(2).max(256).required(),
  middle: Joi.string().min(0).max(256).allow(''),
  last: Joi.string().min(2).max(256).required(),
});

const imageSchema = Joi.object({
  url: Joi.string().min(2).allow(''),
  alt: Joi.string().min(2).max(256).allow(''),
});

const addressSchema = Joi.object({
  state: Joi.string().min(2).max(256).allow(''),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(1).required(),
  zip: Joi.number().min(0),
});

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{7,20}$/;

const registerSchema = Joi.object({
  name: nameSchema.required(),
  phone: Joi.string()
    .min(9)
    .max(11)
    .required()
    .pattern(/^0[2-9]\d(-)?\d{7}$/),
  email: Joi.string().min(5).required().email(),
  password: Joi.string().min(7).max(50).required().pattern(passwordPattern).messages({
    'string.pattern.base':
      'Password must be 7-20 characters and include an uppercase letter, a lowercase letter, a number and a special character.',
  }),
  image: imageSchema,
  address: addressSchema.required(),
  isBusiness: Joi.boolean(),
  isAdmin: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(5).required().email(),
  password: Joi.string().min(7).max(50).required(),
});

const editUserSchema = Joi.object({
  name: nameSchema.required(),
  phone: Joi.string()
    .min(9)
    .max(11)
    .required()
    .pattern(/^0[2-9]\d(-)?\d{7}$/),
  email: Joi.string().min(5).required().email(),
  image: imageSchema,
  address: addressSchema.required(),
  isBusiness: Joi.boolean(),
});

export { registerSchema, loginSchema, editUserSchema };
