import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Feed from "./Components/Feed/Feed";
import Navbar from "./Components/Navbar/Navbar";
import Statistics from "./Components/Statistics/Statistics";
import Authenticate from "./Components/Authentication/Authentication";
import Test from "./Components/Statistics/Test";

class App extends Component {
  constructor() {
    super();
    this.state = {
      LocalStorageParsed: undefined,
      LoggedIn: false,
      UserName: null,
      Statistics: null,
    };
  }
  SetUser = (user, data) => {
    this.setState({
      LoggedIn: true,
      UserName: user,
      Statistics: data,
    });
  };
  LogOut = () => {
    this.setState({ LoggedIn: false, UserName: null, Statistics: null });
  };
  SetStatistics = async (stats) => {
    this.setState({ Statistics: stats });
  };
  SetLocalStorageParsed = (a) => {
    this.setState({ LocalStorageParsed: a });
  };
  componentDidMount() {}
  render() {
    return (
      <div className="MainContainer">
        <Router>
          <Switch>
            <Route
              path="/profile"
              render={(props) => {
                return (
                  <Authenticate
                    SetLocalStorageParsed={this.SetLocalStorageParsed}
                    LoggedIn={this.state.LoggedIn}
                    {...props}
                    SetUser={this.SetUser}
                    LogOut={this.LogOut}
                  />
                );
              }}
            ></Route>
            <Route
              path="/statistics"
              render={(props) => {
                return (
                  <Statistics
                    SetStatistics={this.SetStatistics}
                    {...this.state}
                    {...props}
                  />
                );
              }}
            ></Route>
            <Route
              path="/"
              render={(props) => {
                return <Feed {...props} />;
              }}
            ></Route>
          </Switch>
          <Route render={(props) => <Navbar {...props} />}></Route>
        </Router>
      </div>
    );
  }
}

export default App;
