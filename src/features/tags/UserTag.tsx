import { styled } from "@linaria/react";
import { useAppSelector } from "../../store";
import { getRemoteHandle } from "../../helpers/lemmy";
import { Person } from "lemmy-js-client";

const TagContainer = styled.div<{ tagColor: string }>`
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  --bg: var(--color, var(--lightroom-bg));
  background: var(--bg);
  color: color-contrast(var(--bg) vs #fff, #000);

  border-radius: 4px;
  padding: 1px 4px;
  margin: -1px 0 auto -1px 0;
`;

interface UserTagProps {
  user: Person;
}

export default function UserTag({ user }: UserTagProps) {
  const tag = useAppSelector(
    (state) => state.userTag.tagByRemoteHandle[getRemoteHandle(user)],
  );

  if (!tag || tag === "pending") return;
  if (!tag.text) return;

  return (
    <TagContainer style={{ "--color": tag.color }}>{tag.text}</TagContainer>
  );
}
