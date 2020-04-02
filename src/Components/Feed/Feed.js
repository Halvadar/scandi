import React, { Component } from "react";
import "./Feed.scss";
import AxiosInstance from "../../Configs/AxiosConfig";
import Background from "./Background.jpg";
import image1 from "./image1.png";
import image2 from "./image2.png";

export class Feed extends Component {
  constructor() {
    super();
    this.state = {
      FeedItems: null
    };
  }
  componentDidMount() {
    this.ApiFeedCall();
  }

  ApiFeedCall = async () => {
    let FeedItems = await AxiosInstance("/feed").then(h => {
      console.log(h);
    });
    this.setState({ FeedItems: FeedItems });
    console.log(FeedItems);
  };
  render() {
    return (
      <div className="FeedContainer">
        <div
          className="FeedItem"
          style={{
            backgroundImage: `url(${Background})`
          }}
        >
          <div className="Upper">
            <div className="LinearGrad"></div>
            <div className="Title">
              Who are you and why you're standing here?
            </div>
          </div>
          <div className="Lower">
            <div className="Preview">
              It doesn't matter if you're building the next Facebook, or if
              you're the director of marketing for an industrial company.
            </div>
            <div className="AuthorDate">
              <div className="Author">
                By <span className="Name">Nocholas O'Brian</span>
              </div>
              <div className="Date">28 July</div>
            </div>
            <div className="Likes">
              <img className="LikeImages" src={image1}></img>
              <img className="LikeImages" src={image2}></img>
              <div className="LikeCount">+76</div>
              <span className="LikedThis"> Liked this</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Feed;
