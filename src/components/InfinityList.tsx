import { useEffect, useState } from 'react';
import Card from './Card/Card';
import {List,CellMeasurer,CellMeasurerCache,AutoSizer,} from 'react-virtualized';
import debounce from 'lodash.debounce';
import {BoardListAPI,BoardPopularListAPI,BoardRecentListAPI,BoardShareListAPI,BoardTagsRelatedAPI,} from '../pages/api/boardApi'
import { useSelector } from 'react-redux';
import { MainListTypeState } from '../reducers/mainListTypeSlice';
import { RootState } from '../store/store';
import { CardType } from '../_common/collectionTypes';
import { useLocation,useBeforeUnload } from 'react-router-dom';
import PageTransition from './PageTransition';

const InfinitiList = () => {

    type IdType = null | string;
    interface AllListParams {
        readonly id: IdType;
        readonly allDataLoaded: boolean;
    }

    const { buttonType }: MainListTypeState = useSelector((state: RootState) => state.sideBarButton,);
    const [scrollIndex, setScrollIndex] = useState<number>(0)
    const [initialScrollSet, setInitialScrollSet] = useState(false);
    const [id, setId] = useState<IdType>(null);
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
    const loaction = useLocation()
    const [list, setList] = useState<CardType[]>([]);
    const TAKE: number = 5;

    const cache = new CellMeasurerCache({
        fixedWidth: true, 
        defaultHeight: 400, 
      });

    const ListApi = async ({ id, allDataLoaded }: AllListParams) => {
        if (allDataLoaded) return;
        
        try {
          let response;
          switch (buttonType) {
            case 'HOME':
              response = await BoardListAPI({
                take: TAKE,
                lastId: id,
                category: null,
              });
              break;
    
            case 'POPULAR':
              response = await BoardPopularListAPI({
                take: TAKE,
                lastId: id,
                category: null,
              });
              break;
    
            case 'TAGMATCH':
              response = await BoardTagsRelatedAPI({
                take: TAKE,
                lastId: id,
                category: null,
                userId: localStorage.getItem('id') as string,
              });
              break;
    
            case 'FREQUENTSHARE':
              response = await BoardShareListAPI({
                take: TAKE,
                lastId: id,
                category: null,
              });
              break;
    
            case 'ALL':
              response = await BoardRecentListAPI({
                take: TAKE,
                lastId: id,
                category: null,
              });
              break;
    
            default:
              response = await BoardListAPI({
                take: TAKE,
                lastId: id,
                category: buttonType,
              });
              break;
          }
    
          const res = response?.data?.response;
          
          if (!res) return;
          const newCards = res.current_list;
          setList((prevList) => [...prevList, ...newCards]);
    
          if (newCards.length > 0) {
            setId(newCards[newCards.length - 1].id);
          } else {
            setAllDataLoaded(true);
          }
        } catch (err) {
          console.error('API error: ', err);
        }
      };

    const debouncListApi = debounce(ListApi,300)

    const handleScroll = ({ scrollTop, scrollHeight, clientHeight }: any) => {
        if (scrollTop + clientHeight >= scrollHeight - 10 && !allDataLoaded) {
            debouncListApi({ id, allDataLoaded });
        }
    }

    useBeforeUnload((event) => {
        console.log(sessionStorage.getItem)
        
    })

    useEffect(() => {
        setAllDataLoaded(false);
        setId(null);
        setList([]);
        debouncListApi({ id: null, allDataLoaded: false });
    }, [buttonType]);

    useEffect(() => {
        const handlePageShow = () => {
          const savedScroll = sessionStorage.getItem("scrollIndex");
          if (savedScroll) {
            if(savedScroll !== '0') setScrollIndex(Number(savedScroll) + 1);
            else setScrollIndex(Number(savedScroll));
          }
        }
        handlePageShow()
    
        setTimeout(function(){setInitialScrollSet(true)},2500)
    },[loaction.pathname])

    const rowRenderer = ({ index, key, style, parent }: any) => {
        const el = list[index];
    
        return (
          <PageTransition>
          <CellMeasurer cache={cache} parent={parent} key={key} columnIndex={0} rowIndex={index}>
            <div key={key} style={style}>
              <Card
                index={index}
                id={el.id}
                category={el.category}
                title={el.title}
                nickname={el.nickname}
                createdAt={el.created_at}
                content={el.content}
                type={el.type}
                shareCount={el.share_count}
                userId={el.user_id}
                profileImage={el.user_profile?.profile_image as string}
              />
            </div>
          </CellMeasurer>
          </PageTransition>
        );
      };

      return(
        <>
            <AutoSizer>
                {({ width, height }) => (
                    <List
                    scrollToIndex={initialScrollSet ? undefined : scrollIndex}
                    scrollToAlignment="start"
                    width={width}
                    height={height}
                    rowCount={list.length}
                    rowHeight={cache.rowHeight}
                    rowRenderer={rowRenderer}
                    onScroll={handleScroll}
                    />
                )}
            </AutoSizer>
        </>
      )
}

export default InfinitiList