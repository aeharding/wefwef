import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db, UserTag } from "../../services/db";
import { AppDispatch, RootState } from "../../store";
import { uniq } from "lodash";

interface CommunityState {
  tagByRemoteHandle: Record<string, UserTag | "pending">;
}

const initialState: CommunityState = {
  tagByRemoteHandle: {},
};

interface UpdateVotePayload {
  handle: string;
  oldVote: 1 | -1 | 0 | undefined;
  newVote: 1 | -1 | 0 | undefined;
}

export const userTagSlice = createSlice({
  name: "userTag",
  initialState,
  reducers: {
    _updateTagVotes: (state, action: PayloadAction<UpdateVotePayload>) => {
      const tag =
        state.tagByRemoteHandle[action.payload.handle] ??
        generateNewTag(action.payload.handle);

      if (tag === "pending") return;

      if (action.payload.newVote === 1 && action.payload.oldVote !== 1) {
        tag.upvotes += 1;
      }

      if (action.payload.newVote === -1 && action.payload.oldVote !== -1) {
        tag.downvotes += 1;
      }

      if (action.payload.oldVote === 1 && action.payload.newVote !== 1) {
        tag.upvotes -= 1;
      }

      if (action.payload.oldVote === -1 && action.payload.newVote !== -1) {
        tag.downvotes -= 1;
      }

      tag.upvotes = Math.max(0, tag.upvotes);
      tag.downvotes = Math.max(0, tag.downvotes);

      state.tagByRemoteHandle[action.payload.handle] = tag;
    },
    fetchTagsPending: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((handle) => {
        if (state.tagByRemoteHandle[handle]) return;
        state.tagByRemoteHandle[handle] = "pending";
      });
    },
    updateTag: (state, action: PayloadAction<UserTag>) => {
      state.tagByRemoteHandle[action.payload.handle] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagsForHandles.fulfilled, (state, action) => {
        action.meta.arg.forEach((handle) => {
          if (state.tagByRemoteHandle[handle] !== "pending") return;
          delete state.tagByRemoteHandle[handle];
        });

        action.payload.forEach((tag) => {
          state.tagByRemoteHandle[tag.handle] = tag;
        });
      })
      .addCase(fetchTagsForHandles.rejected, (state, action) => {
        action.meta.arg.forEach((handle) => {
          if (state.tagByRemoteHandle[handle] !== "pending") return;
          delete state.tagByRemoteHandle[handle];
        });
      });
  },
});

export default userTagSlice.reducer;

export const fetchTagsForHandles = createAsyncThunk(
  "userTags/fetch",
  async (handles: string[], thunkAPI) => {
    const rootState = thunkAPI.getState() as RootState;

    const handlesNeedingFetch = uniq(handles).filter(
      (handle) => !rootState.userTag.tagByRemoteHandle[handle],
    );

    thunkAPI.dispatch(
      userTagSlice.actions.fetchTagsPending(handlesNeedingFetch),
    );

    return await db.fetchTagsForHandles(handlesNeedingFetch);
  },
);

export const updateTagVotes =
  (payload: UpdateVotePayload) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userTagSlice.actions._updateTagVotes(payload));

    const updatedTag = getState().userTag.tagByRemoteHandle[payload.handle];
    if (typeof updatedTag !== "object") return;

    await db.updateTag(updatedTag);
  };

export const updateTag =
  (updatedTag: UserTag) => async (dispatch: AppDispatch) => {
    dispatch(userTagSlice.actions.updateTag(updatedTag));
    await db.updateTag(updatedTag);
  };

export function generateNewTag(handle: string): UserTag {
  return {
    handle,
    upvotes: 0,
    downvotes: 0,
  };
}
