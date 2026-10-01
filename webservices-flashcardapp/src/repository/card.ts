import data from "../data/index";
import type { Card, DBCard, DBCardOverview } from "../types/types";

/**
 *
 * @param cards
 * @returns
 */
const createItems = async (cards: Card[]): Promise<null | number[]> => {
  if (cards.length === 0) {
    return null;
  }

  const ids = [];
  for (const card of cards) {
    const [id] = await data.getKnex()(data.tables.card).insert(card);

    ids.push(id);
  }
  return ids;
};

/**
 *
 * @param attributeName
 * @param attributeValue
 * @returns
 */
const find = async (folder_id: string, folder_value: string | number, card_id?: string, card_value?: string | number): Promise<null | DBCard[]> => {
  let query = data.getKnex()(data.tables.card).select().where(folder_id, folder_value);

  if (card_id && card_value !== undefined) {
    query = query.andWhere(card_id, card_value);
  }

  const result = await query;

  if (result.length === 0) {
    return null;
  } else {
    return result;
  }
};

/**
 *
 * @param user_id
 * @param card_id
 * @returns
 */
const cardOverview = async (user_id: number, card_id: number): Promise<null | DBCardOverview> => {
  const result = (
    await data
      .getKnex()(data.tables.card)
      .select()
      .join(data.tables.scoreboard, `${data.tables.card}.id`, `${data.tables.scoreboard}.card_id`)
      .where(`${data.tables.card}.id`, card_id)
      .andWhere(`${data.tables.scoreboard}.user_id`, user_id)
  )[0];

  if (!result) {
    return null;
  }

  return result;
};

/**
 *
 * @returns
 */
const devFindAll = async (): Promise<DBCard[]> => {
  return await data.getKnex()(data.tables.card).select();
};

/**
 *
 * @param id
 * @param param1
 * @returns
 */
const updateSingleItem = async (id: number, { front, back, newFolder_id }: { front?: string; back?: string; newFolder_id?: number }): Promise<null | 1> => {
  if (front === undefined && back === undefined && newFolder_id === undefined) {
    return null;
  }

  const result = await data.getKnex()(data.tables.card).where("id", id).update({
    front,
    back,
    newFolder_id,
  });

  if (result === 0) {
    return null;
  }

  return 1;
};

/**
 *
 * @param folder_id
 * @returns number of cards in folder
 */
const countByFolder = async (folder_id: number): Promise<number> => {
  const result = await data.getKnex()(data.tables.card).where("folder_id", folder_id).count("id as count").first();

  return result ? Number(result.count) : 0;
};

/**
 *
 * @param attributeName
 * @param attributeValue
 * @returns
 */
const deleteItems = async (attributeName?: string, attributeValue?: string | number): Promise<number> => {
  if ((attributeName === undefined) !== (attributeValue === undefined)) {
    throw new Error("You must provide both attributeName and attributeValue");
  } else if (attributeName && attributeValue) {
    return await data.getKnex()(data.tables.card).where(attributeName, attributeValue).delete();
  } else {
    return await data.getKnex()(data.tables.card).delete();
  }
};

export default { createItems, find, cardOverview, devFindAll, updateSingleItem, deleteItems, countByFolder };
