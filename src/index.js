import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import LinkComp from "./linkcomp";

import TextInputArea from './App';
import BlogPage from './modules';

import "./App.css";
import './index.css';
import './router.css'

const App = () => {
  return (
        <div className="app">
              <BrowserRouter>
                <div>
                  <LinkComp />
                  <Switch>
                    <Route exact path="/" component={BlogPage} />
                    <Route path="/js_inference" component={TextInputArea} />
                  </Switch>
                </div>
              </BrowserRouter>
        </div>
  );
};

ReactDOM.render(<React.StrictMode> <App /> </React.StrictMode>, document.getElementById("root"));