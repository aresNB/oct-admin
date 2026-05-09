import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Container,
  FileText,
  Truck,
  Bell,
  Users,
  Settings,
  Map,
  MessageSquare,
} from "lucide-react";
import logo from "@/assets/otc-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Conteneurs", url: "/conteneurs", icon: Container },
  { title: "Carte temps réel", url: "/carte", icon: Map },
  { title: "Factures", url: "/factures", icon: FileText },
  { title: "Livraisons", url: "/livraisons", icon: Truck },
];

const opsItems = [
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Alertes", url: "/alertes", icon: Bell },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

const sysItems = [{ title: "Paramètres", url: "/parametres", icon: Settings }];

export function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" variant="floating" className="md:!p-0">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <img src={logo} alt="OTC" className="h-9 w-9 rounded-lg object-contain bg-white p-0.5 shadow-sm ring-1 ring-sidebar-border/60" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-sidebar-foreground">OTC Admin</span>
            <span className="text-[11px] text-sidebar-foreground/60">Overseas Transit & Cargo</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        {renderGroup("Opérations", mainItems)}
        {renderGroup("Gestion", opsItems)}
        {renderGroup("Système", sysItems)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60">
        <div className="px-3 py-2 text-[11px] text-sidebar-foreground/60">
          v1.0 · Le Collectif Le Brief
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
