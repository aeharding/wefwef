import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as portals from "react-reverse-portal";
import Player from "./Player";
import {
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";

interface VideoPortalProviderProps {
  children: React.ReactNode;
}

export default function VideoPortalProvider({
  children,
}: VideoPortalProviderProps) {
  const [videoRefs, setVideoRefs] = useState<VideoRefs>({});
  const videoRefsRef = useRef<typeof videoRefs>(videoRefs); // yodawg

  useEffect(() => {
    videoRefsRef.current = videoRefs;
  }, [videoRefs]);

  const getPortalNodeForSrc: GetPortalNodeForSrc = useCallback(
    (src, renderedLocationUid) => {
      const videoRefs = videoRefsRef.current;

      const potentialExisting = videoRefs[src];
      if (potentialExisting) {
        if (potentialExisting.renderedLocationUid !== renderedLocationUid) {
          setVideoRefs((videoRefs) => ({
            ...videoRefs,
            [src]: { ...potentialExisting, renderedLocationUid },
          }));
        }

        return potentialExisting.portalNode;
      }

      const newRef = {
        renderedLocationUid,
        portalNode: portals.createHtmlPortalNode(),
      };

      setVideoRefs((videoRefs) => ({
        ...videoRefs,
        [src]: newRef,
      }));

      return newRef.portalNode;
    },
    [],
  );

  const cleanupPortalNodeForSrcIfNeeded = useCallback(
    (src: string, renderedLocationUid: string) => {
      const videoRefs = videoRefsRef.current;

      // Portal was handed off to another OutPortal.
      // Some other portal outlet is controlling, so not responsible for cleanup
      if (videoRefs[src]?.renderedLocationUid !== renderedLocationUid) return;

      setVideoRefs((videoRefs) => {
        const updatedVideoRefs = { ...videoRefs };
        delete updatedVideoRefs[src];
        return updatedVideoRefs;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ videoRefs, getPortalNodeForSrc, cleanupPortalNodeForSrcIfNeeded }),
    [videoRefs, getPortalNodeForSrc, cleanupPortalNodeForSrcIfNeeded],
  );

  const videoOutPortals = useMemo(
    () =>
      Object.entries(videoRefs).map(([src, { portalNode }]) => (
        <portals.InPortal node={portalNode} key={src}>
          <Player src={src} />
        </portals.InPortal>
      )),
    [videoRefs],
  );

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <VideoPortalContext.Provider value={value}>
      {memoizedChildren}
      {videoOutPortals}
    </VideoPortalContext.Provider>
  );
}

type VideoRefs = Record<
  string,
  {
    renderedLocationUid: string;
    portalNode: PortalNode;
  }
>;

type PortalNode = portals.HtmlPortalNode<Component<unknown>>;

interface VideoPortalContextState {
  videoRefs: VideoRefs;
  getPortalNodeForSrc: GetPortalNodeForSrc;
  cleanupPortalNodeForSrcIfNeeded: (
    src: string,
    renderedLocationUid: string,
  ) => void;
}

type GetPortalNodeForSrc = (
  src: string,
  renderedLocationUid: string,
) => PortalNode | void;

const VideoPortalContext = createContext<VideoPortalContextState>({
  videoRefs: {},
  getPortalNodeForSrc: () => {},
  cleanupPortalNodeForSrcIfNeeded: () => {},
});

export function useVideoPortalNode(
  src: string,
  renderedLocationUid: string,
): PortalNode | void {
  const { getPortalNodeForSrc, cleanupPortalNodeForSrcIfNeeded, videoRefs } =
    useContext(VideoPortalContext);

  const oldLocUid = useRef("");

  function getPortalNode() {
    getPortalNodeForSrc(src, renderedLocationUid);
  }

  function cleanupPortalNodeIfNeeded() {
    cleanupPortalNodeForSrcIfNeeded(src, renderedLocationUid);
  }

  useEffect(() => {
    getPortalNode();

    return cleanupPortalNodeIfNeeded;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIonViewWillEnter(() => {
    oldLocUid.current = videoRefs[src]?.renderedLocationUid ?? "";
    getPortalNode();
  });

  const potentialVideoRef = videoRefs[src];

  if (potentialVideoRef?.renderedLocationUid === renderedLocationUid)
    return potentialVideoRef.portalNode;
}
