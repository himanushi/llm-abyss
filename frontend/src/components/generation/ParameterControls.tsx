import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ParameterControlsProps {
  temperature: number;
  maxNewTokens: number;
  topKTokens: number;
  onTemperatureChange: (v: number) => void;
  onMaxNewTokensChange: (v: number) => void;
  onTopKTokensChange: (v: number) => void;
  disabled?: boolean;
}

export function ParameterControls({
  temperature,
  maxNewTokens,
  topKTokens,
  onTemperatureChange,
  onMaxNewTokensChange,
  onTopKTokensChange,
  disabled,
}: ParameterControlsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Temperature</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {temperature.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={([v]) => onTemperatureChange(v)}
          min={0.01}
          max={2.0}
          step={0.01}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Max Tokens</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {maxNewTokens}
          </span>
        </div>
        <Slider
          value={[maxNewTokens]}
          onValueChange={([v]) => onMaxNewTokensChange(v)}
          min={1}
          max={200}
          step={1}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Top-k</Label>
          <span className="text-xs font-mono text-muted-foreground">
            {topKTokens}
          </span>
        </div>
        <Slider
          value={[topKTokens]}
          onValueChange={([v]) => onTopKTokensChange(v)}
          min={1}
          max={50}
          step={1}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
