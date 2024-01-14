import httpStatus from 'http-status';
import { Op } from 'sequelize';
import category from '../database/models/category';
import post from '../database/models/post';
import { post_comment } from '../database/models/post_comment';
import post_tag from '../database/models/post_tag';
import tag_new from '../database/models/tag_new';
import { getPagination } from '../helpers/getpagination';
import { logger } from '../helpers/logger';
import responseHandler from '../helpers/responseHandler';
import { posts, postTags } from '../types/post';

/**
 * Create a new post.
 *
 * @param reqBody - The request body containing post details.
 * @returns A response indicating the success or failure of creating the post.
 */
export const create = async (reqBody: posts) => {
  try {
    const { title, subTitle, content, image, userId, categoryId, tags } = reqBody;

    const postObject = {
      title,
      subTitle,
      content,
      image,
      userId,
      categoryId,
    };

    // Create the new post
    const newPost = await post.create(postObject);

    if (newPost) {
      // Create post tags
      const tagsPost: postTags[] = tags.map((tag) => ({
        postId: newPost.id,
        tagId: tag,
      }));

      await post_tag.bulkCreate(tagsPost);
    }

    // Return success response
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully created post!', newPost);
  } catch (error) {
    // Return error response
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Retrieves all posts with pagination and includes tag news and categories.
 * @param query - The query object containing page and size for pagination.
 * @returns A response object indicating the success or failure of the operation.
 */
export const getAll = async (query: any) => {
  const { page, size, title } = query;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : {};

  try {
    // Get the limit and offset for pagination
    const { limit, offset } = getPagination(page, size);

    // Retrieve all posts with pagination, including tag news and categories
    const allPosts = await post.findAndCountAll({
      where: condition,
      limit,
      offset,
      include: [
        { model: tag_new, as: 'tag_news', attributes: ['name'] },
        { model: category, as: 'categories', attributes: ['name'] },
      ],
    });

    // Get the paginated data from the retrieved posts
    const results = responseHandler.getPaginationData(allPosts, page, limit);

    // Return a success response with the paginated data
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched all posts!', results);
  } catch (error) {
    // Return an error response if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Update a post with the given request body and ID.
 * @param reqBody - The request body containing the updated post data.
 * @param id - The ID of the post to update.
 * @returns The updated post if successful, or an error message if not.
 */
export const update = async (reqBody: posts, id: string) => {
  try {
    // Destructure the properties from the request body
    const { title, subTitle, content, image, userId, categoryId, tags } = reqBody;

    // Check if the post exists
    const postExists = await isPostExists(id);
    if (!postExists) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Post does not exist');
    }

    // Delete all existing tags for the post
    await post_tag.destroy({ where: { postId: id } });

    // Create new post-tag associations for the given tags
    const tagsPost: postTags[] = tags.map((tag) => ({
      postId: id,
      tagId: tag,
    }));
    await post_tag.bulkCreate(tagsPost);

    // Update the post with the new data
    const updatePost = await post.update(
      {
        title,
        subTitle,
        content,
        image,
        userId,
        categoryId,
      },
      { where: { id } },
    );

    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully updated post!', updatePost);
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Deletes a post by its ID.
 *
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<object>} Promise that resolves with the result of the deletion.
 */
export const deleteById = async (id: string) => {
  try {
    // Check if the post exists
    const postExists = await isPostExists(id);
    if (!postExists) {
      // If the post does not exist, return an error response
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Post does not exist');
    }

    // Delete the post tags associated with the post
    await post_tag.destroy({ where: { postId: id } });

    // Delete the post itself
    await post.destroy({ where: { id } });

    // Return a success response
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully deleted post!');
  } catch (error) {
    // If an error occurs, return an error response
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Retrieves the details of a post.
 * @param id - The ID of the post.
 * @returns The details of the post.
 * @throws If the post does not exist or if there is an error.
 */
export const details = async (id: string) => {
  try {
    // Check if the post exists
    const postExists = await isPostExists(id);
    if (!postExists) {
      // Return an error response if the post does not exist
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Post does not exist');
    }

    // Retrieve the post details including tag news and categories
    const postDetails: any = await post.findOne({
      where: { id },
      include: [
        { model: tag_new, as: 'tag_news', attributes: ['name'] },
        { model: category, as: 'categories', attributes: ['name'] },
        { model: post_comment, as: 'post_comments', attributes: ['name', 'email', 'comment', 'status'] },
      ],
    });

    // Return a success response with the post details
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched post details!', postDetails);
  } catch (error) {
    // Return an error response if there is an error
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const getCategoryByPost = async (query: any) => {
  const { categoryId } = query;
  try {
    const postDetails: any = await post.findAll({
      where: { categoryId: categoryId },
      include: [
        { model: category, as: 'categories', attributes: ['name'] },
        { model: tag_new, as: 'tag_news', attributes: ['name'] },
      ],
    });
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched post!', postDetails);
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};



const isPostExists = async (id: string) => {
  const postExists = await post.findOne({ where: { id } });
  return !!postExists;
};
