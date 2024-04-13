import {
  IonButtons,
  IonButton,
  IonToolbar,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import { Comment } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store";
import { Centered, Spinner } from "../../../auth/login/LoginNav";
import { editComment } from "../../commentSlice";
import { DismissableProps } from "../../../shared/DynamicDismissableModal";
import CommentEditorContent from "../CommentEditorContent";
import useAppToast from "../../../../helpers/useAppToast";
import AppHeader from "../../../shared/AppHeader";
import { isIosTheme } from "../../../../helpers/device";
import { arrowBackSharp, send } from "ionicons/icons";
import { presentErrorMessage } from "../../../../helpers/error";

type CommentEditingProps = DismissableProps & {
  item: Comment;
};

export default function CommentEdit({
  item,
  setCanDismiss,
  dismiss,
}: CommentEditingProps) {
  const dispatch = useAppDispatch();
  const [replyContent, setReplyContent] = useState(item.content);
  const presentToast = useAppToast();
  const [loading, setLoading] = useState(false);
  const isSubmitDisabled =
    !replyContent.trim() || item.content === replyContent || loading;

  useEffect(() => {
    setCanDismiss(item.content === replyContent);
  }, [replyContent, item, setCanDismiss]);

  async function submit() {
    if (isSubmitDisabled) return;

    setLoading(true);

    try {
      await dispatch(editComment(item.id, replyContent));
    } catch (error) {
      presentToast({
        message: presentErrorMessage("Problem saving your changes", error),
        color: "danger",
        fullscreen: true,
      });

      throw error;
    } finally {
      setLoading(false);
    }

    presentToast({
      message: "Comment edited!",
      color: "primary",
      position: "top",
      centerText: true,
      fullscreen: true,
    });

    setCanDismiss(true);
    dismiss();
  }

  return (
    <>
      <AppHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => dismiss()}>
              {isIosTheme() ? (
                "Cancel"
              ) : (
                <IonIcon icon={arrowBackSharp} slot="icon-only" />
              )}
            </IonButton>
          </IonButtons>
          <IonTitle>
            <Centered>
              Edit Comment
              {loading && <Spinner color="dark" />}
            </Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong
              type="submit"
              disabled={isSubmitDisabled}
              color={isSubmitDisabled ? "medium" : undefined}
              onClick={submit}
            >
              {isIosTheme() ? "Save" : <IonIcon icon={send} slot="icon-only" />}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </AppHeader>

      <CommentEditorContent
        text={replyContent}
        setText={setReplyContent}
        onSubmit={submit}
        onDismiss={dismiss}
      />
    </>
  );
}
