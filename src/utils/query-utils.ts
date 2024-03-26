import { Request } from 'express';
import QueryString from 'qs';

export const parseQueryParams = (req: Request) => {
  const page = parseInt(`${req.query.page || '1'}`, 10);
  const limit = parseInt(`${req.query.limit || '10'}`, 10);
  const skip = (page - 1) * limit;
  const search = (req.query.search as string) || '';
  const filters = !['string', 'undefined'].includes(typeof req.query.filters)
    ? (req.query.filters as QueryString.ParsedQs)
    : {};

  return {
    page, limit, skip, search, filters,
  };
};

export const parseBusinessId = (req: Request) => {
  const businessId = `${req.params.businessId || ''}`;

  return businessId;
};
