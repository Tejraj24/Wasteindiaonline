"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  User,
  ShieldCheck,
  Store,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside or Escape key
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Derive breadcrumb label from pathname
  function getBreadcrumbLabel() {
    if (pathname === "/admin") return "Dashboard";
    const segments = pathname.replace(/^\/admin\/?/, "").split("/");
    if (segments[0] === "products") {
      if (segments[1] === "new") return "Products / New";
      if (segments[1]) return "Products / Edit";
      return "Products";
    }
    if (segments[0] === "settings") {
      if (segments[1] === "account") return "Settings / Account & Security";
      return "Settings";
    }
    return segments[0]?.replace("-", " ") || "Dashboard";
  }

  const userInitial = (
    user?.displayName?.charAt(0) ||
    user?.email?.charAt(0) ||
    "A"
  ).toUpperCase();

  const userDisplayName =
    user?.displayName || user?.email?.split("@")[0] || "Administrator";

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
      {/* =========================================
          1. DESKTOP SIDEBAR
         ========================================= */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800/80 bg-zinc-950/80 p-4 lg:flex shrink-0">
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-800/60 px-2 pb-4">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-bold tracking-tight text-white transition hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-editorial text-lg text-white shadow-md shadow-blue-600/20">
              W
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider uppercase font-sans">
                Waste Admin
              </span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1.5" aria-label="Admin Sidebar">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-blue-400"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-3 w-3 text-blue-400 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Context */}
        <div className="mt-auto border-t border-zinc-800/60 pt-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/30 px-3 py-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-blue-400" />
              <span>INR Storefront</span>
            </span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>
      </aside>

      {/* =========================================
          2. MAIN CONTENT AREA WITH UTILITY HEADER
         ========================================= */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Compact Admin Utility Header */}
        <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          {/* Left: Mobile Menu Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden transition"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 truncate">
              <span className="text-zinc-500 hidden sm:inline">WASTE</span>
              <span className="text-zinc-600 hidden sm:inline">/</span>
              <span className="text-zinc-500">ADMIN</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-100 font-semibold capitalize truncate">
                {getBreadcrumbLabel()}
              </span>
            </div>
          </div>

          {/* Right: Operational Controls (View Store + Live Status + User Profile Menu) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Live Store Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Store Online</span>
            </div>

            {/* View Storefront Link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              title="Open storefront in new tab"
            >
              <span className="hidden sm:inline">View Store</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </Link>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            {/* Authoritative Admin Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                aria-label="Admin Profile Menu"
              >
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-400 border border-blue-500/30">
                  {userInitial}
                </div>
                <div className="hidden text-left md:block">
                  <p className="max-w-[7rem] truncate text-xs font-semibold text-white leading-tight">
                    {userDisplayName}
                  </p>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                    {role === "ADMIN" || isAdmin ? "Admin" : "User"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 hidden sm:block ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-200 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="border-b border-zinc-800/80 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                      <span className="truncate">{userDisplayName}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-zinc-400 font-mono">
                      {user?.email || "admin@wasteindiaonline.com"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/admin/settings/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      role="menuitem"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                      <span>Account & Security</span>
                    </Link>

                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      role="menuitem"
                    >
                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Store Settings</span>
                    </Link>

                    <Link
                      href="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      role="menuitem"
                    >
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Storefront Account</span>
                    </Link>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        void logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      role="menuitem"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =========================================
            3. MOBILE RESPONSIVE DRAWER
           ========================================= */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-zinc-950 p-6 border-r border-zinc-800 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-editorial text-base text-white">
                    W
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    Waste Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1 flex-1">
                {navigation.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider ${
                        isActive
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-300"
                >
                  <span>View Live Storefront</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                </Link>

                <div className="flex items-center justify-between rounded-lg bg-zinc-900/40 p-2.5 border border-zinc-800/60">
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-semibold text-white">
                      {userDisplayName}
                    </p>
                    <p className="truncate text-[10px] text-zinc-500 font-mono">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void logout();
                    }}
                    className="rounded p-1.5 text-red-400 hover:bg-red-500/10 transition"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            4. PAGE CONTENT
           ========================================= */}
        <main
          className="flex-1 overflow-y-auto bg-[#09090b] p-4 sm:p-6 lg:p-8"
          data-lenis-prevent
        >
          {children}
        </main>
      </div>
    </div>
  );
}

