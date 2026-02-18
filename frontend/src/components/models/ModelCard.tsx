import type { ModelInfoResponse } from "@/api/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Play, Square } from "lucide-react";
import type { DownloadState } from "@/hooks/useModelDownload";
import { DownloadProgress } from "./DownloadProgress";

interface ModelCardProps {
  model: ModelInfoResponse;
  isLoaded: boolean;
  isActionLoading: boolean;
  downloadState: DownloadState | undefined;
  onLoad: () => void;
  onUnload: () => void;
  onDownload: () => void;
}

export function ModelCard({
  model,
  isLoaded,
  isActionLoading,
  downloadState,
  onLoad,
  onUnload,
  onDownload,
}: ModelCardProps) {
  const isDownloading = downloadState?.status === "downloading";

  return (
    <Card className="flex flex-col border-border/50 bg-card/80 transition-colors hover:border-abyss-cyan/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold">{model.name}</CardTitle>
          <div className="flex gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {model.params}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {model.n_layers}L
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{model.description}</p>
      </CardHeader>

      <CardContent className="mt-auto space-y-3">
        {isDownloading && downloadState && (
          <DownloadProgress state={downloadState} />
        )}

        <div className="flex items-center gap-2">
          {model.downloaded ? (
            <Badge
              variant="outline"
              className="border-green-500/30 text-green-400 text-[10px]"
            >
              Downloaded
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground text-[10px]"
            >
              Not Downloaded
            </Badge>
          )}
          {isLoaded && (
            <Badge className="bg-abyss-cyan/20 text-abyss-cyan text-[10px]">
              Active
            </Badge>
          )}

          <div className="ml-auto flex gap-1.5">
            {!model.downloaded && !isDownloading && (
              <Button size="sm" variant="outline" onClick={onDownload} className="h-7 text-xs">
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            )}
            {model.downloaded && !isLoaded && (
              <Button
                size="sm"
                onClick={onLoad}
                disabled={isActionLoading}
                className="h-7 text-xs bg-abyss-cyan/20 text-abyss-cyan hover:bg-abyss-cyan/30 border border-abyss-cyan/30"
              >
                {isActionLoading ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Play className="mr-1 h-3 w-3" />
                )}
                Load
              </Button>
            )}
            {isLoaded && (
              <Button
                size="sm"
                variant="outline"
                onClick={onUnload}
                disabled={isActionLoading}
                className="h-7 text-xs"
              >
                {isActionLoading ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Square className="mr-1 h-3 w-3" />
                )}
                Unload
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
