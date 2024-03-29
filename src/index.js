import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import LinkComp from "./linkcomp";

import TextInputArea from './modules/js_inference';
import BlogPage from './modules/blog';
import LifeStats from './modules/lifestats';

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
                    <Route path="/lifestats" component={LifeStats} />
                  </Switch>
                </div>
              </BrowserRouter>
        </div>
  );
};

ReactDOM.render(<React.StrictMode> <App /> </React.StrictMode>, document.getElementById("root"));