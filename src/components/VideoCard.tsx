import styled from 'styled-components';
import YouTube from 'react-youtube';
import React, { useEffect } from 'react';
import { breakpoints } from '../_common/breakpoint';

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
        const isYoutube: boolean = platform === 'youtube';
        const isTiktok: boolean = platform === 'tiktok';
        const isInstagram: boolean = platform === 'instagram';
        const videoHeight = isYoutube
          ? '400px'
          : isTiktok
            ? '575px'
            : isInstagram
              ? '690px'
              : '1000px';

        return (
          <>
            {(platform === 'youtube' || platform === 'youtube_shorts') &&
              id && (
                <YouTube
                  videoId={id}
                  opts={{
                    width: '100%',
                    height: videoHeight,
                    playerVars: { modestbranding: 1 },
                  }}
                  style={{ borderRadius: '20px' }}
                />
              )}
            {platform === 'instagram' && id && (
              <StyledInstagramWrapper>
                <StyledInstagramContainer height={videoHeight}>
                  <StyledIframe
                    src={`https://www.instagram.com/reel/${id}/embed`}
                    height="1000px"
                    width="1000px"
                    transformY="-60px"
                    transformX="23px"
                  ></StyledIframe>
                </StyledInstagramContainer>
              </StyledInstagramWrapper>
            )}
            {platform === 'tiktok' && id && (
              <StyledTikTokWrapper>
                <StyledTiktokIframeContainer height={videoHeight}>
                  <StyledIframe
                    src={`https://www.tiktok.com/embed/${id}`}
                    height="1000px"
                    width="1000px"
                  ></StyledIframe>
                </StyledTiktokIframeContainer>
              </StyledTikTokWrapper>
            )}
            {platform === 'facebook_video' && id && (
              <iframe
                src={`https://www.facebook.com/video/embed?video_id=${id}`}
                width="100%"
                height={videoHeight}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
            {platform === 'reddit' && id && (
              <iframe
                src={`https://www.reddit.com/embed/${id}`}
                width="100%"
                height={videoHeight}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
            {platform === 'threads' && id && (
              <iframe
                src={`https://www.threads.net/embed/post/${id}`}
                width="100%"
                height={videoHeight}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
            )}
          </>
        );
      })}
    </VideoContainer>
  );
};

export default VideoCard;

const VideoContainer = styled.div`
  border-radius: 0px;
  overflow: hidden;
`;

const StyledInstagramWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
  width: 100%;
  border-radius: 30px;
`;

const StyledInstagramContainer = styled.div<{ readonly height: string }>`
  width: 500px;
  height: ${(props) => props.height};
  overflow: hidden;
  position: relative;
  height: 590px;
  border-radius: 20px;

  @media (max-width: ${breakpoints.mobile}) {
    height: 580px;
  }
`;

const StyledTikTokWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
  width: 100%;
  border-radius: 30px;
`;

const StyledTiktokIframeContainer = styled.div<{ readonly height: string }>`
  width: 323px;
  height: ${(props) => props.height};
  overflow: hidden;
  position: relative;
  border-radius: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    height: 510px;
    width: 290px;
  }
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