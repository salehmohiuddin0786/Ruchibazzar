"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Truck,
  Users,
  ShoppingBag,
  IndianRupee,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const SuperSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/SuperDashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/ManageVendors", icon: Store },
    { name: "Partners", href: "/ManagePartners", icon: Truck },
    { name: "Customers", href: "/ManageCustomers", icon: Users },
    { name: "Orders", href: "/AllOrders", icon: ShoppingBag },
    { name: "Earnings", href: "/Earnings", icon: IndianRupee },
    { name: "Settings", href: "/Settings", icon: Settings },
  ];

  const linkClass = (href) => {
    const isActive = pathname === href;
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";
    const activeClasses = "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium border-r-4 border-indigo-600";
    const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    const collapsedClasses = isCollapsed && !isMobile ? "justify-center px-2" : "";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${collapsedClasses}`;
  };

  const iconColor = (href) => {
    return pathname === href ? "text-indigo-600" : "text-gray-500";
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`fixed md:sticky top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white shadow-lg`} />
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 md:hidden hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 h-screen bg-white shadow-lg flex flex-col
          transition-all duration-300 ease-in-out z-50
          ${isMobile 
            ? `${isMobileOpen ? "left-0" : "-left-72"} w-72` 
            : `${isCollapsed ? "w-20" : "w-64"}`
          }
        `}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-100 ${
          isCollapsed && !isMobile ? "flex-col gap-4" : ""
        }`}>
          <div className={`flex items-center gap-2 ${
            isCollapsed && !isMobile ? "flex-col" : ""
          }`}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">RB</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Ruchi Bazzar
              </h2>
            )}
          </div>

          {/* Collapse Button - Desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 space-y-1 p-3 overflow-y-auto ${
          isCollapsed && !isMobile ? "px-2" : ""
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <Icon className={`w-5 h-5 ${iconColor(item.href)} flex-shrink-0`} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`p-3 border-t border-gray-100 ${
          isCollapsed && !isMobile ? "px-2" : ""
        }`}>
          <button
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
              isCollapsed && !isMobile ? "justify-center px-2" : ""
            }`}
            onClick={() => {
              // Add your logout logic here
              console.log("Logout clicked");
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperSidebar;