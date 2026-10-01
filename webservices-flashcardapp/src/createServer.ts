import Koa from "koa";
import rest from "./rest";
import logging from "./core/logging";
import config from "config";
import data from "./data/index";
import installMiddleware from "./core/installMiddlewares";
import { installErrorHandler } from "./core/errorHandler";
import Router from "@koa/router";

const createServer = async () => {
  // LOGGING
  const NODE_ENV = config.get("env");
  const LOG_LEVEL = config.get("log.level");
  const LOG_DISABLED = config.get("log.disabled");

  logging.initializeLogger({
    level: LOG_LEVEL as string,
    disabled: LOG_DISABLED as boolean,
    defaultMeta: {
      NODE_ENV,
    },
  });
  // LOGGING

  // DATA
  //verbinding met de database
  await data.initializeData();
  // DATA

  // KOA
  const koa = new Koa();
  const router = new Router();
  // KOA

  router.get("/", (ctx) => {
    ctx.status = 200;
    ctx.body = { message: "Welkom bij de API!" };
  });

  // CORS
  //correcte verwerking van HTTP-verzoeken.
  installMiddleware(koa);
  // CORS

  // ERROR HANDLING
  installErrorHandler(koa);
  // ERROR HANDLING

  //Route steken in kao
  koa.use(router.routes()).use(router.allowedMethods());

  // REST-Endpoints Toevoegen
  rest.installRest(koa); // add routes to the koa app
  // REST

  const getKoa = () => {
    return koa;
  };

  const start = async () => {
    const port = config.get("PORT");
    koa.listen(port);
    logging.getLogger().info(`Server listening on http://localhost:${port}`);
  };

  const stop = async () => {
    koa.removeAllListeners();
    await data.shutdownData();
    logging.getLogger().info("Goodbye!");
  };

  return { getKoa, start, stop };
};

export default createServer;
