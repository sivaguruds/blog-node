import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createUser, loginUser } from '../services/auth.services';
import { ApiServiceResponse } from '../types/apiServiceResponse';

/**
 * Registers a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The response with status, message, and data.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const newUser: ApiServiceResponse = await createUser(req.body);
    const { message, data, code, status } = newUser.response;

    return res.status(newUser.statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

/**
 * Handles the login request.
 *
 * @param req The HTTP request object.
 * @param res The HTTP response object.
 */
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
