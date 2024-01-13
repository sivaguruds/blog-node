import { ApiServiceResponse, DataTableDaoResponse, DataTableResponse } from '../types/apiServiceResponse';

/**
 * Returns a success response object.
 *
 * @param statusCode - The status code of the response.
 * @param message - The message of the response.
 * @param data - Optional data to include in the response.
 * @returns The success response object.
 */
const returnSuccess = (statusCode: number, message: string, data?: [] | object) => {
  const response: ApiServiceResponse = {
    statusCode,
    response: {
      status: true,
      code: statusCode,
      message,
      data,
    },
  };
  return response;
};

/**
 * Returns an error response object with the specified status code and message.
 * @param statusCode - The status code of the error response.
 * @param message - The message of the error response.
 * @returns The error response object.
 */
const returnError = (statusCode: number, message: string) => {
  /**
   * The error response object.
   */
  const response: ApiServiceResponse = {
    statusCode,
    response: {
      status: false,
      code: statusCode,
      message,
    },
  };
  return response;
};

const getPaginationData = (rows: DataTableDaoResponse, page: number, limit: number) => {
  const { count: totalItems, rows: data } = rows;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  const response: DataTableResponse = {
    totalItems,
    data,
    totalPages,
    currentPage,
  };
  return response;
};

export default { returnSuccess, returnError, getPaginationData };
