import React, { Component } from "react";
import "./Authentication.scss";
let NewAccStats = [
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
].map((a) => {
  return { month: a, income: undefined, data: [] };
});
export default class Authentication extends Component {
  constructor() {
    super();
    this.state = {
      LoggedIn: false,
      ErrorMessage: "",
    };
  }
  componentDidUpdate() {}
  componentDidMount() {
    if (!window.localStorage.Accounts) {
      window.localStorage.setItem("Accounts", JSON.stringify([]));
    } else {
      this.props.SetLocalStorageParsed(
        JSON.parse(window.localStorage.Accounts)
      );
    }
    if (!this.props.LoggedIn) {
      this.Login.focus();
    }
    window.addEventListener("keypress", (a) => {
      if (a.key === "Enter") {
        this.AddNewOrLogin();
      }
    });
    this.setState({ ErrorMessage: "" });
  }
  AddNewOrLogin = () => {
    if (this.Login.value.length > 0 && this.Password.value.length > 0) {
      let FoundAccount = JSON.parse(window.localStorage.Accounts).find((a) => {
        if (a.Login === this.Login.value) {
          return a;
        }
        return null;
      });
      if (FoundAccount) {
        console.log(FoundAccount.Login);
        if (this.Password.value === FoundAccount.Password) {
          this.props.SetUser(FoundAccount.Login, FoundAccount.Statistics);
          this.setState({ ErrorMessage: "" });
        } else {
          this.setState({ ErrorMessage: "Password Doesnt Match" });
        }
      } else {
        localStorage.setItem(
          "Accounts",
          JSON.stringify([
            ...JSON.parse(localStorage.Accounts),
            {
              Login: this.Login.value,
              Password: this.Password.value,
              Statistics: NewAccStats,
            },
          ])
        );
        this.setState({ ErrorMessage: "" });
        this.props.SetUser(this.Login.value, NewAccStats);
      }
    }
  };

  render() {
    return (
      <div className="AuthenticationContainer">
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
              Please Enter Your Login and Password (You Will be Auto Registered)
            </div>
            <div className="ErrorMessage">{this.state.ErrorMessage}</div>
            <div className="Login">
              <input
                ref={(a) => (this.Login = a)}
                className="Input"
                placeholder="Login"
              ></input>
            </div>
            <div type="password" className="Password">
              <input
                className="Input"
                ref={(a) => (this.Password = a)}
                placeholder="Password"
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
    );
  }
}
