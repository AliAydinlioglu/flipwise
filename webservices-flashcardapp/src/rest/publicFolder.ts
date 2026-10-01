import type { Context } from "koa";
import Router from "@koa/router";
import folderService from "../service/folder";
import textCodes from "../constants/textCodes";
import Joi from "joi";
import validation from "../core/validation";
import parameters from "../core/parameters";
import endpoints from "../constants/endpoints";
import jwtUse from "../core/jwtUse";
import userRepository from "../repository/user";
import { ServiceError } from "../core/errorHandler";

const authenticateIfPresent = async (ctx: Context) => {
  const authorizationInput = ctx.request.headers.authorization;
  if (!authorizationInput) return;
  const token = authorizationInput.split(" ")[1];
  const user_id = jwtUse.getUserID(token);
  if (!user_id) throw new ServiceError(textCodes.INVALIDJWT, 401);
  const user = await userRepository.find("id", user_id);
  if (!user) throw new ServiceError(textCodes.USERMISSING, 401);
  ctx.user_id = user_id;
};

const requireAuth = async (ctx: Context) => {
  const authorizationInput = ctx.request.headers.authorization;
  if (!authorizationInput) throw new ServiceError(textCodes.NOJWT, 401);
  await authenticateIfPresent(ctx);
};

const getFolder = {
  /**
   *
   * @param ctx
   * @returns
   */
  execute: async (ctx: Context) => {
    await authenticateIfPresent(ctx);
    const { folderID } = parameters.getParams(ctx);

    if (folderID === undefined) {
      const allFolders = await folderService.listFoldersByContext(ctx.user_id);

      ctx.body = allFolders;
      return;
    }

    if (!ctx.user_id) {
      const publicFolder = await folderService.findPublic("id", folderID);
      ctx.body = publicFolder;
      return;
    }

    try {
      const publicFolder = await folderService.findPublic("id", folderID);
      ctx.body = publicFolder;
      return;
    } catch (e) {
      const folder = await folderService.getAccessibleFolder(ctx.user_id, folderID);
      ctx.body = [folder];
      return;
    }
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().optional(),
    }),
  },
};

const getCard = {
  /**
   *
   * @param ctx
   * @returns
   */
  execute: async (ctx: Context) => {
    await authenticateIfPresent(ctx);
    const { folderID, cardID } = parameters.getParams(ctx);

    if (cardID === undefined) {
      const cards = await folderService.listCardsByContext(ctx.user_id, folderID!);

      ctx.body = cards;
      return;
    }

    const card = await folderService.getAccessibleCard(ctx.user_id, folderID!, cardID);

    ctx.status = 200;
    ctx.body = [card];
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().optional(),
    }),
  },
};

const getScore = {
  /**
   *
   * @param ctx
   */
  execute: async (ctx: Context) => {
    await requireAuth(ctx);
    const { cardID } = parameters.getParams(ctx);
    const user_id = ctx.user_id;

    const score = await folderService.findScore(cardID!, user_id!);

    ctx.status = 200;
    ctx.body = score;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
  },
};

const updateScore = {
  /**
   *
   * @param ctx
   */
  execute: async (ctx: Context) => {
    await requireAuth(ctx);
    const { folderID, cardID } = parameters.getParams(ctx);
    const user_id = ctx.user_id;
    const { score } = ctx.request.body as { score: number };

    const updated = await folderService.updateScore(folderID!, cardID!, user_id!, score);

    ctx.status = 200;
    ctx.body = updated;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
    body: Joi.object({
      score: Joi.number().required(),
    }),
  },
};

const createScore = {
  /**
   *
   * @param ctx
   */
  execute: async (ctx: Context) => {
    await requireAuth(ctx);
    const { folderID, cardID } = parameters.getParams(ctx);
    const { score } = ctx.request.body as { score: number };
    const user_id = ctx.user_id;

    await folderService.findPublicCards(folderID!, cardID);

    await folderService.createScore(folderID!, cardID!, user_id!, score);

    ctx.status = 204;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
    body: Joi.object({
      score: Joi.number().required(),
    }),
  },
};

const deleteScore = {
  /**
   *
   * @param ctx
   */
  execute: async (ctx: Context) => {
    await requireAuth(ctx);
    const { cardID } = parameters.getParams(ctx);
    const user_id = ctx.user_id;

    await folderService.deleteScore(cardID!, user_id!);

    ctx.status = 204;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
  },
};
/**
 *
 * @param parentRouter
 */
