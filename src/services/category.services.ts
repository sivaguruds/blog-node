import httpStatus from 'http-status';
import category from '../database/models/category';
import { QueryTypes } from '@sequelize/core';
import post from '../database/models/post';
import responseHandler from '../helpers/responseHandler';
import { categories } from '../types/post';
import { logger } from '../helpers/logger';

import { sequelize } from '../database/connection';

/**
 * Create a new category.
 *
 * @param {categories} reqBody - The request body containing the name and description of the category.
 * @returns {Promise<Object>} - A Promise that resolves to the response object.
 */
export const create = async (reqBody: categories) => {
  try {
    // Extract the name and description from the request body
    const { name, description } = reqBody;

    // Create a new category using the extracted name and description
    const createdCategory = await category.create({
      name,
      description,
    });

    // Return a success response with the created category
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully category created!', createdCategory.toJSON());
  } catch (error) {
    // Return an error response if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Retrieves all categories.
 *
 * @returns {Promise<Object>} A promise that resolves with the categories.
 * @throws {Error} If an error occurs while fetching the categories.
 */
export const getAll = async () => {
  try {
    // Retrieve all categories from the database
    const allCategories = await category.findAll();

    // Return success response with the fetched categories
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched all categories!', allCategories);
  } catch (error) {
    // Return error response if an error occurs
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Update a category with the given ID
 * @param reqBody - The request body containing the updated category information
 * @param id - The ID of the category to update
 * @returns The updated category
 * @throws An error if something goes wrong during the update process
 */
export const update = async (reqBody: categories, id: string) => {
  try {
    const { name, description } = reqBody;

    // Check if the category exists
    const categoryExists = await isCategoryExists(id);

    if (!categoryExists) {
      // Return an error response if the tag does not exist
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Category not found!');
    }

    // Update the category in the database
    const updatedCategory = await category.update({ name, description }, { where: { id } });

    // Return the updated category
    return responseHandler.returnSuccess(httpStatus.OK, 'Category successfully updated!');
  } catch (error) {
    // Return an error response if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Delete a category by its ID.
 * @param id - The ID of the category to delete.
 * @returns A Promise that resolves to a success message if the category is deleted, or an error message if something goes wrong.
 */
export const deleteById = async (id: string) => {
  try {
    // Check if the category exists
    const categoryExists = await isCategoryExists(id);

    if (!categoryExists) {
      // Return an error response if the tag does not exist
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Category not found!');
    }

    // Delete the category with the specified ID
    await category.destroy({ where: { id } });

    // Return a success message
    return responseHandler.returnSuccess(httpStatus.OK, 'Category deleted!');
  } catch (error) {
    // Return an error message if something goes wrong
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const categoryCount = async () => {
  try {
    const categoryCount = await sequelize.query(
      'SELECT categories.name AS category , COUNT("posts"."categoryId") AS total FROM categories LEFT JOIN posts ON "categories"."id" = "posts"."categoryId" GROUP BY "categories"."id";;',
      {
        type: QueryTypes.SELECT,
      },
    );
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully fetched category count!', categoryCount);
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

const isCategoryExists = async (id: string) => {
  const categoryExists = await category.findOne({ where: { id } });
  return !!categoryExists;
};
