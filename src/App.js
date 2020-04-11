import React, { Component } from "react";
import { Feed as FeedData } from "./Data";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Feed from "./Components/Feed/Feed";
import Navbar from "./Components/Navbar/Navbar";
import Statistics from "./Components/Statistics/Statistics";
import Authenticate from "./Components/Authentication/Authentication";
import Post from "./Components/Post/Post";
import AddNewPost from "./Components/AddNewPost/AddNewPost";

class App extends Component {
  constructor() {
    super();
    if (!localStorage.Feed) {
      localStorage.setItem("Feed", JSON.stringify(FeedData));
    }

    this.state = {
      FeedData: JSON.parse(localStorage.Feed),
      LocalStorageParsed: undefined,
      LoggedIn: false,
      UserName: null,
      Statistics: null,
      Image: null,
      ShowUserName: false,
      DistanceFromRight: null,
    };
  }
  SetUser = (user, data, image) => {
    this.setState({
      LoggedIn: true,
      UserName: user,
      Statistics: data,
      Image: image,
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
  SetFeedData = (a) => {
    this.setState({ FeedData: a });
  };
  componentDidUpdate() {}

  componentDidMount() {
    this.setState({
      DistanceFromRight: this.MainContainer.getBoundingClientRect().left,
    });
    window.addEventListener("resize", () => {
      this.setState({
        DistanceFromRight: this.MainContainer.getBoundingClientRect().left,
      });
    });
  }
  render() {
    return (
      <div ref={(a) => (this.MainContainer = a)} className="MainContainer">
        <Router>
          <Switch>
            <Route
              path="/AddNewPost"
              render={(props) => {
                return (
                  <AddNewPost
                    Image={this.state.Image}
                    LoggedIn={this.state.LoggedIn}
                    SetFeedData={this.SetFeedData}
                    UserName={this.state.UserName}
                    FeedItems={this.state.FeedData}
                    {...props}
                  />
                );
              }}
            ></Route>
            <Route
              path="/post/:id"
              render={(props) => {
                return (
                  <Post
                    Image={this.state.Image}
                    UserName={this.state.UserName}
                    LoggedIn={this.state.LoggedIn}
                    SetFeedData={this.SetFeedData}
                    FeedItems={this.state.FeedData}
                    {...props}
                  />
                );
              }}
            ></Route>
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
                return <Feed FeedItems={this.state.FeedData} {...props} />;
              }}
            ></Route>
          </Switch>
          <Route
            render={() =>
              this.state.LoggedIn ? (
                <div
                  className="ProfilePicCont"
                  style={{ right: this.state.DistanceFromRight + 20 + "px" }}
                >
                  <img
                    onMouseEnter={() => this.setState({ ShowUserName: true })}
                    onMouseLeave={() => this.setState({ ShowUserName: false })}
                    src={this.state.Image}
                    className="AbsProfilePic"
                  />
                  <div className="ShowUserName">
                    {this.state.ShowUserName ? this.state.UserName : null}
                  </div>
                </div>
              ) : null
            }
          ></Route>
          <Route render={(props) => <Navbar {...props} />}></Route>
        </Router>
      </div>
    );
  }
}

export default App;
