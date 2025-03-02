import styled from "styled-components";
import { breakpoints } from "../../../_common/breakpoint";
import { ReactionStateTypes } from "../../../_common/collectionTypes";
import { useState } from "react";

interface ReactionProps {
    readonly reactionCount: number;
    readonly clickEvent: (reaction: any) => any;
    readonly reactionState: ReactionStateTypes;
  }

const Reaction = ({reactionCount, clickEvent, reactionState}: ReactionProps) => {

    const [isHovered, setIsHovered] = useState<ReactionStateTypes>(null);

    return(
        <>
            <ReactionContainer>
        <ReactionWrapper>
          <LikeReactionButton
            isCommentReaction={reactionState}
            onMouseEnter={() => setIsHovered('LIKE')}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => clickEvent('LIKE')}
            isHovered={isHovered}
          >
            좋아요
          </LikeReactionButton>
          <ReactionCount>{reactionCount}</ReactionCount>
          <DisLikeReactionButton
            isCommentReaction={reactionState}
            onMouseEnter={() => setIsHovered("DISLIKE")}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => clickEvent('DISLIKE')}
            isHovered={isHovered}
          >
            싫어요
          </DisLikeReactionButton>
        </ReactionWrapper>
      </ReactionContainer>
        </>
    )
}

export default Reaction;

const ReactionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin-top: 5px;
  max-height: 80px;
`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 160px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 140px;
  }
`;

const LikeReactionButton = styled.button<{
  readonly isHovered: ReactionStateTypes;
  readonly isCommentReaction: ReactionStateTypes;
}>`
  border: ${(props) =>
    props.isCommentReaction === 'LIKE' ? '2px solid blue' : '1px solid gray'};

  border-radius: 20px;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.isHovered === 'LIKE' ? '#f0f0f0' : 'white')};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const DisLikeReactionButton = styled.button<{
  readonly isHovered: ReactionStateTypes;
  readonly isCommentReaction: ReactionStateTypes;
}>`
  border: ${(props) =>
    props.isCommentReaction === "DISLIKE" ? '2px solid red' : '1px solid gray'};

  border-radius: 20px;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.isHovered === 'DISLIKE' ? '#f0f0f0' : 'white')};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const ReactionCount = styled.span`
  margin: 0 auto 0 auto;
  padding: 5px;
  max-width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
`;