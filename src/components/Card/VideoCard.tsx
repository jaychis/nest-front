import styled from 'styled-components';
import YouTube from 'react-youtube';
import { breakpoints } from '../../_common/breakpoint';

interface VideoProps {
  readonly content: string[];
}

interface VideoExtractor {
  readonly platform: string;
  readonly match: (url: string) => boolean;
  readonly extract: (url: string) => string | null;
}

const videoExtractors: VideoExtractor[] = [
  {
    platform: 'youtube',
    match: (url: string) =>
      url.includes('youtube.com/watch') && url.includes('v='),
    extract: (url: string) => url.split('v=')[1]?.split('&')[0] || null,
  },
  {
    platform: 'youtube',
    match: (url: string) => url.includes('youtu.be/'),
    extract: (url: string) => url.split('youtu.be/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'youtube_shorts',
    match: (url: string) => url.includes('youtube.com/shorts/'),
    extract: (url: string) => url.split('/shorts/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'instagram',
    match: (url: string) => url.includes('instagram.com/reel/'),
    extract: (url: string) => url.split('reel/')[1]?.split('/')[0] || null,
  },
  {
    platform: 'facebook_video',
    match: (url: string) => url.includes('facebook.com/share/v/'),
    extract: (url: string) => url.split('/v/')[1]?.split('/')[0] || null,
  },
  {
    platform: 'facebook_reel',
    match: (url: string) => url.includes('facebook.com/share/r/'),
    extract: (url: string) => url.split('/r/')[1]?.split('/')[0] || null,
  },
  {
    platform: 'threads',
    match: (url: string) => url.includes('threads.net/'),
    extract: (url: string) => url.split('/post/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'reddit',
    match: (url: string) => url.includes('reddit.com/'),
    extract: (url: string) => url.split('/s/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'tiktok',
    match: (url: string) => url.includes('tiktok.com/'),
    extract: (url: string) => {
      const match = url.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    },
  },
];

const VideoCard = ({ content }: VideoProps) => {
  const getVideoIdFromUrl = ({
    url,
  }: {
    readonly url: string;
  }): { readonly platform: string; readonly id: string } => {
    for (const extractor of videoExtractors) {
      if (extractor.match(url)) {
        const id = extractor.extract(url);
        if (id) {
          return { platform: extractor.platform, id };
        }
      }
    }
    console.warn('Unsupported URL format:', url);
    return { platform: 'unknown', id: '' };
  };

  return (
    <VideoContainer>
      {content.map((video: string, index: number) => {
        const { platform, id } = getVideoIdFromUrl({ url: video });

        return (
          <VideoWrapper>
            {(platform === 'youtube' || platform === 'youtube_shorts') &&
              id && (
                <YouTube
                  videoId={id}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { modestbranding: 1 },
                  }}
                  style={{ borderRadius: '20px' }}
                />
              )}
            {platform === 'instagram' && id && (
                <StyledInstagramIframe
                  src={`https://www.instagram.com/reel/${id}/embed`}
                  height="100%"
                  width="100%"
                ></StyledInstagramIframe>
            )}
            {platform === 'tiktok' && id && (
                <iframe
                  src={`https://www.tiktok.com/embed/${id}`}
                  style={{ width: '100%', height: '100%',}}
                ></iframe>
            )}
            {platform === 'facebook_video' && id && (
              <iframe
                src={`https://www.facebook.com/video/embed?video_id=${id}`}
                width="100%"
                height={'100%'}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
            {platform === 'reddit' && id && (
              <iframe
                src={`https://www.reddit.com/embed/${id}`}
                width="100%"
                height={'100%'}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
            {platform === 'threads' && id && (
              <iframe
                src={`https://www.threads.net/embed/post/${id}`}
                width="100%"
                height={'100%'}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
          </VideoWrapper>
        );
      })}
    </VideoContainer>
  );
};

export default VideoCard;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; 
`;

const VideoWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: 56.25%; 
  border-radius: 20px;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const StyledInstagramIframe = styled.iframe<{
  readonly height: string;
}>`
  width: 100%;
  height: 100%; /* 부모의 높이에 맞게 설정 */
  border: none;
  overflow: hidden; /* 초과 콘텐츠 숨김 */
  pointer-events: none; /* 사용자가 스크롤할 수 없도록 차단 */
`;

const StyledIframe = styled.iframe<{
  readonly height: string;
  readonly transformY?: string;
  readonly transformX?: string;
}>`
  width: 100%;
  height: ${(props) => props.height};
  border: none;
  transform: translateX(${(props) => props.transformX || '0'})
    translateY(${(props) => props.transformY || '0'});
`;
