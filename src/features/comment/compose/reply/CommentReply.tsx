import styled from "@emotion/styled";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonToast,
  IonText,
} from "@ionic/react";
import {
  CommentReplyView,
  CommentView,
  PersonMentionView,
  PostView,
} from "lemmy-js-client";
import { useEffect, useState } from "react";
import ItemReplyingTo from "./ItemReplyingTo";
import useClient from "../../../../helpers/useClient";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { Centered, Spinner } from "../../../auth/Login";
import { handleSelector, jwtSelector } from "../../../auth/authSlice";
import { receivedComments } from "../../commentSlice";
import CommentContent from "../shared";
import useTextRecovery, {
  clearRecoveredText,
} from "../../../../helpers/useTextRecovery";

export const UsernameIonText = styled(IonText)`
  font-size: 0.7em;
  font-weight: normal;
`;

export const TitleContainer = styled.div`
  line-height: 1;
`;

export type CommentReplyItem =
  | CommentView
  | PostView
  | PersonMentionView
  | CommentReplyView;

type CommentReplyProps = {
  dismiss: (reply?: CommentView | undefined) => void;
  setCanDismiss: (canDismiss: boolean) => void;
  item: CommentReplyItem;
};

/**
 * New comment replying to something
 */
export default function CommentReply({
  dismiss,
  setCanDismiss,
  item,
}: CommentReplyProps) {
  const comment = "comment" in item ? item.comment : undefined;

  const dispatch = useAppDispatch();
  const [replyContent, setReplyContent] = useState("");
  const client = useClient();
  const jwt = useAppSelector(jwtSelector);
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const userHandle = useAppSelector(handleSelector);

  async function submit() {
    if (!jwt) return;

    setLoading(true);

    let reply;

    try {
      reply = await client.createComment({
        content: replyContent,
        parent_id: comment?.id,
        post_id: item.post.id,
        auth: jwt,
      });
    } catch (error) {
      const errorDescription =
        error === "language_not_allowed"
          ? "Please select a language in your lemmy profile settings."
          : "Please try again.";

      present({
        message: `Problem posting your comment. ${errorDescription}`,
        duration: 3500,
        position: "bottom",
        color: "danger",
      });

      throw error;
    } finally {
      setLoading(false);
    }

    present({
      message: "Comment posted!",
      duration: 3500,
      position: "bottom",
      color: "success",
    });

    dispatch(receivedComments([reply.comment_view]));
    setCanDismiss(true);
    // TODO is there a way to avoid a timeout here?
    await new Promise((resolve) => setTimeout(resolve, 100));
    dismiss(reply.comment_view);
    clearRecoveredText();
  }

  useEffect(() => {
    setCanDismiss(!replyContent);
  }, [replyContent, setCanDismiss]);

  useTextRecovery(replyContent, setReplyContent);

  return (
    <>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => dismiss()}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>
            <Centered>
              <TitleContainer>
                <IonText>New Comment</IonText>
                <div>
                  <UsernameIonText color="medium">{userHandle}</UsernameIonText>
                </div>
              </TitleContainer>{" "}
              {loading && <Spinner color="dark" />}
            </Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong
              type="submit"
              disabled={!replyContent.trim() || loading}
              onClick={submit}
            >
              Post
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <CommentContent text={replyContent} setText={setReplyContent}>
        <ItemReplyingTo item={item} />
      </CommentContent>
    </>
  );
}
