import { Request, Response, NextFunction } from 'express';
import { validate, schema as Schema } from 'express-validation';

const validateSchema = (schema: Schema) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  (await validate(schema, { context: true }, {}))(req, res, next);
};

export default validateSchema;
