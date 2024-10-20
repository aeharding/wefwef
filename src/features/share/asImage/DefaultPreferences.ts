import { ShareAsImagePreferences } from "./ShareAsImagePreferences";

export const defaultPreferences: ShareAsImagePreferences = {
  common: {
    hideUsernames: false,
    watermark: false,
  },
  post: {
    hideCommunity: false,
  },
  comment: {
    includePostContent: false,
    includePostDetails: false,
    allParentComments: false,
  },
};