import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ListingType } from "lemmy-js-client";
import { PostAppearanceType, db } from "../../../services/db";
import { getFeedUrlName } from "../../community/mod/ModActions";

interface PostAppearanceState {
  /**
   * `null`: Loaded from database, but nothing there
   */
  postAppearanceByFeedName: Record<string, PostAppearanceType | null>;
}

const initialState: PostAppearanceState = {
  postAppearanceByFeedName: {},
};

export const postAppearanceSlice = createSlice({
  name: "postAppearance",
  initialState,
  reducers: {
    setPostAppeartance: (
      state,
      action: PayloadAction<{
        feed: FeedSortFeed;
        postAppearance: PostAppearanceType;
      }>,
    ) => {
      const feedName = serializeFeedName(action.payload.feed);
      state.postAppearanceByFeedName[feedName] = action.payload.postAppearance;

      db.setSetting("post_appearance_type", action.payload.postAppearance, {
        community: feedName,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPostAppearance.fulfilled, (state, action) => {
      const { feedName, postAppearance } = action.payload;

      state.postAppearanceByFeedName[feedName] = postAppearance;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setPostAppeartance } = postAppearanceSlice.actions;

export default postAppearanceSlice.reducer;

export type FeedSortFeed =
  | {
      remoteCommunityHandle: string;
    }
  | {
      listingType: ListingType;
    };

export const getPostAppearance = createAsyncThunk(
  "postAppearance/getPostAppearance",
  async (feed: FeedSortFeed) => {
    const feedName = serializeFeedName(feed);
    const postAppearance =
      (await db.getSetting("post_appearance_type", {
        community: feedName,
      })) ?? null; // null = loaded, but not found

    return {
      feedName,
      postAppearance,
    };
  },
);

export function serializeFeedName(feed: FeedSortFeed): string {
  switch (true) {
    case "remoteCommunityHandle" in feed:
      return feed.remoteCommunityHandle; // always contains @ - will never overlap with getFeedUrlName
    case "listingType" in feed:
      return getFeedUrlName(feed.listingType);
    default:
      return feed;
  }
}
