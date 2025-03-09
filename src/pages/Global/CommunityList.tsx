import { useState} from "react";
import styled from "styled-components";
import {setCommunity,SelectCommunityParams, community,} from '../../reducers/communitySlice';
import { MainListTypes} from '../../_common/collectionTypes';
import { JAYCHIS_LOGO } from "../../_common/jaychisLogo";
import { useNavigate } from "react-router-dom";
import { useDispatch} from 'react-redux';
import { AppDispatch } from "../../store/store";
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';

interface CommunityListProps {
    readonly list: any[];
    readonly type: string;
}

const CommunityList = ({list, type}: CommunityListProps) => {

    interface CommunityClickType {
        readonly button: MainListTypes;
      }
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [displayCount, setDisplayCount] = useState(5);

    const handleCommunityClick = async (
        { button }: CommunityClickType,
        index: number,
        ) => {
        
        dispatch(setCommunity(list[index]));
        sessionStorage.setItem('community',JSON.stringify(list[index]))
        await sendDispatchSideBtn({ button });
        await navigate(`/j/${button}`);
    };

    const sendDispatchSideBtn = async ({ button }: CommunityClickType) => {
        dispatch(sideButtonSliceActions.setButtonType({ buttonType: button }));
        dispatch(
        sideButtonSliceActions.setHamburgerState({ hamburgerState: false }),
        );
    };

    const handleLoadMore = () => {
        setDisplayCount((prevCount) => prevCount + 5);
    };

    return(
        <CommunityListContainer>
            {list.length > 0 ? 
                list.slice(0, displayCount).map((community: SelectCommunityParams, index) => (
                    <CommunityItem key={community.id || index}>
                        <picture>
                            <source srcSet = {community.icon as string | undefined} type="image/webp"></source>
                            <CommunityIcon
                            width="20"
                            height="20"
                            src={community.icon ? community.icon : JAYCHIS_LOGO}
                            alt={'community icon'}
                            onClick={() =>
                            handleCommunityClick({ button: community.name } as CommunityClickType, index)}
                            />
                        </picture>
                        <CommunityName
                            onClick={() => handleCommunityClick({button: community.name,} as CommunityClickType,index,)}>
                            j/{community.name}
                        </CommunityName>
                    </CommunityItem>
                    ))
                : []}

            {list.length > displayCount && type === 'communityList' &&  (
                <ButtonWrapper>
                <ShowMoreButton
                    onClick={handleLoadMore}
                    disabled={loading}
                    isLoading={loading}
                >
                    {loading ? '로딩 중...' : '더 보기'}
                </ShowMoreButton>
                </ButtonWrapper>
            )}
        </CommunityListContainer>
    )
}

export default CommunityList;

const CommunityListContainer = styled.div`
  padding: 5px 0 10px 10px;
  overflow-y: auto;
`;

const CommunityItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const CommunityIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CommunityName = styled.span`
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const ShowMoreButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isLoading',
})<{ readonly isLoading: boolean }>`
  padding: 8px 16px;
  border-radius: 5px;
  background-color: #0079d3;
  color: white;
  border: none;
  cursor: pointer;
  visibility: ${({ isLoading }) => (isLoading ? 'hidden' : 'visible')};

  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;