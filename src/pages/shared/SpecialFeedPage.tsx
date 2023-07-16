import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { FetchFn } from "../../features/feed/Feed";
import { useCallback } from "react";
import PostSort from "../../features/feed/PostSort";
import { ListingType } from "lemmy-js-client";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import useClient from "../../helpers/useClient";
import { LIMIT } from "../../services/lemmy";
import { useAppSelector } from "../../store";
import PostCommentFeed, {
  PostCommentItem,
} from "../../features/feed/PostCommentFeed";
import { jwtSelector } from "../../features/auth/authSlice";
import TitleSearch from "../../features/community/titleSearch/TitleSearch";
import { TitleSearchProvider } from "../../features/community/titleSearch/TitleSearchProvider";
import TitleSearchResults from "../../features/community/titleSearch/TitleSearchResults";
import FeedScrollObserver from "../../features/feed/FeedScrollObserver";

interface SpecialFeedProps {
  type: ListingType;
}

export default function SpecialFeedPage({ type }: SpecialFeedProps) {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();

  const client = useClient();
  const sort = useAppSelector((state) => state.post.sort);
  const jwt = useAppSelector(jwtSelector);

  const { markReadOnScroll, disableMarkingRead } = useAppSelector(
    (state) => state.settings.general.posts
  );

  const fetchFn: FetchFn<PostCommentItem> = useCallback(
    async (page) => {
      const response = await client.getPosts({
        limit: LIMIT,
        page,
        sort,
        type_: type,
        auth: jwt,
      });
      return response.posts;
    },
    [client, sort, type, jwt]
  );

  const feed = <PostCommentFeed fetchFn={fetchFn} />;

  return (
    <TitleSearchProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                text="Communities"
                defaultHref={buildGeneralBrowseLink("")}
              />
            </IonButtons>

            <TitleSearch name={listingTypeTitle(type)}>
              <IonButtons slot="end">
                <PostSort />
              </IonButtons>
            </TitleSearch>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {!disableMarkingRead && markReadOnScroll ? (
            <FeedScrollObserver>{feed}</FeedScrollObserver>
          ) : (
            feed
          )}
          <TitleSearchResults />
        </IonContent>
      </IonPage>
    </TitleSearchProvider>
  );
}

function listingTypeTitle(type: ListingType): string {
  switch (type) {
    case "All":
    case "Local":
      return type;
    case "Subscribed":
      return "Home";
  }
}
