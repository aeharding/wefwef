import { Dictionary, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetReportCountResponse, PrivateMessageView } from "lemmy-js-client";
import { AppDispatch, RootState } from "../../store";
import {
  clientSelector,
  isModeratorSelector,
  jwtSelector,
} from "../auth/authSlice";
import { ReportItemView } from "./ReportItem";

interface PostState {
  counts: {
    comment_reports: number;
    post_reports: number;
    private_message_reports: number | undefined;
  };
  lastUpdatedCounts: number;
  resolvedByReportItemId: Dictionary<boolean>;
  messageSyncState: "init" | "syncing" | "synced";
  messages: PrivateMessageView[];
}

const initialState: PostState = {
  counts: {
    comment_reports: 0,
    post_reports: 0,
    private_message_reports: 0,
  },
  lastUpdatedCounts: 0,
  resolvedByReportItemId: {},
  messageSyncState: "init",
  messages: [],
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    receivedReportCounts: (
      state,
      action: PayloadAction<GetReportCountResponse>
    ) => {
      state.counts.comment_reports = action.payload.comment_reports;
      state.counts.post_reports = action.payload.post_reports;
      state.counts.private_message_reports =
        action.payload.private_message_reports;
      state.lastUpdatedCounts = Date.now();
    },
    receivedReportItems: (state, action: PayloadAction<ReportItemView[]>) => {
      for (const item of action.payload) {
        state.resolvedByReportItemId[getReportItemId(item)] =
          getReportResolvedStatus(item);
      }
    },
    // setReadStatus: (
    //   state,
    //   action: PayloadAction<{ item: InboxItemView; read: boolean }>
    // ) => {
    //   state.readByInboxItemId[getInboxItemId(action.payload.item)] =
    //     action.payload.read;
    // },
    // receivedMessages: (state, action: PayloadAction<PrivateMessageView[]>) => {
    //   state.messages = uniqBy(
    //     [...action.payload, ...state.messages],
    //     (m) => m.private_message.id
    //   );
    // },
    // sync: (state) => {
    //   state.messageSyncState = "syncing";
    // },
    // syncComplete: (state) => {
    //   state.messageSyncState = "synced";
    // },
    // syncFail: (state) => {
    //   if (state.messageSyncState === "syncing") state.messageSyncState = "init";
    // },
    resetReports: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { receivedReportCounts, receivedReportItems, resetReports } =
  reportSlice.actions;

export default reportSlice.reducer;

export const totalReportsSelector = (state: RootState) =>
  state.report.counts.comment_reports +
  state.report.counts.post_reports +
  (state.report.counts.private_message_reports || 0);
export const reportCountSelector = (state: RootState) => ({
  ...state.report.counts,
});

export const getReportCounts =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const jwt = jwtSelector(getState());

    if (!jwt) {
      dispatch(resetReports());
      return;
    }
    const isModerator = isModeratorSelector(getState());

    if (!isModerator) {
      dispatch(resetReports());
      return;
    }

    const lastUpdatedCounts = getState().report.lastUpdatedCounts;

    if (Date.now() - lastUpdatedCounts < 60_000) return;

    const result = await clientSelector(getState()).getReportCount({
      auth: jwt,
    });

    if (result) dispatch(receivedReportCounts(result));
  };

export function getReportResolvedStatus(item: ReportItemView): boolean {
  if ("post_report" in item) {
    return item.post_report.resolved;
  }

  if ("comment_report" in item) {
    return item.comment_report.resolved;
  }

  return item.private_message_report.resolved;
}

export function getReportItemPublished(item: ReportItemView): string {
  if ("post_report" in item) {
    return item.post_report.published;
  }

  if ("comment_report" in item) {
    return item.comment_report.published;
  }

  return item.private_message_report.published;
}

export function getReportItemId(item: ReportItemView): string {
  if ("post_report" in item) {
    return `post_report_${item.post_report.id}`;
  }

  if ("comment_report" in item) {
    return `comment_report_${item.comment_report.id}`;
  }

  return `private_message_report_${item.private_message_report.id}`;
}
