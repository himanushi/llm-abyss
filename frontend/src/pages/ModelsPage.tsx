import { useModels } from "@/hooks/useModels";
import { useModelDownload } from "@/hooks/useModelDownload";
import { ModelStatus } from "@/components/models/ModelStatus";
import { ModelGrid } from "@/components/models/ModelGrid";
import { Loader2 } from "lucide-react";

export function ModelsPage() {
  const {
    models,
    status,
    loading,
    actionLoading,
    error,
    loadModel,
    unloadModel,
    refresh,
  } = useModels();

  const { downloads, startDownload } = useModelDownload(refresh);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-abyss-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Models</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and load local LLM models for analysis.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ModelStatus
        status={status}
        onUnload={unloadModel}
        isUnloading={actionLoading === "__unload__"}
      />

      <ModelGrid
        models={models}
        loadedModelId={status?.model_name ?? null}
        actionLoading={actionLoading}
        downloadStates={downloads}
        onLoad={loadModel}
        onUnload={unloadModel}
        onDownload={startDownload}
      />
    </div>
  );
}
