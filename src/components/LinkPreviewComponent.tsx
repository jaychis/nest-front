import React from 'react'
import { LinkPreview } from '@dhaiwat10/react-link-preview';

const LinkPreviewComponent = () => {

    const url:string = 'https://www.msn.com/ko-kr/news/other/%EB%A1%9C%EB%B2%84%ED%8A%B8-%ED%8C%A8%ED%8B%B4%EC%8A%A8-%ED%95%9C%EA%B5%AD-%EC%A7%91-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8D%94%EB%8B%88-%EC%A7%84%EC%A7%9C-%EB%8C%80%EB%B0%95-%ED%96%89%EB%B3%B4/ar-AA1xyMeI?ocid=msedgntp&pc=SMTS&cvid=59c663d2150c41cfbf93c993eac83f37&ei=9 '

    return(
    <div>
      <h1>Link Preview Example</h1>
      <LinkPreview url={url} />
    </div>

    )
}

export default LinkPreviewComponent;