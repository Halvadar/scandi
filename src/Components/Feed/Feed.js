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
    this.AddYourPost = this.AddYourPost.bind(this);
  }
  goToPost = (arg) => {
    return () => {
      this.props.history.push(arg);
    };
  };
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
        {this.props.FeedItems.map((a, b) => {
          let likes = 0;
          a.likedby.forEach((a) => {
            if (a.likestatus === "like") {
              likes++;
            } else {
              likes -= 1;
            }
          });
          return (
            <div
              key={b}
              className="FeedItem"
              style={{
                backgroundImage: `url(${
                  b < 3 ? backgrounds[b] : a.background
                })`,
              }}
            >
              <div
                title="Go To Post"
                className="Upper"
                onClick={this.goToPost(`/post/${b}`)}
              >
                <div className="LinearGrad"></div>
                <div className="Title TitleFeed">{a.title}</div>
              </div>
              <div className="Lower">
                <div className="Preview">{a.post}</div>
                <div className="AuthorDate">
                  <div className="Author">
                    By <span className="Name">{a.author}</span>
                  </div>
                  <div className="Date">{a.date}</div>
                </div>
                <div style={{ justifyContent: "flex-start" }} className="Likes">
                  {b < 3 ? (
                    <React.Fragment>
                      <img
                        className="LikeImages"
                        alt="LikedBy"
                        src={b < 3 ? images[2 * b] : null}
                      ></img>
                      <img
                        className="LikeImages"
                        alt="LikedBy"
                        src={b < 3 ? images[2 * b + 1] : null}
                      ></img>
                    </React.Fragment>
                  ) : (
                    a.likedby.map((a, b) => {
                      return (
                        <img
                          key={b}
                          className="LikeImages"
                          alt="LikedBy"
                          src={a.image}
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
