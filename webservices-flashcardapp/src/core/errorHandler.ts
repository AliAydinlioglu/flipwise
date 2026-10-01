import type Koa from "koa";
import textCodes from "../constants/textCodes";

class ServiceError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "ServiceError";

    this.code = code;
  }

  formJson() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}
/**
 *
 * @param koa
 */
const installErrorHandler = (koa: Koa) => {
  koa.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof ServiceError) {
        ctx.status = error.code;
        ctx.body = error.formJson();
      } else {
        ctx.status = 500;
        ctx.body = { message: textCodes.INVALIDDATA };
        // Optioneel loggen
        // log.error(error);
      }
    }
  });
};

export { installErrorHandler, ServiceError };
