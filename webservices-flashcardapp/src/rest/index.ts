import Router from "@koa/router";
import type Application from "koa";
import user from "./user";
import health from "./health";
import folder from "./publicFolder";
import auth from "./auth";
import endpoints from "../constants/endpoints";

/**
 *
 * @param app
 */
// From this file we will further install other routers to various endpoints.
// This is the main entry point for the REST API.
const installRest = (app: Application) => {
  // create a router for the /api endpoint
  const router = new Router({
    prefix: endpoints.apiPrefix,
  });

  router.use(async (ctx, next) => {
    await next();
  });

  // add a route for the GET /api/ request
  // .get() is a method that takes a path and a callback function. If the path matches, the callback function is called.
  /**
     * @api {get} / API root
     * @apiName ApiRoot
     * @apiGroup Meta
     * @apiSuccess (200) {String} body Static info string.
     */
  router.get("/", async (ctx) => {
    ctx.body = "API";
  });

  health.installRouter(router);
  user.installRouter(router);
  folder.installRouter(router);
  auth.installRouter(router);

  // add the router to the koa app
  app.use(router.routes()).use(router.allowedMethods());
};

export default { installRest };
