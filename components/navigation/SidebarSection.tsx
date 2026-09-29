import React from 'react';

interface SidebarSectionProps {
  title?: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export function SidebarSection({
  title,
  isCollapsed,
  children,
}: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B91C1C] dark:text-[#F472B6]">
            {title}
          </span>
        </div>
      )}
      {title && isCollapsed && (
        <div className="my-2 border-t border-[#F1D5DE]/70 dark:border-[#2A2028]" />
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
