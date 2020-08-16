import React, { Component } from "react";
import "./Navbar.scss";
import Profile from "./Profile.svg";
import Notifications from "./Notifications.svg";
import Home from "./Home.svg";
import Flag from "./Flag.svg";
import Statistics from "./Statistics.svg";
const images = [Profile, Statistics, Notifications, Home, Flag];
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
    };
    this.navLink = this.navLink.bind(this);
  }
  navLink(url) {
    return () => {
      this.props.history.push(url);
      this.setState({ url: url });
    };
  }

  render() {
    return (
      <div className="navbar">
        {images.map((img, ind) => {
          const url = img.match(/((?<=media).*?(?=\.))/gs)[0];

          return (
            <div
              key={ind}
              style={{
                background:
                  this.props.location.pathname === url
                    ? "rgba(114, 114, 114) "
                    : null,
              }}
              className="navItem"
              onClick={this.navLink(url)}
            >
              <img src={img} alt="navImg" className="navImg" />
            </div>
          );
        })}
      </div>
    );
  }
}
