import { createContext, useState } from 'react';

export const PathURLContext = createContext();

export const PathURLProvider = ({ children }) => {
  const [path, setPath] = useState('');

  const value = {
    setPath,
    path,
  };

  return <PathURLContext.Provider value={value}>{children}</PathURLContext.Provider>;
};
