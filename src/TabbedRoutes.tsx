import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { App } from "@capacitor/app";
import {
  personCircleOutline,
  cog,
  search,
  fileTray,
  telescope,
} from "ionicons/icons";
import PostDetail from "./pages/posts/PostPage";
import CommunitiesPage from "./pages/posts/CommunitiesPage";
import CommunityPage from "./pages/shared/CommunityPage";
import { useAppSelector } from "./store";
import {
  jwtIssSelector,
  jwtSelector,
  handleSelector,
} from "./features/auth/authSlice";
import ActorRedirect from "./ActorRedirect";
import SpecialFeedPage from "./pages/shared/SpecialFeedPage";
import styled from "@emotion/styled";
import UserPage from "./pages/profile/UserPage";
import SettingsPage from "./pages/settings/SettingsPage";
import { useContext, useEffect, useMemo, useRef } from "react";
import InstallAppPage from "./pages/settings/InstallAppPage";
import SearchPage, { focusSearchBar } from "./pages/search/SearchPage";
import SearchPostsResultsPage from "./pages/search/results/SearchFeedResultsPage";
import ProfileFeedItemsPage from "./pages/profile/ProfileFeedItemsPage";
import SearchCommunitiesPage from "./pages/search/results/SearchCommunitiesPage";
import TermsPage from "./pages/settings/TermsPage";
import BoxesPage from "./pages/inbox/BoxesPage";
import { totalUnreadSelector } from "./features/inbox/inboxSlice";
import MentionsPage from "./pages/inbox/MentionsPage";
import RepliesPage from "./pages/inbox/RepliesPage";
import MessagesPage from "./pages/inbox/MessagesPage";
import ConversationPage from "./pages/inbox/ConversationPage";
import InboxPage from "./pages/inbox/InboxPage";
import { BackButtonEventDetail, IonRouterOutletCustomEvent } from "@ionic/core";
import InboxAuthRequired from "./pages/inbox/InboxAuthRequired";
import UpdateAppPage from "./pages/settings/UpdateAppPage";
import useShouldInstall from "./features/pwa/useShouldInstall";
import { UpdateContext } from "./pages/settings/update/UpdateContext";
import AppearancePage from "./pages/settings/AppearancePage";
import CommunitySidebarPage from "./pages/shared/CommunitySidebarPage";
import RedditMigratePage from "./pages/settings/RedditDataMigratePage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileFeedHiddenPostsPage from "./pages/profile/ProfileFeedHiddenPostsPage";
import { PageContextProvider } from "./features/auth/PageContext";
import { scrollUpIfNeeded } from "./helpers/scrollUpIfNeeded";
import GesturesPage from "./pages/settings/GesturesPage";
import BlocksSettingsPage from "./pages/settings/BlocksSettingsPage";
import { getDefaultServer } from "./services/app";
import GeneralPage from "./pages/settings/GeneralPage";
import HidingSettingsPage from "./pages/settings/HidingSettingsPage";
import DeviceModeSettingsPage from "./pages/settings/DeviceModeSettingsPage";
import InstanceSidebarPage from "./pages/shared/InstanceSidebarPage";
import { getProfileTabLabel } from "./features/settings/general/other/ProfileTabLabel";
import AppearanceThemePage from "./pages/settings/AppearanceThemePage";
import GalleryProvider from "./features/gallery/GalleryProvider";
import AppIconPage from "./pages/settings/AppIconPage";
import { DefaultFeedType, ODefaultFeedType } from "./services/db";
import { AppContext } from "./features/auth/AppContext";
import SearchFeedResultsPage from "./pages/search/results/SearchFeedResultsPage";
import { resetSavedStatusTap } from "./listeners/statusTap";
import AboutPage from "./pages/settings/about/AboutPage";
import AboutThanksPage from "./pages/settings/about/AboutThanksPage";
import BiometricPage from "./pages/settings/BiometricPage";

const Interceptor = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: all;
`;

const ProfileLabel = styled(IonLabel)`
  max-width: 20vw;
