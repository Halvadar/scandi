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
      IncomeInputValue: "",
      InputValues: [{ name: "", value1: "", value2: "" }],
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
    this.ResizeFunc = this.ResizeFunc.bind(this);
    this.onHoverAnimation = this.onHoverAnimation.bind(this);
    this.OnLeave = this.OnLeave.bind(this);
    this.InputValueSetter = this.InputValueSetter.bind(this);
    this.interval = undefined;
  }

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
  ResizeFunc() {
    if (window.screen.width > 500) {
      this.setState({ CanvasHeightWidth: [300, 450] });
    } else {
      this.setState({ CanvasHeightWidth: [200, 200] });
    }
    this.state.CurrentMonth &&
      this.DiagramFunc(this.state.CurrentMonth, window);
  }
  onHoverAnimation(Index) {
    return () => {
      this.setState({ MonthAnimations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
      const AnimationArrCopy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      let Variable = 0;
      this.interval = setInterval(() => {
        if (this.state.MonthAnimations[Index] < 10) {
          Variable++;
          AnimationArrCopy[Index] = Variable;
          this.setState({ MonthAnimations: AnimationArrCopy });
        } else {
          clearInterval(this.interval);
        }
      }, 10);
    };
  }
  OnLeave(Index) {
    return () => {
      const AnimationArrCopy = [...this.state.MonthAnimations];
      AnimationArrCopy[Index] = 0;
      this.setState({ MonthAnimations: AnimationArrCopy });
      clearInterval(this.interval);
    };
  }

  InputValueSetter(Type, Index) {
    return () => {
      this.setState((PrevState) => {
        if (Type === "Income") {
          return { IncomeInputValue: this.IncomeInput.value };
        }
        const NewInputValues = PrevState.InputValues.map(
          (Item, ObjectIndex) => {
            if (Index === ObjectIndex) {
              let TypeValue;
              if (Type === "name") {
                TypeValue = { name: this[`DataAddNameInput${Index}`].value };
                console.log(this.state.InputValues[Index].name);
              } else if (Type === "value1") {
                TypeValue = { value1: this[`DataAddValueInput${Index}`].value };
              } else if (Type === "value2") {
                TypeValue = {
                  value2: this[`DataAddValueInputSecond${Index}`].value,
                };
              }
              const ThisInputsCopy = {
                ...PrevState.InputValues[Index],
                ...TypeValue,
              };
              return ThisInputsCopy;
            }
            return Item;
          }
        );
        return { InputValues: NewInputValues };
      });
    };
  }
  render() {
    const CurrentData = this.state.CurrentData && [
      this.state.CurrentData.data.reduce(
        (Accumulator, CurrentValue) => Accumulator + CurrentValue,
        0
      ),
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
      this.state.CurrentMonth.data.forEach((DataObject) => {
        DataObject.data.forEach((DataValue) => {
          TotalSpent = TotalSpent + DataValue;
        });
      });
    if (this.state.CurrentMonth && this.state.CurrentMonth.income) {
      Balance = this.state.CurrentMonth.income - TotalSpent;

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
                  ].map((MonthName, Index) => {
                    return (
                      <div
                        key={Index}
                        ref={(t) => (this[MonthName] = t)}
                        style={{
                          background:
                            this.state.CurrentMonth.month === MonthName
                              ? "rgb(53, 124, 255)"
                              : null,
                          bottom: this.state.MonthAnimations[Index] + "px",
                        }}
                        onClick={() =>
                          this.DiagramFunc(this.props.Statistics[Index], window)
                        }
                        className="Month"
                        onMouseEnter={this.onHoverAnimation(Index)}
                        onMouseLeave={this.OnLeave(Index)}
                      >
                        {MonthName}
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
                    ? this.state.ChartXYPositions.map((Value, Index) => {
                        return (
                          <div
                            key={Index}
                            onClick={this.DiagramInfoOnClick(
                              Index,
                              this.state.CurrentMonth.data
                            )}
                            className="DiagramClickInfo"
                            style={{
                              left:
                                this.state.ChartXYPositions[Index]
                                  .LinearGradXEnd -
                                7.5 +
                                "px",
                              top:
                                this.state.ChartXYPositions[Index]
                                  .LinearGradYEnd -
                                7.5 +
                                "px",
                              background: this.state.InfoIndex[Index],
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
                onKeyPress={(KeyPress) => {
                  if (KeyPress.key === "Enter") {
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
                    onChange={this.InputValueSetter("Income")}
                    placeholder="$"
                    value={this.state.IncomeInputValue}
                  ></input>
                </div>
                <div className="AddYourSpendings">
                  <div style={{ margin: "1rem" }}>Add Your Spendings</div>
                </div>
                {this.state.TwoValues.map((Value, Index) => {
                  return (
                    <React.Fragment>
                      <div key={Index} className="DataAddCont">
                        {Index !== 0 ? (
                          <div
                            onClick={() => {
                              this.DeleteEntireDataEntry(Index);
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
                            value={this.state.InputValues[Index].name}
                            onChange={this.InputValueSetter("name", Index)}
                            className="DataAddNameInput"
                            ref={(a) => (this[`DataAddNameInput${Index}`] = a)}
                          ></input>
                        </div>
                        <div
                          className="DataAddNameCont DataAddValueCont"
                          ref={(a) => {
                            if (Index === 0) {
                              this.DataAddValueContWidthSetter(a, Index);
                            }
                          }}
                        >
                          Spent
                          <input
                            ref={(a) => (this[`DataAddValueInput${Index}`] = a)}
                            style={{
                              Width: "100%",
                              maxWidth: this.state.TwoValues[Index]
                                ? this.state.DataAddValueContWidth / 2 + "px"
                                : null,
                            }}
                            value={this.state.InputValues[Index].value1}
                            onChange={this.InputValueSetter("value1", Index)}
                            step="0.01"
                            type="number"
                            placeholder="$"
                            className="DataAddNameInput DataAddValueInput "
                          ></input>
                          {this.state.TwoValues[Index] ? (
                            <input
                              ref={(a) =>
                                (this[`DataAddValueInputSecond${Index}`] = a)
                              }
                              style={{
                                Width: "100%",
                                maxWidth:
                                  this.state.DataAddValueContWidth / 2 + "px",
                              }}
                              value={this.state.InputValues[Index].value2}
                              onChange={this.InputValueSetter("value2", Index)}
                              step="0.01"
                              type="number"
                              placeholder="$"
                              className="DataAddNameInput DataAddValueInput "
                            ></input>
                          ) : null}
                          <div
                            className="AddAnotherValue"
                            onClick={() => {
                              this.TwoValuesSetter(Index);
                            }}
                          >
                            <img
                              alt=""
                              src={this.state.TwoValues[Index] ? Minus : Plus}
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
