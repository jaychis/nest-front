export interface CollectionTypes {
  readonly name: string;
  readonly value: string;
}

export type MainListTypes = "HOME" | "POPULAR" | "ALL";

export type ReactionStateTypes = "LIKE" | "DISLIKE" | null;

export type BoardType = "TEXT" | "LINK" | "MEDIA" | "YOUTUBE";

export interface CardType {
  readonly id: string;
  readonly identifier_id: string;
  readonly category: string;
  readonly content: string[];
  readonly title: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at?: Date | null;

  readonly reactions: {
    id: string;
    type: ReactionStateTypes;
    user_id: string;
    board_id: string;
    created_at: Date;
    updated_at: Date;
    board: null | {
      id: string;
      identifier_id: string;
      title: string;
      content: string;
      category: string;
      nickname: string;
      board_score: number;
      created_at: Date;
      updated_at: Date;
      deleted_at: null | Date;
    };
  }[];
}