const installRouter = (parentRouter: Router) => {
  const router = new Router({
    prefix: endpoints.publicFolderPrefix,
  });

  /**
   * @api {get} /folders/:folderID? List public folders or a single accessible folder
   * @apiName GetPublicFolders
   * @apiGroup Public
   * @apiHeader (Optional) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} [folderID] Optional folder id. If omitted:
   *  - Anonymous: returns all public folders.
   *  - Authenticated: returns all public folders from others plus your own folders.
   * @apiSuccess (200) {Object[]/Object[]} folders When folderID omitted, returns an array of folders; when provided, returns an array with one folder (public or own if accessible).
   * @apiSuccessExample {json} 200-Response (authenticated, list union):
   *  [
   *    { "id": 1, "name": "Math", "public_boolean": 1 },
   *    { "id": 2, "name": "Biology", "public_boolean": 1 },
   *    { "id": 3, "name": "Private Notes", "public_boolean": 0 }
   *  ]
   */
  router.get(endpoints.getPublicFolder, validation.validateSchema(validation.headerAuthorizationOptionalSchema, getFolder.schema), getFolder.execute);
  /**
   * @api {get} /folders/:folderID/cards/:cardID? List public or accessible cards in a folder or a single card
   * @apiName GetPublicCards
   * @apiGroup Public
   * @apiHeader (Optional) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id (required)
   * @apiParam (Path) {Number} [cardID] Optional card id. If omitted, returns all cards (public folder cards, or if authenticated and owner: all cards in own folder or public folder). If provided, returns an array with the single accessible card.
   * @apiSuccess (200) {Object[]} cards Array of card objects. When cardID provided the array contains one element.
   * @apiSuccessExample {json} 200-Response (list cards):
   *  [
   *    { "id": 10, "question": "2+2?", "answer": "4", "folder_id": 3 },
   *    { "id": 11, "question": "3+5?", "answer": "8", "folder_id": 3 }
   *  ]
   * @apiSuccessExample {json} 200-Response (single card):
   *  [
   *    { "id": 10, "question": "2+2?", "answer": "4", "folder_id": 3 }
   *  ]
   * @apiError (401) NoJwt Missing Authorization header when required for private access
   * @apiError (401) InvalidJwt Invalid or expired JWT
   * @apiError (404) NotFound Folder or Card not found / not accessible
   */
  router.get(endpoints.getPublicCard, validation.validateSchema(validation.headerAuthorizationOptionalSchema, getCard.schema), getCard.execute);
  /**
   * @api {get} /folders/:folderID/cards/:cardID/scores Get user's score for a card
   * @apiName GetScore
   * @apiGroup Public
   * @apiHeader (Required) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id
   * @apiParam (Path) {Number} cardID Card id
   * @apiSuccess (200) {Number} score User's score for the card
   * @apiSuccessExample {json} 200-Response:
   *  6
   * @apiError (401) NoJwt Missing Authorization header
   * @apiError (401) InvalidJwt Invalid or expired JWT
   * @apiError (404) NotFound Score not found for this user and card
   */
  router.get(endpoints.getPublicCardScore, validation.validateSchema(getScore.schema), getScore.execute);
  /**
   * @api {put} /folders/:folderID/cards/:cardID/scores Update user's score for a card
   * @apiName UpdateScore
   * @apiGroup Public
   * @apiHeader (Required) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id
   * @apiParam (Path) {Number} cardID Card id
   * @apiBody {Number} score New score value
   * @apiSuccess (200) {Object} score Updated score object
   * @apiSuccessExample {json} 200-Response:
   *  { "card_id": 10, "user_id": 5, "score": 7 }
   * @apiError (401) NoJwt Missing Authorization header
   * @apiError (401) InvalidJwt Invalid or expired JWT
   * @apiError (404) NotFound Score / Card not found or not accessible
   */
  router.put(endpoints.getPublicCardScore, validation.validateSchema(updateScore.schema), updateScore.execute);
  /**
   * @api {post} /folders/:folderID/cards/:cardID/scores Create a score for a card
   * @apiName CreateScore
   * @apiGroup Public
   * @apiHeader (Required) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id
   * @apiParam (Path) {Number} cardID Card id
   * @apiBody {Number} score Initial score value
   * @apiSuccess (204) NoContent Score created
   * @apiError (400) Validation Body validation failed (missing score)
   * @apiError (401) NoJwt Missing Authorization header
   * @apiError (401) InvalidJwt Invalid or expired JWT
   * @apiError (404) NotFound Card not found or not public
   * @apiError (409) Conflict Score already exists for this user & card
   */
  router.post(endpoints.getPublicCardScore, validation.validateSchema(createScore.schema), createScore.execute);
  /**
   * @api {delete} /folders/:folderID/cards/:cardID/scores Delete user's score for a card
   * @apiName DeleteScore
   * @apiGroup Public
   * @apiHeader (Required) {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id
   * @apiParam (Path) {Number} cardID Card id
   * @apiSuccess (204) NoContent Score deleted
   * @apiError (401) NoJwt Missing Authorization header
   * @apiError (401) InvalidJwt Invalid or expired JWT
   * @apiError (404) NotFound Score not found
   */
  router.delete(endpoints.getPublicCardScore, validation.validateSchema(deleteScore.schema), deleteScore.execute);

  parentRouter.use(router.routes()).use(router.allowedMethods());
};

export default { installRouter };
