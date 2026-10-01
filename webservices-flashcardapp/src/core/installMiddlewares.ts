import type Koa from "koa";
import koaCors from "@koa/cors";
import config from "config";
import koaHelmet from "koa-helmet";
import bodyParser from "koa-bodyparser";

/**
 * Install all required middlewares in the given app.
 *
 * @param {koa.Application} koa - The Koa application.
 */
const installMiddleware = (koa: Koa) => {
  const CORS_ORIGINS = config.get("cors.origins") as string[];
  const CORS_MAX_AGE = config.get("cors.maxAge") as number;

  koa.use(bodyParser());
  koa.use(koaHelmet());

  koa.use(
    koaCors({
      origin: (ctx) => {
        const requestOrigin = ctx.request.header.origin;

        if (typeof requestOrigin === "string" && CORS_ORIGINS.includes(requestOrigin)) {
          return requestOrigin;
        }

        if (requestOrigin?.startsWith("http://localhost")) {
          return requestOrigin;
        }

        return CORS_ORIGINS[0];
      },
      allowHeaders: ["Accept", "Content-Type", "Authorization"],
      exposeHeaders: ["Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      maxAge: CORS_MAX_AGE,
    }),
  );
};

export default installMiddleware;
