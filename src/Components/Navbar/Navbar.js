import React, { Component } from "react";
import "./Navbar.scss";
import profile from "./profile.svg";
import notifications from "./notifications.svg";
import home from "./home.svg";
import flag from "./flag.svg";
import statistics from "./statistics.svg";
const Images = [profile, statistics, notifications, home, flag];
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }
  NavLink = a => {
    return () => {
      this.props.history.push(a);
      this.setState({ url: a });
    };
  };
  render() {
    return (
      <div className="Navbar">
        {Images.map(img => {
          let Url = img.match(/((?<=media\/).*?(?=\.))/gs)[0];
          console.log(img);
          return (
            <div
              style={{
                background:
                  this.state.url === Url ? "rgba(114, 114, 114) " : null
              }}
              className="NavItem"
              onClick={this.NavLink(Url)}
            >
              <img src={img} className="NavImg" />
            </div>
          );
        })}
      </div>
    );
  }
}
