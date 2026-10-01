import type { Context } from "koa";
import type { UpdateUserRequest, CreateFolderRequest, UpdateFolderRequest, CreateCardRequest, UpdateCardRequest, CreateScoreRequest } from "../types/types";
import userService from "../service/user";
import Router from "@koa/router";
import textCodes from "../constants/textCodes";
import Joi from "joi";
import validation from "../core/validation";
import parameters from "../core/parameters";
import endpoints from "../constants/endpoints";
import jwtUse from "../core/jwtUse";
import userRepository from "../repository/user";
import { ServiceError } from "../core/errorHandler";

// Auth helpers
const requireAuth = async (ctx: Context, next: () => Promise<unknown>) => {
  const authorizationInput = ctx.request.headers.authorization;
  if (!authorizationInput) throw new ServiceError(textCodes.NOJWT, 401);
  const token = authorizationInput.split(" ")[1];
  const user_id = jwtUse.getUserID(token);
  if (!user_id) throw new ServiceError(textCodes.INVALIDJWT, 401);
  const user = await userRepository.find("id", user_id);
  if (!user) throw new ServiceError(textCodes.USERMISSING, 401);
  ctx.user_id = user_id;
  return next();
};

const getUser = async (ctx: Context) => {
  ctx.body = await userService.find(ctx.user_id);
  ctx.status = 200;
};

const getFolder = {
  execute: async (ctx: Context) => {
    const { folderID } = parameters.getParams(ctx);

    if (folderID === undefined) {
      const allFolders = await userService.findAllFolders(ctx.user_id);
      ctx.status = 200;
      ctx.body = allFolders;
      return;
    }

    const folder = await userService.findSingleFolder(ctx.user_id, folderID);

    ctx.body = folder;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().optional(),
    }),
  },
};

const getCardsInFolder = {
  execute: async (ctx: Context) => {
    const { cardID, folderID } = parameters.getParams(ctx);

    if (cardID === undefined) {
      const allCards = await userService.findAllCardsInFolder(ctx.user_id, folderID!);

      ctx.status = 200;
      ctx.body = allCards;
      return;
    }

    const cards = await userService.findSingleCard(ctx.user_id, folderID!, cardID);

    ctx.body = cards;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().optional(),
    }),
  },
};

const updateUser = {
  execute: async (ctx: Context) => {
    const updateData = ctx.request.body as UpdateUserRequest;

    await userService.updateUser(ctx.user_id, updateData);

    ctx.status = 200;
  },
  schema: {
    body: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
    }).or("name", "email", "password"),
  },
};
const deleteUser = async (ctx: Context) => {
  await userService.deleteUser(ctx.user_id);

  ctx.status = 200;
  ctx.body = { message: "User deleted" };
};

const deleteFolder = {
  execute: async (ctx: Context) => {
    const { folderID } = parameters.getParams(ctx);

    await userService.deleteFolder(ctx.user_id, folderID!);

    ctx.status = 200;
    ctx.body = { message: textCodes.FOLDERDELETED };
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
    }),
  },
};

const deleteCard = {
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);

    await userService.deleteSingleCard(ctx.user_id, folderID!, cardID!);

    ctx.status = 200;
    ctx.body = { message: textCodes.CARDDELETED };
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
  },
};

const updateUserFolder = {
  execute: async (ctx: Context) => {
    const { folderID } = parameters.getParams(ctx);
    const updateData = ctx.request.body as UpdateFolderRequest;

    await userService.updateSingleFolder(ctx.user_id, folderID!, updateData);

    ctx.status = 200;
    ctx.body = { message: textCodes.FOLDERUPDATED };
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
    }),
    body: Joi.object({
      name: Joi.string().optional(),
      public_boolean: Joi.number().optional(),
    }).or("name", "public_boolean"),
  },
};

const updateUserCard = {
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);
    const updateData = ctx.request.body as UpdateCardRequest;

    await userService.updateSingleCard(ctx.user_id, folderID!, cardID!, updateData);

    ctx.status = 200;
    ctx.body = { message: textCodes.CARDUPDATED };
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
    body: Joi.object({
      front: Joi.string().optional(),
      back: Joi.string().optional(),
    }).or("front", "back"),
  },
};

const createFolder = {
  execute: async (ctx: Context) => {
    const folderData = ctx.request.body as CreateFolderRequest;

    await userService.createSingleFolder(ctx.user_id, folderData);

    ctx.status = 201;
    ctx.body = { message: textCodes.FOLDERCREATED };
  },
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      public_boolean: Joi.number().required(),
    }),
  },
};

