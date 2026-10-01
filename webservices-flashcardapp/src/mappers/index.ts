import type { DBUser, DBFolder, DBCard, DBCardOverview, PasswordlessUser, CardOverview, PublicFolder } from "../types/types";

class User {
  constructor(public id: number, public name: string, public email: string) {}
  toPasswordlessUser(): PasswordlessUser {
    return { id: this.id, name: this.name, email: this.email };
  }
}

class Card {
  constructor(public id: number, public front: string, public back: string, public folder_id: number) {}
}

export class UserMapper {
  static toPasswordlessUser(dbUser: DBUser): PasswordlessUser {
    return new User(dbUser.id, dbUser.name, dbUser.email).toPasswordlessUser();
  }
}

export class FolderMapper {
  static toPublicFolder(dbFolder: DBFolder): PublicFolder {
    return {
      id: dbFolder.id,
      name: dbFolder.name,
      public_boolean: dbFolder.public_boolean,
      card_count: dbFolder.card_count || 0,
    };
  }
}

export class CardMapper {
  static toDomain(dbCard: DBCard): Card {
    return new Card(dbCard.id, dbCard.front, dbCard.back, dbCard.folder_id);
  }

  static toCardOverview(dbCardOverview: DBCardOverview): CardOverview {
    return {
      front: dbCardOverview.front,
      back: dbCardOverview.back,
      folder_id: dbCardOverview.folder_id,
      score: dbCardOverview.score,
    };
  }
}

export class CollectionMapper {
  static mapCards(dbCards: DBCard[]): Card[] {
    return dbCards.map((card) => CardMapper.toDomain(card));
  }
  static mapPublicFolders(dbFolders: DBFolder[]): PublicFolder[] {
    return dbFolders.map((folder) => FolderMapper.toPublicFolder(folder));
  }
}
