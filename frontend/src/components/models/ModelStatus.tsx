import type { ModelStatusResponse } from "@/api/model";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

interface ModelStatusProps {
  status: ModelStatusResponse | null;
  onUnload: () => void;
  isUnloading: boolean;
}

export function ModelStatus({ status, onUnload, isUnloading }: ModelStatusProps) {
  if (!status?.loaded) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-abyss-cyan/20 bg-abyss-cyan/5 px-4 py-3">
      <Cpu className="h-4 w-4 text-abyss-cyan" />
      <div className="flex-1">
        <span className="text-sm font-medium">
          {status.model_info?.name ?? status.model_name}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          loaded on {status.device?.toUpperCase()}
        </span>
      </div>
      {status.model_info && (
        <Badge variant="outline" className="border-abyss-cyan/30 text-abyss-cyan">
          {status.model_info.params}
        </Badge>
      )}
      <button
        onClick={onUnload}
        disabled={isUnloading}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
      >
        {isUnloading ? "Unloading..." : "Unload"}
      </button>
    </div>
  );
}
