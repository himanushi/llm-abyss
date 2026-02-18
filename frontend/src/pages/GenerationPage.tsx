import { useState } from "react";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGeneration } from "@/hooks/useGeneration";
import { useModels } from "@/hooks/useModels";
import { PromptInput } from "@/components/generation/PromptInput";
import { ParameterControls } from "@/components/generation/ParameterControls";
import { GenerationResult } from "@/components/generation/GenerationResult";

export function GenerationPage() {
  const { status } = useModels();
  const { result, loading, error, generate, clear } = useGeneration();

  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(1.0);
  const [maxNewTokens, setMaxNewTokens] = useState(50);
  const [topKTokens, setTopKTokens] = useState(10);

  const modelLoaded = status?.loaded === true;
  const canGenerate = modelLoaded && prompt.trim().length > 0 && !loading;

  const handleGenerate = () => {
    generate({ text: prompt, temperature, maxNewTokens, topKTokens });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Generation</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate text completions and visualize token probabilities.
        </p>
      </div>

      {!modelLoaded && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Load a model from the Models page before generating.</span>
        </div>
      )}

      <Card className="border-border/50 bg-card/80">
        <CardContent className="space-y-4 pt-6">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            disabled={loading}
          />
          <ParameterControls
            temperature={temperature}
            maxNewTokens={maxNewTokens}
            topKTokens={topKTokens}
            onTemperatureChange={setTemperature}
            onMaxNewTokensChange={setMaxNewTokens}
            onTopKTokensChange={setTopKTokens}
            disabled={loading}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
            {result && (
              <Button variant="outline" onClick={clear} disabled={loading}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && <GenerationResult result={result} />}
    </div>
  );
}
