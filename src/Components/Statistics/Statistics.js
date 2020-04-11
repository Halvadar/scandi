import React, { Component } from "react";
import "./Statistics.scss";
import statistics from "../Navbar/statistics.svg";
import Arrow from "./Arrow.svg";

import * as Functions from "./Functions";
import Plus from "./Plus.svg";
import Minus from "./minus.svg";
import PlusData from "./PlusData.svg";
import Income from "./Income.svg";
import Expense from "./Expense.svg";

export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      ChartXYPositions: [],
      InfoIndex: [],
      CurrentData: null,
      CurrentMonth: null,
      ParsedStatistics: null,
      MonthsScrollPosition: 0,
      CanvasHeightWidth: [200, 200],
      TwoValues: [false],
      DataAddValueContWidth: undefined,
      DataEntryAmount: 1,
      EditMode: false,
      MonthAnimations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      Errors: "",
    };
    this.DiagramFunc = Functions.DiagramFunc.bind(this);
    this.DiagramInfoOnClick = Functions.DiagramInfoOnClick.bind(this);
    this.SubmitData = Functions.SubmitData.bind(this);
    this.AddAnotherDataEntry = Functions.AddAnotherDataEntry.bind(this);
    this.TwoValuesSetter = Functions.TwoValuesSetter.bind(this);
    this.DataAddValueContWidthSetter = Functions.DataAddValueContWidthSetter.bind(
      this
    );
    this.ChangeCurrentMonthData = Functions.ChangeCurrentMonthData.bind(this);
    this.DeleteEntireDataEntry = Functions.DeleteEntireDataEntry.bind(this);
    this.interval = undefined;
  }
  componentDidUpdate() {}

  componentDidMount() {
    if (window.screen.width > 500) {
      this.setState({ CanvasHeightWidth: [300, 450] });
    }

    if (this.props.LoggedIn) {
      this.DiagramFunc(this.props.Statistics[0], window);
    }

    window.addEventListener("resize", this.ResizeFunc);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.ResizeFunc);
  }
  ResizeFunc = () => {
    if (window.screen.width > 500) {
      this.setState({ CanvasHeightWidth: [300, 450] });
    } else {
      this.setState({ CanvasHeightWidth: [200, 200] });
    }
    this.state.CurrentMonth &&
      this.DiagramFunc(this.state.CurrentMonth, window);
  };
  onHoverAnimation = (b) => {
    return () => {
      this.setState({ MonthAnimations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      let AnimationArrCopy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      let Variable = 0;
      this.interval = setInterval(() => {
        if (this.state.MonthAnimations[b] < 10) {
          Variable++;
          AnimationArrCopy[b] = Variable;
          this.setState({ MonthAnimations: AnimationArrCopy });
        } else {
          clearInterval(this.interval);
        }
      }, 10);
    };
  };
  OnLeave = (b) => {
    return () => {
      let AnimationArrCopy = [...this.state.MonthAnimations];
      AnimationArrCopy[b] = 0;
      this.setState({ MonthAnimations: AnimationArrCopy });
      clearInterval(this.interval);
    };
  };

  render() {
    let CurrentData = this.state.CurrentData && [
      this.state.CurrentData.data.reduce((a, b) => a + b, 0),
      this.state.CurrentData.name,
    ];
    let TotalSpent = 0;
    let Balance;
    let BalanceFloored;
    let DecimalPart;
    let IncomeFloored;
    let IncomeDecimal;
    let ExpenseFloored;
    let ExpenseDecimal;
    this.state.CurrentMonth &&
      this.state.CurrentMonth.data.forEach((a) => {
        a.data.forEach((b) => {
          TotalSpent = TotalSpent + b;
        });
      });
    if (this.state.CurrentMonth && this.state.CurrentMonth.income) {
      Balance = this.state.CurrentMonth.income - TotalSpent;
      let DataEntryAmount = [];
      let i;
      for (i = 0; i < this.state.DataEntryAmount; i++) {
        DataEntryAmount.push(0);
      }
      BalanceFloored = Balance > 0 ? Math.floor(Balance) : Math.ceil(Balance);
      DecimalPart = (Balance > 0
        ? Balance - BalanceFloored
        : BalanceFloored - Balance
      )
        .toFixed(2)
        .toString()
        .slice(2, 4);
      IncomeFloored =
        this.state.CurrentMonth.income > 0
          ? Math.floor(this.state.CurrentMonth.income)
          : Math.ceil(this.state.CurrentMonth.income);
      IncomeDecimal = (this.state.CurrentMonth.income > 0
        ? this.state.CurrentMonth.income - IncomeFloored
        : IncomeFloored - this.state.CurrentMonth.income
      )
        .toFixed(2)
        .toString()
        .slice(2, 4);
      ExpenseFloored = Math.floor(TotalSpent);

      ExpenseDecimal = (TotalSpent - ExpenseFloored)
        .toFixed(2)
        .toString()
        .slice(2, 4);
    }

    return (
      <div className="Statistic">
        <div className="GoBack_LogoCont">
          <img
            onClick={() => {
              this.props.history.push("/feed");
            }}
            src={Arrow}
            alt="GoBack"
            className="GoBack"
          ></img>
          <div className="Logo">
            <div>Statistics</div>
            <img src={statistics} alt="Statistics" className="LogoImg"></img>
          </div>
        </div>
        {this.props.LoggedIn ? (
          <React.Fragment>
            <div
              className="MonthsContainer"
              ref={(a) => (this.MonthsScrollBar = a)}
            >
              {this.state.CurrentMonth ? (
                <div ref={(a) => (this.Months = a)} className="Months">
                  {[
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
                  ].map((a, b) => {
                    return (
                      <div
                        key={b}
                        ref={(t) => (this[a] = t)}
                        style={{
                          background:
                            this.state.CurrentMonth.month === a
                              ? "rgb(53, 124, 255)"
                              : null,
                          bottom: this.state.MonthAnimations[b] + "px",
                        }}
                        onClick={() =>
                          this.DiagramFunc(this.props.Statistics[b], window)
                        }
                        className="Month"
                        onMouseEnter={this.onHoverAnimation(b)}
                        onMouseLeave={this.OnLeave(b)}
                      >
                        {a}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            {!this.state.EditMode &&
            this.state.CurrentMonth &&
            this.state.CurrentMonth.data.length > 0 ? (
              <React.Fragment>
                <div className="ChangeDataEntries">
                  <button
                    onClick={this.ChangeCurrentMonthData}
                    className="ChangeDataEntriesButton"
                  >
                    Change Data
                  </button>
                </div>
                <div className="Chart" style={{ position: "relative" }}>
                  <canvas
                    height={this.state.CanvasHeightWidth[0] + "px"}
                    width={this.state.CanvasHeightWidth[1] + "px"}
                    ref={(a) => (this.Diagram = a)}
                    className="Diagram"
                  ></canvas>
                  {this.state.ChartXYPositions.length > 0 &&
                  this.state.CurrentMonth.data
                    ? this.state.ChartXYPositions.map((val, ind) => {
                        return (
                          <div
                            key={ind}
                            onClick={this.DiagramInfoOnClick(
                              ind,
                              this.state.CurrentMonth.data
                            )}
                            className="DiagramClickInfo"
                            style={{
                              left:
                                this.state.ChartXYPositions[ind]
                                  .LinearGradXEnd -
                                7.5 +
                                "px",
                              top:
                                this.state.ChartXYPositions[ind]
                                  .LinearGradYEnd -
                                7.5 +
                                "px",
                              background: this.state.InfoIndex[ind],
                            }}
                          >
                            <div className="DiagramClickInside"></div>
                          </div>
                        );
                      })
                    : null}
                  <div className="CenterBalance">
                    <div className="BalanceNumber">
                      ${Balance < 0 && Balance > -1 && "-"}
                      {this.state.CurrentMonth && BalanceFloored}
                      <div className="DecimalPortion">
                        {this.state.CurrentMonth && DecimalPart}
                      </div>
                    </div>
                    <div className="Balance">Balance</div>
                  </div>
                </div>
                <div className="DataInfoCont">
                  <div className="DataInfo">
                    <div className="DataAmount">
                      {CurrentData && `$${CurrentData[0]}`}
                    </div>
                    <div className="DataName">
                      {CurrentData && CurrentData[1]}
                    </div>
                  </div>
                </div>
                <div className="IncomeExpense">
                  <div className="Income">
                    +$
                    {this.state.CurrentMonth && IncomeFloored}
                    <div className="DecimalPortionIncomeExpense">
                      {this.state.CurrentMonth && IncomeDecimal}
                      <img alt="Income" src={Income}></img>
                    </div>
                  </div>
                  <div className="Expense">
                    -${this.state.CurrentMonth && ExpenseFloored}
                    <div className="DecimalPortionIncomeExpense">
                      {this.state.CurrentMonth && ExpenseDecimal}
                      <img alt="Expense" src={Expense}></img>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div
                className="AddData"
                onKeyPress={(a) => {
                  if (a.key === "Enter") {
                    this.SubmitData();
                  }
                }}
              >
                <div className="ErrorMessage">{this.state.Errors}</div>
                <div className="IncomeInputCont">
                  <div style={{ margin: "1rem" }}>
                    Add Your Income For This Month
                  </div>
                  <input
                    ref={(a) => (this.IncomeInput = a)}
                    className="IncomeInput"
                    step="0.01"
                    type="number"
                    placeholder="$"
                    Value={
                      this.state.EditMode
                        ? this.state.CurrentMonth.income
                        : null
                    }
                  ></input>
                </div>
                <div className="AddYourSpendings">
                  <div style={{ margin: "1rem" }}>Add Your Spendings</div>
                </div>
                {this.state.TwoValues.map((a, b) => {
                  return (
                    <React.Fragment>
                      <div key={b} className="DataAddCont">
                        {b !== 0 ? (
                          <div
                            onClick={() => {
                              this.DeleteEntireDataEntry(b);
                            }}
                            className="DeleteDataEntry"
                          >
                            <img
                              alt="Minus"
                              height="100%"
                              width="100%"
                              src={Minus}
                            ></img>
                          </div>
                        ) : null}
                        <div className="DataAddNameCont">
                          Name
                          <input
                            Value={
                              this.state.EditMode
                                ? this.state.CurrentMonth.data[b]
                                  ? this.state.CurrentMonth.data[b].name
                                  : null
                                : null
                            }
                            className="DataAddNameInput"
                            ref={(a) => (this[`DataAddNameInput${b}`] = a)}
                          ></input>
                        </div>
                        <div
                          className="DataAddNameCont DataAddValueCont"
                          ref={(a) => {
                            if (b === 0) {
                              this.DataAddValueContWidthSetter(a, b);
                            }
                          }}
                        >
                          Spent
                          <input
                            ref={(a) => (this[`DataAddValueInput${b}`] = a)}
                            style={{
                              Width: "100%",
                              maxWidth: this.state.TwoValues[b]
                                ? this.state.DataAddValueContWidth / 2 + "px"
                                : null,
                            }}
                            Value={
                              this.state.EditMode
                                ? this.state.CurrentMonth.data[b]
                                  ? this.state.CurrentMonth.data[b].data[0]
                                  : null
                                : null
                            }
                            step="0.01"
                            type="number"
                            placeholder="$"
                            className="DataAddNameInput DataAddValueInput "
                          ></input>
                          {this.state.TwoValues[b] ? (
                            <input
                              ref={(a) =>
                                (this[`DataAddValueInputSecond${b}`] = a)
                              }
                              style={{
                                Width: "100%",
                                maxWidth:
                                  this.state.DataAddValueContWidth / 2 + "px",
                              }}
                              defaultValue={
                                this.state.EditMode
                                  ? this.state.CurrentMonth.data[b]
                                    ? this.state.CurrentMonth.data[b].data[1]
                                    : null
                                  : null
                              }
                              step="0.01"
                              type="number"
                              placeholder="$"
                              className="DataAddNameInput DataAddValueInput "
                            ></input>
                          ) : null}
                          <div
                            className="AddAnotherValue"
                            onClick={() => {
                              this.TwoValuesSetter(b);
                            }}
                          >
                            <img
                              alt=""
                              src={this.state.TwoValues[b] ? Minus : Plus}
                              height="100%"
                            ></img>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div
                  className="AddAnotherMonthData"
                  onClick={this.AddAnotherDataEntry}
                >
                  <img
                    alt="AddAnother"
                    src={PlusData}
                    height="40px"
                    width="40px"
                  ></img>
                </div>
                <div className="Submit">
                  <button
                    onClick={this.SubmitData}
                    className="SubmitButton"
                    placeholder="Submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ) : (
          <div className="YouNeedToSignIn">
            You need To be Signed In to view this page
          </div>
        )}
      </div>
    );
  }
}
