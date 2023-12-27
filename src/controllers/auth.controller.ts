import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createUser } from '../services/auth.services';
import { ApiServiceResponse } from '../types/apiServiceResponse';

/**
 * Registers a new user
 * @param req - The request object containing the user data
 * @param res - The response object to send the result
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Create a new user
    const newUser: ApiServiceResponse = await createUser(req.body);
    const { message, data, code, status } = newUser.response;

    // Send the response with status, message, and data
    res.status(newUser.statusCode).send({ status, message, data });
  } catch (error) {
    // Send an error response with the error object as the body
    res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
