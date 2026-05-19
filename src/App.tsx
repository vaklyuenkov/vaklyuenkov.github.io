import { Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/layouts/AppShell";
import { AboutPage } from "@/pages/AboutPage";
import { StatsLayout } from "@/pages/StatsLayout";
import { StatsSectionView } from "@/pages/StatsSectionView";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="stats" replace />} />
          <Route path="stats" element={<StatsLayout />}>
            <Route index element={<Navigate to="health" replace />} />
            <Route path=":sectionId" element={<StatsSectionView />} />
          </Route>
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  );
}
