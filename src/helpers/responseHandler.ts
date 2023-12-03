import { ApiServiceResponse } from '../types/apiServiceResponse';

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

const returnError = (statusCode: number, message: string) => {
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

export default { returnSuccess, returnError };
