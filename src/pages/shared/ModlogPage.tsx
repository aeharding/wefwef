import {
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Feed, { FetchFn } from "../../features/feed/Feed";
import AppBackButton from "../../features/shared/AppBackButton";
import { memo, useCallback } from "react";
import useClient from "../../helpers/useClient";
import FeedContextProvider from "../../features/feed/FeedContext";
import FeedContent from "./FeedContent";
import { Community, GetModlogResponse, Person } from "lemmy-js-client";
import { values } from "lodash";
import { ModlogItem } from "../../features/moderation/logs/ModlogItem";
import { fixLemmyDateString } from "../../helpers/date";
import { LIMIT } from "../../services/lemmy";
import useFetchCommunity from "../../features/community/useFetchCommunity";
import { CenteredSpinner } from "../posts/PostPage";
import { useParams } from "react-router";
import { getHandle } from "../../helpers/lemmy";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { buildCommunityLink } from "../../helpers/appLinkBuilder";
import { RootState, useAppSelector } from "../../store";
import useCanModerate from "../../features/moderation/useCanModerate";
import { useUserDetails } from "../../features/user/useUserDetails";

export type ModlogItemType =
  GetModlogResponse[keyof GetModlogResponse] extends (infer T)[] ? T : never;

export default function ModlogPage() {
  const { community, handle } = useParams<{
    community?: string;
    handle?: string;
  }>();

  if (handle) return <ModlogByUserHandle handle={handle} />;
  if (community) return <ModlogByCommunityName communityName={community} />;

  return <GlobalModlog />;
}

const userSelector = (state: RootState) =>
  state.auth.site?.my_user?.local_user_view?.person;

const GlobalModlog = memo(function GlobalModlog() {
  const canModerate = useCanModerate(true);
  const user = useAppSelector(userSelector);

  if (canModerate) return <Modlog />;
  return <Modlog user={user} />;
});

const ModlogByCommunityName = memo(function ModlogByCommunityName({
  communityName,
}: {
  communityName: string;
}) {
  const community = useFetchCommunity(communityName);
  const canModerate = useCanModerate(community?.community);
  const user = useAppSelector(userSelector);

  if (!community) return <CenteredSpinner />;

  if (canModerate) return <Modlog community={community.community} />;
  return <Modlog community={community.community} user={user} />;
});

const ModlogByUserHandle = memo(function ModlogByUserHandle({
  handle,
}: {
  handle: string;
}) {
  const user = useUserDetails(handle);

  if (!user) return <CenteredSpinner />;

  return <Modlog user={user.user} />;
});

interface ModlogProps {
  community?: Community;
  user?: Person;
  mod?: Person;
}

function Modlog({ community, user, mod }: ModlogProps) {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const client = useClient();

  const fetchFn: FetchFn<ModlogItemType> = useCallback(
    async (pageData) => {
      const logs = await client.getModlog({
        ...pageData,
        limit: LIMIT,
        community_id: community?.id,
        other_person_id: user?.id,
        mod_person_id: mod?.id,
      });

      return values(logs)
        .reduce<ModlogItemType[]>((acc, current) => acc.concat(current), [])
        .sort(
          (a, b) =>
            Date.parse(fixLemmyDateString(getLogDate(b))) -
            Date.parse(fixLemmyDateString(getLogDate(a))),
        );
    },
    [client, community, user, mod],
  );

  const renderItemContent = useCallback((item: ModlogItemType) => {
    return <ModlogItem item={item} />;
  }, []);

  return (
    <FeedContextProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <AppBackButton
                defaultHref={buildGeneralBrowseLink(
                  community ? buildCommunityLink(community) : "",
                )}
              />
            </IonButtons>
            <IonTitle>{community ? getHandle(community) : "Mod"} Logs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <FeedContent>
          <Feed
            fetchFn={fetchFn}
            renderItemContent={renderItemContent}
            getIndex={getIndex}
          />
        </FeedContent>
      </IonPage>
    </FeedContextProvider>
  );
}

function getIndex(item: ModlogItemType): string {
  switch (true) {
    case "mod_remove_comment" in item:
      return `mod_remove_comment-${item.mod_remove_comment.id}`;
    case "mod_remove_post" in item:
      return `mod_remove_post-${item.mod_remove_post.id}`;
    case "mod_lock_post" in item:
      return `mod_lock_post-${item.mod_lock_post.id}`;
    case "mod_feature_post" in item:
      return `mod_feature_post-${item.mod_feature_post.id}`;
    case "mod_remove_community" in item:
      return `mod_remove_community-${item.mod_remove_community.id}`;
    case "mod_ban_from_community" in item:
      return `mod_ban_from_community-${item.mod_ban_from_community.id}`;
    case "mod_ban" in item:
      return `mod_ban-${item.mod_ban.id}`;
    case "mod_add_community" in item:
      return `mod_add_community-${item.mod_add_community.id}`;
    case "mod_transfer_community" in item:
      return `mod_transfer_community-${item.mod_transfer_community.id}`;
    case "mod_add" in item:
      return `mod_add-${item.mod_add.id}`;
    case "admin_purge_person" in item:
      return `admin_purge_person-${item.admin_purge_person.id}`;
    case "admin_purge_community" in item:
      return `admin_purge_community-${item.admin_purge_community.id}`;
    case "admin_purge_post" in item:
      return `admin_purge_post-${item.admin_purge_post.id}`;
    case "admin_purge_comment" in item:
      return `admin_purge_comment-${item.admin_purge_comment.id}`;
    case "mod_hide_community" in item:
      return `mod_hide_community-${item.mod_hide_community.id}`;
    default:
      // should never happen (type = never)
      //
      // If item is not type = never, then some mod log action was added
      // and needs to be handled.
      return item;
  }
}

function getLogDate(item: ModlogItemType): string {
  switch (true) {
    case "mod_remove_comment" in item:
      return item.mod_remove_comment.when_;
    case "mod_remove_post" in item:
      return item.mod_remove_post.when_;
    case "mod_lock_post" in item:
      return item.mod_lock_post.when_;
    case "mod_feature_post" in item:
      return item.mod_feature_post.when_;
    case "mod_remove_community" in item:
      return item.mod_remove_community.when_;
    case "mod_ban_from_community" in item:
      return item.mod_ban_from_community.when_;
    case "mod_ban" in item:
      return item.mod_ban.when_;
    case "mod_add_community" in item:
      return item.mod_add_community.when_;
    case "mod_transfer_community" in item:
      return item.mod_transfer_community.when_;
    case "mod_add" in item:
      return item.mod_add.when_;
    case "admin_purge_person" in item:
      return item.admin_purge_person.when_;
    case "admin_purge_community" in item:
      return item.admin_purge_community.when_;
    case "admin_purge_post" in item:
      return item.admin_purge_post.when_;
    case "admin_purge_comment" in item:
      return item.admin_purge_comment.when_;
    case "mod_hide_community" in item:
      return item.mod_hide_community.when_;
    default:
      // should never happen (type = never)
      //
      // If item is not type = never, then some mod log action was added
      // and needs to be handled.
      return item;
  }
}
