import { useHealth } from "@/hooks/useHealth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
  const { connected, health } = useHealth();

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <h1 className="text-lg font-bold tracking-wide text-abyss-cyan">
        llm-abyss
      </h1>
      <span className="text-xs text-muted-foreground">
        Mechanistic Interpretability
      </span>

      <div className="ml-auto flex items-center gap-3">
        {health && (
          <span className="text-xs text-muted-foreground">
            {health.device.toUpperCase()}
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  connected
                    ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                    : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {connected
              ? `Backend connected (PyTorch ${health?.torch_version})`
              : "Backend not reachable"}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
