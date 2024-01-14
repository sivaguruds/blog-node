import httpStatus from 'http-status';
import { includes } from 'lodash';
import post from '../database/models/post';
import post_like from '../database/models/post_like';
import responseHandler from '../helpers/responseHandler';
import { postLike } from '../types/post';

/**
 * Updates or adds a like for a post.
 * @param reqBody - The request body containing postId, userId, and status.
 * @returns A response indicating the result of the operation.
 */
export const addUpdateLike = async (reqBody: postLike) => {
  // Extract the postId, userId, and status from the request body
  const { postId, userId, status } = reqBody;

  try {
    // Check if a like already exists for the given postId and userId
    let like = await post_like.findOne({ where: { postId, userId } });

    if (like) {
      // Update the status of the existing like
      like.status = status;
      await like.save();
      return responseHandler.returnSuccess(httpStatus.OK, 'Successfully updated post like!', like);
    } else {
      // Create a new like with the given postId, userId, and status
      await post_like.create({ postId, userId, status });
      return responseHandler.returnSuccess(httpStatus.OK, 'Successfully added post like!', reqBody);
    }
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const getLikes = async (userId: string) => {
  try {
    const likes = await post_like.findAll({
      where: {
        userId: userId,
      },
      include: [{ model: post, as: 'posts' }],
    });
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully retrieved post likes!', likes);
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
