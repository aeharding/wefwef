import { ComponentProps, useContext } from "react";
import store, { useAppDispatch } from "../../../../../store";
import { PageContext } from "../../../../auth/PageContext";
import type { BaseSlidingDM } from "../../BaseSliding";
import { useSharedVoteActions } from "../shared";
import GenericBaseSliding from "../GenericBaseSliding";
import { markRead, syncMessages } from "../../../../inbox/inboxSlice";

export default function DMActionsImpl({
  item,
  ...rest
}: ComponentProps<typeof BaseSlidingDM>) {
  const dispatch = useAppDispatch();
  const { presentCommentReply } = useContext(PageContext);

  const shared = useSharedVoteActions(item);

  return (
    <GenericBaseSliding
      onVote={async () => {}}
      currentVote={0}
      reply={async () => {
        await presentCommentReply({
          private_message: {
            recipient:
              item.private_message.creator_id ===
              store.getState().site.response?.my_user?.local_user_view
                ?.local_user?.person_id
                ? item.recipient
                : item.creator,
          },
        });

        await dispatch(markRead(item, true));
        dispatch(syncMessages());
      }}
      collapse={() => {}}
      collapseRootComment={() => {}}
      save={async () => {}}
      isHidden={false}
      shareTrigger={() => {}}
      isSaved={false}
      {...shared}
      {...rest}
    />
  );
}
