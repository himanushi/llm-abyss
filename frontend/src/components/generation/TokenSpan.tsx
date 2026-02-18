import type { GenerationTokenResult } from "@/api/model";

interface TokenSpanProps {
  token: GenerationTokenResult;
  onClick: () => void;
  isActive: boolean;
}

export function TokenSpan({ token, onClick, isActive }: TokenSpanProps) {
  const hue = token.probability * 120;
  const color = `hsl(${hue}, 80%, 60%)`;
  const bg = `hsla(${hue}, 80%, 60%, ${isActive ? 0.2 : 0.08})`;

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="cursor-pointer rounded-sm px-0.5 transition-colors hover:brightness-125"
      style={{ color, backgroundColor: bg }}
    >
      {token.token}
    </span>
  );
}
