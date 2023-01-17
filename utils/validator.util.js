const { celebrate, Joi, Segments } = require('celebrate');
const { isValidObjectId } = require('./utility.util');

class Validator {
  // Validators for auth routes
  static signupValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().required().messages({ 'string.empty': 'Username required' }),
      firstname: Joi.string().required().messages({ 'string.empty': 'Firstname required' }),
      lastname: Joi.string().required(),
      email: Joi.string().email().required().trim()
        .lowercase(),
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/).required().label('Password')
        .messages({
          'string.min': '{#label} Must have at least 8 characters',
          'string.pattern.base': '{#label} must include at least eight characters, one uppercase and lowercase letter and one number',
        }),
    }),
  });

  static loginValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required().trim()
        .lowercase(),
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/).required().label('Password')
        .messages({
          'string.min': '{#label} Must have at least 8 characters',
          'string.pattern.base': '{#label} must include at least eight characters, one uppercase and lowercase letter and one number',
        }),
    }),
  });

  static updateDetailsValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
    }),
  });

  // Validators for book routes
  static getNanoURLsValidator = celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().positive().min(1).default(1),
      limit: Joi.number().positive().min(1).default(25),
      select: Joi.string(),
      sort: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      subject: Joi.string(),
      authorInformation: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) return helper.message('Please enter a valid author ID');
        return value;
      }, 'ObjectID Validation'),
      'dimension.height': Joi.number().positive(),
      'dimension.width': Joi.number().positive(),
      'dimension.unitOfMeasurement': Joi.string(),
      'pricing.dailyRate': Joi.number().positive(),
      'pricing.currency': Joi.string(),
      'quantity.inStock': Joi.number().positive(),
      'quantity.rentedOut': Joi.number().positive(),
    }),
  });

  static getNanoURLValidator = celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().positive().min(1).default(1),
      limit: Joi.number().positive().min(1).default(25),
      select: Joi.string(),
      sort: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      subject: Joi.string(),
      authorInformation: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) return helper.message('Please enter a valid author ID');
        return value;
      }, 'ObjectID Validation'),
      'dimension.height': Joi.number().positive(),
      'dimension.width': Joi.number().positive(),
      'dimension.unitOfMeasurement': Joi.string(),
      'pricing.dailyRate': Joi.number().positive(),
      'pricing.currency': Joi.string(),
      'quantity.inStock': Joi.number().positive(),
      'quantity.rentedOut': Joi.number().positive(),
    }),
  });

  static postShortenURLValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
      originalURL: Joi.string().uri().required().trim(),
    }),
  });
}

module.exports = Validator;
