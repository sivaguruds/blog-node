import Joi, { valid } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validationRequest } from '../helpers/validationRequest';

export const categoryCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  validationRequest(req, res, next, schema);
};

export const tagCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  validationRequest(req, res, next, schema);
};

export const postCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    userId: Joi.string().required(),
    image: Joi.string().required(),
    content: Joi.string().required(),
    categoryId: Joi.string().required(),
    tags: Joi.array().min(1).required(),
  });
  validationRequest(req, res, next, schema);
};

export const postQueryValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
  });
  console.log(req);
  validationRequest(req, res, next, schema, 'query');
};

export const postParamsValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });
  console.log(req);
  validationRequest(req, res, next, schema, 'params');
};

export const postCommentValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    postId: Joi.string().required(),
    name: Joi.string().required(),
    comment: Joi.string().required(),
    email: Joi.string().required(),
    status: Joi.boolean().required(),
  });
  validationRequest(req, res, next, schema, 'body');
};
