import { IonContent } from "@ionic/react";
import React from "react";
import { isAndroid, isNative } from "../../helpers/device";

interface FeedContentProps {
  children: React.ReactNode;
  className?: string;
}

// There is some strange behavior that needs to be sorted before this
// can be enabled
export const isSafariFeedHackEnabled = !isNative() || isAndroid();

// All of this terrible code is to deal with safari being safari >:(
// https://bugs.webkit.org/show_bug.cgi?id=222654

export default function FeedContent({ children, className }: FeedContentProps) {
  if (isSafariFeedHackEnabled)
    return <IonContent className={className}>{children}</IonContent>;

  return (
    <IonContent scrollY={false} fullscreen className={className}>
      {children}
    </IonContent>
  );
}