`;

export default function TabbedRoutes() {
  const { activePageRef } = useContext(AppContext);
  const location = useLocation();
  const router = useIonRouter();
  const jwt = useAppSelector(jwtSelector);
  const totalUnread = useAppSelector(totalUnreadSelector);
  const { status: updateStatus } = useContext(UpdateContext);
  const shouldInstall = useShouldInstall();
  const ready = useAppSelector((state) => state.settings.ready);
  const defaultFeed = useAppSelector(
    (state) => state.settings.general.defaultFeed,
  );

  const settingsNotificationCount =
    (shouldInstall ? 1 : 0) + (updateStatus === "outdated" ? 1 : 0);

  const pageRef = useRef<IonRouterOutletCustomEvent<unknown>["target"]>(null);

  const connectedInstance = useAppSelector(
    (state) => state.auth.connectedInstance,
  );
  const actor = location.pathname.split("/")[2];
  const iss = useAppSelector(jwtIssSelector);

  // Back button handling for Android native app
  useEffect(() => {
    const backButtonHandler = (ev: CustomEvent<BackButtonEventDetail>) => {
      ev.detail.register(-1, () => {
        // pswp is the gallery component. It pushes state, but the router isn't aware.
        // So if that's open, don't close the app just yet
        if (!router.canGoBack() && !document.querySelector(".pswp--open")) {
          App.exitApp();
        }
      });
    };

    document.addEventListener(
      "ionBackButton",
      // eslint-disable-next-line no-undef
      backButtonHandler as EventListener,
    );

    return () => {
      document.removeEventListener(
        "ionBackButton",
        // eslint-disable-next-line no-undef
        backButtonHandler as EventListener,
      );
    };
  }, [router]);

  useEffect(() => {
    resetSavedStatusTap();
  }, [location]);

  const userHandle = useAppSelector(handleSelector);
  const profileLabelType = useAppSelector(
    (state) => state.settings.appearance.general.profileLabel,
  );

  const profileTabLabel = useMemo(
    () => getProfileTabLabel(profileLabelType, userHandle, connectedInstance),
    [profileLabelType, userHandle, connectedInstance],
  );

  const isPostsButtonDisabled = location.pathname.startsWith("/posts");
  const isInboxButtonDisabled = location.pathname.startsWith("/inbox");
  const isProfileButtonDisabled = location.pathname.startsWith("/profile");
  const isSearchButtonDisabled = location.pathname.startsWith("/search");
  const isSettingsButtonDisabled = location.pathname.startsWith("/settings");

  async function onPostsClick() {
    if (!isPostsButtonDisabled) return;

    if (scrollUpIfNeeded(activePageRef?.current)) return;

    if (location.pathname.endsWith(jwt ? "/home" : "/all")) {
      router.push(`/posts/${actor ?? iss ?? getDefaultServer()}`, "back");
      return;
    }

    const communitiesPath = `/posts/${actor ?? iss ?? getDefaultServer()}`;
    if (
      location.pathname === communitiesPath ||
      location.pathname === `${communitiesPath}/`
    )
      return;

    if (router.canGoBack()) {
      router.goBack();
    } else {
      router.push(
        `/posts/${actor ?? iss ?? getDefaultServer()}/${jwt ? "home" : "all"}`,
        "back",
      );
    }
  }

  async function onInboxClick() {
    if (!isInboxButtonDisabled) return;

    if (
      // Messages are in reverse order, so bail on scroll up
      !location.pathname.startsWith("/inbox/messages/") &&
      scrollUpIfNeeded(activePageRef?.current)
    )
      return;

    router.push(`/inbox`, "back");
  }

  async function onProfileClick() {
    if (!isProfileButtonDisabled) return;

    if (scrollUpIfNeeded(activePageRef?.current)) return;

    router.push("/profile", "back");
  }

  async function onSearchClick() {
    if (!isSearchButtonDisabled) return;

    // if the search page is already open, focus the search bar
    focusSearchBar();

    if (scrollUpIfNeeded(activePageRef?.current)) return;

    router.push(`/search`, "back");
  }

  async function onSettingsClick() {
    if (!isSettingsButtonDisabled) return;

    if (scrollUpIfNeeded(activePageRef?.current)) return;

    router.push(`/settings`, "back");
  }

  function buildGeneralBrowseRoutes(tab: string) {
    return [
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/c/:community`}>
        <ActorRedirect>
          <CommunityPage />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/c/:community/search/posts/:search`}>
        <ActorRedirect>
          <SearchFeedResultsPage type="Posts" />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/c/:community/search/comments/:search`}>
        <ActorRedirect>
          <SearchFeedResultsPage type="Comments" />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/c/:community/sidebar`}>
        <ActorRedirect>
          <CommunitySidebarPage />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/c/:community/comments/:id`}>
        <ActorRedirect>
          <PostDetail />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route
        exact
        path={`/${tab}/:actor/c/:community/comments/:id/thread/:threadCommentId`}
      >
        <ActorRedirect>
          <PostDetail />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route
        exact
        path={`/${tab}/:actor/c/:community/comments/:id/:commentPath`}
      >
        <ActorRedirect>
          <PostDetail />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle`}>
        <ActorRedirect>
          <UserPage />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle/posts`}>
        <ActorRedirect>
          <ProfileFeedItemsPage type="Posts" />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle/comments`}>
        <ActorRedirect>
          <ProfileFeedItemsPage type="Comments" />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle/saved`}>
        <ActorRedirect>
          <ProfileFeedItemsPage type="Saved" />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle/hidden`}>
        <ActorRedirect>
          <ProfileFeedHiddenPostsPage />
        </ActorRedirect>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/u/:handle/message`}>
        <InboxAuthRequired>
          <ConversationPage />
        </InboxAuthRequired>
      </Route>,
      // eslint-disable-next-line react/jsx-key
      <Route exact path={`/${tab}/:actor/sidebar`}>
        <ActorRedirect>
          <InstanceSidebarPage />
        </ActorRedirect>
      </Route>,
    ];
  }

  const pageContextValue = useMemo(() => ({ pageRef }), []);

  // Ideally this would be a separate component,
  // but that is not currently supported in Ionic React
  // So memoize instead (since this is expensive to build)
  const routes = useMemo(
    () => (
      <IonRouterOutlet ref={pageRef}>
        <Route exact path="/">
          {!iss || defaultFeed ? (
            <Redirect
              to={`/posts/${iss ?? getDefaultServer()}${
                iss
                  ? getPathForFeed(
                      defaultFeed || { type: ODefaultFeedType.Home },
                    )
                  : "/all"
              }`}
              push={false}
            />
          ) : (
            ""
          )}
        </Route>
        <Route exact path="/posts/:actor/home">
          <ActorRedirect>
            <SpecialFeedPage type="Subscribed" />
          </ActorRedirect>
        </Route>
        <Route exact path="/posts/:actor/all">
          <ActorRedirect>
            <SpecialFeedPage type="All" />
          </ActorRedirect>
        </Route>
        <Route exact path="/posts/:actor/local">
          <ActorRedirect>
            <SpecialFeedPage type="Local" />
          </ActorRedirect>
        </Route>
        <Route exact path="/posts/:actor/mod">
          <ActorRedirect>
            <SpecialFeedPage type="ModeratorView" />
          </ActorRedirect>
        </Route>
        <Route exact path="/posts/:actor">
          <ActorRedirect>
            <CommunitiesPage />
          </ActorRedirect>
        </Route>
        {...buildGeneralBrowseRoutes("posts")}

        <Route exact path="/inbox">
          <BoxesPage />
        </Route>
        <Route exact path="/inbox/all">
          <InboxAuthRequired>
            <InboxPage showRead />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/unread">
          <InboxAuthRequired>
            <InboxPage />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/mentions">
          <InboxAuthRequired>
            <MentionsPage />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/comment-replies">
          <InboxAuthRequired>
            <RepliesPage type="Comment" />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/post-replies">
          <InboxAuthRequired>
            <RepliesPage type="Post" />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/messages">
          <InboxAuthRequired>
            <MessagesPage />
          </InboxAuthRequired>
        </Route>
        <Route exact path="/inbox/messages/:handle">
          <InboxAuthRequired>
            <ConversationPage />
          </InboxAuthRequired>
        </Route>
        {...buildGeneralBrowseRoutes("inbox")}

        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        {...buildGeneralBrowseRoutes("profile")}
        <Route exact path="/profile/:actor">
          <Redirect to="/profile" push={false} />
        </Route>

        <Route exact path="/search">
          <SearchPage />
        </Route>
        <Route exact path="/search/posts/:search">
          <SearchPostsResultsPage type="Posts" />
        </Route>
        <Route exact path="/search/comments/:search">
          <SearchPostsResultsPage type="Comments" />
        </Route>
        <Route exact path="/search/communities/:search">
          <SearchCommunitiesPage />
        </Route>
        {...buildGeneralBrowseRoutes("search")}
        <Route exact path="/search/:actor">
          <Redirect to="/search" push={false} />
        </Route>

        {...buildGeneralBrowseRoutes("settings")}
        <Route exact path="/settings/:actor">
          <Redirect to="/settings" push={false} />
        </Route>

        <Route exact path="/settings">
          <SettingsPage />
        </Route>
        <Route exact path="/settings/terms">
          <TermsPage />
        </Route>
        <Route exact path="/settings/install">
          <InstallAppPage />
        </Route>
        <Route exact path="/settings/update">
          <UpdateAppPage />
        </Route>
        <Route exact path="/settings/general">
          <GeneralPage />
        </Route>
        <Route exact path="/settings/general/hiding">
          <HidingSettingsPage />
        </Route>
        <Route exact path="/settings/appearance">
          <AppearancePage />
        </Route>
        <Route exact path="/settings/appearance/theme">
          <AppearanceThemePage />
        </Route>
        <Route exact path="/settings/appearance/theme/mode">
          <DeviceModeSettingsPage />
        </Route>
        <Route exact path="/settings/app-icon">
          <AppIconPage />
        </Route>
        <Route exact path="/settings/biometric">
          <BiometricPage />
        </Route>
        <Route exact path="/settings/gestures">
          <GesturesPage />
        </Route>
        <Route exact path="/settings/blocks">
          <BlocksSettingsPage />
        </Route>
        <Route exact path="/settings/reddit-migrate">
          <RedditMigratePage />
        </Route>
        <Route exact path="/settings/reddit-migrate/:search">
          <SearchCommunitiesPage />
        </Route>

        {/* This annoyingly cannot be /settings/about, because otherwise it will also match /settings/:actor */}
        <Route exact path="/settings/about/app">
          <AboutPage />
        </Route>
        <Route exact path="/settings/about/thanks">
          <AboutThanksPage />
        </Route>
      </IonRouterOutlet>
    ),
    [iss, defaultFeed],
  );

  if (!ready) return;

  return (
    <PageContextProvider value={pageContextValue}>
      <GalleryProvider>
        {/* TODO key={} resets the tab route stack whenever your instance changes. */}
        {/* In the future, it would be really cool if we could resolve object urls to pick up where you left off */}
        {/* But this isn't trivial with needing to rewrite URLs... */}
        <IonTabs key={iss ?? getDefaultServer()}>
          {routes}
          <IonTabBar slot="bottom">
            <IonTabButton
              disabled={isPostsButtonDisabled}
              tab="posts"
              href={`/posts/${connectedInstance}`}
            >
              <IonIcon aria-hidden="true" icon={telescope} />
              <IonLabel>Posts</IonLabel>
              <Interceptor onClick={onPostsClick} />
            </IonTabButton>
            <IonTabButton
              disabled={isInboxButtonDisabled}
              tab="inbox"
              href="/inbox"
            >
              <IonIcon aria-hidden="true" icon={fileTray} />
              <IonLabel>Inbox</IonLabel>
              {totalUnread ? (
                <IonBadge color="danger">{totalUnread}</IonBadge>
              ) : undefined}
              <Interceptor onClick={onInboxClick} />
            </IonTabButton>
            <IonTabButton
              disabled={isProfileButtonDisabled}
              tab="profile"
              href="/profile"
            >
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
              <ProfileLabel>{profileTabLabel}</ProfileLabel>
              <Interceptor onClick={onProfileClick} />
            </IonTabButton>
            <IonTabButton
              disabled={isSearchButtonDisabled}
              tab="search"
              href="/search"
            >
              <IonIcon aria-hidden="true" icon={search} />
              <IonLabel>Search</IonLabel>
              <Interceptor onClick={onSearchClick} />
            </IonTabButton>
            <IonTabButton
              tab="settings"
              href="/settings"
              disabled={isSettingsButtonDisabled}
            >
              <IonIcon aria-hidden="true" icon={cog} />
              <IonLabel>Settings</IonLabel>
              {settingsNotificationCount ? (
                <IonBadge color="danger">{settingsNotificationCount}</IonBadge>
              ) : undefined}
              <Interceptor onClick={onSettingsClick} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </GalleryProvider>
    </PageContextProvider>
  );
}

function getPathForFeed(defaultFeed: DefaultFeedType): string {
  switch (defaultFeed.type) {
    case ODefaultFeedType.All:
      return "/all";
    case ODefaultFeedType.Home:
      return "/home";
    case ODefaultFeedType.Local:
      return "/local";
    case ODefaultFeedType.Moderating:
      return "/mod";
    case ODefaultFeedType.CommunityList:
      return "";
    case ODefaultFeedType.Community:
      return `/c/${defaultFeed.name}`;
  }
}
