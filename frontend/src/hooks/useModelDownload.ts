import { useCallback, useRef, useState } from "react";

export interface DownloadState {
  status: "idle" | "downloading" | "complete" | "error";
  totalFiles: number;
  totalSizeMb: number;
  currentFile: string;
  currentFileIndex: number;
  progressPercent: number;
  downloadedMb: number;
  error: string | null;
}

const initialState: DownloadState = {
  status: "idle",
  totalFiles: 0,
  totalSizeMb: 0,
  currentFile: "",
  currentFileIndex: 0,
  progressPercent: 0,
  downloadedMb: 0,
  error: null,
};

export function useModelDownload(onComplete?: () => void) {
  const [downloads, setDownloads] = useState<Map<string, DownloadState>>(
    new Map(),
  );
  const esRefs = useRef<Map<string, EventSource>>(new Map());

  const startDownload = useCallback(
    (modelName: string) => {
      // Close existing connection if any
      const existing = esRefs.current.get(modelName);
      if (existing) {
        existing.close();
      }

      setDownloads((prev) => {
        const next = new Map(prev);
        next.set(modelName, { ...initialState, status: "downloading" });
        return next;
      });

      const es = new EventSource(`/api/models/download/${modelName}`);
      esRefs.current.set(modelName, es);

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          setDownloads((prev) => {
            const next = new Map(prev);
            const current = next.get(modelName) ?? { ...initialState };

            switch (payload.event) {
              case "start":
                next.set(modelName, {
                  ...current,
                  status: "downloading",
                });
                break;
              case "files":
                next.set(modelName, {
                  ...current,
                  totalFiles: payload.total_files,
                  totalSizeMb: payload.total_size_mb,
                });
                break;
              case "file_start":
                next.set(modelName, {
                  ...current,
                  currentFile: payload.file,
                  currentFileIndex: payload.file_index,
                });
                break;
              case "file_done":
                next.set(modelName, {
                  ...current,
                  progressPercent: payload.progress_percent,
                  downloadedMb: payload.downloaded_mb,
                });
                break;
              case "complete":
                next.set(modelName, {
                  ...current,
                  status: "complete",
                  progressPercent: 100,
                });
                es.close();
                esRefs.current.delete(modelName);
                onComplete?.();
                break;
              case "error":
                next.set(modelName, {
                  ...current,
                  status: "error",
                  error: payload.message,
                });
                es.close();
                esRefs.current.delete(modelName);
                break;
            }

            return next;
          });
        } catch {
          // ignore parse errors
        }
      };

      es.onerror = () => {
        es.close();
        esRefs.current.delete(modelName);
        setDownloads((prev) => {
          const next = new Map(prev);
          const current = next.get(modelName);
          if (current && current.status === "downloading") {
            next.set(modelName, {
              ...current,
              status: "error",
              error: "Connection lost",
            });
          }
          return next;
        });
      };
    },
    [onComplete],
  );

  return { downloads, startDownload };
}
