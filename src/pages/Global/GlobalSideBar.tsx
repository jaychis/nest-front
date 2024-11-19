import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainListTypes } from '../../_common/collectionTypes';
import { AppDispatch } from '../../store/store';
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';
import { setCommunity,SelectCommunityParams } from '../../reducers/communitySlice';
import { RootState } from '../../store/store';
import { UserModalState } from '../../reducers/modalStateSlice';
import logo from '../../assets/img/panda_logo.png';
import { CommunityListAPI } from '../api/communityApi';
import Tooltip from '../../components/Tooltip';

const GlobalSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  const [isSideHovered, setIsSideHovered] = useState<
    MainListTypes | 'CREATE_COMMUNITY' | null
  >(null);
  const [selectedButton, setSelectedButton] = useState<MainListTypes>('HOME');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  const [communityList, setCommunityList] = useState<SelectCommunityParams[]>([],);
  const [communityNamesSet, setCommunityNamesSet] = useState<Set<string>>(new Set(),);
  const [displayCount, setDisplayCount] = useState(5);

  const fetchCommunities = async (page: number) => {
    setLoading(true);
    const id = localStorage.getItem('id') as string;

    try {
      const res = await CommunityListAPI({ take: 10, page });
      if (!res) return;
      const response = res.data.response.current_list;
      const uniqueCommunities = response.filter(
        (community: SelectCommunityParams) => {
          if (communityNamesSet.has(community.name)) {
            return false;
          } else {
            communityNamesSet.add(community.name);
            return true;
          }
        },
      );
      setCommunityList((prevList) => [...prevList, ...uniqueCommunities]);
    } catch (err) {
      console.log('CommunityListAPI error: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities(page);
  }, [page]);

  useEffect(() => {
    const initialSet = new Set(
      communityList.map((community) => community.name),
    );
    setCommunityNamesSet(initialSet);
  }, [communityList]);

  const handleClick = (button: MainListTypes) => {
    if (button === 'TAGMATCH' && !(localStorage.getItem('id') as string)) {
      alert('회원가입 유저에게 제공되는 기능입니다.');

      return;
    }

    setSelectedButton(button);
    dispatch(sideButtonSliceActions.setButtonType(button));
  };

  interface CommunityClickType {
    button: MainListTypes;
  }
  const handleCommunityClick = (
    { button }: CommunityClickType,
    index: number,
  ) => {
    dispatch(sideButtonSliceActions.setButtonType(button));
    dispatch(setCommunity(communityList[index]));
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleCreateCommunityClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    navigate('/community/create1');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        height: '100%', // 전체 높이를 채우되,
        overflowY: 'auto', // 필요한 경우에만 스크롤을 생성
        background: '#fff',
        marginRight: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        borderTop: 'none',
        marginTop: '90px',
        position: 'fixed',
        zIndex: modalState.modalState ? -1 : 1000,
      }}
    >
      <div
        style={{
          padding: '6px 0',
          backgroundColor:
            selectedButton === 'HOME' || isSideHovered === 'HOME'
              ? '#f0f0f0'
              : 'white',
          borderRadius: '5px',
        }}
        onMouseEnter={() => setIsSideHovered('HOME')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('HOME')}
      >
        <Tooltip
          image={'🏠'}
          title={'홈'}
          content={'사용자들이 좋아요를 많이 누른 랭킹순입니다.'}
        />
      </div>
      <div
        style={{
          padding: '6px 0',
          backgroundColor:
            selectedButton === 'POPULAR' || isSideHovered === 'POPULAR'
              ? '#f0f0f0'
              : 'white',
          borderRadius: '5px',
          margin: '1px',
        }}
        onMouseEnter={() => setIsSideHovered('POPULAR')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('POPULAR')}
      >
        <Tooltip
          image={'🔥'}
          title={'실시간'}
          content={'사용자들이 댓글을 많이 단 랭킹입니다.'}
        />
      </div>
      <div
        style={{
          padding: '6px 0',
          backgroundColor:
            selectedButton === 'FREQUENTSHARE' ||
            isSideHovered === 'FREQUENTSHARE'
              ? '#f0f0f0'
              : 'white',
          borderRadius: '5px',
          margin: '1px',
        }}
        onMouseEnter={() => setIsSideHovered('FREQUENTSHARE')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('FREQUENTSHARE')}
      >
        <Tooltip
          image={'🌐'}
          title={'퍼주기'}
          content={'사용자들이 많이 공유한 랭킹입니다.'}
        />
      </div>
      <div
        style={{
          padding: '6px 0',
          backgroundColor:
            selectedButton === 'TAGMATCH' || isSideHovered === 'TAGMATCH'
              ? '#f0f0f0'
              : 'white',
          borderRadius: '5px',
          margin: '1px',
        }}
        onMouseEnter={() => setIsSideHovered('TAGMATCH')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('TAGMATCH')}
      >
        <Tooltip
          image={'🌐'}
          title={'내가 좋아할 글'}
          content={'사용자가 좋아할 만한 태그를 가진 랭킹입니다.'}
        />
      </div>
      {/*  */}
      <div
        style={{ fontWeight: 'bold', paddingLeft: '10px', fontSize: '14px' }}
      >
        RECENT
      </div>
      <div style={{ padding: '5px 0 10px 10px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span style={{ fontSize: '20px' }}>🇰🇷</span>
          <span style={{ marginLeft: '6px', fontSize: '14px' }}>r/korea</span>
        </div>
      </div>
      {/*  */}

      <div
        style={{ fontWeight: 'bold', paddingLeft: '10px', fontSize: '14px' }}
      >
        커뮤니티
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 0',
          backgroundColor:
            isSideHovered === 'CREATE_COMMUNITY' ? '#f0f0f0' : 'white',
          borderRadius: '10px',
          margin: '5px',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsSideHovered('CREATE_COMMUNITY')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={handleCreateCommunityClick}
      >
        <span style={{ fontSize: '14px', marginRight: '10px' }}>➕</span>
        <span style={{ fontSize: '14px' }}>커뮤니티 만들기</span>
      </div>
      <div style={{ flex: 1, padding: '5px 0 10px 10px', overflowY: 'auto' }}>
        {communityList.length > 0
          ? communityList
              .slice(0, displayCount)
              .map((community: SelectCommunityParams, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <img
                    src={logo}
                    alt={'community icon'}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      handleCommunityClick(
                        {
                          button: community.name,
                        } as CommunityClickType,
                        index,
                      )
                    }
                  />
                  <span
                    style={{
                      marginLeft: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onClick={() =>
                      handleCommunityClick(
                        {
                          button: community.name,
                        } as CommunityClickType,
                        index,
                      )
                    }
                  >
                    j/{community.name}
                  </span>
                </div>
              ))
          : []}
        {communityList.length > displayCount && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '10px',
            }}
          >
            <button
              onClick={handleLoadMore}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '5px',
                backgroundColor: '#0079D3',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                visibility: loading ? 'hidden' : 'visible',
              }}
            >
              {loading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSideBar;
