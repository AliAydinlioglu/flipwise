import folderRepository from "../repository/folder";
import type { DBCard, DBFolder, Score, PublicFolder } from "../types/types";
import { CollectionMapper } from "../mappers";
import cardRepository from "../repository/card";
import scoreRepository from "../repository/score";
import { ServiceError } from "../core/errorHandler";
import textCodes from "../constants/textCodes";

/**
 *
 * @param FolderID
 * @param FolderValue
 * @returns
 */
const findPublic = async (FolderID?: string, FolderValue?: string | number): Promise<null | PublicFolder[]> => {
  const results = await folderRepository.findPublic(FolderID, FolderValue);

  if (results === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  const foldersWithCardCount = await Promise.all(
    results.map(async (folder) => {
      const cardCount = await cardRepository.countByFolder(folder.id);
      return {
        ...folder,
        card_count: cardCount,
      };
    }),
  );

  return CollectionMapper.mapPublicFolders(foldersWithCardCount);
};

/**
 * Unified access checks
 */
const getAccessibleFolder = async (user_id: number | undefined, folderID: number): Promise<DBFolder> => {
  const publicFolders = await folderRepository.findPublic("id", folderID);
  if (publicFolders && publicFolders.length > 0) {
    return publicFolders[0] as DBFolder;
  }

  if (!user_id) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }
  const own = await folderRepository.find("id", folderID);
  if (!own || own.length === 0 || own[0].user_id !== user_id) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }
  return own[0];
};

const listFoldersByContext = async (user_id?: number): Promise<PublicFolder[]> => {
  if (!user_id) {
    const results = await folderRepository.findPublic();
    if (results === null) {
      throw new ServiceError(textCodes.NOFOLDERSFOUND, 404);
    }
    const foldersWithCardCount = await Promise.all(
      results.map(async (folder) => {
        const cardCount = await cardRepository.countByFolder(folder.id);
        return {
          ...folder,
          card_count: cardCount,
        };
      }),
    );
    return CollectionMapper.mapPublicFolders(foldersWithCardCount);
  }

  const [publicResults, ownResults] = await Promise.all([folderRepository.findPublic(), folderRepository.find("user_id", user_id)]);

  if (publicResults === null && (ownResults === null || ownResults.length === 0)) {
    throw new ServiceError(textCodes.NOFOLDERSFOUND, 404);
  }

  const combined = [...(publicResults ?? []), ...(ownResults ?? [])] as DBFolder[];

  const uniqueByIdMap = new Map<number, DBFolder>();
  combined.forEach((f) => {
    if (!uniqueByIdMap.has(f.id)) uniqueByIdMap.set(f.id, f);
  });

  const uniqueList = Array.from(uniqueByIdMap.values());

  const foldersWithCardCount = await Promise.all(
    uniqueList.map(async (folder) => {
      const cardCount = await cardRepository.countByFolder(folder.id);
      return {
        ...folder,
        card_count: cardCount,
      };
    }),
  );

  return CollectionMapper.mapPublicFolders(foldersWithCardCount);
};

const listCardsByContext = async (user_id: number | undefined, folderID: number): Promise<DBCard[]> => {
  const folder = await getAccessibleFolder(user_id, folderID);
  const cards = await cardRepository.find("folder_id", folder.id);
  if (!cards || cards.length === 0) {
    throw new ServiceError(textCodes.NOCARDSINFOLDER, 404);
  }
  return cards;
};

const getAccessibleCard = async (user_id: number | undefined, folderID: number, cardID: number): Promise<DBCard> => {
  const cards = await listCardsByContext(user_id, folderID);
  const card = cards.find((c) => c.id === cardID);
  if (!card) {
    throw new ServiceError(textCodes.CARDNOTINFOLDER, 404);
  }
  return card;
};

/**
 *
 * @param folderID
 * @param cardID
 * @returns
 */
const findPublicCards = async (folderID: number, cardID?: number): Promise<null | DBCard[]> => {
  const publicFolder = await findPublic("id", folderID);

  if (publicFolder === null) {
    throw new ServiceError(textCodes.NOFOLDERFOUND, 404);
  }

  if (cardID === undefined) {
    const cards = await cardRepository.find("folder_id", publicFolder[0].id);

    if (cards === null || cards.length === 0) {
      throw new ServiceError(textCodes.NOCARDSINFOLDER, 404);
    }

    return cards;
  } else {
    const cards = await cardRepository.find("folder_id", publicFolder[0].id, "id", cardID);

    if (cards === null || cards.length === 0) {
      throw new ServiceError(textCodes.CARDNOTINFOLDER, 404);
    }

    return cards;
  }
};

/**
 *
 * @param folderID
 * @param cardID
 * @param user_id
 * @param score
 * @returns updated score
 */
const updateScore = async (folderID: number, cardID: number, user_id: number, score: number): Promise<number> => {
  const publicCard = await findPublicCards(folderID, cardID);

  if (publicCard === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const result = await scoreRepository.updateItem(user_id!, publicCard[0].id, score);

  if (result === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return score;
};
/**
 *
 * @param cardID
 * @param user_id
 * @returns
 */
const findScore = async (cardID: number, user_id: number): Promise<null | number> => {
  const score = await scoreRepository.find("user_id", user_id, "card_id", cardID);

  if (score === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return score[0].score;
};
/**
 *
 * @param folderID
 * @param cardID
 * @param user_id
 * @param score
 * @returns
 */
const createScore = async (folderID: number, cardID: number, user_id: number, score: number): Promise<1 | null | false> => {
  const publicCard = await findPublicCards(folderID, cardID);

  if (publicCard === null) {
    throw new ServiceError(textCodes.NOCARDFOUND, 404);
  }

  const scoreExists = await scoreRepository.find("user_id", user_id, "card_id", publicCard[0].id);

  if (scoreExists !== null) {
    throw new ServiceError(textCodes.SCOREALREADYEXISTS, 405);
  }

  const scoreObject = {
    card_id: publicCard[0].id,
    user_id: user_id,
    score,
  } as Score;

  const result = await scoreRepository.createItems([scoreObject]);

  if (result === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return 1;
};

/**
 *
 * @param cardID
 * @param user_id
 * @returns
 */
const deleteScore = async (cardID: number, user_id: number): Promise<1 | null> => {
  const result = await scoreRepository.deleteItem(user_id, cardID);

  if (result === null) {
    throw new ServiceError(textCodes.NOSCOREFOUND, 404);
  }

  return 1;
};

export default { findPublic, findPublicCards, updateScore, findScore, createScore, deleteScore, getAccessibleFolder, listFoldersByContext, listCardsByContext, getAccessibleCard };
