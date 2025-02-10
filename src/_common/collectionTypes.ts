export interface CollectionTypes {
  readonly name: string;
  readonly value: string;
}

export type MainListTypes =
  | 'HOME'
  | 'POPULAR'
  | 'TAGMATCH'
  | 'FREQUENTSHARE'
  | 'ALL';

export type ReactionStateTypes = 'LIKE' | 'DISLIKE' | null;

export type BoardType = 'TEXT' | 'LINK' | 'MEDIA' | 'YOUTUBE';

export interface UsersProfileType {
  readonly id: string;
  readonly user_id: string;
  readonly profile_image: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
}

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
  readonly users_profile: UsersProfileType[];
}

export interface TagType {
  readonly id: string;
  readonly name: string;
  readonly communitiesTags?: any[];
}

export interface CommunityType {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly banner: string;
  readonly icon: string;
  readonly visibility: 'PUBLIC';
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
}

export interface CardType {
  readonly id: string;
  readonly user_id: string;
  readonly category: string;
  readonly content: string[];
  readonly title: string;
  readonly nickname: string;
  readonly type: BoardType;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at?: Date | null;
  readonly share_count: number;
  readonly user_profile?: {
    readonly id: string;
    readonly profile_image: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date | null;
    readonly user_id: string;
  };
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
  readonly shareCount: number;
  readonly userId: string;
  readonly profileImage?: string;
  readonly index?: string;
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

export type CommunityVisibilityType = 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';

export interface RecentCommunityListType {
  readonly id: string;
  readonly user_id: string;
  readonly community_id: string;
  readonly visited_at: Date;
  readonly community: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly banner: null | string;
    readonly icon: null | string;
    readonly visibility: CommunityVisibilityType;
    readonly creator_user_id: string;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: null | Date;
  };
}
