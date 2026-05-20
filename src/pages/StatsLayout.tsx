import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATS_SECTIONS } from "@/config/sections";
import { cn } from "@/lib/utils";

export function StatsLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-0 flex-col gap-3 sm:min-h-[calc(100dvh-3.5rem-3rem)] sm:flex-row sm:gap-4">
      <aside
        className={cn(
          "relative flex shrink-0 rounded-xl border border-border/80 bg-card/40 transition-all duration-200 ease-out",
          collapsed
            ? "w-full flex-row items-center gap-1 p-1 sm:w-11 sm:flex-col"
            : "w-full flex-col sm:w-52 md:w-56",
        )}
      >
        <div
          className={cn(
            "flex items-center border-border/60",
            collapsed
              ? "shrink-0 border-0 p-0 sm:flex sm:w-full sm:justify-center sm:border-b sm:p-1"
              : "w-full justify-between gap-1 border-b p-2",
          )}
        >
          {!collapsed && (
            <span className="truncate px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              STATS
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground hover:text-accent sm:size-9"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? <ChevronRight className="sm:rotate-0" /> : <ChevronLeft />}
          </Button>
        </div>
        <nav
          className={cn(
            "flex gap-0.5",
            collapsed ? "min-w-0 flex-1 flex-row justify-stretch sm:flex-col sm:p-1" : "flex-col gap-1 p-2",
          )}
        >
          {STATS_SECTIONS.map((s) => (
            <NavLink
              key={s.id}
              to={s.id}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg border border-transparent text-sm font-medium transition-colors",
                  collapsed
                    ? "flex-1 justify-center px-0 py-2 sm:mx-auto sm:size-9 sm:flex-none sm:shrink-0 sm:p-0"
                    : "gap-3 px-3 py-2.5 sm:py-3",
                  isActive
                    ? "border-border bg-muted/50 text-accent"
                    : "text-foreground/80 hover:border-border hover:bg-muted/30 hover:text-foreground",
                )
              }
              title={collapsed ? s.label : undefined}
            >
              {s.id === "health" ? (
                <Activity className="size-4 shrink-0 opacity-70" />
              ) : (
                <span className="font-mono text-xs opacity-70">#</span>
              )}
              {!collapsed && <span className="truncate">{s.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-h-0 min-w-0 flex-1 rounded-xl border border-border/80 bg-card/20 p-3 sm:p-4 md:p-6">
        <Outlet />
      </section>
    </div>
  );
}
