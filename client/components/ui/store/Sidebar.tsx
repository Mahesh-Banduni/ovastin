"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

type SidebarTheme = {
  backgroundColor: string;
  activeTabColor: string;
  borderColor: string;
  textColor: string;
  surfaceColor: string;
};

type SidebarProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  backgroundColor?: string;
  activeTabColor?: string;
  borderColor?: string;
  textColor?: string;
  surfaceColor?: string;
};

const SidebarThemeContext = createContext<SidebarTheme>({
  backgroundColor: "var(--background)",
  activeTabColor: "var(--brand)",
  borderColor: "var(--border)",
  textColor: "var(--text-primary)",
  surfaceColor: "var(--surface)",
});

export const useSidebarTheme = () => useContext(SidebarThemeContext);

export default function Sidebar({
  children,
  open,
  onOpenChange,
  collapsed = false,
  backgroundColor = "var(--background)",
  activeTabColor = "var(--brand)",
  borderColor = "var(--border)",
  textColor = "var(--text-primary)",
  surfaceColor = "var(--surface)",
}: SidebarProps) {
  const theme = useMemo(
    () => ({
      backgroundColor,
      activeTabColor,
      borderColor,
      textColor,
      surfaceColor,
    }),
    [
      backgroundColor,
      activeTabColor,
      borderColor,
      textColor,
      surfaceColor,
    ]
  );

  return (
    <SidebarThemeContext.Provider value={theme}>
      <>
        {/* Mobile Backdrop */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => onOpenChange(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-0 z-50 h-screen w-72 border-r
            transition-[width,transform] duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 ${collapsed ? "lg:w-16" : "lg:w-72"}
          `}
          style={{
            backgroundColor,
            borderColor,
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute right-4 top-4 cursor-pointer rounded-md p-1.5 lg:hidden"
            style={{
              color: textColor,
            }}
            onClick={() => onOpenChange(false)}
          >
            <X size={20} />
          </button>

          {children}
        </aside>
      </>
    </SidebarThemeContext.Provider>
  );
}
