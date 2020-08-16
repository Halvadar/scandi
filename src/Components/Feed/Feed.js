import React, { Component } from "react";
import "./Feed.scss";
import Image0 from "./Image0.png";
import Image1 from "./Image1.png";
import Image2 from "./Image2.png";
import Image3 from "./Image3.png";
import Image4 from "./Image4.png";
import Image5 from "./Image5.png";
import Background0 from "./Background0.jpg";
import Background1 from "./Background1.jpg";
import Background2 from "./Background2.jpg";
import Plus from "../Statistics/PlusData.svg";

const backgrounds = [Background0, Background1, Background2];
const images = [Image0, Image1, Image2, Image3, Image4, Image5];
export class Feed extends Component {
  constructor() {
    super();
    this.state = {
      previewWidth: undefined,
      imageValid: false,
    };
    this.addYourPost = this.addYourPost.bind(this);
    this.resizeFunc = this.resizeFunc.bind(this);
    this.goToPost = this.goToPost.bind(this);
  }
  goToPost(arg) {
    return () => {
      this.props.history.push(arg);
    };
  }

  componentDidMount() {
    this.setState({
      previewWidth: window
        .getComputedStyle(this.previewRef)
        .getPropertyValue("width"),
    });
    window.addEventListener("resize", this.resizeFunc);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunc);
  }
  resizeFunc() {
    this.setState({
      previewWidth: window
        .getComputedStyle(this.previewRef)
        .getPropertyValue("width"),
    });
  }
  addYourPost() {
    this.props.history.push("/addNewPost");
  }

  render() {
    return (
      <div className="feedContainer">
        <div className="addYourPost">
          <img
            alt="Add a New post"
            src={Plus}
            className="addYourPostImg"
            onClick={this.addYourPost}
          ></img>
          <div> Add a New Post</div>
        </div>
        {this.props.feedItems.map((feedItem, feedItemIndex) => {
          const likes = feedItem.likedby.reduce(
            (sum, likeDislike) =>
              likeDislike.likestatus === "like" ? sum++ : (sum -= 1),
            0
          );

          return (
            <div
              key={feedItemIndex}
              className="feedItem"
              style={{
                backgroundImage: `url(${
                  feedItemIndex < 3
                    ? backgrounds[feedItemIndex]
                    : feedItem.background
                }),url('https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg?size=626&ext=jpg')`,
              }}
            >
              <div
                title="Go To Post"
                className="upper"
                onClick={this.goToPost(`/post/${feedItemIndex}`)}
              >
                <div className="linearGrad"></div>
                <div className="title titleFeed">{feedItem.title}</div>
              </div>
              <div className="lower">
                <div
                  className="preview"
                  ref={(elem) => (this.previewRef = elem)}
                >
                  <div
                    className="previewContent"
                    style={{
                      columnWidth: this.state.previewWidth
                        ? this.state.previewWidth
                        : null,
                    }}
                  >
                    {feedItem.post}
                  </div>
                </div>
                <div className="authorDate">
                  <div className="author">
                    By <span className="name">{feedItem.author}</span>
                  </div>
                  <div className="date">{feedItem.date}</div>
                </div>
                <div style={{ justifyContent: "flex-start" }} className="likes">
                  {feedItemIndex < 3 ? (
                    <React.Fragment>
                      <img
                        className="likeImages"
                        alt="likedBy"
                        src={
                          feedItemIndex < 3 ? images[2 * feedItemIndex] : null
                        }
                      ></img>
                      <img
                        className="likeImages"
                        alt="likedBy"
                        src={
                          feedItemIndex < 3
                            ? images[2 * feedItemIndex + 1]
                            : null
                        }
                      ></img>
                    </React.Fragment>
                  ) : (
                    feedItem.likedby.map((likeDislike, likeDislikeIndex) => {
                      return (
                        <img
                          key={likeDislikeIndex}
                          className="likeImages"
                          alt="likedBy"
                          src={likeDislike.image}
                        ></img>
                      );
                    })
                  )}
                  <div className="likeCount">
                    {likes - 1 >= 0 ? "+" : null}
                    {likes}
                  </div>
                  <span className="likedThis">Liked This</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Feed;
