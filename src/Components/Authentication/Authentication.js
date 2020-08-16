import React, { Component } from "react";
import "./Authentication.scss";
const newAccStats = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((monthName) => {
  return { month: monthName, income: undefined, data: [] };
});
export default class Authentication extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      errorMessage: "",
    };
    this.addNewOrLogin = this.addNewOrLogin.bind(this);
  }
  componentWillUnmount() {
    this.authenticPage.removeEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.addNewOrLogin();
      }
    });
  }
  componentDidMount() {
    if (!window.localStorage.accounts) {
      window.localStorage.setItem("accounts", JSON.stringify([]));
    }
    this.props.setLocalStorageParsed(JSON.parse(window.localStorage.accounts));
    if (!this.props.loggedIn) {
      this.login.focus();
    }
    this.authenticPage.addEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.addNewOrLogin();
      }
    });
    this.setState({ errorMessage: "" });
  }
  async addNewOrLogin() {
    if (this.login.value.length > 0 && this.password.value.length > 0) {
      const foundAccount = JSON.parse(window.localStorage.accounts).find(
        (account) => {
          if (account.login === this.login.value) {
            return account;
          }
          return null;
        }
      );
      if (foundAccount) {
        if (this.password.value === foundAccount.password) {
          this.props.setUser(
            foundAccount.login,
            foundAccount.statistics,
            foundAccount.image
          );
          this.setState({ errorMessage: "" });
        } else {
          this.authenticPage.scrollIntoView();
          this.setState({ errorMessage: "Password Doesnt Match" });
        }
      } else {
        const imageValid = await this.imageValidChecker(this.profilePic.value);
        localStorage.setItem(
          "accounts",
          JSON.stringify([
            ...JSON.parse(localStorage.accounts),
            {
              login: this.login.value,
              password: this.password.value,
              statistics: newAccStats,
              image: imageValid
                ? this.profilePic.value
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png",
            },
          ])
        );
        this.setState({ errorMessage: "" });
        this.props.setUser(
          this.login.value,
          newAccStats,
          imageValid
            ? this.profilePic.value
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png"
        );
      }
    }
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

  render() {
    return (
      <React.Fragment>
        <div
          className="authenticationContainer"
          ref={(elem) => (this.authenticPage = elem)}
        >
          {this.props.loggedIn ? (
            <React.Fragment>
              <div className="loggedIn">You Logged In Successfully</div>
              <button className="logOut" onClick={this.props.logOut}>
                Log Out
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="pleaseEnter">
                Please Enter Your Login and Password (You Will be Auto
                Registered)
              </div>
              <div className="errorMessage">{this.state.errorMessage}</div>
              <div className="login">
                <input
                  ref={(elem) => (this.login = elem)}
                  className="input"
                  placeholder="Login"
                ></input>
              </div>
              <div className="password">
                <input
                  type="password"
                  className="input"
                  ref={(elem) => (this.password = elem)}
                  placeholder="Password"
                ></input>
              </div>
              <div className="profilePic">
                <div style={{ marginBottom: "1rem" }}> Not Required</div>
                <input
                  className="input"
                  ref={(elem) => (this.profilePic = elem)}
                  placeholder="Profile Image Url"
                ></input>
              </div>
              <div className="submit">
                <button
                  onClick={this.addNewOrLogin}
                  className="submitButton"
                  placeholder="Submit"
                >
                  Submit
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}
