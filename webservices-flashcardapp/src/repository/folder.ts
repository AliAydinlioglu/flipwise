import data from "../data/index";
import type { DBFolder, Folder } from "../types/types";

/**
 * 
 * @param folders 
 * @returns 
 */
const createItems = async (folders: Folder[]): Promise<null | number[]> => {
  const ids = [];

  if (folders.length === 0) {
    return null;
  }

  for (const folder of folders) {
    const [id] = await data.getKnex()(data.tables.folder).insert(folder);

    ids.push(id);
  }
  return ids;
};

/**
 * 
 * @returns 
 */
const devFindAll = async (): Promise<DBFolder[]> => {
  return await data.getKnex()(data.tables.folder).select();
};

/**
 * 
 * @param attributeName 
 * @param attributeValue 
 * @returns 
 */
const find = async (attributeName: string, attributeValue: string | number): Promise<null | DBFolder[]> => {
  const result = await data.getKnex()(data.tables.folder).select().where(attributeName, attributeValue);

  if (result.length === 0) {
    return null;
  }

  return result;
};

/**
 * 
 * @param attributeName 
 * @param attributeValue 
 * @returns 
 */
// I don't want someone creating billion folders in private mode to slow down search process, so we're going to hardcode search for public folders.
const findPublic = async (attributeName?: string, attributeValue?: string | number): Promise<null | DBFolder[]> => {
  if (attributeName === undefined && attributeValue === undefined) {
    const allResults = await data.getKnex()(data.tables.folder).select().where("public_boolean", 1);

    if (allResults.length === 0) {
      return null;
    }

    return allResults;
  }

  if (attributeName === undefined || attributeValue === undefined) {
    throw new Error("You must provide both attributeName and attributeValue");
  }

  const result = await data.getKnex()(data.tables.folder).select().where("public_boolean", 1).andWhere(attributeName, attributeValue);

  if (result.length === 0) {
    return null;
  }

  return result;
};

/**
 * 
 * @param id 
 * @param param1 
 * @returns 
 */
const updateSingleItem = async (id: number, { name, public_boolean }: { name?: string; public_boolean?: number }): Promise<null | 1> => {
  if (name === undefined && public_boolean === undefined) {
    return null;
  }

  const result = await data.getKnex()(data.tables.folder).where("id", id).update({
    name,
    public_boolean,
  });

  if (result === 0) {
    return null;
  }

  return 1;
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
    return await data.getKnex()(data.tables.folder).where(attributeName, attributeValue).delete();
  } else {
    return await data.getKnex()(data.tables.folder).delete();
  }
};

export default { createItems, find, findPublic, devFindAll, updateSingleItem, deleteItems };
