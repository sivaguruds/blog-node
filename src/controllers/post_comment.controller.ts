import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { addComment } from '../services/post_comment.services';

export const commentCreate = async (req: Request, res: Response) => {
  try {
    const { response, statusCode } = await addComment(req.body);
    const { message, data, code, status } = response;
    return res.status(statusCode).send({ status, message, data });
  } catch (error) {
    return res.status(httpStatus.BAD_GATEWAY).send(error);
  }
};
