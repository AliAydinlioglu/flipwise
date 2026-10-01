import type { Context } from "koa";
import healthService from "../service/health";
import Router from "@koa/router";
import endpoints from "../constants/endpoints";

const ping = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
const getVersion = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};
const installRouter = (parentRouter: Router) => {
  const router = new Router({
    prefix: endpoints.health,
  });

  /**
     * @api {get} /health/ping Health check
     * @apiName HealthPing
     * @apiGroup Health
     * @apiSuccess (200) {Object} body Pong object.
     * @apiSuccessExample {json} 200-Response:
     *    { "pong": true }
     */
  router.get("/ping", ping); // GET .../api/health/ping
  /**
     * @api {get} /health/version API version
     * @apiName HealthVersion
     * @apiGroup Health
     * @apiSuccess (200) {Object} version Version metadata.
     * @apiSuccessExample {json} 200-Response:
     *    { "name": "flashcardapp", "version": "1.0.0", "env": "test" }
     */
  router.get("/version", getVersion); // GET .../api/health/version

  parentRouter.use(router.routes()).use(router.allowedMethods());
};

export default { installRouter };
