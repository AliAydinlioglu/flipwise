import type { Context } from "koa";

/**
 *
 * @param ctx
 * @returns
 */
const getParams = (ctx: Context) => {
  const folderIDString = ctx.params.folderID;
  const cardIDString = ctx.params.cardID;
  const returObj: { folderID?: number; cardID?: number } = {};

  if (folderIDString !== undefined) {
    returObj.folderID = Number(folderIDString);
  }

  if (cardIDString !== undefined) {
    returObj.cardID = Number(cardIDString);
  }

  return returObj;
};

export default { getParams };
