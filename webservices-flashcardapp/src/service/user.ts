import argonPassword from "../core/argonPassword";
import textCodes from "../constants/textCodes";
import jwtUse from "../core/jwtUse";
import userRepository from "../repository/user";
import { UserMapper, CardMapper, CollectionMapper } from "../mappers";
import type {
  CardOverview,
  DBCard,
  DBFolder,
  PasswordlessUser,
  RegisterRequest,
  LoginRequest,
  UpdateUserRequest,
  CreateFolderRequest,
  UpdateFolderRequest,
  CreateCardRequest,
  UpdateCardRequest,
  CreateScoreRequest,
} from "../types/types";
import folderRepository from "../repository/folder";
import cardRepository from "../repository/card";
import scoreRepository from "../repository/score";
import { ServiceError } from "../core/errorHandler";

/**
 *
 * @param param0
 * @param expiresInSeconds
 * @returns token
 */
const create = async (userData: RegisterRequest, expiresInSeconds?: number): Promise<string> => {
  const { name, email, password } = userData;
  if (password.length < 8) {
    throw new ServiceError(textCodes.SHORTPASSWORD, 400);
  }

  let result;
  try {
    result = await userRepository.createItems([{ name, email, password }]);
  } catch (e) {
    throw new ServiceError(textCodes.DUPLICATE, 400);
  }

  if (result === null || result == undefined) {
    throw new ServiceError(textCodes.INVALIDDATA, 400);
  }

  const id = result[0];
  const token = jwtUse.generateJWT(id, expiresInSeconds);
  return token;
};

/**
 *
 * @param param0
 * @returns JWT token on success
 * @throws ServiceError on authentication failure
 */
const login = async (loginData: LoginRequest): Promise<string> => {
  const { email, password } = loginData;
  const result = await userRepository.find("email", email);

  if (result === null) {
    throw new ServiceError(textCodes.NOUSERFOUND, 401);
  } else if (await argonPassword.verifyPassword(password, result[0].hashed_password)) {
    return jwtUse.generateJWT(result[0].id);
  } else {
    throw new ServiceError(textCodes.WRONGPASSWORD, 401);
  }
};

/**
 *
 * @param user_id
 * @param param1
 * @returns result if succesfull
 */
const updateUser = async (user_id: number, updateData: UpdateUserRequest): Promise<1 | null> => {
  const { name, email, password } = updateData;
  try {
    const result = await userRepository.updateItem(user_id, { name, email, password });

    if (result === null) {
      throw new ServiceError(textCodes.INVALIDDATA, 404);
    }

    return result;
  } catch (e) {
    throw new ServiceError(textCodes.EMAILALREADYEXISTS, 405);
  }
};

/**
 *
 * @param user_id
 * @returns passwordlessUser if succesfull
 */
const find = async (user_id: number): Promise<PasswordlessUser | null> => {
  const result = await userRepository.find("id", user_id);

  if (result === null) {
    return null;
  }

  return UserMapper.toPasswordlessUser(result[0]);
};

/**
 *
 * @param user_id
 * @returns amountOfUsers if succesfull
 */
const deleteUser = async (user_id: number): Promise<number> => {
  const amountOfUsers = await userRepository.deleteItems("id", user_id);

  if (amountOfUsers === 0) {
    throw new ServiceError(textCodes.USERMISSING, 404);
  }

  return amountOfUsers;
};

/**
 *
 * @param user_id
 * @returns folders if succesfull
 */
// user_id is impossible to be faked because it gets decoded and verified with a signature.
// The mainlogic is that every folder method will start from this method which requires the user_id which is impossible to be faked thanks to jwt.
const findAllFolders = async (user_id: number): Promise<null | DBFolder[]> => {
  const folders = await folderRepository.find("user_id", user_id);

  if (folders === null) {
    throw new ServiceError(textCodes.NOFOLDERSFOUND, 404);
  }

  const foldersWithCardCount = await Promise.all(
    folders.map(async (folder) => {
      const cardCount = await cardRepository.countByFolder(folder.id);
      return {
        ...folder,
        card_count: cardCount,
      };
    }),
  );

  return foldersWithCardCount;
};

/**
 *
 * @param user_id
 * @param folder_id
 * @returns folder if succesfull
 */
