import httpStatus from 'http-status';
import tag_new from '../database/models/tag_new';
import { logger } from '../helpers/logger';
import responseHandler from '../helpers/responseHandler';
import { tags } from '../types/post';

/**
 * Create a new tag.
 *
 * @param {tags} reqBody - The request body containing the name and description of the tag.
 * @returns {Promise<Object>} - A Promise that resolves to the response object.
 */
export const create = async (reqBody: tags) => {
  try {
    // Extract the name and description from the request body
    const { name, description } = reqBody;

    // Create a new tag using the extracted name and description
    const createdTag = await tag_new.create({
      name,
      description,
    });

    logger.info(createdTag);

    // Return a success response with the created tag
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully tag created!', createdTag.toJSON());
  } catch (error) {
    // Return an error response if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Retrieves all tags.
 *
 * @returns {Promise<Object>} A promise that resolves with the tags.
 * @throws {Error} If an error occurs while fetching the tags.
 */
export const getAll = async () => {
  try {
    // Retrieve all tags from the database
    const allTags = await tag_new.findAll();

    // Return success response with the fetched tags
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched all categories!', allTags);
  } catch (error) {
    // Return error response if an error occurs
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Update a tag with the given ID.
 *
 * @param {Object} reqBody - The request body containing the name and description of the tag to update.
 * @param {string} id - The ID of the tag to update.
 * @returns {Object} - The response object indicating the success or failure of the update operation.
 */
export const update = async (reqBody: tags, id: string) => {
  try {
    const { name, description } = reqBody;

    // Check if the tag exists
    const tagExists = await isTagExists(id);

    if (!tagExists) {
      // Return an error response if the tag does not exist
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Tag not found!');
    }

    // Update the tag with the given ID
    const updatedTag = await tag_new.update({ name, description }, { where: { id } });

    // Return a success response
    return responseHandler.returnSuccess(httpStatus.OK, 'Tag successfully updated!');
  } catch (error) {
    // Return an error response if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Delete a tag by its ID.
 *
 * @param id - The ID of the tag to delete.
 * @returns A Promise that resolves to a success message if the tag is deleted, or an error message if something goes wrong.
 */
export const deleteById = async (id: string) => {
  try {
    // Check if the tag exists
    const tagExists = await isTagExists(id);
    if (!tagExists) {
      // Return an error message if the tag is not found
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Tag not found!');
    }

    // Delete the tag
    await tag_new.destroy({ where: { id } });

    // Return a success message if the tag is deleted
    return responseHandler.returnSuccess(httpStatus.OK, 'Tag deleted!');
  } catch (error) {
    // Return an error message if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

const isTagExists = async (id: string) => {
  const tag = await tag_new.findOne({ where: { id } });
  return !!tag;
};
