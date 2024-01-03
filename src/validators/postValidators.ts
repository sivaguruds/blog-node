import Joi, { valid } from 'joi';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';

export const categoryCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  } else {
    req.body = value;
    return next();
  }
};

export const tagCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  } else {
    req.body = value;
    return next();
  }
};
