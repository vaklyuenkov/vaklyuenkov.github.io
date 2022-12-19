import React, { useState } from "react";
export const AppContext = React.createContext();

const MyComponent = props => {
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

export default MyComponent;