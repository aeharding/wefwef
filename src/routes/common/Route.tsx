import { createContext, useContext, useState } from "react";
import { TabContext } from "../../core/TabContext";
import { RouteProps } from "react-router-dom";
import { Route as ReactRoute } from "react-router-dom";
import ActorRedirect from "./ActorRedirect";

export default function Route({ children, ...props }: RouteProps) {
  const { tabRef } = useContext(TabContext);
  const [tabName] = useState(() => tabRef?.current ?? "");

  const content = (() => {
    if (props.path?.includes("/:actor"))
      return <ActorRedirect>{children}</ActorRedirect>;

    return children;
  })();

  return (
    <TabNameContext.Provider value={tabName}>
      <ReactRoute {...props}>{content}</ReactRoute>
    </TabNameContext.Provider>
  );
}

export const TabNameContext = createContext("");
