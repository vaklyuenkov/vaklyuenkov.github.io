import React from "react";
import { Link } from "react-router-dom";

const LinkComp = () => {
  return (
   <div className="header">
    <div className="nav">
      <Link exact to="/">
        {" "} Blog {" "}
      </Link>
      <Link to="/js_inference"> Demo </Link>
    </div>
    </div>
  );
};

export default LinkComp;
