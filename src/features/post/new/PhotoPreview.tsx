import { styled } from "@linaria/react";
import { IonSpinner } from "@ionic/react";
import { isUrlVideo } from "../../../helpers/url";

const Container = styled.div`
  position: relative;
`;

const Img = styled.img<{ loadingImage: boolean }>`
  max-width: 100px;
  max-height: 100px;
  padding: 1rem;

  filter: ${({ loadingImage }) =>
    loadingImage ? "blur(5px) brightness(0.5)" : "none"};
`;

const OverlaySpinner = styled(IonSpinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

interface PhotoPreviewProps {
  src: string;
  isVideo?: boolean;
  loading: boolean;
}

export default function PhotoPreview({
  src,
  isVideo,
  loading,
}: PhotoPreviewProps) {
  return (
    <Container>
      <Img
        src={src}
        loadingImage={loading}
        /* Just uploaded blob (can't detect type from url), or editing post w/ media lemmy url (can) */
        as={isVideo || isUrlVideo(src) ? "video" : "img"}
      />
      {loading && <OverlaySpinner />}
    </Container>
  );
}
