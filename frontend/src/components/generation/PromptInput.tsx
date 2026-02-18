import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const PRESETS = [
  "The meaning of life is",
  "Once upon a time",
  "In the beginning",
  "The quick brown fox",
];

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Prompt</label>
        <span className="text-xs text-muted-foreground">
          {value.length} / 500
        </span>
      </div>
      <Textarea
        placeholder="Enter text for the model to complete..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        rows={3}
        disabled={disabled}
        className="resize-none"
      />
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <Badge
            key={preset}
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => !disabled && onChange(preset)}
          >
            {preset}
          </Badge>
        ))}
      </div>
    </div>
  );
}
