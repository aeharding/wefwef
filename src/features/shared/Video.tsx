import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Dictionary } from "@reduxjs/toolkit";
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { isAppleDeviceInstallable } from "../../helpers/device";

const Container = styled.div<{ interactable: boolean }>`
  position: relative;
  overflow: hidden;

  // Hack for Safari bug
  //
  // https://bugs.webkit.org/show_bug.cgi?id=261950
  // https://github.com/aeharding/voyager/issues/763
  //
  // This workaround isn't perfect, but allows some
  // touch events to work sometimes instead of never
  ${({ interactable }) =>
    !interactable && isAppleDeviceInstallable()
      ? css`
          &::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translate3d(0, 0, 0);
          }
        `
      : ""}
`;

const Progress = styled.progress`
  position: absolute;
  bottom: -6px;
  right: 0;
  left: 0;
  width: 100%;
  appearance: none;
  height: 12px;
  transform: translate3d(0, 0, 0);

  &::-webkit-progress-bar {
    background: rgba(0, 0, 0, 0.0045);
    backdrop-filter: blur(30px);
  }

  &::-webkit-progress-value {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const VideoEl = styled.video`
  width: 100%;
  max-height: calc(100vh - 60px);
  object-fit: cover;

  overflow: hidden;
`;

export interface VideoProps {
  src: string;

  controls?: boolean;
  progress?: boolean;
  autoPlay?: boolean;

  className?: string;
}

const videoPlaybackPlace: Dictionary<number> = {};

const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  {
    src,
    controls,
    className,
    progress: showProgress = !controls,
    autoPlay = true,
    ...rest
  },
  forwardedRef,
) {
  const videoRef = useRef<HTMLVideoElement>();

  useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement);

  const [inViewRef, inView] = useInView({
    threshold: 0.5,
  });
  const [progress, setProgress] = useState<number | undefined>(undefined);

  const setRefs = useCallback(
    (node: HTMLVideoElement) => {
      // Ref's from useRef needs to have the node assigned to `current`
      videoRef.current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef],
  );

  const savePlace = useCallback(() => {
    if (!videoRef.current) return;
    if (!autoPlay) return;

    videoPlaybackPlace[src] = videoRef.current.currentTime;
    videoRef.current.pause();
  }, [src, autoPlay]);

  const resume = useCallback(() => {
    if (!videoRef.current) return;
    if (!autoPlay) return;

    videoRef.current.currentTime = videoPlaybackPlace[src] ?? 0;
    videoRef.current.play();
  }, [src, autoPlay]);

  useEffect(() => {
    if (!videoRef || !videoRef.current) {
      return;
    }

    if (inView) {
      resume();
    } else {
      savePlace();
    }
  }, [inView, savePlace, resume]);

  const videoEl = (
    <Container interactable={!!controls} className={className}>
      <VideoEl
        ref={setRefs}
        src={`${src}#t=0.001`}
        loop
        muted
        playsInline
        autoPlay={false}
        controls={controls}
        onTimeUpdate={(e: ChangeEvent<HTMLVideoElement>) => {
          if (!showProgress) return;
          setProgress(e.target.currentTime / e.target.duration);
        }}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      />
      {showProgress && progress !== undefined && <Progress value={progress} />}
    </Container>
  );

  return videoEl;
});

export default Video;
