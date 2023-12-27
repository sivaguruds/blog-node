import Joi, { valid } from 'joi';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';

/**
 * Validates the request body for creating a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const userCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      )
      .required(),
    role: Joi.string().valid('admin', 'viewer').required(),
    status: Joi.boolean().valid(true).required(),
  });

  // Define options for Joi validation
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  // Validate the request body using the schema and options
  const { error, value } = schema.validate(req.body, options);

  // If there is an error in validation, create an error message and pass it to the error handling middleware
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  } else {
    // If validation succeeds, assign the validated value to the request body and call the next middleware function
    req.body = value;
    return next();
  }
};
