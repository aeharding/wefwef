import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useParams } from "react-router";
import Stats from "./Stats";
import styled from "@emotion/styled";
import Embed from "../shared/Embed";
import Comments from "../../comment/Comments";
import Markdown from "../../shared/Markdown";
import PostActions from "../actions/PostActions";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { findLoneImage } from "../../../helpers/markdown";
import { getPost, setPostRead } from "../postSlice";
import { isUrlImage, isUrlVideo } from "../../../helpers/lemmy";
import AppBackButton from "../../shared/AppBackButton";
import { maxWidthCss } from "../../shared/AppContent";
import PersonLink from "../../labels/links/PersonLink";
import { CommentSortType, PostView } from "lemmy-js-client";
import { useBuildGeneralBrowseLink } from "../../../helpers/routes";
import ViewAllComments from "./ViewAllComments";
import InlineMarkdown from "../../shared/InlineMarkdown";
import { megaphone } from "ionicons/icons";
import CommunityLink from "../../labels/links/CommunityLink";
import Video from "../../shared/Video";
import { css } from "@emotion/react";
import { jwtSelector } from "../../auth/authSlice";
import CommentSort from "../../comment/CommentSort";
import Nsfw, { isNsfw } from "../../labels/Nsfw";
import { PageContext } from "../../auth/PageContext";
import MoreActions from "../shared/MoreActions";
import PostGalleryImg from "../../gallery/PostGalleryImg";

const BorderlessIonItem = styled(IonItem)`
  --padding-start: 0;
  --inner-padding-end: 0;

  ${maxWidthCss}
`;

export const CenteredSpinner = styled(IonSpinner)`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Container = styled.div`
  margin: 0 0 16px;
  width: 100%;
`;

const lightboxCss = css`
  width: 100%;
  max-height: 50vh;
  object-fit: contain;
  background: var(--lightroom-bg);
`;

const LightboxImg = styled(PostGalleryImg)`
  -webkit-touch-callout: default;

  ${lightboxCss}
`;

const StyledMarkdown = styled(Markdown)`
  margin: 16px 0;

  img {
    display: block;
    max-width: 100%;
    max-height: 50vh;
    object-fit: contain;
    object-position: 0%;
  }
`;

const StyledEmbed = styled(Embed)`
  margin: 16px 0;
`;

const PostDeets = styled.div`
  margin: 0 8px;
  font-size: 0.9em;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1em;
  }
`;

const Title = styled.div`
  font-size: 1.3em;
  padding: 16px 0 0;
  margin-bottom: 16px;
`;

const By = styled.div`
  margin-bottom: 5px;
  color: var(--ion-color-text-aside);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AnnouncementIcon = styled(IonIcon)`
  font-size: 1.1rem;
  margin-right: 5px;
  vertical-align: middle;
  color: var(--ion-color-success);
`;

export default function PostDetail() {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const { id, commentPath, community } = useParams<{
    id: string;
    commentPath?: string;
    community: string;
  }>();
  const jwt = useAppSelector(jwtSelector);
  const [collapsed, setCollapsed] = useState(!!commentPath);
  const post = useAppSelector((state) => state.post.postById[id]);
  const dispatch = useAppDispatch();
  const markdownLoneImage = useMemo(
    () => (post?.post.body ? findLoneImage(post.post.body) : undefined),
    [post]
  );
  const titleRef = useRef<HTMLDivElement>(null);
  const { presentLoginIfNeeded, presentCommentReply } = useContext(PageContext);
  const [commentsLastUpdated, setCommentsLastUpdated] = useState(Date.now());
  const [sort, setSort] = useState<CommentSortType>("Hot");
  const [ionViewEntered, setIonViewEntered] = useState(false);

  useEffect(() => {
    if (post) return;

    dispatch(getPost(+id));
  }, [post, jwt, dispatch, id]);

  // Avoid rerender from marking a post as read until the page
  // has fully transitioned in.
  // This keeps the page transition as performant as possible
  useEffect(() => {
    if (!post || !ionViewEntered) return;

    dispatch(setPostRead(+id));
  }, [post, ionViewEntered, dispatch, id]);

  useIonViewDidEnter(() => {
    setIonViewEntered(true);
  });

  useEffect(() => {
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [collapsed]);

  function renderImage() {
    if (!post) return;

    if (post.post.url) {
      if (isUrlImage(post.post.url)) return <LightboxImg post={post} />;

      if (isUrlVideo(post.post.url))
        return <Video src={post.post.url} css={lightboxCss} controls />;
    }

    if (markdownLoneImage) return <LightboxImg post={post} />;
  }

  function renderText() {
    if (!post) return;

    if (post.post.body && !markdownLoneImage) {
      return (
        <>
          {post.post.url &&
            !isUrlImage(post.post.url) &&
            !isUrlVideo(post.post.url) && <Embed post={post} />}
          <StyledMarkdown>{post.post.body}</StyledMarkdown>
        </>
      );
    }

    if (
      post.post.url &&
      !isUrlImage(post.post.url) &&
      !isUrlVideo(post.post.url)
    ) {
      return <StyledEmbed post={post} />;
    }
  }

  function renderHeader(post: PostView) {
    return (
      <>
        <BorderlessIonItem
          onClick={(e) => {
            if (e.target instanceof HTMLElement && e.target.nodeName === "A")
              return;

            setCollapsed(!collapsed);
          }}
        >
          <Container>
            <div onClick={(e) => e.stopPropagation()}>{renderImage()}</div>
            <PostDeets>
              <Title ref={titleRef}>
                <InlineMarkdown>{post.post.name}</InlineMarkdown>{" "}
                {isNsfw(post) && <Nsfw />}
              </Title>
              {!collapsed && renderText()}
              <By>
                {post.counts.featured_community ||
                post.counts.featured_local ? (
                  <AnnouncementIcon icon={megaphone} />
                ) : undefined}
                <CommunityLink
                  community={post.community}
                  showInstanceWhenRemote
                />{" "}
                <PersonLink person={post.creator} prefix="by" />
              </By>
              <Stats post={post} />
            </PostDeets>
          </Container>
        </BorderlessIonItem>
        <BorderlessIonItem>
          <PostActions
            post={post}
            onReply={async () => {
              if (presentLoginIfNeeded()) return;

              const replied = await presentCommentReply(post);

              if (replied) setCommentsLastUpdated(Date.now());
            }}
          />
        </BorderlessIonItem>
      </>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <AppBackButton
              defaultHref={buildGeneralBrowseLink(`/c/${community}`)}
              defaultText={post?.community.name}
            />
          </IonButtons>
          <IonTitle>{post?.counts.comments} Comments</IonTitle>
          <IonButtons slot="end">
            <CommentSort sort={sort} setSort={setSort} />
            {post && <MoreActions post={post} />}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {post ? (
          <Comments
            header={renderHeader(post)}
            postId={post.post.id}
            commentPath={commentPath}
            op={post.creator}
            sort={sort}
            commentsLastUpdated={commentsLastUpdated}
          />
        ) : (
          <CenteredSpinner />
        )}
        {commentPath && <ViewAllComments />}
      </IonContent>
    </IonPage>
  );
}
