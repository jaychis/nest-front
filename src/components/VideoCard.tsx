import styled from 'styled-components';
import YouTube from 'react-youtube';
import React from 'react';

interface VideoProps {
  readonly content: string[];
}

const VideoCard = ({ content }: VideoProps) => {
  const getVideoIdFromUrl = ({
    url,
  }: {
    readonly url: string;
  }): { readonly platform: string; readonly id: string } => {
    try {
      if (url.includes('youtube.com/watch') && url.includes('v=')) {
        return { platform: 'youtube', id: url.split('v=')[1]?.split('&')[0] };
      } else if (url.includes('youtu.be/')) {
        return {
          platform: 'youtube',
          id: url.split('youtu.be/')[1]?.split('?')[0],
        };
      } else if (url.includes('youtube.com/shorts/')) {
        return {
          platform: 'youtube_shorts',
          id: url.split('shorts/')[1]?.split('?')[0],
        };
      } else if (url.includes('instagram.com/reel/')) {
        return {
          platform: 'instagram',
          id: url.split('reel/')[1]?.split('/')[0],
        };
      } else if (url.includes('facebook.com/share/v/')) {
        return {
          platform: 'facebook_video',
          id: url.split('/v/')[1]?.split('/')[0],
        };
      } else if (url.includes('facebook.com/share/r/')) {
        return {
          platform: 'facebook_reel',
          id: url.split('/r/')[1]?.split('/')[0],
        };
      } else if (url.includes('threads.net/')) {
        return {
          platform: 'threads',
          id: url.split('/post/')[1]?.split('?')[0],
        };
      } else if (url.includes('reddit.com/')) {
        return { platform: 'reddit', id: url.split('/s/')[1]?.split('?')[0] };
      } else {
        console.warn('Unsupported URL format:', url);
        return { platform: 'unknown', id: '' };
      }
    } catch (e) {
      console.error('Error extracting video ID:', e);
      return { platform: 'error', id: '' };
    }
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
