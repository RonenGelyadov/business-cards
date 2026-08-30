import Joi from 'joi';

const addressSchema = Joi.object({
  state: Joi.string().min(2).max(256).allow(''),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(1).required(),
  zip: Joi.number().min(0),
});

const imageSchema = Joi.object({
  url: Joi.string().min(2).allow(''),
  alt: Joi.string().min(2).max(256).allow(''),
});

const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string()
    .min(9)
    .max(11)
    .required()
    .pattern(/^0[2-9]\d(-)?\d{7}$/),
  email: Joi.string().min(5).required().email(),
  web: Joi.string().min(5).allow(''),
  image: imageSchema,
  address: addressSchema.required(),
  bizNumber: Joi.number().min(1).required(),
});

export default cardSchema;
