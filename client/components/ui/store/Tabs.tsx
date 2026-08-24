"use client";
import { useState } from "react";

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs?: TabItem[];
  active?: string;
  onChange?: (value: string) => void;
}

const defaultTabs = [
  {
    label: "Overview",
    value: "overview",
  },
  {
    label: "Settings",
    value: "settings",
  },
];

export default function Tabs({
  tabs = defaultTabs,
  active: controlledActive,
  onChange,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(
    tabs[0]?.value || "overview"
  );

  const active =
    controlledActive !== undefined ? controlledActive : internalActive;

  const handleTabClick = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      setInternalActive(value);
    }
  };

  return (
    <>
      <div
        className="
        inline-flex
        p-1
        rounded-lg
        bg-[var(--surface)]
      "
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`
              px-4
              py-2
              rounded-md
              text-sm
              font-medium
              cursor-pointer
              transition-all

              ${
                active === tab.value
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}