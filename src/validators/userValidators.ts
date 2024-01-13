import Joi, { valid } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validationRequest } from '../helpers/validationRequest';

export const userCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
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

  validationRequest(req, res, next, schema);
};

export const userLoginValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      )
      .required(),
  });

  validationRequest(req, res, next, schema);
};
