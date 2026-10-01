import endpoints from "../src/constants/endpoints";

const base = endpoints.apiPrefix + endpoints.userPrefix;
const healthBase = endpoints.apiPrefix + endpoints.health;

//Endpoints
// User
const apiUserFolder = base + endpoints.userPostFolderEndpoint; // /api/users/folders
const apiUserFolderID = base + endpoints.userFolderEndpoint; // /api/users/folders/:folderID
const apiUserFolderCard = base + endpoints.userPostCardEndpoint; // /api/users/folders/:folderID/cards
const apiUserFolderCardID = base + endpoints.userCardEndpoint; // /api/users/folders/:folderID/cards/:cardID
const apiHealthPing = healthBase + endpoints.ping; // /api/health/ping
const apiHealthVersion = healthBase + endpoints.version; // /api/health/version

// Public Folder
const apiPublicFolder = endpoints.apiPrefix + endpoints.publicFolderPrefix;
const apiPublicCard = endpoints.apiPrefix + endpoints.userPostCardEndpoint; // /api/folders/:folderID/cards
const apiPublicCardID = endpoints.apiPrefix + endpoints.userCardEndpoint; // /api/folders/:folderID/cards/:cardID
const apiPublicCardScore = endpoints.apiPrefix + endpoints.userScoreEndpoint; // /api/folders/:folderID/cards/:cardID/scores

// cardoverview
const apiCardOverview = base + endpoints.userGetCardoverviewEndpoint; // /api/users/cardoverviews/:cardID

export default {
  apiUserFolder,
  apiUserFolderID,
  apiUserFolderCard,
  apiUserFolderCardID,
  apiHealthPing,
  apiHealthVersion,
  apiPublicFolder,
  apiPublicCard,
  apiPublicCardID,
  apiPublicCardScore,
  apiCardOverview,
};
