const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().required().lowercase(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const registerSchema = joi.object({
  first_name: joi.string().required().lowercase(),
  last_name: joi.string().lowercase(),
  email: joi.string().required().lowercase().required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .min(4)
    .max(8),
  store_link: joi.string().required(),
  user_type: joi.string().required(),
  city: joi.string().required(),
  state: joi.string(),
  phone: joi.string().max(14),
  is_email_verify: joi.boolean(),
  is_phone_verify: joi.boolean(),
  referal_code: joi.string(),
  referrer: joi.string().max(4),
  status:joi.boolean().default(false),

  create_at: joi.date().default(new Date().toLocaleString()),
  updated_at: joi.date().default(new Date().toLocaleString()),
});

module.exports = {
  loginSchema,
  registerSchema,
};
