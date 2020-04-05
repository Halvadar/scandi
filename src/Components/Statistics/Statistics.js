import React, { Component } from "react";
import "./Statistics.scss";
import statistics from "../Navbar/statistics.svg";
import Arrow from "./Arrow.svg";
import { StatisticsData } from "../../Data";
import { DiagramFunc, DiagramInfoOnClick, MonthDataSetter } from "./Functions";
import Plus from "./Plus.svg";
import Minus from "./minus.svg";
import PlusData from "./PlusData.svg";

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
      CanvasHeightWidth: [200, 300],
      TwoValues: [false],
      DataAddValueContWidth: undefined,
      DataEntryAmount: 1,
    };
    this.DiagramFunc = DiagramFunc.bind(this);
    this.DiagramInfoOnClick = DiagramInfoOnClick.bind(this);
    this.MonthDataSetter = MonthDataSetter.bind(this);
  }
  componentDidUpdate() {}
  componentDidMount() {
    if (window.screen.height > 500) {
      this.setState({ CanvasHeightWidth: [300, 450] });
    }

    if (this.props.LoggedIn) {
      this.DiagramFunc(this.props.Statistics[0], window);
    }
  }
  AddAnotherDataEntry = () => {
    let NewState = [...this.state.TwoValues];
    NewState.push(false);
    console.log(NewState);
    this.setState({
      DataEntryAmount: this.state.DataEntryAmount + 1,
      TwoValues: NewState,
    });
  };
  TwoValuesSetter = (ind) => {
    let NewState = [...this.state.TwoValues];
    NewState[ind] = !NewState[ind];
    this.setState({ TwoValues: NewState });
  };
  DataAddValueContWidthSetter = (a, b) => {
    if (!this.DataAddValueCont) {
      this.DataAddValueCont = a;
    }

    let DataAddValueContWidth;
    if (this.DataAddValueCont && !this.state.DataAddValueContWidth) {
      DataAddValueContWidth = window
        .getComputedStyle(this.DataAddValueCont)
        .getPropertyValue("width");
      this.setState({
        DataAddValueContWidth: DataAddValueContWidth.slice(
          0,
          DataAddValueContWidth.length - 2
        ),
      });
    }
  };
  SubmitData = async () => {
    if (this.IncomeInput.value.length > 0 && this["DataAddNameInput0"].value) {
      let CurrentStatistics = [...this.props.Statistics];
      CurrentStatistics = CurrentStatistics.map((a) => {
        if (a.month === this.state.CurrentMonth.month) {
          let NewData = { ...a };
          NewData.income = this["IncomeInput"].value;

          this.state.TwoValues.forEach((e, r) => {
            if (this[`DataAddValueInputSecond${r}`]) {
              NewData.data.push({
                name: this[`DataAddNameInput${r}`].value,
                data: [
                  parseFloat(this[`DataAddValueInput${r}`].value),
                  parseFloat(this[`DataAddValueInputSecond${r}`].value),
                ],
              });
            } else {
              NewData.data.push({
                name: this[`DataAddNameInput${r}`].value,
                data: [parseFloat(this[`DataAddValueInput${r}`].value)],
              });
            }
          });
          return NewData;
        } else {
          return a;
        }
      });
      await this.props.SetStatistics(CurrentStatistics);

      let NewAccounts = this.props.LocalStorageParsed.map((a) => {
        console.log(a.Login, this.props.UserName);
        if (a.Login === this.props.UserName) {
          console.log("Accounts Cahnged");
          let NewUser = { ...a };
          NewUser.Statistics = CurrentStatistics;
          return NewUser;
        } else {
          return a;
        }
      });
      window.localStorage.setItem("Accounts", JSON.stringify(NewAccounts));
      await this.setState({
        CurrentMonth: CurrentStatistics.find((a) => {
          if (a.month === this.state.CurrentMonth.month) {
            return a;
          }
        }),
      });
      this.DiagramFunc(this.state.CurrentMonth, window);
    }
  };
  render() {
    let CurrentData = this.state.CurrentData && [
      this.state.CurrentData.data.reduce((a, b) => a + b, 0),
      this.state.CurrentData.name,
    ];
    let TotalSpent = 0;
    let Balance;
    this.state.CurrentMonth &&
      this.state.CurrentMonth.data.forEach((a) => {
        a.data.forEach((b) => {
          TotalSpent = TotalSpent + b;
        });
      });
    Balance =
      this.state.CurrentMonth && this.state.CurrentMonth.income - TotalSpent;
    let DataEntryAmount = [];
    let i;
    for (i = 0; i < this.state.DataEntryAmount; i++) {
      DataEntryAmount.push(0);
    }

    return (
      <div className="Statistic">
        <div className="GoBack_LogoCont">
          <img src={Arrow} alt="GoBack" className="GoBack"></img>
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
                        ref={(t) => (this[a] = t)}
                        style={{
                          background:
                            this.state.CurrentMonth.month === a ? "gray" : null,
                        }}
                        onClick={() =>
                          this.DiagramFunc(this.props.Statistics[b], window)
                        }
                        className="Month"
                      >
                        {a}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            {this.state.CurrentMonth &&
            this.state.CurrentMonth.data.length > 0 ? (
              <React.Fragment>
                <div className="ChangeDataEntries">
                  <button onClick className="ChangeDataEntriesButton">
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
                      ${this.state.CurrentMonth && Balance}
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
                    {this.state.CurrentMonth && this.state.CurrentMonth.income}
                  </div>
                  <div className="Expense">
                    -${this.state.CurrentMonth && TotalSpent}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <div className="AddData">
                <div className="IncomeInputCont">
                  <div style={{ margin: "1rem" }}>
                    Add Your Income For This Month
                  </div>
                  <input
                    ref={(a) => (this.IncomeInput = a)}
                    className="IncomeInput"
                    type="number"
                    placeholder="$"
                  ></input>
                </div>
                {DataEntryAmount.map((a, b) => {
                  return (
                    <React.Fragment>
                      <div className="DataAddCont">
                        <div className="DataAddNameCont">
                          Name
                          <input
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
                  <img src={PlusData} height="40px" width="40px"></img>
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
