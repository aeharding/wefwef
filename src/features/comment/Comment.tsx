import styled from "@emotion/styled";
import { IonIcon, IonItem } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import { CommentView } from "lemmy-js-client";
import { css } from "@emotion/react";
import React, { MouseEvent } from "react";
import Ago from "../labels/Ago";
import { maxWidthCss } from "../shared/AppContent";
import PersonLink from "../labels/links/PersonLink";
import { ignoreSsrFlag } from "../../helpers/emotion";
import Vote from "../labels/Vote";
import AnimateHeight from "react-animate-height";
import CommentContent from "./CommentContent";
import SlidingNestedCommentVote from "../shared/sliding/SlidingNestedCommentVote";
import CommentEllipsis from "./CommentEllipsis";
import { useAppSelector } from "../../store";
import Save from "../labels/Save";
import Edited from "../labels/Edited";
import ModActions from "./ModActions";
import { ModeratableItemBannerOutlet } from "../moderation/ModeratableItem";
import ModeratableItem from "../moderation/ModeratableItem";
import useCanModerate from "../moderation/useCanModerate";

const rainbowColors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#e1ca00", // Yellow
  "#00dd00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#8B00FF", // Violet
  "#FF00FF", // Magenta
  "#FF1493", // Deep Pink
  "#00FFFF", // Cyan
];

export const CustomIonItem = styled(IonItem)`
  scroll-margin-bottom: 35vh;

  --padding-start: 0;
  --inner-padding-end: 0;
  --border-style: none;
  --min-height: 0;
`;

export const PositionedContainer = styled.div<{
  depth: number;
  highlighted: boolean;
}>`
  position: relative;

  ${maxWidthCss}

  padding: 8px 12px;

  ${({ highlighted }) =>
    highlighted &&
    css`
      background: var(--ion-color-light);
    `}

  @media (hover: none) {
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
  }

  ${({ depth }) => css`
    padding-left: calc(12px + ${Math.max(0, depth - 1) * 10}px);
  `}
`;

export const Container = styled.div<{
  depth: number;
  highlighted?: boolean;
  hidden?: boolean;
}>`
  display: flex;

  position: relative;
  width: 100%;

  font-size: 0.9375em;

  display: flex;
  flex-direction: column;

  ${({ depth }) =>
    depth > 0 &&
    css`
      padding-left: 1rem;
    `}

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    filter: brightness(0.7);

    ${({ theme }) =>
      !theme.dark &&
      css`
        filter: none;
      `}

    ${({ depth }) =>
      depth &&
      css`
        background: ${rainbowColors[depth % rainbowColors.length]};
      `}

      ${({ hidden }) =>
      hidden &&
      css`
        opacity: 0;
      `}
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;

  font-size: 0.875rem;

  gap: 0.5rem;

  color: var(--ion-color-medium2);
`;

const StyledPersonLabel = styled(PersonLink)`
  color: var(--ion-text-color);

  min-width: 0;
  overflow: hidden;
`;

const Content = styled.div`
  padding-top: 0.35rem;

  @media (hover: none) {
    padding-top: 0.45rem;
  }

  line-height: 1.25;

  > *:first-child ${ignoreSsrFlag} {
    &,
    > p:first-child ${ignoreSsrFlag} {
      margin-top: 0;
    }
  }
  > *:last-child {
    &,
    > p:last-child {
      margin-bottom: 0;
    }
  }
`;

const CollapsedIcon = styled(IonIcon)`
  font-size: 1.2em;
`;

const AmountCollapsed = styled.div`
  font-size: 0.875em;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem;
  border-radius: 1rem;
  color: var(--ion-color-medium);
  background: var(--ion-color-light);
`;

interface CommentProps {
  comment: CommentView;
  highlightedCommentId?: number;
  depth?: number;
  absoluteDepth?: number;
  onClick?: (e: MouseEvent) => void;
  collapsed?: boolean;
  fullyCollapsed?: boolean;
  routerLink?: string;

  /** On profile view, this is used to show post replying to */
  context?: React.ReactNode;

  className?: string;

  rootIndex?: number;
}

export default function Comment({
  comment: commentView,
  highlightedCommentId,
  depth,
  absoluteDepth,
  onClick,
  collapsed,
  fullyCollapsed,
  context,
  routerLink,
  className,
  rootIndex,
}: CommentProps) {
  const commentFromStore = useAppSelector(
    (state) => state.comment.commentById[commentView.comment.id],
  );

  // Comment from slice might be more up to date, e.g. edits
  const comment = commentFromStore ?? commentView.comment;

  const canModerate = useCanModerate(commentView.community);

  return (
    <AnimateHeight duration={200} height={fullyCollapsed ? 0 : "auto"}>
      <SlidingNestedCommentVote
        item={commentView}
        className={className}
        rootIndex={rootIndex}
        collapsed={!!collapsed}
      >
        <CustomIonItem
          routerLink={routerLink}
          href={undefined}
          onClick={(e) => onClick?.(e)}
          className={`comment-${comment.id}`}
        >
          <ModeratableItem itemView={commentView}>
            <PositionedContainer
              depth={absoluteDepth === depth ? depth || 0 : (depth || 0) + 1}
              highlighted={highlightedCommentId === comment.id}
            >
              <Container depth={absoluteDepth ?? depth ?? 0}>
                <ModeratableItemBannerOutlet />
                <Header>
                  <StyledPersonLabel
                    person={commentView.creator}
                    opId={commentView.post.creator_id}
                    distinguished={comment.distinguished}
                    showBadge={!context}
                  />
                  <Vote item={commentView} />
                  <Edited item={commentView} />
                  <div
                    css={css`
                      flex: 1;
                    `}
                  />
                  {!collapsed ? (
                    <>
                      {!!canModerate && (
                        <ModActions
                          comment={comment}
                          counts={commentView.counts}
                        />
                      )}
                      <CommentEllipsis
                        comment={commentView}
                        rootIndex={rootIndex}
                      />
                      <Ago date={comment.published} />
                    </>
                  ) : (
                    <>
                      <AmountCollapsed>
                        {commentView.counts.child_count + 1}
                      </AmountCollapsed>
                      <CollapsedIcon icon={chevronDownOutline} />
                    </>
                  )}
                </Header>

                <AnimateHeight duration={200} height={collapsed ? 0 : "auto"}>
                  <Content
                    onClick={(e) => {
                      if (!(e.target instanceof HTMLElement)) return;
                      if (e.target.nodeName === "A") e.stopPropagation();
                    }}
                  >
                    <CommentContent
                      item={comment}
                      showTouchFriendlyLinks={!context}
                      isMod={!!canModerate}
                    />
                    {context}
                  </Content>
                </AnimateHeight>
              </Container>
              <Save type="comment" id={commentView.comment.id} />
            </PositionedContainer>
          </ModeratableItem>
        </CustomIonItem>
      </SlidingNestedCommentVote>
    </AnimateHeight>
  );
}
