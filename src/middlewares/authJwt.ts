import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import httpStatus from 'http-status';
import responseHandler from '../helpers/responseHandler';
import user from '../database/models/user';
import { userEntity } from '../types/user';

dotenv.config();

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT from the request header.
  const token: any = req.headers['authorization'];
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).send(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'No token provided!'));
  }
  const configJwtKey: any = process.env.JWTSECRETKEY;
  jwt.verify(token?.split(' ')[1], configJwtKey, (err: any, decoded: any) => {
    if (err) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Unauthorized! Access Token was expired!'));
    }
    next();
  });
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers['authorization'];
  if (!token) {
    return res.status(httpStatus.FORBIDDEN).send(responseHandler.returnError(httpStatus.FORBIDDEN, 'No token provided!'));
  }
  const configJwtKey: any = process.env.JWTSECRETKEY;
  jwt.verify(token?.split(' ')[1], configJwtKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(httpStatus.UNAUTHORIZED).send(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }
    if (decoded?.role === 'admin') {
      next();
    } else {
      return res.status(httpStatus.FORBIDDEN).send(responseHandler.returnError(httpStatus.FORBIDDEN, 'Require Admin Role!'));
    }
  });
};

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers['authorization'];
  if (!token) {
    return res.status(httpStatus.FORBIDDEN).send(responseHandler.returnError(httpStatus.FORBIDDEN, 'No token provided!'));
  }
  const configJwtKey: any = process.env.JWTSECRETKEY;
  jwt.verify(token?.split(' ')[1], configJwtKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(httpStatus.UNAUTHORIZED).send(responseHandler.returnError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }
    if (decoded?.role === 'viewer') {
      next();
    } else {
      return res.status(httpStatus.FORBIDDEN).send(responseHandler.returnError(httpStatus.FORBIDDEN, 'Require viewer Role!'));
    }
  });
};
