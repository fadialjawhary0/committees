import { createContext, useState } from 'react';

export const ActiveLinkContext = createContext();

export const ActiveLinkProvider = ({ children }) => {
  const [activeLink, setActiveLink] = useState(null);
  const value = {
    setActiveLink,
    activeLink,
  };

  return <ActiveLinkContext.Provider value={value}>{children}</ActiveLinkContext.Provider>;
};
