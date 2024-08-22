import React, { createContext, useState } from "react";

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photoUrls, setPhotoUrls] = useState({});

  return (
    <PhotoContext.Provider value={{ photoUrls, setPhotoUrls }}>
      {children}
    </PhotoContext.Provider>
  );
};
