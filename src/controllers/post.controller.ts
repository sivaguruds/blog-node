import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { create, deleteById, details, getAll, update } from '../services/post.services';

export const postCreate = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await create(req.body);
    const { message, data, code, status } = response;

    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const postGetAll = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await getAll(req.query);
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const postUpdate = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await update(req.body, req.params.id);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const postDelete = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await deleteById(req.params.id);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const postDetails = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await details(req.params.id);
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
