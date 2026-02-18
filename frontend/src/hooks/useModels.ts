import { useCallback, useEffect, useState } from "react";
import {
  getAvailableModelsApiModelsAvailableGet,
  getModelStatusApiModelsStatusGet,
  loadModelApiModelsLoadPost,
  unloadModelApiModelsUnloadPost,
} from "@/api/endpoints/models/models";
import type { ModelInfoResponse, ModelStatusResponse } from "@/api/model";

export function useModels() {
  const [models, setModels] = useState<ModelInfoResponse[]>([]);
  const [status, setStatus] = useState<ModelStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    try {
      const res = await getAvailableModelsApiModelsAvailableGet(undefined);
      setModels(res.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch models");
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getModelStatusApiModelsStatusGet(undefined);
      setStatus(res.data);
    } catch {
      setStatus(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchModels(), fetchStatus()]);
    setLoading(false);
  }, [fetchModels, fetchStatus]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loadModel = useCallback(
    async (modelName: string) => {
      setActionLoading(modelName);
      setError(null);
      try {
        const res = await loadModelApiModelsLoadPost({ model_name: modelName });
        if (res.status === 200) {
          setStatus(res.data as ModelStatusResponse);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load model");
      } finally {
        setActionLoading(null);
      }
    },
    [],
  );

  const unloadModel = useCallback(async () => {
    setActionLoading("__unload__");
    setError(null);
    try {
      await unloadModelApiModelsUnloadPost(undefined);
      setStatus({ loaded: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unload model");
    } finally {
      setActionLoading(null);
    }
  }, []);

  return {
    models,
    status,
    loading,
    actionLoading,
    error,
    loadModel,
    unloadModel,
    refresh,
  };
}
