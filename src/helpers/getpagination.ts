export const getPagination = (page: any, size: any) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  console.log(limit, offset);

  return { limit, offset };
};
