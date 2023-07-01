import { dismiss, present } from "@ionic/core/dist/types/utils/overlays";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonPage,
} from "@ionic/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Centered } from "../auth/Login";

interface SelectTextProps {
  text: string;
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

export default function SelectText({ text, onDismiss }: SelectTextProps) {
  const pageRef = useRef();

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Centered>Select Text</Centered>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                onDismiss();
              }}
            >
              Dismiss
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-padding-horizontal selectable preserve-newlines">{text}</p>
      </IonContent>
    </IonPage>
  );
}
