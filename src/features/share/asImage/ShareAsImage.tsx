import { IonButton, IonItem, IonLabel, IonList, IonToggle } from "@ionic/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import CommentTree from "../../comment/inTree/CommentTree";
import { buildCommentsTree, getDepthFromComment } from "../../../helpers/lemmy";
import AddRemoveButtons from "./AddRemoveButtons";
import Watermark from "./Watermark";
import { isNative } from "../../../helpers/device";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { blobToDataURL, blobToString } from "../../../helpers/blob";
import useAppToast from "../../../helpers/useAppToast";
import includeStyleProperties from "./includeStyleProperties";
import { CapacitorHttp } from "@capacitor/core";
import { domToBlob } from "modern-screenshot";
import { getImageSrc } from "../../../services/lemmy";
import { ShareAsImageData } from "./ShareAsImageModal";
import PostHeader from "../../post/detail/PostHeader";
import { webviewServerUrl } from "../../../services/nativeFetch";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { useShareAsImagePreferences } from "./ShareAsImagePreferences";

const Container = styled.div`
  --bottom-padding: max(
    var(--ion-safe-area-bottom, env(safe-area-inset-bottom, 0)),
    16px
  );

  --top-space: 50px;

  @media (max-height: 650px) {
    --top-space: 0px;
  }

  display: grid;
  grid-template-rows: max-content 1fr max-content;

  max-height: calc(
    100vh - var(--ion-safe-area-top, env(safe-area-inset-top, 0)) - var(
        --top-space
      )
  );

  padding: 0 16px var(--bottom-padding);
`;

const sharedImgCss = `
  min-height: 0;
  max-height: 100%;
  justify-self: center;
  max-width: 100%;

  filter: var(--share-img-drop-shadow);

  .ios & {
    border-radius: 8px;
  }

  .md & {
    margin-top: 16px;
  }
`;

const PlaceholderImg = styled.div`
  ${sharedImgCss}

  background: white;

  .ion-palette-dark & {
    background: black;
  }

  height: 80px;
  width: 80%;
`;

const PreviewImg = styled.img`
  ${sharedImgCss}
`;

const StyledIonList = styled(IonList)`
  &.list-ios.list-inset {
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
`;

const ParentCommentValues = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CommentSnapshotContainer = styled.div`
  background: var(--ion-item-background, var(--ion-background-color, #fff));
`;

const PostCommentSpacer = styled.div`
  height: 6px;
`;

const hideBottomBorderCss = css`
  --inner-border-width: 0 0 0 0;
`;

const shareAsImageRenderRoot = document.querySelector(
  "#share-as-image-root",
) as HTMLElement;

interface ShareAsImageProps {
  data: ShareAsImageData;
  header: ReactNode;
}

