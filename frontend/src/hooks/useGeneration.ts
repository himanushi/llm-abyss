import { useCallback, useState } from "react";
import { generationExperimentApiExperimentsGenerationPost } from "@/api/endpoints/experiments/experiments";
import type { GenerationResponse } from "@/api/model";

interface GenerationParams {
  text: string;
  temperature: number;
  maxNewTokens: number;
  topKTokens: number;
}

export function useGeneration() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GenerationParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await generationExperimentApiExperimentsGenerationPost({
        text: params.text,
        temperature: params.temperature,
        max_new_tokens: params.maxNewTokens,
        top_k_tokens: params.topKTokens,
      });
      if (res.status === 200) {
        setResult(res.data);
      } else {
        setError("Validation error");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, generate, clear };
}
