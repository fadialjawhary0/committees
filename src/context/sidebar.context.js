import { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const value = {
    setIsCollapsed,
    isCollapsed,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
