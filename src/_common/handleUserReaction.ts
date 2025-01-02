import { ReactionStateTypes } from './collectionTypes';
import { Dispatch, SetStateAction } from 'react';

export const handleReaction = async ({
  userReaction,
  localCount,
  isReaction,
  setIsReaction,
  isCardCount,
  setIsCardCount,
}: {
  readonly userReaction: ReactionStateTypes;
  readonly localCount: number;
  readonly isReaction: ReactionStateTypes;
  readonly setIsReaction: Dispatch<SetStateAction<ReactionStateTypes>>;
  readonly isCardCount: number;
  readonly setIsCardCount: Dispatch<SetStateAction<number>>;
}) => {
  if (
    userReaction === 'DISLIKE' &&
    isReaction === 'DISLIKE' &&
    localCount === 0
  ) {
    setIsReaction(null);
  } else if (
    userReaction === 'LIKE' &&
    isReaction === 'DISLIKE' &&
    localCount === 0
  ) {
    setIsReaction('LIKE');
    setIsCardCount((prevCount) => prevCount + 1);
  } else if (userReaction === 'LIKE' && isReaction === 'LIKE') {
    setIsReaction(null);
    setIsCardCount((prevCount) => prevCount - 1);
  } else if (userReaction === 'LIKE' && isReaction === 'DISLIKE') {
    setIsReaction('LIKE');
    setIsCardCount((prevCount) => prevCount + 2);
  } else if (userReaction === 'LIKE' && isReaction === null) {
    setIsReaction('LIKE');
    setIsCardCount((prevCount) => prevCount + 1);
  } else if (
    userReaction === 'DISLIKE' &&
    isReaction === null &&
    localCount === 0
  ) {
    setIsReaction('DISLIKE');
  } else if (
    userReaction === 'DISLIKE' &&
    isReaction === 'LIKE' &&
    isCardCount === 1
  ) {
    setIsReaction('DISLIKE');
    setIsCardCount((prev) => prev - 1);
  } else if (
    userReaction === 'DISLIKE' &&
    isReaction === null &&
    localCount !== 0
  ) {
    setIsReaction('DISLIKE');
    setIsCardCount((prevCount) => prevCount - 1);
  } else if (userReaction === 'DISLIKE' && isReaction === 'DISLIKE') {
    setIsReaction(null);
    setIsCardCount((prevCount) => prevCount + 1);
  } else if (userReaction === 'DISLIKE' && isReaction === 'LIKE') {
    setIsReaction('DISLIKE');
    setIsCardCount((prevCount) => prevCount - 2);
  }
};
