export const DiagramFunc = async function (Month, wind) {
  await this.setState({
    CurrentMonth: Month,
    ChartXYPositions: [],
    InfoIndex: [],
    CurrentData: null,
    EditMode: false,
    DataEntryAmount: 1,
    TwoValues: [false],
  });
  console.log("Month", Month);

  let scroller = async () => {
    let ElementDistanceFromLeft = this[Month.month];
    let ElementWidth = window
      .getComputedStyle(ElementDistanceFromLeft)
      .getPropertyValue("width");
    ElementWidth = ElementWidth.slice(0, ElementWidth.length - 2);
    let MonthsContainerWidth = window
      .getComputedStyle(this.Months)
      .getPropertyValue("width");
    MonthsContainerWidth = MonthsContainerWidth.slice(
      0,
      MonthsContainerWidth.length - 2
    );
    let MonthsScrollBarWidth = window
      .getComputedStyle(this.MonthsScrollBar)
      .getPropertyValue("width");
    MonthsScrollBarWidth = MonthsScrollBarWidth.slice(
      0,
      MonthsScrollBarWidth.length - 2
    );

    if (
      ElementDistanceFromLeft.offsetLeft <
        MonthsContainerWidth - MonthsScrollBarWidth / 2 ||
      ElementDistanceFromLeft.offsetRight <
        MonthsContainerWidth - MonthsScrollBarWidth / 2
    ) {
      this.MonthsScrollBar.scrollLeft =
        ElementDistanceFromLeft.offsetLeft -
        MonthsScrollBarWidth / 2 +
        ElementWidth / 2;
    }
  };
  await scroller();
  if (this.state.CurrentMonth.data.length === 0) {
    return;
  }
  let dataSum = 0;
  let data = Month.data;
  data.forEach((a) => {
    a.data.forEach((b) => {
      dataSum = dataSum + b;
    });
  });

  let DiagramComputedStyle = wind.getComputedStyle(this.Diagram);
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

  let DiagramCanvas = await this.Diagram.getContext("2d");

  await DiagramCanvas.clearRect(0, 0, DiagramWidth, DiagramHeight);
  DiagramCanvas.globalCompositeOperation = "destination-over";
  await DiagramCanvas.beginPath();
  await DiagramCanvas.arc(
    DiagramWidth / 2,
    DiagramHeight / 2,
    wind.screen.height > 500 ? 90 : 50,
    0,
    2 * Math.PI
  );

  DiagramCanvas.fillStyle = "#161823";
  await DiagramCanvas.fill();
  let DegreeCalculator = 0;

  let SectorMaker = async (radius, value) => {
    this.setState((PrevState) => {
      return { InfoIndex: [...PrevState.InfoIndex, null] };
    });
    let LineagGradStartEndSetter = async (Degree, index) => {
      let LinearGradYStart = DiagramHeight / 2 - Math.sin(Degree) * -radius;

      let LinearGradXStart = DiagramWidth / 2 + Math.cos(Degree) * radius;
      let LinearGradXEnd;
      let LinearGradYEnd;
      if (value.data.length > 1) {
        LinearGradXEnd =
          DiagramWidth / 2 +
          Math.cos(Degree + (value.data[index] * 2 * Math.PI) / dataSum) *
            radius;
        LinearGradYEnd =
          DiagramHeight / 2 -
          Math.sin(Degree + (value.data[index] * 2 * Math.PI) / dataSum) *
            -radius;
      } else {
        LinearGradXEnd =
          DiagramWidth / 2 +
          Math.cos(Degree + (value.data[0] * Math.PI) / dataSum) * radius;
        LinearGradYEnd =
          DiagramHeight / 2 -
          Math.sin(Degree + (value.data[0] * Math.PI) / dataSum) * -radius;
      }

      if (index === 0) {
        await this.setState((prevstate, props) => {
          return {
            ChartXYPositions: [
              ...prevstate.ChartXYPositions,
              {
                LinearGradXEnd,
                LinearGradYEnd,
              },
            ],
          };
        });
      }

      return [
        LinearGradXStart,
        LinearGradYStart,
        LinearGradXEnd,
        LinearGradYEnd,
      ];
    };

    let RandomNumber = Math.random();
    let ColorNumber = (arg) => {
      return (
        "hsl(" +
        360 * RandomNumber * arg +
        "," +
        (70 + 25 * RandomNumber) +
        "%," +
        (50 + 10 * RandomNumber * arg) +
        "%)"
      );
    };

    await DiagramCanvas.beginPath();
    await DiagramCanvas.moveTo(DiagramWidth / 2, DiagramHeight / 2);
    await DiagramCanvas.arc(
      DiagramWidth / 2,
      DiagramHeight / 2,
      radius,
      DegreeCalculator,
      DegreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum
    );
    let LinearStats = await LineagGradStartEndSetter(DegreeCalculator, 0);

    var grd = DiagramCanvas.createLinearGradient(...LinearStats);

    await grd.addColorStop(0, ColorNumber(1));
    await grd.addColorStop(1, ColorNumber(0.8));
    DiagramCanvas.fillStyle = grd;
    await DiagramCanvas.fill();
    DegreeCalculator =
      DegreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum;

    if (value.data.length > 1) {
      await DiagramCanvas.beginPath();
      await DiagramCanvas.moveTo(DiagramWidth / 2, DiagramHeight / 2);
      await DiagramCanvas.arc(
        DiagramWidth / 2,
        DiagramHeight / 2,
        radius,
        DegreeCalculator,
        DegreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum
      );
      let LinearStats1 = await LineagGradStartEndSetter(DegreeCalculator, 1);

      var grd1 = DiagramCanvas.createLinearGradient(...LinearStats1);
      grd1.addColorStop(0, ColorNumber(0.8));
      grd1.addColorStop(1, ColorNumber(1));
      DiagramCanvas.fillStyle = grd1;
      await DiagramCanvas.fill();
      DegreeCalculator =
        DegreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum;
    }
  };
  let t;
  for (t = 0; t < data.length; t++) {
    if ((t + 1) % 2 === 0) {
      if (wind.screen.height > 500) {
        await SectorMaker(130, data[t]);
      } else {
        await SectorMaker(90, data[t]);
      }
    } else {
      if (wind.screen.height > 500) {
        await SectorMaker(120, data[t]);
      } else {
        await SectorMaker(80, data[t]);
      }
    }
  }
};
export const DiagramInfoOnClick = function (arg, data) {
  return () => {
    let NewArray = [...this.state.InfoIndex];
    NewArray = NewArray.map((a, b) => {
      if (b === arg) {
        return "white";
      } else {
        return null;
      }
    });
    this.setState({ InfoIndex: NewArray, CurrentData: data[arg] });
  };
};

