import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Box, Sparkles } from "lucide-react";

export type PageId = "models" | "generation";

const navItems: { id: PageId; label: string; icon: typeof Box }[] = [
  { id: "models", label: "Models", icon: Box },
  { id: "generation", label: "Generation", icon: Sparkles },
];

interface AppSidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function AppSidebar({ activePage, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <span className="text-sm font-semibold text-abyss-cyan">
          llm-abyss
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activePage === item.id}
                    onClick={() => onNavigate(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
