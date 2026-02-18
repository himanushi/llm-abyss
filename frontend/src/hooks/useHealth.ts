import { useEffect, useRef, useState } from "react";
import { healthCheckApiHealthGet } from "@/api/endpoints/health/health";

export interface HealthData {
  status: string;
  device: string;
  torch_version: string;
  mps_available: boolean;
  cuda_available: boolean;
}

export function useHealth(intervalMs = 5000) {
  const [connected, setConnected] = useState(false);
  const [health, setHealth] = useState<HealthData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await healthCheckApiHealthGet(undefined);
        if (cancelled) return;
        setHealth(res.data as HealthData);
        setConnected(true);
      } catch {
        if (cancelled) return;
        setConnected(false);
        setHealth(null);
      }
    };

    check();
    timerRef.current = setInterval(check, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return { connected, health };
}