export const SubmitData = async function () {
  if (
    this.IncomeInput.value.length > 0 &&
    this["DataAddNameInput0"] &&
    this["DataAddNameInput0"].value.length > 0 &&
    this["DataAddValueInput0"] &&
    this["DataAddValueInput0"].value.length > 0
  ) {
    await this.setState({ Errors: "" });
    let CurrentStatistics = [...this.props.Statistics];
    CurrentStatistics = CurrentStatistics.map((a) => {
      if (a.month === this.state.CurrentMonth.month) {
        let NewData = { ...a };
        NewData.income = parseFloat(this["IncomeInput"].value);
        NewData.data = [];
        this.state.TwoValues.forEach((e, r) => {
          if (
            this[`DataAddValueInput${r}`].value.length > 0 &&
            this[`DataAddNameInput${r}`].value.length > 0
          ) {
            if (this[`DataAddValueInputSecond${r}`]) {
              if (this[`DataAddValueInputSecond${r}`].value.length > 0) {
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
            } else {
              NewData.data.push({
                name: this[`DataAddNameInput${r}`].value,
                data: [parseFloat(this[`DataAddValueInput${r}`].value)],
              });
            }
          }
        });
        return NewData;
      } else {
        return a;
      }
    });
    await this.props.SetStatistics(CurrentStatistics);

    let NewAccounts = this.props.LocalStorageParsed.map((a) => {
      if (a.Login === this.props.UserName) {
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
      EditMode: false,
    });

    this.DiagramFunc(this.state.CurrentMonth, window);
  } else {
    this.setState({ Errors: "Please Fill All Necessary Inputs" });
    window.scrollTo(0, 0);
  }
};
export const AddAnotherDataEntry = function () {
  let NewState = [...this.state.TwoValues];
  NewState.push(false);

  this.setState({
    DataEntryAmount: this.state.DataEntryAmount + 1,
    TwoValues: NewState,
  });
};
export const TwoValuesSetter = function (ind) {
  let NewState = [...this.state.TwoValues];
  NewState[ind] = !NewState[ind];
  this.setState({ TwoValues: NewState });
};
export const DataAddValueContWidthSetter = function (a, b) {
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

export const ChangeCurrentMonthData = async function () {
  let TwoValuesCopy = this.state.CurrentMonth.data.map((a) => {
    if (a.data.length === 1) {
      return false;
    } else {
      return true;
    }
  });

  await this.setState({
    ChartXYPositions: [],
    InfoIndex: [],
    CurrentData: null,
    EditMode: true,
    DataEntryAmount: this.state.CurrentMonth.data.length,
    TwoValues: TwoValuesCopy,
  });
};
export const DeleteEntireDataEntry = function (b) {
  let TwoValuesCopy = [...this.state.TwoValues];
  TwoValuesCopy.splice(b, 1);
  let CurrentMonthCopy = { ...this.state.CurrentMonth };

  CurrentMonthCopy.data.splice(b, 1);

  this.setState({
    DataEntryAmount: this.state.DataEntryAmount - 1,
    TwoValues: TwoValuesCopy,
    CurrentMonth: CurrentMonthCopy,
  });
};
