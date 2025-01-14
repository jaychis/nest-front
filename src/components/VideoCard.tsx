import styled from 'styled-components';
import YouTube from 'react-youtube';
import React from 'react';

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
    extract: (url) => url.split('youtu.be/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'youtube_shorts',
    match: (url) => url.includes('youtube.com/shorts/'),
    extract: (url) => url.split('/shorts/')[1]?.split('?')[0] || null,
  },
  {
    platform: 'instagram',
    match: (url) => url.includes('instagram.com/reel/'),
    extract: (url) => url.split('reel/')[1]?.split('/')[0] || null,
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
        const isYoutube = platform === 'youtube';
        const videoHeight = isYoutube ? '400px' : '1000px';

        return (
          <VideoContainer key={`${id}-${index}`}>
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
              <iframe
                src={`https://www.instagram.com/reel/${id}/embed`}
                width="100%"
                height={videoHeight}
                style={{ borderRadius: '20px', border: 'none' }}
                allowFullScreen
              ></iframe>
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
          </VideoContainer>
        );
      })}
    </VideoContainer>
  );
};

export default VideoCard;

const VideoContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
`;
