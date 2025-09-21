import { ReactNode } from 'react';

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export function AuthTabs({ activeTab, onTabChange, children }: AuthTabsProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}

interface AuthTabsListProps {
  children: ReactNode;
}

export function AuthTabsList({ children }: AuthTabsListProps) {
  return (
    <div className="flex bg-neutral-300/30 p-1 rounded-lg mb-6">
      {children}
    </div>
  );
}

interface AuthTabsTriggerProps {
  value: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export function AuthTabsTrigger({ value, activeTab, onTabChange, children }: AuthTabsTriggerProps) {
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`
        flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium
        ${isActive 
          ? 'bg-white text-neutral-900 shadow-sm' 
          : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
        }
      `}
    >
      {children}
    </button>
  );
}

interface AuthTabsContentProps {
  value: string;
  activeTab: string;
  children: ReactNode;
}

export function AuthTabsContent({ value, activeTab, children }: AuthTabsContentProps) {
  if (activeTab !== value) return null;
  
  return (
    <div className="animate-in fade-in-0 duration-200">
      {children}
    </div>
  );
}