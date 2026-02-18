import { useState } from "react";
import type { GenerationResponse } from "@/api/model";
import { TokenDetailPopover } from "./TokenDetailPopover";

interface GenerationResultProps {
  result: GenerationResponse;
}

export function GenerationResult({ result }: GenerationResultProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border/50 bg-card/80 p-4 font-mono text-sm leading-relaxed">
        <span className="text-muted-foreground">{result.input_text}</span>
        {result.tokens.map((token, i) => (
          <TokenDetailPopover
            key={i}
            token={token}
            isOpen={activeIndex === i}
            onOpenChange={(open) => setActiveIndex(open ? i : null)}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span>Token probability:</span>
        <div className="flex items-center gap-1">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: "hsl(0, 80%, 60%)" }}
          />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: "hsl(60, 80%, 60%)" }}
          />
          <span>Mid</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: "hsl(120, 80%, 60%)" }}
          />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
