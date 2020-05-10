import React, { Component } from "react";
import "./AddNewPost.scss";
export default class AddNewPost extends Component {
  constructor() {
    super();
    this.state = {
      error: "",
    };
    this.submitNewPost = this.submitNewPost.bind(this);
    this.ImageValidChecker = this.ImageValidChecker.bind(this);
  }
  componentDidMount() {
    this.ImageRef.addEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.submitNewPost();
      }
    });
  }
  async ImageValidChecker(Url) {
    const ImageStatus = await fetch(Url, {
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

    return ImageStatus;
  }

  async submitNewPost() {
    if (this.TitleRef.value.length > 0 && this.TextRef.value.length > 0) {
      if (this.props.LoggedIn) {
        const ImageValid = await this.ImageValidChecker(this.ImageRef.value);
        const NewFeed = [
          ...this.props.FeedItems,
          {
            title: this.TitleRef.value,
            post: this.TextRef.value,
            background: ImageValid
              ? this.ImageRef.value
              : "https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg?size=626&ext=jpg",
            author: this.props.UserName,
            posted: Date.now().toLocaleString,
            comments: [],
            likedby: [],
          },
        ];
        localStorage.setItem("Feed", JSON.stringify(NewFeed));
        this.setState({ error: "" });
        this.props.SetFeedData(NewFeed);
        this.props.history.push("/feed");
      } else {
        this.ErrorMessage.scrollIntoView();
        this.setState({ error: "You need to Log in" });
      }
    } else {
      this.ErrorMessage.scrollIntoView();
      this.setState({ error: "Fill The Inputs" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="AddNewPostCont">
          <div className="AddaNewPost"> Add a New Post</div>
          <div
            ref={(Elem) => (this.ErrorMessage = Elem)}
            className="ErrorMessage"
          >
            {this.state.error}
          </div>
          <div className="AddTitle">
            <div>Title</div>
            <input
              ref={(Elem) => (this.TitleRef = Elem)}
              className="AddNewPostTitleInput"
            ></input>
          </div>
          <div className="AddText">
            <div>Text</div>
            <textarea
              ref={(Elem) => (this.TextRef = Elem)}
              className="AddNewPostTextInput"
            ></textarea>
          </div>
          <div className="AddNewPostImage">
            <div>Add Background Image URL (not required)</div>
            <input ref={(Elem) => (this.ImageRef = Elem)}></input>
          </div>
          <div>
            <button
              onClick={this.submitNewPost}
              ref={(Elem) => (this.SubmitRef = Elem)}
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
