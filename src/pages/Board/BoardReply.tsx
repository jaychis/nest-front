import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ReactionStateTypes,
  ReactionType,
} from '../../_common/CollectionTypes';
import {
  ReactionAPI,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../api/ReactionApi';
import logo from '../../assets/img/panda_logo.png';

export interface ReplyType {
  readonly id: string;
  readonly comment_id: string;
  readonly user_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null;
}

const BoardReply = (re: ReplyType) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCardReplyCount, setIsCardReplyCount] = useState<number>(0);
  const [isCardReplyUpHovered, setIsCardReplyUpHovered] =
    useState<boolean>(false);
  const [isCardReplyDownHovered, setIsCardReplyDownHovered] =
    useState<boolean>(false);
  const [isCardReplyShareHovered, setIsCardReplyShareHovered] =
    useState<boolean>(false);
  const [isCardReplySendHovered, setIsCardReplySendHovered] =
    useState<boolean>(false);
  const [isReplyReaction, setReplyIsReaction] =
    useState<ReactionStateTypes>(null);

  const [isReplyReplyButton, setIsReplyReplyButton] = useState<boolean>(false);

  const ID: string = re.id;
  const USER_ID: string = localStorage.getItem('id') as string;

  const reactionReplyButton = async (type: ReactionStateTypes) => {
    if (type !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type,
        reactionTarget: 'REPLY',
      };

      console.log('reply reaction param : ', param);
      ReactionAPI(param)
        .then((res) => {
          const status: number = res.status;
          console.log('status : ', status);

          const type = res.data.response?.type;
          console.log('type : ', type);
          if (type === undefined) setReplyIsReaction(null);
          if (type === 'LIKE') setReplyIsReaction('LIKE');
          if (type === 'DISLIKE') setReplyIsReaction('DISLIKE');
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    ReactionListAPI({ boardId: ID })
      .then((res): void => {
        const response = res.data.response;

        response.forEach((el: ReactionType): void => {
          if (USER_ID === el.user_id) {
            setReplyIsReaction(el.type);
          }
        });
      })
      .catch((err) => console.error('BoardReply ReactionListAPI err : ', err));

    ReactionCountAPI({ boardId: ID })
      .then((res): void => {
        const resCount = res.data.response;

        setIsCardReplyCount(resCount.count);
      })
      .catch((err) => console.error('BoardReply ReactionCountAPI err : ', err));
  }, [isReplyReaction]);

  return (
    <>
      <OuterContainer>
        <FlexContainer>
          <AvatarContainer>
            <AvatarImage src={logo} alt={`${re.nickname}'s avatar`} />
          </AvatarContainer>
          <NicknameText>{re.nickname}</NicknameText>
        </FlexContainer>
        <ContentContainer
          isHovered={isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ContentText>{re.content}</ContentText>
        </ContentContainer>
      </OuterContainer>
      <ButtonContainer>
        <ReactionButtonGroup isReplyReaction={isReplyReaction}>
          <ReactionButton
            isHovered={isCardReplyUpHovered}
            hoverColor="red"
            onMouseEnter={() => setIsCardReplyUpHovered(true)}
            onMouseLeave={() => setIsCardReplyUpHovered(false)}
            onClick={() => reactionReplyButton('LIKE')}
          >
            좋아요
          </ReactionButton>
          <ReactionCount>{isCardReplyCount}</ReactionCount>
          <ReactionButton
            isHovered={isCardReplyDownHovered}
            hoverColor="blue"
            onMouseEnter={() => setIsCardReplyDownHovered(true)}
            onMouseLeave={() => setIsCardReplyDownHovered(false)}
            onClick={() => reactionReplyButton('DISLIKE')}
          >
            싫어요
          </ReactionButton>
        </ReactionButtonGroup>
        <ActionButtonContainer>
          <ActionButton
            isHovered={isCardReplyShareHovered}
            onMouseEnter={() => setIsCardReplyShareHovered(true)}
            onMouseLeave={() => setIsCardReplyShareHovered(false)}
          >
            공유
          </ActionButton>
        </ActionButtonContainer>
        <ActionButtonContainer>
          <ActionButton
            isHovered={isCardReplySendHovered}
            onMouseEnter={() => setIsCardReplySendHovered(true)}
            onMouseLeave={() => setIsCardReplySendHovered(false)}
            onClick={() => alert('BoardReply Button Click')}
          >
            보내기
          </ActionButton>
        </ActionButtonContainer>
      </ButtonContainer>
      {isReplyReplyButton ? (
        <ReplyFormContainer>
          <ReplyTextArea></ReplyTextArea>
          <ReplyFormButtons>
            <FormButton
              bgColor="#f5f5f5"
              textColor="#333"
              onClick={() => setIsReplyReplyButton(false)}
            >
              Cancel
            </FormButton>
            <FormButton bgColor="#007BFF" textColor="white">
              Comment
            </FormButton>
          </ReplyFormButtons>
        </ReplyFormContainer>
      ) : null}
    </>
  );
};

export default BoardReply;

// Styled Components
const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const AvatarContainer = styled.div`
  margin-right: 18px;
`;

const AvatarImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 30%;
`;

const NicknameText = styled.div`
  font-weight: bold;
  color: #333;
`;

const ContentContainer = styled.div<{ isHovered: boolean }>`
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border-radius: 10px;
  padding: 8px;
  width: 100%;
`;

const ContentText = styled.div`
  margin-top: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 1100px;
  margin-bottom: 10px;
`;

const ReactionButtonGroup = styled.div<{ isReplyReaction: ReactionStateTypes }>`
  background-color: ${(props) =>
    props.isReplyReaction === null
      ? 'white'
      : props.isReplyReaction === 'LIKE'
        ? 'red'
        : 'blue'};
  padding: 10px;
  margin-right: 10px;
  border-radius: 20px;
`;

const ReactionButton = styled.button<{
  isHovered: boolean;
  hoverColor: string;
}>`
  border-color: ${(props) => (props.isHovered ? props.hoverColor : '#e0e0e0')};
  background-color: ${(props) => (props.isHovered ? '#c9c6c5' : '#f5f5f5')};
  border: none;
  width: 65px;
  height: 30px;
  border-radius: 30px;
  margin-right: 5px;
`;

const ReactionCount = styled.span`
  margin: 10px;
  width: 10px;
  height: 10px;
`;

const ActionButtonContainer = styled.div`
  margin-right: 10px;
  border-radius: 30px;
  width: 75px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button<{ isHovered: boolean }>`
  background-color: ${(props) => (props.isHovered ? '#c9c6c5' : '#f5f5f5')};
  border: none;
  width: 65px;
  height: 30px;
  border-radius: 30px;
`;

const ReplyFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px;
  border: 3px solid #ccc;
  border-radius: 30px;
  padding: 10px;
`;

const ReplyTextArea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const ReplyFormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const FormButton = styled.button<{ bgColor: string; textColor: string }>`
  padding: 6px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
`;
