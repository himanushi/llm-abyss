import type { DownloadState } from "@/hooks/useModelDownload";
import { Progress } from "@/components/ui/progress";

interface DownloadProgressProps {
  state: DownloadState;
}

export function DownloadProgress({ state }: DownloadProgressProps) {
  if (state.status === "error") {
    return (
      <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
        {state.error ?? "Download failed"}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Progress
        value={state.progressPercent}
        className="h-1.5 [&>div]:bg-abyss-cyan"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {state.currentFile
            ? `${state.currentFile} (${state.currentFileIndex + 1}/${state.totalFiles})`
            : "Preparing..."}
        </span>
        <span>
          {state.downloadedMb.toFixed(1)} / {state.totalSizeMb.toFixed(1)} MB
        </span>
      </div>
    </div>
  );
}
