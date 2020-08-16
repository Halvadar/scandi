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
    if (!localStorage.feed) {
      localStorage.setItem("feed", JSON.stringify(FeedData));
    }

    this.state = {
      parsedFeedData: JSON.parse(localStorage.feed),
      localStorageParsed: undefined,
      loggedIn: false,
      userName: null,
      statistics: null,
      image: null,
      showUserName: false,
      distanceFromRight: null,
    };
    this.setUser = this.setUser.bind(this);
    this.logOut = this.logOut.bind(this);
    this.setStatistics = this.setStatistics.bind(this);
    this.setLocalStorageParsed = this.setLocalStorageParsed.bind(this);
    this.setFeedData = this.setFeedData.bind(this);
  }
  setUser(user, data, image) {
    this.setState({
      loggedIn: true,
      userName: user,
      statistics: data,
      image: image,
    });
  }

  logOut() {
    this.setState({ loggedIn: false, userName: null, statistics: null });
  }
  async setStatistics(stats) {
    this.setState({ statistics: stats });
  }
  setLocalStorageParsed(localStorageParsedValue) {
    this.setState({ localStorageParsed: localStorageParsedValue });
  }
  async setFeedData(feedDataValue) {
    await this.setState({ parsedFeedData: feedDataValue });
  }

  componentDidMount() {
    this.setState({
      distanceFromRight: this.mainContainer.getBoundingClientRect().left,
    });
    window.addEventListener("resize", () => {
      this.setState({
        distanceFromRight: this.mainContainer.getBoundingClientRect().left,
      });
    });
  }
  render() {
    return (
      <div
        ref={(elem) => (this.mainContainer = elem)}
        className="mainContainer"
      >
        <Router>
          <Switch>
            <Route
              path="/addNewPost"
              render={(props) => {
                return (
                  <AddNewPost
                    distanceFromRight={this.state.distanceFromRight}
                    image={this.state.image}
                    loggedIn={this.state.loggedIn}
                    setFeedData={this.setFeedData}
                    userName={this.state.userName}
                    feedItems={this.state.parsedFeedData}
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
                    distanceFromRight={this.state.distanceFromRight}
                    image={this.state.image}
                    userName={this.state.userName}
                    loggedIn={this.state.loggedIn}
                    setFeedData={this.setFeedData}
                    feedItems={this.state.parsedFeedData}
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
                    distanceFromRight={this.state.distanceFromRight}
                    setLocalStorageParsed={this.setLocalStorageParsed}
                    loggedIn={this.state.loggedIn}
                    {...props}
                    setUser={this.setUser}
                    logOut={this.logOut}
                  />
                );
              }}
            ></Route>
            <Route
              path="/statistics"
              render={(props) => {
                return (
                  <Statistics
                    distanceFromRight={this.state.distanceFromRight}
                    setStatistics={this.setStatistics}
                    {...this.state}
                    {...props}
                  />
                );
              }}
            ></Route>
            <Route
              path="/"
              render={(props) => {
                return (
                  <Feed feedItems={this.state.parsedFeedData} {...props} />
                );
              }}
            ></Route>
          </Switch>
          <Route
            render={() =>
              this.state.loggedIn ? (
                <div
                  className="profilePicCont"
                  style={{ right: this.state.distanceFromRight + 20 + "px" }}
                >
                  <img
                    alt="Profile"
                    onError={() =>
                      this.setState({
                        image:
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png",
                      })
                    }
                    onMouseEnter={() => this.setState({ showUserName: true })}
                    onMouseLeave={() => this.setState({ showUserName: false })}
                    src={this.state.image}
                    className="absProfilePic"
                  />
                  <div className="showUserName">
                    {this.state.showUserName ? this.state.userName : null}
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
                  style={{ left: this.state.distanceFromRight + 20 + "px" }}
                  src={Arrow}
                  alt="GoBack"
                  className="goBack"
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
