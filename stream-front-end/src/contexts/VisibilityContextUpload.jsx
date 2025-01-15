import React, { createContext, useState } from 'react';

export const VisibilityContextUpload = createContext();

export const VisibilityProviderUpload = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState);
  };

  return (
    <VisibilityContextUpload.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </VisibilityContextUpload.Provider>
  );
};