const createCard = {
  execute: async (ctx: Context) => {
    const { folderID } = parameters.getParams(ctx);
    const cardData = ctx.request.body as CreateCardRequest;

    await userService.createSingleCard(ctx.user_id, folderID!, cardData);

    ctx.status = 201;
    ctx.body = { message: textCodes.CARDCREATED };
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
    }),
    body: Joi.object({
      front: Joi.string().optional(),
      back: Joi.string().optional(),
    }).or("front", "back"),
  },
};

const getCardOverview = {
  execute: async (ctx: Context) => {
    const { cardID } = parameters.getParams(ctx);

    const result = await userService.getCardOverview(ctx.user_id, cardID!);

    ctx.status = 200;
    ctx.body = result;
  },
  schema: {
    params: Joi.object({
      cardID: Joi.number().required(),
    }),
  },
};

const getScoreOfCard = {
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);

    const result = await userService.getScoreOfCard(ctx.user_id, folderID!, cardID!);

    ctx.status = 200;
    ctx.body = result;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
  },
};

const createScore = {
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);
    const scoreData = ctx.request.body as CreateScoreRequest;

    await userService.createScore(ctx.user_id, folderID!, cardID!, scoreData.score);

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

const updateScore = {
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);
    const scoreData = ctx.request.body as CreateScoreRequest;

    await userService.updateScore(ctx.user_id, folderID!, cardID!, scoreData.score);

    ctx.status = 200;
    ctx.body = scoreData.score;
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
  execute: async (ctx: Context) => {
    const { folderID, cardID } = parameters.getParams(ctx);
    await userService.deleteScore(ctx.user_id, folderID!, cardID!);

    ctx.status = 204;
  },
  schema: {
    params: Joi.object({
      folderID: Joi.number().required(),
      cardID: Joi.number().required(),
    }),
  },
};

