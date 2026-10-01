const api = "api";
const user = "users";

const folder = "folders";
const folderID = ":folderID";

const card = "cards";
const cardOverview = "cardoverviews";
const cardID = ":cardID";

const score = "scores";
const scoreID = ":scoreID";

// index.ts
const apiPrefix = "/" + api;

// Health"
const health = "/" + "health";
const ping = "/" + "ping";
const version = "/" + "version";

// ENDPOINTS
// Schema: filename + protocol + property name + "endpoint"
// Only mention the protocol if the endpoint is unique

// user.ts
//// Root
const userPrefix = "/" + user;
//// User
const userUserEndpoint = "/";
//// Folder
const userGetFolderEndpoint = "/" + folder + "/" + folderID + "?";
const userPostFolderEndpoint = "/" + folder;
const userFolderEndpoint = "/" + folder + "/" + folderID; // PUT, DELETE
//// Card
const userGetCardEndpoint = "/" + folder + "/" + folderID + "/" + card + "/" + cardID + "?";
const userPostCardEndpoint = "/" + folder + "/" + folderID + "/" + card; // /folder/:folderID/card
const userCardEndpoint = "/" + folder + "/" + folderID + "/" + card + "/" + cardID; // PUT, DELETE
const userGetCardoverviewEndpoint = "/" + cardOverview + "/" + cardID; // GET
//// Score
const userScoreEndpoint = "/" + folder + "/" + folderID + "/" + card + "/" + cardID + "/" + score;

// publicFolder.ts
//// Root
const publicFolderPrefix = "/" + folder;
const getPublicFolder = "/" + folderID + "?";
const getPublicCard = "/" + folderID + "/" + card + "/" + cardID + "?";
const getPublicCardScore = "/" + folderID + "/" + card + "/" + cardID + "/" + score;

export default {
  card,

  folderID,
  cardID,

  apiPrefix,
  userPrefix,

  userUserEndpoint,
  userGetFolderEndpoint,
  userPostFolderEndpoint,
  userFolderEndpoint,

  userGetCardEndpoint,
  userPostCardEndpoint,
  userCardEndpoint,
  userGetCardoverviewEndpoint,
  userScoreEndpoint,

  health,
  ping,
  version,

  publicFolderPrefix,
  getPublicFolder,
  getPublicCard,
  getPublicCardScore,
};
