import React, { useEffect, useState, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { AppContext } from "./provider";

const MyComponent = props => {
  const [content, setContent] = useState();
  const { contentUrl } = useContext(AppContext);
  useEffect(() => {
    fetch(contentUrl)
      .then(r => r.text())
      .then(text => {
        setContent(text);
      });
  }, [contentUrl]);
  return (
    <div className="result-pane">
      <ReactMarkdown className="result" children={content} />
    </div>
  );
};

export default MyComponent;