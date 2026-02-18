import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, type PageId } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function AppLayout({ children, activePage, onNavigate }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar activePage={activePage} onNavigate={onNavigate} />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
