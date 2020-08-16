import React, { Component } from "react";
import "./AddNewPost.scss";
export default class AddNewPost extends Component {
  constructor() {
    super();
    this.state = {
      error: "",
    };
    this.submitNewPost = this.submitNewPost.bind(this);
    this.imageValidChecker = this.imageValidChecker.bind(this);
  }
  componentDidMount() {
    this.imageRef.addEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.submitNewPost();
      }
    });
  }
  async imageValidChecker(url) {
    if (url.length === 0) {
      return false;
    }
    const imageStatus = await fetch(url, {
      method: "HEAD",
    })
      .then((res) => {
        if (res.ok) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => false);

    return imageStatus;
  }

  async submitNewPost() {
    if (this.titleRef.value.length > 0 && this.textRef.value.length > 0) {
      if (this.props.loggedIn) {
        const imageValid = await this.imageValidChecker(this.imageRef.value);
        const newFeed = [
          ...this.props.feedItems,
          {
            title: this.titleRef.value,
            post: this.textRef.value,
            background: imageValid
              ? this.imageRef.value
              : "https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg?size=626&ext=jpg",
            author: this.props.userName,
            posted: Date.now().toLocaleString,
            comments: [],
            likedby: [],
          },
        ];
        localStorage.setItem("Feed", JSON.stringify(newFeed));
        this.setState({ error: "" });
        this.props.setFeedData(newFeed);
        this.props.history.push("/feed");
      } else {
        this.errorMessage.scrollIntoView();
        this.setState({ error: "You need to Log in" });
      }
    } else {
      this.errorMessage.scrollIntoView();
      this.setState({ error: "Fill The Inputs" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="addNewPostCont">
          <div className="addaNewPost"> Add a New Post</div>
          <div
            ref={(elem) => (this.errorMessage = elem)}
            className="errorMessage"
          >
            {this.state.error}
          </div>
          <div className="addTitle">
            <div>Title</div>
            <input
              ref={(elem) => (this.titleRef = elem)}
              className="addNewPostTitleInput"
            ></input>
          </div>
          <div className="addText">
            <div>Text</div>
            <textarea
              ref={(elem) => (this.textRef = elem)}
              className="addNewPostTextInput"
            ></textarea>
          </div>
          <div className="addNewPostImage">
            <div>Add Background Image URL (not required)</div>
            <input ref={(elem) => (this.imageRef = elem)}></input>
          </div>
          <div>
            <button
              onClick={this.submitNewPost}
              ref={(elem) => (this.submitRef = elem)}
              className="addNewPostSubmit"
            >
              Submit
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
