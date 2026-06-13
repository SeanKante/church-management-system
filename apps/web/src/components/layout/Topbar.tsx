import { useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}` : "";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search members, events..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge tone="brand" className="mt-0.5">{user?.role}</Badge>
            </div>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-3 py-2 text-xs text-slate-400">{user?.email}</div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
