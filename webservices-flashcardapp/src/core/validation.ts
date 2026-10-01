import Joi from "joi";
import type { Context, Next } from "koa";
import parameters from "./parameters";
import { ServiceError } from "./errorHandler";

interface Schema {
  headers?: Joi.StringSchema<string>;
  body?: Joi.ObjectSchema<unknown>;
  params?: Joi.ObjectSchema<unknown>;
}

/**
 * Validates request parts (headers/body/params) against provided Joi schemas.
 * This performs only technical validation and does NOT authenticate users or mutate ctx.
 */
const validateSchema = (...schemas: Schema[]) => {
  return async (ctx: Context, next: Next) => {
    const authorizationInput = ctx.request.headers.authorization;
    const bodyInput = ctx.request.body;
    const paramsInput = parameters.getParams(ctx);

    for (const schema of schemas) {
      if (schema.headers !== undefined) {
        const { error } = schema.headers.validate(authorizationInput);
        if (error) {
          throw new ServiceError((error as Error).message, 400);
        }
      }

      if (schema.body !== undefined) {
        const { error } = schema.body.validate(bodyInput);
        if (error) {
          throw new ServiceError((error as Error).message, 400);
        }
      }

      if (schema.params !== undefined) {
        const { error } = schema.params.validate(paramsInput);
        if (error) {
          throw new ServiceError((error as Error).message, 400);
        }
      }
    }
    return next();
  };
};

const headerAuthorizationSchema = {
  headers: Joi.string()
    .required()
    .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/),
};

const headerAuthorizationOptionalSchema = {
  headers: Joi.string()
    .optional()
    .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/),
};

export default { validateSchema, headerAuthorizationSchema, headerAuthorizationOptionalSchema };
