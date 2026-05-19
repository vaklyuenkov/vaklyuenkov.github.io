import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATS_SECTIONS } from "@/config/sections";
import { cn } from "@/lib/utils";

export function StatsLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem-3rem)] gap-4">
      <aside
        className={cn(
          "relative flex shrink-0 flex-col rounded-xl border border-border/80 bg-card/40 transition-[width] duration-200 ease-out",
          collapsed ? "w-[4.25rem]" : "w-52 sm:w-56",
        )}
      >
        <div className="flex items-center justify-between gap-1 border-b border-border/60 p-2">
          {!collapsed && (
            <span className="truncate px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              STATS
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {STATS_SECTIONS.map((s) => (
            <NavLink
              key={s.id}
              to={s.id}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
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
      <section className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card/20 p-4 sm:p-6">
        <Outlet />
      </section>
    </div>
  );
}
