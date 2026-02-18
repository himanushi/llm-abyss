import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GenerationTokenResult } from "@/api/model";
import type { TokenAlternative } from "@/types/generation";
import { TokenSpan } from "./TokenSpan";

interface TokenDetailPopoverProps {
  token: GenerationTokenResult;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenDetailPopover({
  token,
  isOpen,
  onOpenChange,
}: TokenDetailPopoverProps) {
  const alternatives = token.top_alternatives as TokenAlternative[];

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <span>
          <TokenSpan
            token={token}
            onClick={() => onOpenChange(!isOpen)}
            isActive={isOpen}
          />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="bottom" align="start">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-medium">
              &quot;{token.token}&quot;
            </span>
            <span className="text-muted-foreground">
              ID: {token.token_id}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Probability: {(token.probability * 100).toFixed(2)}%
          </div>
          <div className="border-t border-border/50 pt-2">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Top Alternatives
            </div>
            <div className="space-y-1">
              {alternatives.map((alt, i) => {
                const pct = alt.probability * 100;
                const hue = alt.probability * 120;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-20 truncate font-mono">
                      {alt.token}
                    </span>
                    <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: `hsl(${hue}, 80%, 60%)`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-muted-foreground">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
