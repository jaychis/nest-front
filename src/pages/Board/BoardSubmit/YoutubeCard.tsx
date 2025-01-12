import styled from "styled-components";
import YouTube from "react-youtube";

interface YoutubeProps {
    readonly content: string[];
}

const YoutubeCard = ({content}:YoutubeProps) => {

    const getYouTubeVideoId = ({ url }: { readonly url: string }): string => {
        try {
          return url.includes('v=')
            ? url?.split('v=')[1]?.split('&')[0]
            : url?.split('youtu.be/')[1]?.split('?')[0];
        } catch (e) {
          console.error('Invalid URL', e);
          return '';
        }
      };

    return(
        <VideoContainer>
            {content.map((video:string, index:number) => {
                return(
                    <YouTube
                      videoId={getYouTubeVideoId({ url: video })}
                      opts={{
                        width: '100%',
                        height: '400px',
                        playerVars: { modestbranding: 1 },
                      }}
                      style={{ borderRadius: '20px' }} 
                    />
                  )}
                )
            }
        </VideoContainer>
    )
}

export default YoutubeCard;

const VideoContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
`;

