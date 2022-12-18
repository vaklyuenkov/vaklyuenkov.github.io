import React, { useState } from "react";
export const AppContext = React.createContext();

const Props = () => {
  const [contentUrl, setContentUrl] = useState("/contents/About.md");
  return (
    <AppContext.Provider
      value={{
        contentUrl,
        setContentUrl
      }}
    >
      {Props.children}
    </AppContext.Provider>
  );
};

export default Props;