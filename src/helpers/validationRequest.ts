import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import ApiError from '../helpers/ApiError';
import httpStatus from 'http-status';

export const validationRequest = async (req: Request, res: Response, next: NextFunction, schema: Joi.ObjectSchema, type?: string) => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  let requestData;

  switch (type) {
    case 'query':
      requestData = req.query;
      break;
    case 'params':
      requestData = req.params;
      break;
    case 'headers':
      requestData = req.headers;
      break;
    case 'cookies':
      requestData = req.cookies;
      break;
    default:
      requestData = req.body;
      break;
  }

  const { error, value } = schema.validate(requestData, options);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  } else {
    req.body = value;
    next();
  }
};
