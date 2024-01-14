import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { addUpdateLike, getLikes } from '../services/post_like.services';

export const postLike = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await addUpdateLike(req.body);
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};

export const userLikePost = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await getLikes(req.params.id);
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
