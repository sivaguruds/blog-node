export const getPagination = (page: any, size: any) => {
  const limit = size ? +size : 1;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
