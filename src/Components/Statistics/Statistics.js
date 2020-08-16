import React, { Component } from "react";
import "./Statistics.scss";
import StatisticsImage from "../Navbar/Statistics.svg";
import * as Functions from "./Functions";
import Plus from "./Plus.svg";
import Minus from "./Minus.svg";
import PlusData from "./PlusData.svg";
import Income from "./Income.svg";
import Expense from "./Expense.svg";
const animationArrCopy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      chartXYPositions: [],
      infoIndex: [],
      currentData: null,
      currentMonth: null,
      parsedStatistics: null,
      monthsScrollPosition: 0,
      canvasHeightWidth: [200, 200],
      inputDoubleValue: [false],
      dataAddValueContWidth: undefined,
      dataEntryAmount: 1,
      editMode: false,
      monthAnimations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      errors: "",
      incomeInputValue: "",
      inputValues: [{ name: "", value1: "", value2: "" }],
    };
    this.diagramFunc = Functions.diagramFunc.bind(this);
    this.diagramInfoOnClick = Functions.diagramInfoOnClick.bind(this);
    this.submitData = Functions.submitData.bind(this);
    this.addAnotherDataEntry = Functions.addAnotherDataEntry.bind(this);
    this.twoValuesSetter = Functions.twoValuesSetter.bind(this);
    this.dataAddValueContWidthSetter = Functions.dataAddValueContWidthSetter.bind(
      this
    );
    this.changeCurrentMonthData = Functions.changeCurrentMonthData.bind(this);
    this.deleteEntireDataEntry = Functions.deleteEntireDataEntry.bind(this);
    this.incomeInfoClass = Functions.incomeInfoClass.bind(this);
    this.resizeFunc = this.resizeFunc.bind(this);
    this.onHoverAnimation = this.onHoverAnimation.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.inputValueSetter = this.inputValueSetter.bind(this);

    this.interval = undefined;
  }

  componentDidMount() {
    if (window.screen.width > 500) {
      this.setState({ canvasHeightWidth: [300, 450] });
    }

    if (this.props.loggedIn) {
      this.diagramFunc(this.props.statistics[0], window);
    }

    window.addEventListener("resize", this.resizeFunc);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunc);
    clearInterval(this.interval);
  }

  resizeFunc() {
    if (window.screen.width > 500) {
      this.setState({ canvasHeightWidth: [300, 450] });
    } else {
      this.setState({ canvasHeightWidth: [200, 200] });
    }
    this.state.currentMonth &&
      !this.state.editMode &&
      this.diagramFunc(this.state.currentMonth, window);
  }
  onHoverAnimation(index) {
    return () => {
      this.setState({ monthAnimations: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });

      this.interval = setInterval(() => {
        if (this.state.monthAnimations[index] < 10) {
          const animatedArr = animationArrCopy.map((item, itemIndex) =>
            index === itemIndex ? this.state.monthAnimations[index] + 1 : item
          );

          this.setState({ monthAnimations: animatedArr });
        } else {
          clearInterval(this.interval);
        }
      }, 10);
    };
  }
  onLeave(index) {
    return () => {
      const animationArrCopy = [...this.state.monthAnimations];
      animationArrCopy[index] = 0;
      this.setState({ monthAnimations: animationArrCopy });
      clearInterval(this.interval);
    };
  }

  inputValueSetter(Type, index) {
    return () => {
      this.setState((prevState) => {
        if (Type === "Income") {
          return { incomeInputValue: this.incomeInput.value };
        }
        const newInputValues = prevState.inputValues.map(
          (item, objectIndex) => {
            if (index === objectIndex) {
              const typeValue =
                Type === "name"
                  ? { name: this[`dataAddNameInput${index}`].value }
                  : Type === "value1"
                  ? { value1: this[`dataAddValueInput${index}`].value }
                  : Type === "value2"
                  ? {
                      value2: this[`dataAddValueInputSecond${index}`].value,
                    }
                  : undefined;

              const thisInputsCopy = {
                ...prevState.inputValues[index],
                ...typeValue,
              };
              return thisInputsCopy;
            }
            return item;
          }
        );
        return { inputValues: newInputValues };
      });
    };
  }
  render() {
    const currentData = this.state.currentData && [
      this.state.currentData.data.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      ),
      this.state.currentData.name,
    ];
    const totalSpent =
      this.state.currentMonth &&
      this.state.currentMonth.data.reduce((Total, objectValue) => {
        return (
          Total +
          objectValue.data.reduce(
            (itemTotal, itemValue) => itemTotal + itemValue,
            0
          )
        );
      }, 0);

    const incomeInfo =
      this.state.currentMonth &&
      this.state.currentMonth.income &&
      new this.incomeInfoClass(this, totalSpent);

    return (
      <div className="statistic">
        <div className="goBack_LogoCont">
          <div className="logo">
            <div>Statistics</div>
            <img
              src={StatisticsImage}
              alt="Statistics"
              className="logoImg"
            ></img>
          </div>
        </div>
        {this.props.loggedIn ? (
          <React.Fragment>
            <div
              className="monthsContainer"
              ref={(elem) => (this.monthsScrollBar = elem)}
            >
              {this.state.currentMonth ? (
                <div ref={(elem) => (this.months = elem)} className="months">
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
                  ].map((monthName, index) => {
                    return (
                      <div
                        key={index}
                        ref={(elem) => (this[monthName] = elem)}
                        style={{
                          background:
                            this.state.currentMonth.month === monthName
                              ? "rgb(53, 124, 255)"
                              : null,
                          bottom: this.state.monthAnimations[index] + "px",
                        }}
                        onClick={() =>
                          this.diagramFunc(this.props.statistics[index], window)
                        }
                        className="month"
                        onMouseEnter={this.onHoverAnimation(index)}
                        onMouseLeave={this.onLeave(index)}
                      >
                        {monthName}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            {!this.state.editMode &&
            this.state.currentMonth &&
            this.state.currentMonth.data.length > 0 ? (
              <React.Fragment>
                <div className="changeDataEntries">
                  <button
                    onClick={this.changeCurrentMonthData}
                    className="changeDataEntriesButton"
                  >
                    Change Data
                  </button>
                </div>
                <div className="chart" style={{ position: "relative" }}>
                  <canvas
                    height={this.state.canvasHeightWidth[0] + "px"}
                    width={this.state.canvasHeightWidth[1] + "px"}
                    ref={(elem) => (this.diagram = elem)}
                    className="diagram"
                  ></canvas>
                  {this.state.chartXYPositions.length > 0 &&
                  this.state.currentMonth.data
                    ? this.state.chartXYPositions.map((value, index) => {
                        return (
                          <div
                            key={index}
                            onClick={this.diagramInfoOnClick(
                              index,
                              this.state.currentMonth.data
                            )}
                            className="diagramClickInfo"
                            style={{
                              left:
                                this.state.chartXYPositions[index]
                                  .linearGradXEnd -
                                7.5 +
                                "px",
                              top:
                                this.state.chartXYPositions[index]
                                  .linearGradYEnd -
                                7.5 +
                                "px",
                              background: this.state.infoIndex[index],
                            }}
                          >
                            <div className="diagramClickInside"></div>
                          </div>
                        );
                      })
                    : null}
                  <div className="centerBalance">
                    <div className="balanceNumber">
                      $
                      {incomeInfo.balance < 0 && incomeInfo.balance > -1 && "-"}
                      {this.state.currentMonth && incomeInfo.balanceFloored}
                      <div className="decimalPortion">
                        {this.state.currentMonth && incomeInfo.decimalPart}
                      </div>
                    </div>
                    <div className="balance">Balance</div>
                  </div>
                </div>
                <div className="dataInfoCont">
                  <div className="dataInfo">
                    <div className="dataAmount">
                      {currentData && `$${currentData[0]}`}
                    </div>
                    <div className="dataName">
                      {currentData && currentData[1]}
                    </div>
                  </div>
                </div>
                <div className="incomeExpense">
                  <div className="income">
                    +$
                    {this.state.currentMonth && incomeInfo.incomeFloored}
                    <div className="decimalPortionIncomeExpense">
                      {this.state.currentMonth && incomeInfo.incomeDecimal}
                      <img alt="income" src={Income}></img>
                    </div>
                  </div>
                  <div className="expense">
                    -${this.state.currentMonth && incomeInfo.expenseFloored}
                    <div className="decimalPortionIncomeExpense">
                      {this.state.currentMonth && incomeInfo.expenseDecimal}
                      <img alt="Expense" src={Expense}></img>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div
                className="addData"
                onKeyPress={(keyPress) => {
                  if (keyPress.key === "Enter") {
                    this.submitData();
                  }
                }}
              >
                <div className="errorMessage">{this.state.errors}</div>
                <div className="incomeInputCont">
                  <div style={{ margin: "1rem" }}>
                    Add Your Income For This Month
                  </div>
                  <input
                    ref={(elem) => (this.incomeInput = elem)}
                    className="incomeInput"
                    step="0.01"
                    type="number"
                    onChange={this.inputValueSetter("Income")}
                    placeholder="$"
                    value={this.state.incomeInputValue}
                  ></input>
                </div>
                <div className="addYourSpendings">
                  <div style={{ margin: "1rem" }}>Add Your Spendings</div>
                </div>
                {this.state.inputDoubleValue.map((value, index) => {
                  return (
                    <React.Fragment>
                      <div key={index} className="dataAddCont">
                        {index !== 0 ? (
                          <div
                            onClick={() => {
                              this.deleteEntireDataEntry(index);
                            }}
                            className="deleteDataEntry"
                          >
                            <img
                              alt="Minus"
                              height="100%"
                              width="100%"
                              src={Minus}
                            ></img>
                          </div>
                        ) : null}
                        <div className="dataAddNameCont">
                          Name
                          <input
                            value={this.state.inputValues[index].name}
                            onChange={this.inputValueSetter("name", index)}
                            className="dataAddNameInput"
                            ref={(elem) =>
                              (this[`dataAddNameInput${index}`] = elem)
                            }
                          ></input>
                        </div>
                        <div
                          className="dataAddNameCont dataAddValueCont"
                          ref={(elem) => {
                            if (index === 0) {
                              this.dataAddValueContWidthSetter(elem, index);
                            }
                          }}
                        >
                          Spent
                          <input
                            ref={(elem) =>
                              (this[`dataAddValueInput${index}`] = elem)
                            }
                            style={{
                              Width: "100%",
                              maxWidth: this.state.inputDoubleValue[index]
                                ? this.state.dataAddValueContWidth / 2 + "px"
                                : null,
                            }}
                            value={this.state.inputValues[index].value1}
                            onChange={this.inputValueSetter("value1", index)}
                            step="0.01"
                            type="number"
                            placeholder="$"
                            className="dataAddNameInput dataAddValueInput "
                          ></input>
                          {this.state.inputDoubleValue[index] ? (
                            <input
                              ref={(elem) =>
                                (this[`dataAddValueInputSecond${index}`] = elem)
                              }
                              style={{
                                Width: "100%",
                                maxWidth:
                                  this.state.dataAddValueContWidth / 2 + "px",
                              }}
                              value={this.state.inputValues[index].value2}
                              onChange={this.inputValueSetter("value2", index)}
                              step="0.01"
                              type="number"
                              placeholder="$"
                              className="dataAddNameInput dataAddValueInput "
                            ></input>
                          ) : null}
                          <div
                            className="addAnotherValue"
                            onClick={() => {
                              this.twoValuesSetter(index);
                            }}
                          >
                            <img
                              alt=""
                              src={
                                this.state.inputDoubleValue[index]
                                  ? Minus
                                  : Plus
                              }
                              height="100%"
                            ></img>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div
                  className="addAnotherMonthData"
                  onClick={this.addAnotherDataEntry}
                >
                  <img
                    alt="AddAnother"
                    src={PlusData}
                    height="40px"
                    width="40px"
                  ></img>
                </div>
                <div className="submit">
                  <button
                    onClick={this.submitData}
                    className="submitButton"
                    placeholder="Submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ) : (
          <div className="youNeedToSignIn">
            You need To be Signed In to view this page
          </div>
        )}
      </div>
    );
  }
}
