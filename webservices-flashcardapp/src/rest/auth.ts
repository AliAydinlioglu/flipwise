import Router from "@koa/router";
import user from "../service/user";
import type { Context } from "koa";
import type { RegisterRequest, LoginRequest } from "../types/types";
import Joi from "joi";
import validation from "../core/validation";

const createUser = {
  execute: async (ctx: Context) => {
    const userData = ctx.request.body as RegisterRequest;

    const token = await user.create(userData);
    ctx.set("Authorization", `Bearer ${token}`);
    ctx.status = 200;
  },
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};

const loginUser = {
  execute: async (ctx: Context) => {
    const loginData = ctx.request.body as LoginRequest;

    const token = await user.login(loginData);
    ctx.set("Authorization", `Bearer ${token}`);
    ctx.status = 200;
  },
  schema: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};

const installRouter = (parentRouter: Router) => {
  const router = new Router({
    prefix: "/auth",
  });

  /**
     * @api {post} /auth/register Register a new user
     * @apiName Register
     * @apiGroup Auth
     *
     * @apiBody {String} name The user's display name.
     * @apiBody {String} email The user's unique email address.
     * @apiBody {String} password The user's password.
     *
     * @apiSuccess (200) {String} Authorization Bearer JWT returned in the Authorization response header.
     * @apiSuccessExample {http} Success-Response:
     *     HTTP/1.1 200 OK
     *     Authorization: Bearer <JWT>
     */
  router.post("/register", validation.validateSchema(createUser.schema), createUser.execute); // POST .../api/data/

  /**
     * @api {post} /auth/login Login a user
     * @apiName Login
     * @apiGroup Auth
     *
     * @apiBody {String} email The user's email address.
     * @apiBody {String} password The user's password.
     *
     * @apiSuccess (200) {String} Authorization Bearer JWT returned in the Authorization response header.
     * @apiSuccessExample {http} Success-Response:
     *     HTTP/1.1 200 OK
     *     Authorization: Bearer <JWT>
     */
  router.post("/login", validation.validateSchema(loginUser.schema), loginUser.execute); // POST .../api/data/

  parentRouter.use(router.routes()).use(router.allowedMethods());
};

export default { installRouter };
