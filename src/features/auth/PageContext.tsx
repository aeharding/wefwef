import { useIonModal } from "@ionic/react";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CommentReplyItem } from "../comment/reply/CommentReply";
import Login from "../auth/Login";
import { useAppSelector } from "../../store";
import { jwtSelector } from "../auth/authSlice";
import CommentReplyModal from "../comment/reply/CommentReplyModal";
import { CommentView, PostView } from "lemmy-js-client";
import CommentEditModal from "../comment/edit/CommentEditModal";
import { Report, ReportHandle, ReportableItem } from "../report/Report";
import PostEditorModal from "../post/new/PostEditorModal";

interface IPageContext {
  // used for ion presentingElement
  page: HTMLElement | undefined;

  /**
   * @returns true if login dialog was presented
   */
  presentLoginIfNeeded: () => boolean;

  /**
   * @returns true if replied (requires feed refresh)
   */
  presentCommentReply: (item: CommentReplyItem) => Promise<boolean>;

  /**
   * Will mutate comment in store, which view should be linked to for updates
   * That's why this does not return anything
   */
  presentCommentEdit: (item: CommentView) => void;

  presentReport: (item: ReportableItem) => void;

  /**
   * @param postOrCommunity An existing post to be edited, or the community handle
   * to submit the new post to
   */
  presentPostEditor: (postOrCommunity: PostView | string) => void;
}

export const PageContext = createContext<IPageContext>({
  page: undefined,
  presentLoginIfNeeded: () => false,
  presentCommentReply: async () => false,
  presentCommentEdit: () => false,
  presentReport: () => {},
  presentPostEditor: () => {},
});

interface PageContextProvider {
  value: Pick<IPageContext, "page">;
  children: React.ReactNode;
}

export function PageContextProvider({ value, children }: PageContextProvider) {
  const jwt = useAppSelector(jwtSelector);
  const [presentLogin, onDismissLogin] = useIonModal(Login, {
    onDismiss: (data: string, role: string) => onDismissLogin(data, role),
  });
  const reportRef = useRef<ReportHandle>(null);

  const presentLoginIfNeeded = useCallback(() => {
    if (jwt) return false;

    presentLogin({ presentingElement: value.page });
    return true;
  }, [jwt, presentLogin, value.page]);

  // Comment reply start
  const commentReplyItem = useRef<CommentReplyItem>();
  const commentReplyCb = useRef<((replied: boolean) => void) | undefined>();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const presentCommentReply = useCallback((item: CommentReplyItem) => {
    const promise = new Promise<boolean>(
      (resolve) => (commentReplyCb.current = resolve)
    );

    commentReplyItem.current = item;
    setIsReplyOpen(true);

    return promise;
  }, []);

  useEffect(() => {
    if (isReplyOpen) return;

    commentReplyCb.current?.(false);
    commentReplyCb.current = undefined;
    return;
  }, [isReplyOpen]);
  // Comment reply end

  // Edit comment start
  const commentEditItem = useRef<CommentView>();
  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const presentCommentEdit = useCallback((item: CommentView) => {
    commentEditItem.current = item;
    setIsEditCommentOpen(true);
  }, []);
  // Edit comment end

  // Edit/new post start
  const postItem = useRef<PostView | string>();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const presentPostEditor = useCallback(
    (postOrCommunity: PostView | string) => {
      postItem.current = postOrCommunity;
      setIsPostOpen(true);
    },
    []
  );
  // Edit/new post end

  const presentReport = (item: ReportableItem) => {
    reportRef.current?.present(item);
  };

  return (
    <PageContext.Provider
      value={{
        ...value,
        presentLoginIfNeeded,
        presentCommentReply,
        presentCommentEdit,
        presentReport,
        presentPostEditor,
      }}
    >
      {children}

      <CommentReplyModal
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item={commentReplyItem.current!}
        isOpen={isReplyOpen}
        setIsOpen={setIsReplyOpen}
        onReply={(replied) => {
          commentReplyCb.current?.(replied);
          commentReplyCb.current = undefined;
        }}
      />
      <CommentEditModal
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item={commentEditItem.current!}
        isOpen={isEditCommentOpen}
        setIsOpen={setIsEditCommentOpen}
      />
      <Report ref={reportRef} />
      <PostEditorModal
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        postOrCommunity={postItem.current!}
        isOpen={isPostOpen}
        setIsOpen={setIsPostOpen}
      />
    </PageContext.Provider>
  );
}
