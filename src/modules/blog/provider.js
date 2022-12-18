import React, { useState } from "react";
export const AppContext = React.createContext();

export default props => {
  const [contentUrl, setContentUrl] = useState("/contents/About.md");
  return (
    <AppContext.Provider
      value={{
        contentUrl,
        setContentUrl
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};