const installRouter = (parentRouter: Router) => {
  const router = new Router({
    prefix: endpoints.userPrefix,
  });

  router.use(validation.validateSchema(validation.headerAuthorizationOptionalSchema));
  router.use(requireAuth);

  /**
   * @api {get} /users/ Get authenticated user
   * @apiName GetUser
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiSuccess (200) {Object} user The authenticated user profile.
   * @apiSuccessExample {json} 200-Response:
   *    {
   *      "id": 1,
   *      "name": "Jane Doe",
   *      "email": "jane@example.com"
   *    }
   */
  router.get(endpoints.userUserEndpoint, getUser);
  /**
   * @api {put} /users/ Update authenticated user
   * @apiName UpdateUser
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiBody {String} [name]
   * @apiBody {String} [email]
   * @apiBody {String} [password]
   * @apiSuccess (200) NoContent Empty response body.
   * @apiSuccessExample {http} 200-Response:
   *    HTTP/1.1 200 OK
   */
  router.put(endpoints.userUserEndpoint, validation.validateSchema(updateUser.schema), updateUser.execute);
  /**
   * @api {delete} /users/ Delete authenticated user
   * @apiName DeleteUser
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiSuccess (200) {String} message Confirmation message.
   * @apiSuccessExample {json} 200-Response:
   *    { "message": "User deleted" }
   */
  router.delete(endpoints.userUserEndpoint, deleteUser);

  /**
   * @api {get} /users/folders/:folderID? Get own folders or a single own folder
   * @apiName GetFolders
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} [folderID] Optional folder id. If omitted, returns all own folders.
   * @apiSuccess (200) {Object[]/Object} folders Array when no folderID, object when folderID provided.
   * @apiSuccessExample {json} 200-Response (list):
   *    [
   *      { "id": 1, "name": "Biology", "public_boolean": 1, "user_id": 1 },
   *      { "id": 2, "name": "Chemistry", "public_boolean": 0, "user_id": 1 }
   *    ]
   */
  router.get(endpoints.userGetFolderEndpoint, validation.validateSchema(getFolder.schema), getFolder.execute);
  /**
   * @api {post} /users/folders Create a folder
   * @apiName CreateFolder
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiBody {String} name Folder name.
   * @apiBody {Number} public_boolean 1 for public, 0 for private.
   * @apiSuccess (201) {String} message Confirmation message.
   * @apiSuccessExample {json} 201-Response:
   *    { "message": "Folder created" }
   */
  router.post(endpoints.userPostFolderEndpoint, validation.validateSchema(createFolder.schema), createFolder.execute);
  /**
   * @api {put} /users/folders/:folderID Update a folder
   * @apiName UpdateFolder
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiBody {String} [name]
   * @apiBody {Number} [public_boolean]
   * @apiSuccess (200) {String} message Confirmation message.
   * @apiSuccessExample {json} 200-Response:
   *    { "message": "Folder updated" }
   */
  router.put(endpoints.userFolderEndpoint, validation.validateSchema(updateUserFolder.schema), updateUserFolder.execute);
  /**
   * @api {delete} /users/folders/:folderID Delete a folder
   * @apiName DeleteFolder
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiSuccess (200) {String} message Confirmation message.
   * @apiSuccessExample {json} 200-Response:
   *    { "message": "Folder deleted" }
   */
  router.delete(endpoints.userFolderEndpoint, validation.validateSchema(deleteFolder.schema), deleteFolder.execute);

  /**
   * @api {get} /users/folders/:folderID/cards/:cardID? Get cards in a folder or a single card
   * @apiName GetCards
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} [cardID] Optional card id. If omitted, returns all cards in folder.
   * @apiSuccess (200) {Object[]/Object} cards Array when no cardID, object when cardID provided.
   * @apiSuccessExample {json} 200-Response (list):
   *    [
   *      { "id": 1, "front": "Q1", "back": "A1", "folder_id": 1 },
   *      { "id": 2, "front": "Q2", "back": "A2", "folder_id": 1 }
   *    ]
   */
  router.get(endpoints.userGetCardEndpoint, validation.validateSchema(getCardsInFolder.schema), getCardsInFolder.execute);
  /**
   * @api {get} /users/cardoverviews/:cardID Get card overview
   * @apiName GetCardOverview
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} cardID Card id.
   * @apiSuccess (200) {Object} overview Aggregated stats for the card.
   * @apiSuccessExample {json} 200-Response:
   *    { "front": "Q1", "back": "A1", "folder_id": 1, "score": 3 }
   */
  router.get(endpoints.userGetCardoverviewEndpoint, validation.validateSchema(getCardOverview.schema), getCardOverview.execute);
  /**
   * @api {post} /users/folders/:folderID/cards Create a card
   * @apiName CreateCard
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiBody {String} [front]
   * @apiBody {String} [back]
   * @apiSuccess (201) {String} message Confirmation message.
   * @apiSuccessExample {json} 201-Response:
   *    { "message": "Card created" }
   */
  router.post(endpoints.userPostCardEndpoint, validation.validateSchema(createCard.schema), createCard.execute);
  /**
   * @api {put} /users/folders/:folderID/cards/:cardID Update a card
   * @apiName UpdateCard
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiBody {String} [front]
   * @apiBody {String} [back]
   * @apiSuccess (200) {String} message Confirmation message.
   * @apiSuccessExample {json} 200-Response:
   *    { "message": "Card updated" }
   */
  router.put(endpoints.userCardEndpoint, validation.validateSchema(updateUserCard.schema), updateUserCard.execute);
  /**
   * @api {delete} /users/folders/:folderID/cards/:cardID Delete a card
   * @apiName DeleteCard
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiSuccess (200) {String} message Confirmation message.
   * @apiSuccessExample {json} 200-Response:
   *    { "message": "Card deleted" }
   */
  router.delete(endpoints.userCardEndpoint, validation.validateSchema(deleteCard.schema), deleteCard.execute);

  /**
   * @api {get} /users/folders/:folderID/cards/:cardID/scores Get scores for a card
   * @apiName GetScores
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiSuccess (200) {Object} scores Score data for the card.
   * @apiSuccessExample {json} 200-Response:
   *    3
   */
  router.get(endpoints.userScoreEndpoint, validation.validateSchema(getScoreOfCard.schema), getScoreOfCard.execute);
  /**
   * @api {post} /users/folders/:folderID/cards/:cardID/scores Create a score
   * @apiName CreateScore
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiBody {Number} score Score value.
   * @apiSuccess (204) NoContent Empty response body.
   * @apiSuccessExample {http} 204-Response:
   *    HTTP/1.1 204 No Content
   */
  router.post(endpoints.userScoreEndpoint, validation.validateSchema(createScore.schema), createScore.execute);
  /**
   * @api {put} /users/folders/:folderID/cards/:cardID/scores Update a score
   * @apiName UpdateScore
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiBody {Number} score Score value.
   * @apiSuccess (200) {Number} score Updated score value.
   * @apiSuccessExample {json} 200-Response:
   *    4
   */
  router.put(endpoints.userScoreEndpoint, validation.validateSchema(updateScore.schema), updateScore.execute);
  /**
   * @api {delete} /users/folders/:folderID/cards/:cardID/scores Delete a score
   * @apiName DeleteScore
   * @apiGroup Users
   * @apiHeader {String} Authorization Bearer <JWT>
   * @apiParam (Path) {Number} folderID Folder id.
   * @apiParam (Path) {Number} cardID Card id.
   * @apiSuccess (204) NoContent Empty response body.
   * @apiSuccessExample {http} 204-Response:
   *    HTTP/1.1 204 No Content
   */
  router.delete(endpoints.userScoreEndpoint, validation.validateSchema(deleteScore.schema), deleteScore.execute);

  parentRouter.use(router.routes()).use(router.allowedMethods());
};

export default { installRouter };
