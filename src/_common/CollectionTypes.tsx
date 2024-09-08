export interface CollectionTypes {
  readonly name: string;
  readonly value: string;
}

export type MainListTypes = "HOME" | "POPULAR" | "ALL" | string;

export type ReactionStateTypes = "LIKE" | "DISLIKE" | null;

export type BoardType = "TEXT" | "LINK" | "MEDIA" | "YOUTUBE";

export interface UserType {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly nickname: string;
  readonly refresh_token: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
}

export interface CommunityType {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly banner: string;
  readonly icon: string;
  readonly visibility: "PUBLIC";
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
}

export interface CardType {
  readonly id: string;
  readonly identifier_id: string;
  readonly category: string;
  readonly content: string[];
  readonly title: string;
  readonly nickname: string;
  readonly type: BoardType;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at?: Date | null;
}

export interface ReactionType {
  readonly id: string;
  readonly boardI_id: string;
  readonly type: ReactionStateTypes;
  readonly user_id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface BoardProps {
  readonly id: string;
  readonly category: string;
  readonly content: string[];
  readonly nickname: string;
  readonly title: string;
  readonly createdAt: Date;
  readonly type: BoardType;
}

export interface InquiryType {
  readonly content: string;
  readonly created_at: Date;
  readonly deleted_at: Date;
  readonly id: string;
  readonly nickname: string;
  readonly title: string;
  readonly update_at: Date;

}

export type CommunityVisibilityType = "PUBLIC" | "RESTRICTED" | "PRIVATE";
