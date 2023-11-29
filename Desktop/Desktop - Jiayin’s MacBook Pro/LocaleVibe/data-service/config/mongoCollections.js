import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Documents
export const polls = getCollectionFn("poll");
export const users = getCollectionFn("user");
export const posts = getCollectionFn("post");