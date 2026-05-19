import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { STATS_SECTIONS } from "@/config/sections";
import { fetchHealthOpenSheet } from "@/lib/fetch-health-opensheet";
import { HealthDashboard } from "@/components/charts/HealthDashboard";
import type { HealthJsonPayload } from "@/types/charts";

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "ok"; data: unknown }
  | { status: "error"; message: string };

async function loadSection(sectionId: string, signal: AbortSignal): Promise<unknown> {
  const section = STATS_SECTIONS.find((s) => s.id === sectionId);
  if (!section) throw new Error("Unknown section");
  if (section.source === "opensheet_health") {
    return fetchHealthOpenSheet(signal);
  }
  throw new Error("No data source");
}

export function StatsSectionView() {
  const { sectionId } = useParams();
  const section = useMemo(
    () => STATS_SECTIONS.find((s) => s.id === sectionId),
    [sectionId],
  );
  const [state, setState] = useState<LoadState>({ status: "idle" });
  /** Bumps on mount and when the page is restored from bfcache so data is refetched. */
  const [fetchToken, setFetchToken] = useState(() => Date.now());

  const bumpFetch = useCallback(() => setFetchToken(Date.now()), []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) bumpFetch();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [bumpFetch]);

  useEffect(() => {
    if (!section) return;
    const controller = new AbortController();
    setState({ status: "loading" });

    void (async () => {
      try {
        const data = await loadSection(section.id, controller.signal);
        setState({ status: "ok", data });
      } catch (e) {
        if (controller.signal.aborted) return;
        const message = e instanceof Error ? e.message : "Failed to load";
        setState({ status: "error", message });
      }
    })();

    return () => controller.abort();
  }, [section, fetchToken]);

  if (!section) {
    return <Navigate to="/stats" replace />;
  }

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="flex h-48 items-center justify-center font-mono text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Could not load {section.label}</p>
        <p className="mt-1 font-mono text-xs text-accent/90">{state.message}</p>
        <p className="mt-3 text-xs leading-relaxed">
          Data is loaded from the public sheet tab{" "}
          <span className="font-mono text-foreground/90">health public</span> via{" "}
          <a
            href="https://opensheet.elk.sh/"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            OpenSheet
          </a>
          . Check that the spreadsheet is shared as “Anyone with the link” can view.
        </p>
      </div>
    );
  }

  if (state.status !== "ok") {
    return null;
  }

  if (section.id === "health") {
    return <HealthDashboard data={state.data as HealthJsonPayload} />;
  }

  return (
    <p className="text-sm text-muted-foreground">
      No view registered for <span className="font-mono text-accent">{section.id}</span>.
    </p>
  );
}
