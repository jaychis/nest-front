import { useState, useEffect } from "react";
import styled from "styled-components";
import sanitizeHtml from 'sanitize-html';

interface ContentCardProps {
    readonly content: string[];
}

const ContentCard = ({content}:ContentCardProps) => {

    const [color, setColor] = useState<string>('');

    const safeHtml = (content: string) => {
        return sanitizeHtml(content, {
        allowedTags: ['img','a','br','p','div','span','pre','code','bold','em','u','s','blockquote','ol','li','ul',],
        allowedAttributes: {
        img: [
            'src',
            'srcset',
            'alt',
            'title',
            'width',
            'height',
            'loading',
            'style',
        ],
        a: ['href', 'rel', 'target'],
        span: ['style', 'contenteditable'],
        p: ['style'],
        div: ['class', 'spellcheck'],
        pre: ['class'],
        code: ['class'],
        li: ['data-list', 'style', 'class'],
        },
        allowedClasses: {
        div: ['ql-code-block', 'ql-code-block-container'],
        code: ['language-*'],
        li: ['ql-indent-*'],
        },
        transformTags: {
        img: (tagName, attribs) => {
            return {
            tagName: 'img',
            attribs: {
                ...attribs,
                style:
                'width: 40%; height: auto; display: block; margin: 0 auto;',
            },
            };
        },
        },
    });
    };

    useEffect(() => {

    if (content.some((item) => item.includes('span'))) {
        const contentString = content.join('');
        const colorMatch = contentString.match(/color:\s*rgb\([^\)]+\)/);
    
    if (colorMatch) {
        const extractedColor = colorMatch[0].replace('color: ', '').trim();
        setColor(extractedColor);
    }
    }

    const extractTextFromHTML = (htmlString: string): string => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        return tempDiv.innerText || tempDiv.textContent || '';
        };

        extractTextFromHTML(content[0]);
    },[])


    return(
        <ContentContainer fontcolor={color}>
            {content?.map((co, index) => {
                return (
                  <ContentWrapper
                    key={`-${index}`}
                    dangerouslySetInnerHTML={{ __html: safeHtml(co) }}
                  />
                );
              })}
        </ContentContainer>
    )
}

export default ContentCard;

const ContentContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'fontcolor',
  })<{ fontcolor: string }>`
    text-align: left;
    white-space: normal;
    word-break: break-word;
    width: 100%;
  
    span {
      color: ${(props) => props.fontcolor};
    }
  `;

const ContentWrapper = styled.div`
  max-width: 100% !important;
  max-height: 100% !important;

  img {
    max-width: 70% !important;
    max-height: 450px !important;
    height: auto !important;
    display: block !important;
  }
`;