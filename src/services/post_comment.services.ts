import httpStatus from 'http-status';
import { post_comment } from '../database/models/post_comment';
import responseHandler from '../helpers/responseHandler';
import { postComment } from '../types/post';

export const addComment = async (reqBody: postComment) => {
  const { postId, name, comment, email, status } = reqBody;

  try {
    const results = await post_comment.create({ postId, name, comment, email, status });
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully added post comment!', results);
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
