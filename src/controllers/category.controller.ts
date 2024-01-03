import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { create, deleteById, getAll, update } from '../services/category.services';

export const categoryCreate = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await create(req.body);
    const { message, data, code, status } = response;

    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const categoryGetAll = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await getAll();
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const categoryUpdate = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await update(req.body, req.params.id);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const categoryDelete = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await deleteById(req.params.id);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
