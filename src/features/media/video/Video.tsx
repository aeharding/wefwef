import { useImperativeHandle } from "react";
import * as portals from "react-reverse-portal";

import type { PlayerProps } from "./Player";
import Player from "./Player";
import { useVideoPortalNode } from "./VideoPortalProvider";

export interface VideoProps extends Omit<PlayerProps, "ref"> {
  ref: React.RefObject<HTMLVideoElement>;
  shouldPortal?: boolean;
}

export default function Video(props: VideoProps) {
  const VideoComponent = props.shouldPortal ? PortaledVideo : UnportaledVideo;

  return <VideoComponent {...props} />;
}

function UnportaledVideo(props: VideoProps) {
  return <Player {...props} />;
}

function PortaledVideo({ src, ref, ...props }: VideoProps) {
  const portalNode = useVideoPortalNode(src);

  useImperativeHandle(
    ref,
    () => portalNode?.element.querySelector("video") ?? undefined,
    [portalNode],
  );

  return (
    <div style={props.style} className={props.className}>
      {portalNode ? (
        <portals.OutPortal<typeof Player>
          {...props}
          node={portalNode}
          src={src}
        />
      ) : undefined}
    </div>
  );
}
