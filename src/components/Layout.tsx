import React from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, CalendarDays, UtensilsCrossed, LogOut, Flame, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "reservations", label: "Reservations", icon: CalendarDays },
    { id: "menu", label: "Menu Editor", icon: UtensilsCrossed },
  ];

  return (
    <div className="flex min-h-screen bg-bg-dark text-gray-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl md:flex md:flex-col">
        {/* Brand */}
        <div className="flex h-20 items-center gap-3 px-6 border-b border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-ember shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Flame className="h-5 w-5 text-bg-dark" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-light tracking-wide text-white leading-none">
              Ceylon Ember
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-gold/10 to-ember/5 border-l-2 border-gold text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-gold" : "text-gray-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="border-t border-white/5 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-gold border border-white/10">
              {user?.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Administrator</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-red-400/80 hover:bg-red-950/20 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header for Mobile & Desktop top */}
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-black/20 px-6 backdrop-blur-md">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-1.5 hover:bg-white/5 md:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-xl font-light text-white capitalize">
              {currentPage === "dashboard" ? "System Overview" : `${currentPage} Management`}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold to-ember">
              <Flame className="h-4 w-4 text-bg-dark" />
            </div>
            <span className="font-serif text-sm text-white font-light">Ceylon Ember</span>
          </div>

          {/* User Info Quick View */}
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 md:inline">
              Server status: <span className="text-green-500 font-medium">Online</span>
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative flex w-64 flex-col bg-bg-dark border-r border-white/10 p-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <span className="font-serif text-lg font-light text-white">Ceylon Ember</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1 hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-gold/10 to-ember/5 border-l-2 border-gold text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 pt-4">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400/80 hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
