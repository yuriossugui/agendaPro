import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  Settings,
  Wrench,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ isOpen = true, onClose, onCollapseChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const menuItems = [
    {
      label: "Serviços",
      href: "/service",
      icon: Wrench,
    },
    {
      label: "Agendamentos",
      href: "/appointment",
      icon: Calendar,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_in");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 flex flex-col",
          collapsed ? "w-20" : "w-64",
          !isOpen && "lg:block -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                AP
              </div>
              <span className="font-bold text-xl">AgendaPro</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={handleCollapse}
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-base font-medium transition-all",
                    active
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-3 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all",
              collapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-20 lg:hidden gap-2 shadow-lg"
        onClick={onClose}
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  );
}
