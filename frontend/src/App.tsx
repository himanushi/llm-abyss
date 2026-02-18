import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import type { PageId } from "@/components/layout/AppSidebar";
import { ModelsPage } from "@/pages/ModelsPage";
import { GenerationPage } from "@/pages/GenerationPage";

function App() {
  const [activePage, setActivePage] = useState<PageId>("models");

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === "models" && <ModelsPage />}
      {activePage === "generation" && <GenerationPage />}
    </AppLayout>
  );
}

export default App;
