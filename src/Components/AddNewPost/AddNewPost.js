import React, { Component } from "react";
import "./AddNewPost.scss";
import Arrow from "../Statistics/Arrow.svg";
export default class AddNewPost extends Component {
  constructor() {
    super();
    this.state = {
      Error: "",
    };
    this.SubmitNewPost = this.SubmitNewPost.bind(this);
  }
  componentDidMount() {
    this.ImageRef.addEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.SubmitNewPost();
      }
    });
  }

  SubmitNewPost() {
    if (
      this.ImageRef.value.length > 0 &&
      this.TitleRef.value.length > 0 &&
      this.TextRef.value.length > 0
    ) {
      if (this.props.LoggedIn) {
        const NewFeed = [
          ...this.props.FeedItems,
          {
            title: this.TitleRef.value,
            post: this.TextRef.value,
            background: this.ImageRef.value,
            author: this.props.UserName,
            posted: Date.now().toLocaleString,
            comments: [],
            likedby: [],
          },
        ];
        localStorage.setItem("Feed", JSON.stringify(NewFeed));
        this.setState({ Error: "" });
        this.props.SetFeedData(NewFeed);
        this.props.history.push("/feed");
      } else {
        this.ErrorMessage.scrollIntoView();
        this.setState({ Error: "You need to Log in" });
      }
    } else {
      this.ErrorMessage.scrollIntoView();
      this.setState({ Error: "Fill All Inputs" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          onClick={() => {
            this.props.history.push("/feed");
          }}
          className="AuthenticationGoBack"
        >
          <img
            style={{ left: this.props.DistanceFromRight + 20 + "px" }}
            src={Arrow}
            alt="GoBack"
            className="GoBack"
          ></img>
        </div>
        <div className="AddNewPostCont">
          <div className="AddaNewPost"> Add a New Post</div>
          <div ref={(a) => (this.ErrorMessage = a)} className="ErrorMessage">
            {this.state.Error}
          </div>
          <div className="AddTitle">
            <div>Title</div>
            <input
              ref={(a) => (this.TitleRef = a)}
              className="AddNewPostTitleInput"
            ></input>
          </div>
          <div className="AddText">
            <div>Text</div>
            <textarea
              ref={(a) => (this.TextRef = a)}
              className="AddNewPostTextInput"
            ></textarea>
          </div>
          <div className="AddNewPostImage">
            <div>Add Background Image URL</div>
            <input ref={(a) => (this.ImageRef = a)}></input>
          </div>
          <div>
            <button
              onClick={this.SubmitNewPost}
              ref={(a) => (this.SubmitRef = a)}
              className="AddNewPostSubmit"
            >
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
