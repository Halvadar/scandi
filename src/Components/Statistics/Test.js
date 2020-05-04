import React, { Component } from "react";
import Plus from "./Plus.svg";
import Minus from "./minus.svg";

export default class Test extends Component {
  constructor() {
    super();
    this.state = {
      TwoValues: false,
      DataAddValueContWidth: undefined,
    };
  }
  componentDidMount() {
    const DataAddValueContWidth = window
      .getComputedStyle(this.DataAddValueCont)
      .getPropertyValue("width");
    this.setState({
      DataAddValueContWidth: DataAddValueContWidth.slice(
        0,
        DataAddValueContWidth.length - 2
      ),
    });
  }
  TwoValuesSetter = () => {
    this.setState({ TwoValues: !this.state.TwoValues });
  };
  render() {
    return (
      <div className="Statistic">
        <div className="AddData">
          <div className="IncomeInputCont">
            <div style={{ margin: "1rem" }}>Add Your Income For This Month</div>
            <input
              className="IncomeInput"
              type="number"
              placeholder="$"
            ></input>
          </div>
          <div className="DataAddCont">
            <div className="DataAddNameCont">
              Name<input className="DataAddNameInput"></input>
            </div>
            <div
              className="DataAddNameCont DataAddValueCont"
              ref={(a) => {
                this.DataAddValueCont = a;
              }}
            >
              Spent
              <input
                style={{
                  width: this.state.TwoValues
                    ? this.state.DataAddValueContWidth / 2 + "px"
                    : null,
                }}
                type="number"
                placeholder="$"
                className="DataAddNameInput DataAddValueInput "
              ></input>
              {this.state.TwoValues ? (
                <input
                  style={{
                    width: this.state.DataAddValueContWidth / 2 + "px",
                  }}
                  type="number"
                  placeholder="$"
                  className="DataAddNameInput DataAddValueInput "
                ></input>
              ) : null}
              <div className="AddAnotherValue" onClick={this.TwoValuesSetter}>
                <img
                  alt="111"
                  src={this.state.TwoValues ? Minus : Plus}
                  height="100%"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
