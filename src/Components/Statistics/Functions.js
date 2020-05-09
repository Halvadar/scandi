export const DiagramFunc = async function (Month, wind) {
  await this.setState({
    CurrentMonth: Month,
    ChartXYPositions: [],
    InfoIndex: [],
    CurrentData: null,
    EditMode: false,
    DataEntryAmount: 1,
    TwoValues: [false],
    IncomeInputValue: Month.income ? Month.income : "",
    InputValues:
      Month.data.length > 0
        ? Month.data.map((DataItem, index) => {
            return {
              name: DataItem.name,
              value1: DataItem.data[0],
              value2: DataItem.data[1] ? DataItem.data[1] : "",
            };
          })
        : [{ name: "", value1: "", value2: "" }],
  });

  await scroller.call(this, Month);
  if (this.state.CurrentMonth.data.length === 0) {
    return;
  }

  const data = Month.data;
  const DataSum = data.reduce(
    (Sum, DataItem) => Sum + DataItem.data.reduce((Sum, Value) => Sum + Value),
    0
  );

  const DiagramComputedStyle = wind.getComputedStyle(this.Diagram);
  const DiagramWidth = parseInt(
    DiagramComputedStyle.getPropertyValue("width").slice(
      0,
      DiagramComputedStyle.getPropertyValue("width").length
    )
  );
  const DiagramHeight = parseInt(
    DiagramComputedStyle.getPropertyValue("height").slice(
      0,
      DiagramComputedStyle.getPropertyValue("height").length
    )
  );

  const DiagramCanvas = await this.Diagram.getContext("2d");

  await DiagramCanvas.clearRect(0, 0, DiagramWidth, DiagramHeight);
  DiagramCanvas.globalCompositeOperation = "destination-over";
  await DiagramCanvas.beginPath();
  await DiagramCanvas.arc(
    DiagramWidth / 2,
    DiagramHeight / 2,
    wind.screen.width > 500 ? 90 : 50,
    0,
    2 * Math.PI
  );

  DiagramCanvas.fillStyle = "#161823";
  await DiagramCanvas.fill();
  const DegreeCalculator = 0;
  const Arguments = {
    DiagramHeight,
    DiagramWidth,
    DataSum,
    DiagramCanvas,
    DegreeCalculator,
    data,
    wind,
  };

  wind.screen.width > 500
    ? await SectorMaker.call(this, 130, data[0], 0, Arguments)
    : await SectorMaker.call(this, 90, data[0], 0, Arguments);
};

