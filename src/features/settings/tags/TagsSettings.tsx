import { IonList } from "@ionic/react";

import sharedStyles from "#/features/shared/shared.module.css";
import { cx } from "#/helpers/css";
import { useAppSelector } from "#/store";

import Browse from "./Browse";
import Enabled from "./Enabled";
import HideInstance from "./HideInstance";
import ResetTags from "./Reset";
import StoreSource from "./StoreSource";
import TrackVotes from "./TrackVotes";
import TagSvg from "./tag.svg?react";

export default function TagsSettings() {
  const userTagsEnabled = useAppSelector(
    (state) => state.settings.tags.enabled,
  );

  return (
    <>
      <IonList inset>
        <Enabled />
      </IonList>
      {userTagsEnabled ? (
        <>
          <IonList inset>
            <Browse />
          </IonList>
          <IonList inset>
            <TrackVotes />
            <HideInstance />
            <StoreSource />
            <ResetTags />
          </IonList>
        </>
      ) : (
        <TagSvg className={cx(sharedStyles.emptyStateIcon, "ion-margin-top")} />
      )}
    </>
  );
}
