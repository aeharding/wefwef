import React, { HTMLProps, MouseEventHandler } from "react";
import { isNative } from "../../helpers/device";
import { useAppSelector } from "../../store";
import { OLinkHandlerType } from "../../services/db";
import { IonItem } from "@ionic/react";
import useNativeBrowser from "./useNativeBrowser";

type InAppExternalLinkProps =
  | HTMLProps<HTMLAnchorElement>
  | (HTMLProps<HTMLDivElement> & { el: "div" });

export default function InAppExternalLink({
  href,
  onClick: _onClick,
  ...rest
}: InAppExternalLinkProps) {
  const onClick = useOnClick(href, _onClick);

  if ("el" in rest) {
    const El = rest.el;

    return <El onClick={onClick} {...rest} />;
  }

  return <a href={href} onClick={onClick} {...rest} />;
}

export function IonItemInAppExternalLink({
  href,
  onClick: _onClick,
  ...rest
}: React.ComponentProps<typeof IonItem>) {
  const onClick = useOnClick(href, _onClick);

  return <IonItem href={href} onClick={onClick} {...rest} />;
}

function useOnClick(
  href: string | undefined,
  _onClick: MouseEventHandler | undefined,
) {
  const linkHandler = useAppSelector(
    (state) => state.settings.general.linkHandler,
  );
  const openNativeBrowser = useNativeBrowser();

  const onClick: MouseEventHandler = (e) => {
    _onClick?.(e);

    if (e.defaultPrevented) return;

    if (isNative() && href && linkHandler === OLinkHandlerType.InApp) {
      e.preventDefault();
      e.stopPropagation();
      openNativeBrowser(href);
    }
  };

  return onClick;
}
