import React, { Component } from "react";
import "./Authentication.scss";
import Arrow from "../Statistics/Arrow.svg";
const NewAccStats = [
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
].map((MonthName) => {
  return { month: MonthName, income: undefined, data: [] };
});
export default class Authentication extends Component {
  constructor() {
    super();
    this.state = {
      LoggedIn: false,
      ErrorMessage: "",
    };
    this.AddNewOrLogin = this.AddNewOrLogin.bind(this);
  }
  componentWillUnmount() {
    this.AuthenticPage.removeEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.AddNewOrLogin();
      }
    });
  }
  componentDidMount() {
    if (!window.localStorage.Accounts) {
      window.localStorage.setItem("Accounts", JSON.stringify([]));
    }
    this.props.SetLocalStorageParsed(JSON.parse(window.localStorage.Accounts));
    if (!this.props.LoggedIn) {
      this.Login.focus();
    }
    this.AuthenticPage.addEventListener("keypress", (keypress) => {
      if (keypress.key === "Enter") {
        this.AddNewOrLogin();
      }
    });
    this.setState({ ErrorMessage: "" });
  }
  async AddNewOrLogin() {
    if (this.Login.value.length > 0 && this.Password.value.length > 0) {
      const FoundAccount = JSON.parse(window.localStorage.Accounts).find(
        (Account) => {
          if (Account.Login === this.Login.value) {
            return Account;
          }
          return null;
        }
      );
      if (FoundAccount) {
        if (this.Password.value === FoundAccount.Password) {
          this.props.SetUser(
            FoundAccount.Login,
            FoundAccount.Statistics,
            FoundAccount.Image
          );
          this.setState({ ErrorMessage: "" });
        } else {
          this.AuthenticPage.scrollIntoView();
          this.setState({ ErrorMessage: "Password Doesnt Match" });
        }
      } else {
        const ImageValid = await this.ImageValidChecker(this.ProfilePic.value);
        localStorage.setItem(
          "Accounts",
          JSON.stringify([
            ...JSON.parse(localStorage.Accounts),
            {
              Login: this.Login.value,
              Password: this.Password.value,
              Statistics: NewAccStats,
              Image: ImageValid
                ? this.ProfilePic.value
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png",
            },
          ])
        );
        this.setState({ ErrorMessage: "" });
        this.props.SetUser(
          this.Login.value,
          NewAccStats,
          ImageValid
            ? this.ProfilePic.value
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png"
        );
      }
    }
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

  render() {
    return (
      <React.Fragment>
        <div
          className="AuthenticationContainer"
          ref={(a) => (this.AuthenticPage = a)}
        >
          {this.props.LoggedIn ? (
            <React.Fragment>
              <div className="LoggedIn">You Logged In Successfully</div>
              <button className="LogOut" onClick={this.props.LogOut}>
                Log Out
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="PleaseEnter">
                Please Enter Your Login and Password (You Will be Auto
                Registered)
              </div>
              <div className="ErrorMessage">{this.state.ErrorMessage}</div>
              <div className="Login">
                <input
                  ref={(a) => (this.Login = a)}
                  className="Input"
                  placeholder="Login"
                ></input>
              </div>
              <div className="Password">
                <input
                  type="password"
                  className="Input"
                  ref={(a) => (this.Password = a)}
                  placeholder="Password"
                ></input>
              </div>
              <div className="ProfilePic">
                <div style={{ marginBottom: "1rem" }}> Not Required</div>
                <input
                  className="Input"
                  ref={(a) => (this.ProfilePic = a)}
                  placeholder="Profile Image Url"
                ></input>
              </div>
              <div className="Submit">
                <button
                  onClick={this.AddNewOrLogin}
                  className="SubmitButton"
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
