import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell() {
  return (
    <div className="flex min-h-dvh min-h-[var(--tg-viewport-height,100dvh)] flex-col bg-background pb-[env(safe-area-inset-bottom,0px)]">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-mono text-sm tracking-tight text-foreground/90">
            vk<span className="text-accent">.</span>stats
          </span>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <NavLink
                to="/stats"
                className={({ isActive }) =>
                  cn(isActive ? "text-accent" : "text-muted-foreground hover:text-foreground")
                }
              >
                stats
              </NavLink>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  cn(isActive ? "text-accent" : "text-muted-foreground hover:text-foreground")
                }
              >
                about
              </NavLink>
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col px-3 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
}
