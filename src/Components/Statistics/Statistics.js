import React, { Component } from "react";
import "./Statistics.scss";
import statistics from "../Navbar/statistics.svg";
import Arrow from "./Arrow.svg";
import Chart from "chart.js";
let data = [
  { name: "Food", data: [230, 50] },
  { name: "Internet", data: [150, 70] },
  { name: "Clothe", data: [200, 60] },
  { name: "Other", data: [200, 70] }
];
let dataSum = 0;
data.forEach(a => {
  dataSum = dataSum + a.data[0] + a.data[1];
});

export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      ChartXYPositions: []
    };
  }

  componentDidMount() {
    let DiagramComputedStyle = window.getComputedStyle(this.Diagram);
    let DiagramWidth = parseInt(
      DiagramComputedStyle.getPropertyValue("width").slice(
        0,
        DiagramComputedStyle.getPropertyValue("width").length
      )
    );
    let DiagramHeight = parseInt(
      DiagramComputedStyle.getPropertyValue("height").slice(
        0,
        DiagramComputedStyle.getPropertyValue("height").length
      )
    );

    let DiagramCanvas = this.Diagram.getContext("2d");
    DiagramCanvas.globalCompositeOperation = "destination-over";
    DiagramCanvas.beginPath();
    DiagramCanvas.arc(DiagramWidth / 2, DiagramHeight / 2, 50, 0, 2 * Math.PI);

    DiagramCanvas.fillStyle = "#161823";
    DiagramCanvas.fill();
    let DegreeCalculator = 0;

    let SectorMaker = (radius, value) => {
      console.log(value.data[0]);
      DiagramCanvas.beginPath();
      DiagramCanvas.moveTo(DiagramWidth / 2, DiagramHeight / 2);
      DiagramCanvas.arc(
        DiagramWidth / 2,
        DiagramHeight / 2,
        radius,
        DegreeCalculator,
        DegreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum
      );

      let RandomNumber = Math.random();
      let ColorNumber = arg => {
        return (
          "hsl(" +
          360 * RandomNumber * arg +
          "," +
          (25 + 70 * RandomNumber) +
          "%," +
          (50 + 10 * RandomNumber * arg) +
          "%)"
        );
      };

      let LineagGradStartEndSetter = (Degree, index) => {
        let LinearGradYStart =
          100 -
          Math.sin(Degree + (value.data[index] * 2 * Math.PI) / dataSum) * -90;
        let LinearGradXStart =
          150 +
          Math.cos(Degree + (value.data[index] * 2 * Math.PI) / dataSum) * 90;
        let LinearGradYEnd =
          100 -
          Math.sin(Degree + (value.data[index] * Math.PI) / dataSum) * -90;
        let LinearGradXEnd =
          150 + Math.cos(Degree + (value.data[index] * Math.PI) / dataSum) * 90;
        if (index === 0) {
          this.setState(state => {
            console.log(state.ChartXYPositions.push);
            let newstate = state.ChartXYPositions;
            return {
              ChartXYPositions: newstate
            };
          });
        }

        return [
          LinearGradXStart,
          LinearGradYStart,
          LinearGradXEnd,
          LinearGradYEnd
        ];
      };

      var grd = DiagramCanvas.createLinearGradient(
        ...LineagGradStartEndSetter(DegreeCalculator, 0)
      );

      grd.addColorStop(0, ColorNumber(1));
      grd.addColorStop(1, ColorNumber(0.8));
      DiagramCanvas.fillStyle = grd;
      DiagramCanvas.fill();
      DegreeCalculator =
        DegreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum;
      DiagramCanvas.beginPath();
      DiagramCanvas.moveTo(DiagramWidth / 2, DiagramHeight / 2);
      DiagramCanvas.arc(
        DiagramWidth / 2,
        DiagramHeight / 2,
        radius,
        DegreeCalculator,
        DegreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum
      );

      var grd1 = DiagramCanvas.createLinearGradient(
        ...LineagGradStartEndSetter(DegreeCalculator, 1)
      );
      grd1.addColorStop(0, ColorNumber(1));
      grd1.addColorStop(1, ColorNumber(1));
      DiagramCanvas.fillStyle = grd1;
      DiagramCanvas.fill();
      DegreeCalculator =
        DegreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum;
    };
    data.forEach((a, b) => {
      if ((b + 1) % 2 == 0) {
        SectorMaker(90, a);
      } else {
        SectorMaker(70, a);
      }
    });
  }
  render() {
    return (
      <div className="Statistic">
        <div className="GoBack_LogoCont">
          <img src={Arrow} className="GoBack"></img>
          <div className="Logo">
            <div>Statistics</div>
            <img src={statistics} className="LogoImg"></img>
          </div>
        </div>
        <div className="MonthsContainer">
          <div className="Months">
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
              "December"
            ].map(a => {
              return <div className="Month">{a}</div>;
            })}
          </div>
        </div>
        <div className="Chart" style={{ position: "relative" }}>
          <canvas
            height="200px"
            width="300px"
            ref={a => (this.Diagram = a)}
            className="Diagram"
          ></canvas>
          {this.state.ChartXYPositions.length > 0
            ? this.State.ChartXYPositions.map((val, ind) => {
                return <div className="DiagramClickInfo"></div>;
              })
            : null}
        </div>
      </div>
    );
  }
}
