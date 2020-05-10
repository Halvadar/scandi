import React, { Component } from "react";
import "./Feed.scss";
import image0 from "./image0.png";
import image1 from "./image1.png";
import image2 from "./image2.png";
import image3 from "./image3.png";
import image4 from "./image4.png";
import image5 from "./image5.png";
import background0 from "./Background0.jpg";
import background1 from "./Background1.jpg";
import background2 from "./Background2.jpg";
import Plus from "../Statistics/PlusData.svg";

const backgrounds = [background0, background1, background2];
const images = [image0, image1, image2, image3, image4, image5];
export class Feed extends Component {
  constructor() {
    super();
    this.state = {
      PreviewWidth: undefined,
      ImageValid: false,
    };
    this.AddYourPost = this.AddYourPost.bind(this);
    this.ResizeFunc = this.ResizeFunc.bind(this);
    this.goToPost = this.goToPost.bind(this);
  }
  goToPost(arg) {
    return () => {
      this.props.history.push(arg);
    };
  }

  componentDidMount() {
    this.setState({
      PreviewWidth: window
        .getComputedStyle(this.PreviewRef)
        .getPropertyValue("width"),
    });
    window.addEventListener("resize", this.ResizeFunc);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.ResizeFunc);
  }
  ResizeFunc() {
    this.setState({
      PreviewWidth: window
        .getComputedStyle(this.PreviewRef)
        .getPropertyValue("width"),
    });
  }
  AddYourPost() {
    this.props.history.push("/AddNewPost");
  }

  render() {
    return (
      <div className="FeedContainer">
        <div className="AddYourPost">
          <img
            alt="Add a New post"
            src={Plus}
            className="AddYourPostImg"
            onClick={this.AddYourPost}
          ></img>
          <div> Add a New Post</div>
        </div>
        {this.props.FeedItems.map((FeedItem, FeedItemIndex) => {
          const likes = FeedItem.likedby.reduce(
            (Sum, LikeDislike) =>
              LikeDislike.likestatus === "like" ? Sum++ : (Sum -= 1),
            0
          );

          return (
            <div
              key={FeedItemIndex}
              className="FeedItem"
              style={{
                backgroundImage: `url(${
                  FeedItemIndex < 3
                    ? backgrounds[FeedItemIndex]
                    : FeedItem.background
                })`,
              }}
            >
              <div
                title="Go To Post"
                className="Upper"
                onClick={this.goToPost(`/post/${FeedItemIndex}`)}
              >
                <div className="LinearGrad"></div>
                <div className="Title TitleFeed">{FeedItem.title}</div>
              </div>
              <div className="Lower">
                <div
                  className="Preview"
                  ref={(Elem) => (this.PreviewRef = Elem)}
                >
                  <div
                    className="PreviewContent"
                    style={{
                      columnWidth: this.state.PreviewWidth
                        ? this.state.PreviewWidth
                        : null,
                    }}
                  >
                    {FeedItem.post}
                  </div>
                </div>
                <div className="AuthorDate">
                  <div className="Author">
                    By <span className="Name">{FeedItem.author}</span>
                  </div>
                  <div className="Date">{FeedItem.date}</div>
                </div>
                <div style={{ justifyContent: "flex-start" }} className="Likes">
                  {FeedItemIndex < 3 ? (
                    <React.Fragment>
                      <img
                        className="LikeImages"
                        alt="LikedBy"
                        src={
                          FeedItemIndex < 3 ? images[2 * FeedItemIndex] : null
                        }
                      ></img>
                      <img
                        className="LikeImages"
                        alt="LikedBy"
                        src={
                          FeedItemIndex < 3
                            ? images[2 * FeedItemIndex + 1]
                            : null
                        }
                      ></img>
                    </React.Fragment>
                  ) : (
                    FeedItem.likedby.map((LikeDislike, LikeDislikeIndex) => {
                      return (
                        <img
                          key={LikeDislikeIndex}
                          className="LikeImages"
                          alt="LikedBy"
                          src={LikeDislike.image}
                        ></img>
                      );
                    })
                  )}
                  <div className="LikeCount">
                    {likes - 1 >= 0 ? "+" : null}
                    {likes}
                  </div>
                  <span className="LikedThis">Liked This</span>
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
