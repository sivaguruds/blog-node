import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../helpers/logger';
import { createUser, forgot, loginUser, refresh, reset } from '../services/auth.services';
import { ApiServiceResponse } from '../types/apiServiceResponse';

export const register = async (req: Request, res: Response) => {
  try {
    const newUser: ApiServiceResponse = await createUser(req.body);
    const { message, data, code, status } = newUser.response;

    return res.status(newUser.statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await loginUser(req.body);
    const { message, data, code, status } = response;

    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const adminBoard = async (req: Request, res: Response) => {
  return res.status(201).send({
    message: 'Admin Content.',
  });
};

export const viewerBoard = async (req: Request, res: Response) => {
  return res.status(201).send({
    message: 'Viewer Content.',
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await refresh(req.body);
    const { message, data, code, status } = response;

    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { statusCode, response }: ApiServiceResponse | any = await forgot(req.body);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { statusCode, response }: ApiServiceResponse | any = await reset(req.body);
    const { message, code, status } = response;
    return res.status(statusCode).send({ status, message });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
