import React, { Component } from "react";
import { Feed as FeedData } from "./Data";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Feed from "./Components/Feed/Feed";
import Navbar from "./Components/Navbar/Navbar";
import Statistics from "./Components/Statistics/Statistics";
import Authenticate from "./Components/Authentication/Authentication";
import Post from "./Components/Post/Post";
import AddNewPost from "./Components/AddNewPost/AddNewPost";
import Arrow from "./Components/Statistics/Arrow.svg";

class App extends Component {
  constructor() {
    super();
    if (!localStorage) {
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
    this.SetUser = this.SetUser.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.SetStatistics = this.SetStatistics.bind(this);
    this.SetLocalStorageParsed = this.SetLocalStorageParsed.bind(this);
    this.SetFeedData = this.SetFeedData.bind(this);
  }
  SetUser(user, data, image) {
    console.log(image);
    this.setState({
      LoggedIn: true,
      UserName: user,
      Statistics: data,
      Image: image,
    });
  }

  LogOut() {
    this.setState({ LoggedIn: false, UserName: null, Statistics: null });
  }
  async SetStatistics(stats) {
    this.setState({ Statistics: stats });
  }
  SetLocalStorageParsed(LocalStorageParsedValue) {
    this.setState({ LocalStorageParsed: LocalStorageParsedValue });
  }
  async SetFeedData(FeedDataValue) {
    await this.setState({ FeedData: FeedDataValue });
  }

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
      <div
        ref={(Elem) => (this.MainContainer = Elem)}
        className="MainContainer"
      >
        <Router>
          <Switch>
            <Route
              path="/AddNewPost"
              render={(props) => {
                return (
                  <AddNewPost
                    DistanceFromRight={this.state.DistanceFromRight}
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
                    DistanceFromRight={this.state.DistanceFromRight}
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
                    DistanceFromRight={this.state.DistanceFromRight}
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
                    DistanceFromRight={this.state.DistanceFromRight}
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
                    alt="Profile"
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
          <Route
            render={(props) => {
              return props.history.location.pathname !== "/feed" ? (
                <img
                  onClick={() => {
                    props.history.push("/feed");
                  }}
                  style={{ left: this.state.DistanceFromRight + 20 + "px" }}
                  src={Arrow}
                  alt="GoBack"
                  className="GoBack"
                ></img>
              ) : null;
            }}
          ></Route>
          <Route render={(props) => <Navbar {...props} />}></Route>
        </Router>
      </div>
    );
  }
}

export default App;