export default function ShareAsImage({ data, header }: ShareAsImageProps) {
  const presentToast = useAppToast();

  const [blob, setBlob] = useState<Blob | undefined>();
  const [imageSrc, setImageSrc] = useState("");

  const {
    shareAsImagePreferences: {
      comment: { includePostContent, includePostDetails, allParentComments },
      common: { hideUsernames, watermark },
      post: { hideCommunity },
    },
    setShareAsImagePreferences,
  } = useShareAsImagePreferences();

  const isComment = "comment" in data;

  // eslint-disable-next-line no-nested-ternary
  const defaultMinDepth = allParentComments
    ? 0
    : isComment
      ? getDepthFromComment(data.comment.comment)
      : 0;

  const [minDepth, setMinDepth] = useState(defaultMinDepth ?? 0);

  const hasPostBody = data.post.post.body || data.post.post.url;

  useEffect(() => {
    if (!blob) return;

    (async () => {
      setImageSrc(await blobToDataURL(blob));
    })();
  }, [blob]);

  const filteredComments = useMemo(() => {
    if (!isComment) return [];

    const filtered = data.comments
      .filter(
        (c) =>
          (getDepthFromComment(c.comment) ?? 0) >= minDepth &&
          data.comment.comment.path.split(".").includes(`${c.comment.id}`),
      )
      .sort(
        (a, b) =>
          (getDepthFromComment(a.comment) ?? 0) -
          (getDepthFromComment(b.comment) ?? 0),
      );

    return filtered;
  }, [data, minDepth, isComment]);

  const commentNode = useMemo(
    () =>
      filteredComments.length ? buildCommentsTree(filteredComments, true) : [],
    [filteredComments],
  );

  const render = useCallback(async () => {
    try {
      const blob = await domToBlob(
        shareAsImageRenderRoot.querySelector(".inner") as HTMLElement,
        {
          scale: 4,
          features: {
            // Without this, render fails on certain images
            removeControlCharacter: false,
          },
          includeStyleProperties,
          filter: (node) => {
            if (!(node instanceof HTMLElement)) return true;

            return node.tagName !== "VIDEO";
          },
          fetchFn: isNative()
            ? async (url) => {
                // Pass through relative URLs to browser fetching
                if (url.startsWith(`${webviewServerUrl}/`)) {
                  return false;
                }

                // Attempt upgrade to https (insecure will be blocked)
                if (url.startsWith("http://")) {
                  url = url.replace(/^http:\/\//, "https://");
                }

                const nativeResponse = await CapacitorHttp.get({
                  // if pictrs, convert large gifs to jpg
                  url: getImageSrc(url, { format: "jpg" }),
                  responseType: "blob",
                });

                // Workaround that will probably break in a future capacitor upgrade
                // https://github.com/ionic-team/capacitor/issues/6126
                return `data:${
                  nativeResponse.headers["Content-Type"] || "image/png"
                };base64,${nativeResponse.data}`;
              }
            : undefined,
        },
      );
      setBlob(blob ?? undefined);
    } catch (error) {
      presentToast({
        message: "Error rendering image.",
      });

      throw error;
    }
  }, [presentToast]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      render();
    });
  }, [
    render,
    data,
    filteredComments,
    watermark,
    hideUsernames,
    hideCommunity,
    includePostContent,
    includePostDetails,
    allParentComments,
  ]);

  async function onShare() {
    if (!blob) return;

    const apId = isComment ? data.comment.comment.ap_id : data.post.post.ap_id;

    const filename = `${apId
      .replace(/^https:\/\//, "")
      .replaceAll(/\//g, "-")}.png`;

    const file = new File([blob], filename, {
      type: "image/png",
    });

    const webSharePayload: ShareData = { files: [file] };

    if (isNative()) {
      const data = await blobToString(blob);
      const file = await Filesystem.writeFile({
        data,
        directory: Directory.Cache,
        path: filename,
      });
      await Share.share({ files: [file.uri] });
      await Filesystem.deleteFile({ path: file.uri });
    } else if ("canShare" in navigator && navigator.canShare(webSharePayload)) {
      navigator.share(webSharePayload);
    } else {
      const link = document.createElement("a");
      link.download = filename;
      link.href = URL.createObjectURL(file);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }

  return (
    <Container>
      {header}
      {!imageSrc ? (
        <PlaceholderImg />
      ) : (
        <PreviewImg
          draggable={false}
          src={imageSrc}
          onLoad={(e) => {
            if (!(e.target instanceof HTMLImageElement)) return;
            const parent = e.target.parentElement;
            if (!parent) return;

            // Safari hacks 😢 to force rerender
            const theMostParentedOfThemAll = parent.parentElement;
            if (!theMostParentedOfThemAll) return;
            setTimeout(() => {
              theMostParentedOfThemAll.style.opacity = "0.99";
              setTimeout(() => {
                theMostParentedOfThemAll.style.opacity = "1";
              });
            });
          }}
        />
      )}

      <StyledIonList inset lines="full">
        {isComment && (
          <>
            <IonItem>
              <IonToggle
                checked={includePostDetails}
                onIonChange={({ detail: { checked } }) =>
                  setShareAsImagePreferences({
                    comment: { includePostDetails: checked },
                  })
                }
              >
                Include Post Details
              </IonToggle>
            </IonItem>
            {(isComment ? includePostDetails : true) && hasPostBody ? (
              <IonItem>
                <IonToggle
                  checked={includePostContent}
                  onIonChange={({ detail: { checked } }) =>
                    setShareAsImagePreferences({
                      comment: { includePostContent: checked },
                    })
                  }
                >
                  Include Post Content
                </IonToggle>
              </IonItem>
            ) : undefined}

            {!!getDepthFromComment(data.comment.comment) && (
              <IonItem>
                <IonLabel>Parent Comments</IonLabel>
                <ParentCommentValues slot="end">
                  <strong>
                    {(getDepthFromComment(data.comment.comment) ?? 0) -
                      minDepth}
                  </strong>
                  <AddRemoveButtons
                    addDisabled={minDepth === 0}
                    removeDisabled={
                      minDepth === getDepthFromComment(data.comment.comment)
                    }
                    onAdd={() => {
                      setMinDepth((minDepth) => {
                        const newValue = minDepth - 1;
                        if (newValue === 0) {
                          setShareAsImagePreferences({
                            comment: { allParentComments: true },
                          });
                        }
                        return newValue;
                      });
                    }}
                    onRemove={() => {
                      setMinDepth((minDepth) => {
                        const newValue = minDepth + 1;
                        if (
                          newValue === getDepthFromComment(data.comment.comment)
                        ) {
                          setShareAsImagePreferences({
                            comment: { allParentComments: false },
                          });
                        }
                        return newValue;
                      });
                    }}
                  />
                </ParentCommentValues>
              </IonItem>
            )}
          </>
        )}
        {includePostDetails && (
          <IonItem>
            <IonToggle
              checked={hideCommunity}
              onIonChange={({ detail: { checked } }) =>
                setShareAsImagePreferences({ post: { hideCommunity: checked } })
              }
            >
              Hide Community
            </IonToggle>
          </IonItem>
        )}
        <IonItem>
          <IonToggle
            checked={hideUsernames}
            onIonChange={({ detail: { checked } }) =>
              setShareAsImagePreferences({ common: { hideUsernames: checked } })
            }
          >
            Hide Usernames
          </IonToggle>
        </IonItem>
        <IonItem lines="none">
          <IonToggle
            checked={watermark}
            onIonChange={({ detail: { checked } }) =>
              setShareAsImagePreferences({ common: { watermark: checked } })
            }
          >
            Watermark
          </IonToggle>
        </IonItem>
      </StyledIonList>
      <IonButton onClick={onShare}>
        {isNative() || "canShare" in navigator ? "Share" : "Download"}
      </IonButton>

      {createPortal(
        <CommentSnapshotContainer className="inner">
          <ShareImageContext.Provider
            value={{ capturing: true, hideUsernames, hideCommunity }}
          >
            {(isComment ? includePostDetails : true) && (
              <PostHeader
                className={!isComment ? hideBottomBorderCss : ""}
                post={data.post}
                showPostText={isComment ? includePostContent : true}
                showPostActions={false}
                constrainHeight={false}
              />
            )}
            {isComment && (
              <>
                {includePostDetails && <PostCommentSpacer />}
                <CommentTree
                  comment={commentNode[0]!}
                  first
                  rootIndex={0}
                  baseDepth={minDepth}
                />
              </>
            )}
          </ShareImageContext.Provider>
          {watermark && <Watermark />}
        </CommentSnapshotContainer>,
        shareAsImageRenderRoot,
      )}
    </Container>
  );
}

export const ShareImageContext = createContext({
  /**
   * `true` when components are being rendered for image capture
   */
  capturing: false,
  hideUsernames: false,
  hideCommunity: false,
});
