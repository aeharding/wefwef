import {
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  useIonActionSheet,
} from "@ionic/react";
import { styled } from "@linaria/react";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";

import { BanUserPayload } from "#/features/auth/PageContext";
import { Centered, Spinner } from "#/features/auth/login/LoginNav";
import { preventPhotoswipeGalleryFocusTrap } from "#/features/media/gallery/GalleryImg";
import AddRemoveButtons from "#/features/share/asImage/AddRemoveButtons";
import AppHeader from "#/features/shared/AppHeader";
import { banUser } from "#/features/user/userSlice";
import { getHandle } from "#/helpers/lemmy";
import { buildBanFailed, buildBanned } from "#/helpers/toastMessages";
import useAppToast from "#/helpers/useAppToast";
import { useAppDispatch } from "#/store";

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DaysValues = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BanTextContainer = styled.div`
  font-size: 0.925em;
  margin: 0 32px 32px;
`;

interface BanUserProps {
  dismiss: () => void;
  setCanDismiss: (canDismiss: boolean) => void;
  item: BanUserPayload;
}

export default function BanUser({
  dismiss,
  setCanDismiss,
  item: { user, community },
}: BanUserProps) {
  const [reason, setReason] = useState("");
  const [permanent, setPermanent] = useState(true);
  const [days, setDays] = useState(1);
  const [removeContent, setRemoveContent] = useState(false);

  const dispatch = useAppDispatch();
  const presentToast = useAppToast();
  const [loading, setLoading] = useState(false);
  const [presentActionSheet] = useIonActionSheet();

  const text = `Banning ${getHandle(user)} ${
    permanent ? "permanently" : `for ${days} days`
  } from c/${getHandle(community)}`;

  async function submit() {
    presentActionSheet([
      {
        text: `Ban ${getHandle(user)}`,
        role: "destructive",
        handler: () => {
          ban();
        },
      },
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "mod",
      },
    ]);
  }

  async function ban() {
    setLoading(true);

    try {
      await dispatch(
        banUser({
          person_id: user.id,
          community_id: community.id,
          reason,
          expires: !permanent
            ? Math.trunc(addDays(new Date(), days).getTime() / 1_000)
            : undefined,
          remove_or_restore_data: removeContent,
          ["remove_data" as never]: removeContent, // TODO lemmy 0.19.0 and less support
        }),
      );
    } catch (error) {
      presentToast(buildBanFailed(true));
      throw error;
    } finally {
      setLoading(false);
    }

    presentToast(buildBanned(true));

    setCanDismiss(true);
    dismiss();
  }

  useEffect(() => {
    setCanDismiss(!reason);
  }, [reason, setCanDismiss]);

  return (
    <>
      <AppHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => dismiss()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            <Centered>
              <Title>
                Ban {getHandle(user)} {loading && <Spinner color="dark" />}
              </Title>
            </Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong
              type="submit"
              color="danger"
              onClick={submit}
              disabled={loading}
            >
              Ban
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </AppHeader>
      <IonContent {...preventPhotoswipeGalleryFocusTrap}>
        <IonTextarea
          className="ion-padding"
          label="Reason"
          labelPlacement="stacked"
          placeholder="Ban reason in public logs"
          autoGrow
          value={reason}
          onIonInput={(e) => setReason(e.detail.value as string)}
        />
        <IonList inset>
          <IonItem>
            <IonToggle
              checked={permanent}
              onIonChange={(e) => setPermanent(e.detail.checked)}
            >
              Permanent
            </IonToggle>
          </IonItem>
          {!permanent && (
            <IonItem>
              <IonLabel>Days</IonLabel>
              <DaysValues slot="end">
                <strong>{days}</strong>
                <AddRemoveButtons
                  addDisabled={days > 999}
                  removeDisabled={days <= 1}
                  onAdd={() => setDays((days) => days + 1)}
                  onRemove={() => setDays((days) => days - 1)}
                />
              </DaysValues>
            </IonItem>
          )}
          <IonItem>
            <IonToggle
              checked={removeContent}
              onIonChange={(e) => setRemoveContent(e.detail.checked)}
            >
              Remove Content
            </IonToggle>
          </IonItem>
        </IonList>

        <BanTextContainer>
          <IonLabel color="medium">{text}</IonLabel>
        </BanTextContainer>
      </IonContent>
    </>
  );
}
