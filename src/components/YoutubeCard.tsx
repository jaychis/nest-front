import styled from "styled-components";
import YouTube from "react-youtube";

interface YoutubeProps {
  readonly content: string[];
}

const YoutubeCard = ({ content }: YoutubeProps) => {
  const getYouTubeVideoId = ({ url }: { readonly url: string }): string => {
    try {
      return url.includes("v=")
        ? url?.split("v=")[1]?.split("&")[0]
        : url?.split("youtu.be/")[1]?.split("?")[0];
    } catch (e) {
      console.error("Invalid URL", e);
      return "";
    }
  };

  return (
    <VideoContainer>
      {content.map((video: string, index: number) => (
        <VideoWrapper key={index}>
          <YouTube
            videoId={getYouTubeVideoId({ url: video })}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { modestbranding: 1 },
            }}
          />
        </VideoWrapper>
      ))}
    </VideoContainer>
  );
};

export default YoutubeCard;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; 
`;

const VideoWrapper = styled.div`
  position: relative;
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