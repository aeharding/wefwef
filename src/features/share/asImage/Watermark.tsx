import styled from "@emotion/styled";
import { isAndroid, isNative } from "../../../helpers/device";

const Container = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  padding: 0 8px 8px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  opacity: 0.6;

  color: var(--ion-item-color, var(--ion-text-color, #000));
`;

const Text = styled.div`
  opacity: 0.5;
`;

const LogoImg = styled.img`
  border-radius: 4px;
  width: 25px;
`;

export default function Watermark() {
  return (
    <Container>
      <Text>Voyager for Lemmy</Text>
      {/* https://github.com/bubkoo/html-to-image/issues/321#issuecomment-1831136948 */}
      {(!isNative() || !isAndroid()) && (
        <LogoImg src="/logo.png" className="allowed-image" />
      )}
    </Container>
  );
}