const findSingleFolder = async (user_id: number, folder_id: number): Promise<null | DBFolder> => {
  const folders = await findAllFolders(user_id);

  if (folders === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  const folder = folders.filter((folder: DBFolder) => folder.id === folder_id)[0];

  if (folder === undefined) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  return folder;
};
/**
 *
 * @param user_id
 * @param folder_id
 * @returns folderRepository.deleteItems('id', folder.id); if succesfull
 */
const deleteFolder = async (user_id: number, folder_id: number): Promise<number | null> => {
  const folder = await findSingleFolder(user_id, folder_id);

  if (folder === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  return await folderRepository.deleteItems("id", folder.id);
};
/**
 *
 * @param user_id
 * @param folder_id
 * @param param2
 * @returns folderRepository.updateSingleItem(folder.id, { name, public_boolean }); if succesfull
 */
const updateSingleFolder = async (user_id: number, folder_id: number, updateData: UpdateFolderRequest): Promise<1 | null> => {
  const { name, public_boolean } = updateData;
  const folder = await findSingleFolder(user_id, folder_id);

  if (folder === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  return await folderRepository.updateSingleItem(folder.id, { name, public_boolean });
};

/**
 *
 * @param user_id
 * @param folder_id
 * @returns cards if succesfull
 */
const findAllCardsInFolder = async (user_id: number, folder_id: number): Promise<null | DBCard[]> => {
  const userFolders = await findSingleFolder(user_id, folder_id);
  if (userFolders === null) {
    throw new ServiceError(textCodes.NOCARDSINFOLDER, 404);
  }

  const cards = await cardRepository.find("folder_id", folder_id);

  if (cards === null) {
    throw new ServiceError(textCodes.NOCARDSFOUND, 404);
  }

  return CollectionMapper.mapCards(cards);
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @returns card if succesfull
 */
const findSingleCard = async (user_id: number, folder_id: number, card_id: number): Promise<null | DBCard> => {
  const cards = await findAllCardsInFolder(user_id, folder_id);

  if (cards === null) {
    throw new ServiceError(textCodes.NOCARDSFOUND, 404);
  }

  const card = cards.filter((card: DBCard) => card.id === card_id)[0];

  if (card === undefined) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  return card;
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @returns 1 or 0 if succesfull
 */
const deleteSingleCard = async (user_id: number, folder_id: number, card_id: number): Promise<number | null> => {
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  return await cardRepository.deleteItems("id", card.id); // 1 or 0
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @param param3
 * @returns cardRepository.updateSingleItem(card.id, { front, back });}; if succesfull
 */
const updateSingleCard = async (user_id: number, folder_id: number, card_id: number, updateData: UpdateCardRequest): Promise<1 | null> => {
  const { front, back } = updateData;
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  return await cardRepository.updateSingleItem(card.id, { front, back });
};
/**
 *
 * @param user_id
 * @param param1
 * @returns result[0] if succesfull
 */
const createSingleFolder = async (user_id: number, folderData: CreateFolderRequest): Promise<number | null> => {
  const { name, public_boolean } = folderData;
  const result = await folderRepository.createItems([{ user_id, name, public_boolean }]);

  if (result === null) {
    throw new ServiceError(textCodes.INVALIDDATA, 400);
  }

  return result[0];
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param param2
 * @returns result[0] if succesfull
 */
const createSingleCard = async (user_id: number, folder_id: number, cardData: CreateCardRequest): Promise<number | null> => {
  let { front, back } = cardData;
  if (front === undefined) {
    front = "";
  }
  if (back === undefined) {
    back = "";
  }

  const folder = await findSingleFolder(user_id, folder_id);

  if (folder === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 400);
  }

  const result = await cardRepository.createItems([{ folder_id: folder.id, front, back }]);

  if (result === null) {
    throw new ServiceError(textCodes.INVALIDDATA, 400);
  }

  return result[0];
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @returns score[0].score if succesfull
 */
const getScoreOfCard = async (user_id: number, folder_id: number, card_id: number): Promise<null | number> => {
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const score = await scoreRepository.find("user_id", user_id, "card_id", card.id);

  if (score === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return score[0].score;
};

/**
 *
 * @param user_id
 * @param card_id
 * @returns cardOverview if succesfull
 */
const getCardOverview = async (user_id: number, card_id: number): Promise<CardOverview> => {
  const dbCardOverview = await cardRepository.cardOverview(user_id, card_id);

  if (dbCardOverview === null) {
    throw new ServiceError(textCodes.NOCARDSOVERVIEWFOUND, 404);
  }

  return CardMapper.toCardOverview(dbCardOverview);
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @param score
 * @returns 1 if succesfull
 */
const createScore = async (user_id: number, folder_id: number, card_id: number, score: number): Promise<1 | null | false> => {
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const search = await scoreRepository.find("user_id", user_id, "card_id", card.id);

  if (search !== null) {
    throw new ServiceError(textCodes.SCOREALREADYEXISTS, 400);
  }

  const result = await scoreRepository.createItems([{ card_id: card.id, user_id, score }]);

  if (result === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  return 1;
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @param score
 * @returns 1 if succesfull
 */
const updateScore = async (user_id: number, folder_id: number, card_id: number, score: number): Promise<1 | null> => {
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const result = await scoreRepository.updateItem(user_id, card.id, score);

  if (result === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return 1;
};

/**
 *
 * @param user_id
 * @param folder_id
 * @param card_id
 * @returns 1 if succesfull
 */
const deleteScore = async (user_id: number, folder_id: number, card_id: number): Promise<1 | null> => {
  const card = await findSingleCard(user_id, folder_id, card_id);

  if (card === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const result = await scoreRepository.deleteItem(user_id, card.id);

  if (result === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return 1;
};

export default {
  create,
  login,
  updateUser,
  find,
  deleteUser,
  deleteFolder,
  findSingleFolder,
  findAllFolders,
  findAllCardsInFolder,
  findSingleCard,
  deleteSingleCard,
  updateSingleFolder,
  updateSingleCard,
  createSingleFolder,
  createSingleCard,
  getScoreOfCard,
  createScore,
  updateScore,
  deleteScore,
  getCardOverview,
};
