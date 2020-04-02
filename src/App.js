import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Feed from "./Components/Feed/Feed";
import Navbar from "./Components/Navbar/Navbar";
import Statistics from "./Components/Statistics/Statistics";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/statistics"
            render={props => {
              return <Statistics {...props} />;
            }}
          ></Route>
          <Route
            path="/"
            render={props => {
              return <Feed {...props} />;
            }}
          ></Route>
        </Switch>
        <Route render={props => <Navbar {...props} />}></Route>
      </Router>
    );
  }
}

export default App;