export const DiagramInfoOnClick = function (StatisticsInfoIndex, data) {
  return () => {
    const NewArray = this.state.InfoIndex.map((a, b) => {
      if (b === StatisticsInfoIndex) {
        return "white";
      } else {
        return null;
      }
    });

    this.setState({
      InfoIndex: NewArray,
      CurrentData: data[StatisticsInfoIndex],
    });
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
    const CurrentStatistics = this.props.Statistics.map((MonthStatistics) => {
      if (MonthStatistics.month === this.state.CurrentMonth.month) {
        const NewDataData = this.state.TwoValues.filter((item, index) => {
          if (
            this[`DataAddValueInput${index}`].value.length > 0 &&
            this[`DataAddNameInput${index}`].value.length > 0
          ) {
            return true;
          }
          return false;
        }).map((e, r) => {
          if (this[`DataAddValueInputSecond${r}`]) {
            if (this[`DataAddValueInputSecond${r}`].value.length > 0) {
              return {
                name: this[`DataAddNameInput${r}`].value,
                data: [
                  parseFloat(this[`DataAddValueInput${r}`].value),
                  parseFloat(this[`DataAddValueInputSecond${r}`].value),
                ],
              };
            } else {
              return {
                name: this[`DataAddNameInput${r}`].value,
                data: [parseFloat(this[`DataAddValueInput${r}`].value)],
              };
            }
          } else {
            return {
              name: this[`DataAddNameInput${r}`].value,
              data: [parseFloat(this[`DataAddValueInput${r}`].value)],
            };
          }
        });
        const NewData = {
          ...MonthStatistics,
          income: parseFloat(this["IncomeInput"].value),
          data: NewDataData,
        };
        return NewData;
      } else {
        return MonthStatistics;
      }
    });
    await this.props.SetStatistics(CurrentStatistics);

    const NewAccounts = this.props.LocalStorageParsed.map((Account) => {
      if (Account.Login === this.props.UserName) {
        const NewUser = { ...Account, Statistics: CurrentStatistics };

        return NewUser;
      } else {
        return Account;
      }
    });
    window.localStorage.setItem("Accounts", JSON.stringify(NewAccounts));
    await this.setState({
      CurrentMonth: CurrentStatistics.find(
        (MonthStatistics) =>
          MonthStatistics.month === this.state.CurrentMonth.month
      ),
      EditMode: false,
    });

    this.DiagramFunc(this.state.CurrentMonth, window);
  } else {
    this.setState({ Errors: "Please Fill All Necessary Inputs" });
    window.scrollTo(0, 0);
  }
};
export const AddAnotherDataEntry = function () {
  const NewState = [...this.state.TwoValues, false];

  this.setState({
    DataEntryAmount: this.state.DataEntryAmount + 1,
    TwoValues: NewState,
    InputValues: [
      ...this.state.InputValues,
      { name: "", value1: "", value2: "" },
    ],
  });
};
export const TwoValuesSetter = function (Index) {
  const NewState = [...this.state.TwoValues];
  NewState[Index] = !NewState[Index];
  this.setState({ TwoValues: NewState });
};
export const DataAddValueContWidthSetter = function (Value) {
  if (!this.DataAddValueCont) {
    this.DataAddValueCont = Value;
  }

  if (this.DataAddValueCont && !this.state.DataAddValueContWidth) {
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
};

export const ChangeCurrentMonthData = async function () {
  const TwoValuesCopy = this.state.CurrentMonth.data.map((DataObject) => {
    if (DataObject.data.length === 1) {
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
export const DeleteEntireDataEntry = function (EntryIndex) {
  const TwoValuesCopy = this.state.TwoValues.filter(
    (val, Index) => Index !== EntryIndex
  );
  const InputValuesCopy = this.state.InputValues.filter(
    (val, Index) => Index !== EntryIndex
  );

  const CurrentMonthCopy = {
    ...this.state.CurrentMonth,
    data: this.state.CurrentMonth.data.filter(
      (val, Index) => Index !== EntryIndex
    ),
  };

  this.setState({
    DataEntryAmount: this.state.DataEntryAmount - 1,
    TwoValues: TwoValuesCopy,
    CurrentMonth: CurrentMonthCopy,
    InputValues: InputValuesCopy,
  });
};
export const IncomeInfoClass = class {
  constructor(that, TotalSpent) {
    this.Balance = that.state.CurrentMonth.income - TotalSpent;
    this.BalanceFloored =
      this.Balance > 0 ? Math.floor(this.Balance) : Math.ceil(this.Balance);
    this.DecimalPart = (this.Balance > 0
      ? this.Balance - this.BalanceFloored
      : this.BalanceFloored - this.Balance
    )
      .toFixed(2)
      .toString()
      .slice(2, 4);
    this.IncomeFloored =
      that.state.CurrentMonth.income > 0
        ? Math.floor(that.state.CurrentMonth.income)
        : Math.ceil(that.state.CurrentMonth.income);
    this.IncomeDecimal = (that.state.CurrentMonth.income > 0
      ? that.state.CurrentMonth.income - this.IncomeFloored
      : this.IncomeFloored - that.state.CurrentMonth.income
    )
      .toFixed(2)
      .toString()
      .slice(2, 4);
    this.ExpenseFloored = Math.floor(TotalSpent);
    this.ExpenseDecimal = (TotalSpent - this.ExpenseFloored)
      .toFixed(2)
      .toString()
      .slice(2, 4);
  }
};
const scroller = async function (Month) {
  const ElementDistanceFromLeft = this[Month.month];
  const ElementWidthComputed = window
    .getComputedStyle(ElementDistanceFromLeft)
    .getPropertyValue("width");

  const ElementWidth = ElementWidthComputed.slice(
    0,
    ElementWidthComputed.length - 2
  );
  const MonthsContainerWidthComputed = window
    .getComputedStyle(this.Months)
    .getPropertyValue("width");
  const MonthsContainerWidth = MonthsContainerWidthComputed.slice(
    0,
    MonthsContainerWidthComputed.length - 2
  );
  const MonthsScrollBarWidthComputed = window
    .getComputedStyle(this.MonthsScrollBar)
    .getPropertyValue("width");
  const MonthsScrollBarWidth = MonthsScrollBarWidthComputed.slice(
    0,
    MonthsScrollBarWidthComputed.length - 2
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
const SectorMaker = async function (
  radius,
  value,
  Ind,
  {
    DiagramHeight,
    DiagramWidth,
    DataSum,
    DiagramCanvas,
    DegreeCalculator,
    data,
    wind,
  }
) {
  this.setState((PrevState) => {
    return { InfoIndex: [...PrevState.InfoIndex, null] };
  });
  const LineagGradStartEndSetter = async (Degree, index) => {
    const LinearGradYStart = DiagramHeight / 2 - Math.sin(Degree) * -radius;

    const LinearGradXStart = DiagramWidth / 2 + Math.cos(Degree) * radius;
    const LinearGradXEnd =
      value.data.length > 1
        ? DiagramWidth / 2 +
          Math.cos(Degree + (value.data[index] * 2 * Math.PI) / DataSum) *
            radius
        : DiagramWidth / 2 +
          Math.cos(Degree + (value.data[0] * Math.PI) / DataSum) * radius;
    const LinearGradYEnd =
      value.data.length > 1
        ? DiagramHeight / 2 -
          Math.sin(Degree + (value.data[index] * 2 * Math.PI) / DataSum) *
            -radius
        : DiagramHeight / 2 -
          Math.sin(Degree + (value.data[0] * Math.PI) / DataSum) * -radius;

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

    return [LinearGradXStart, LinearGradYStart, LinearGradXEnd, LinearGradYEnd];
  };

  const RandomNumber = Math.random();
  const ColorNumber = (arg) => {
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
    DegreeCalculator + (value.data[0] * 2 * Math.PI) / DataSum
  );
  const LinearStats = await LineagGradStartEndSetter(DegreeCalculator, 0);

  const grd = DiagramCanvas.createLinearGradient(...LinearStats);

  await grd.addColorStop(0, ColorNumber(1));
  await grd.addColorStop(1, ColorNumber(0.8));
  DiagramCanvas.fillStyle = grd;
  await DiagramCanvas.fill();
  DegreeCalculator = DegreeCalculator + (value.data[0] * 2 * Math.PI) / DataSum;

  if (value.data.length > 1) {
    await DiagramCanvas.beginPath();
    await DiagramCanvas.moveTo(DiagramWidth / 2, DiagramHeight / 2);
    await DiagramCanvas.arc(
      DiagramWidth / 2,
      DiagramHeight / 2,
      radius,
      DegreeCalculator,
      DegreeCalculator + (value.data[1] * 2 * Math.PI) / DataSum
    );
    const LinearStats1 = await LineagGradStartEndSetter(DegreeCalculator, 1);

    const grd1 = DiagramCanvas.createLinearGradient(...LinearStats1);
    grd1.addColorStop(0, ColorNumber(0.8));
    grd1.addColorStop(1, ColorNumber(1));
    DiagramCanvas.fillStyle = grd1;
    await DiagramCanvas.fill();
    DegreeCalculator =
      DegreeCalculator + (value.data[1] * 2 * Math.PI) / DataSum;
  }
  const PassingArguments = {
    DiagramHeight,
    DiagramWidth,
    DataSum,
    DiagramCanvas,
    DegreeCalculator,
    data,
    wind,
  };
  if (Ind < data.length - 1) {
    return (Ind + 1) % 2 === 0
      ? wind.screen.width > 500
        ? await SectorMaker.call(
            this,
            130,
            data[Ind + 1],
            Ind + 1,
            PassingArguments
          )
        : await SectorMaker.call(
            this,
            90,
            data[Ind + 1],
            Ind + 1,
            PassingArguments
          )
      : wind.screen.width > 500
      ? await SectorMaker.call(
          this,
          120,
          data[Ind + 1],
          Ind + 1,
          PassingArguments
        )
      : await SectorMaker.call(
          this,
          80,
          data[Ind + 1],
          Ind + 1,
          PassingArguments
        );
  }
  return;
};
