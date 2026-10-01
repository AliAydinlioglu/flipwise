//Bevat alle type-definities voor TypeScript.

type User = { name: string; email: string; password: string };
type Folder = { name: string; public_boolean: number; user_id: number };
type Card = { front: string; back: string; folder_id: number };
type Score = { card_id: number; user_id: number; score: number };

type DBUser = { id: number; name: string; email: string; hashed_password: string };
type DBFolder = { id: number; name: string; public_boolean: number; user_id: number; card_count?: number };
type DBCard = { id: number; front: string; back: string; folder_id: number };
type DBScore = { id: number; card_id: number; user_id: number; score: number; date: Date };

type PasswordlessUser = {
  id: number;
  name: string;
  email: string;
};

type PublicFolder = Omit<DBFolder, "user_id">;

type DBCardOverview = DBCard & DBScore;
type CardOverview = Card & { score: number };

type LoginRequest = { email: string; password: string };
type RegisterRequest = { name: string; email: string; password: string };
type UpdateUserRequest = { name?: string; email?: string; password?: string };
type CreateFolderRequest = { name: string; public_boolean: number };
type UpdateFolderRequest = { name?: string; public_boolean?: number };
type CreateCardRequest = { front: string; back: string };
type UpdateCardRequest = { front?: string; back?: string };
type CreateScoreRequest = { score: number };

export {
  User,
  PasswordlessUser,
  DBUser,
  Folder,
  DBFolder,
  PublicFolder,
  Card,
  DBCard,
  Score,
  DBScore,
  DBCardOverview,
  CardOverview,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  CreateFolderRequest,
  UpdateFolderRequest,
  CreateCardRequest,
  UpdateCardRequest,
  CreateScoreRequest,
};
