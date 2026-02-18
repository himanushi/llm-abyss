import type { ModelInfoResponse } from "@/api/model";
import type { DownloadState } from "@/hooks/useModelDownload";
import { ModelCard } from "./ModelCard";

interface ModelGridProps {
  models: ModelInfoResponse[];
  loadedModelId: string | null;
  actionLoading: string | null;
  downloadStates: Map<string, DownloadState>;
  onLoad: (modelName: string) => void;
  onUnload: () => void;
  onDownload: (modelName: string) => void;
}

export function ModelGrid({
  models,
  loadedModelId,
  actionLoading,
  downloadStates,
  onLoad,
  onUnload,
  onDownload,
}: ModelGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          isLoaded={loadedModelId === model.id}
          isActionLoading={actionLoading === model.id || actionLoading === "__unload__"}
          downloadState={downloadStates.get(model.id)}
          onLoad={() => onLoad(model.id)}
          onUnload={onUnload}
          onDownload={() => onDownload(model.id)}
        />
      ))}
    </div>
  );
}
