export const diagramFunc = async function (month, wind) {
  await this.setState({
    currentMonth: month,
    chartXYPositions: [],
    infoIndex: [],
    currentData: null,
    editMode: false,
    dataEntryAmount: 1,
    inputDoubleValue: [false],
    incomeInputValue: month.income ? month.income : "",
    inputValues:
      month.data.length > 0
        ? month.data.map((dataItem, index) => {
            return {
              name: dataItem.name,
              value1: dataItem.data[0],
              value2: dataItem.data[1] ? dataItem.data[1] : "",
            };
          })
        : [{ name: "", value1: "", value2: "" }],
  });

  await scroller.call(this, month);
  if (this.state.currentMonth.data.length === 0) {
    return;
  }

  const data = month.data;
  const dataSum = data.reduce(
    (sum, dataItem) => sum + dataItem.data.reduce((sum, value) => sum + value),
    0
  );

  const diagramComputedStyle = wind.getComputedStyle(this.diagram);
  const diagramWidth = parseInt(
    diagramComputedStyle
      .getPropertyValue("width")
      .slice(0, diagramComputedStyle.getPropertyValue("width").length)
  );
  const diagramHeight = parseInt(
    diagramComputedStyle
      .getPropertyValue("height")
      .slice(0, diagramComputedStyle.getPropertyValue("height").length)
  );

  const diagramCanvas = await this.diagram.getContext("2d");

  await diagramCanvas.clearRect(0, 0, diagramWidth, diagramHeight);
  diagramCanvas.globalCompositeOperation = "destination-over";
  await diagramCanvas.beginPath();
  await diagramCanvas.arc(
    diagramWidth / 2,
    diagramHeight / 2,
    wind.screen.width > 500 ? 90 : 50,
    0,
    2 * Math.PI
  );

  diagramCanvas.fillStyle = "#161823";
  await diagramCanvas.fill();
  const degreeCalculator = 0;
  const sectorMakerArguments = {
    diagramHeight,
    diagramWidth,
    dataSum,
    diagramCanvas,
    degreeCalculator,
    data,
    wind,
  };

  wind.screen.width > 500
    ? await sectorMaker.call(this, 130, data[0], 0, sectorMakerArguments)
    : await sectorMaker.call(this, 90, data[0], 0, sectorMakerArguments);
};

export const diagramInfoOnClick = function (statisticsInfoIndex, data) {
  return () => {
    const newArray = this.state.infoIndex.map((infoItem, infoIndex) => {
      if (infoIndex === statisticsInfoIndex) {
        return "white";
      } else {
        return null;
      }
    });

    this.setState({
      infoIndex: newArray,
      currentData: data[statisticsInfoIndex],
    });
  };
};

export const submitData = async function () {
  if (
    this.incomeInput.value.length > 0 &&
    this["dataAddNameInput0"] &&
    this["dataAddNameInput0"].value.length > 0 &&
    this["dataAddValueInput0"] &&
    this["dataAddValueInput0"].value.length > 0
  ) {
    await this.setState({ Errors: "" });
    const currentStatistics = this.props.statistics.map((monthStatistics) => {
      if (monthStatistics.month === this.state.currentMonth.month) {
        const newDataData = this.state.inputDoubleValue
          .filter((item, index) => {
            if (
              this[`dataAddValueInput${index}`].value.length > 0 &&
              this[`dataAddNameInput${index}`].value.length > 0
            ) {
              return true;
            }
            return false;
          })
          .map((statItem, statItemIndex) => {
            if (this[`dataAddValueInputSecond${statItemIndex}`]) {
              if (
                this[`dataAddValueInputSecond${statItemIndex}`].value.length > 0
              ) {
                return {
                  name: this[`dataAddNameInput${statItemIndex}`].value,
                  data: [
                    parseFloat(this[`dataAddValueInput${statItemIndex}`].value),
                    parseFloat(
                      this[`dataAddValueInputSecond${statItemIndex}`].value
                    ),
                  ],
                };
              } else {
                return {
                  name: this[`dataAddNameInput${statItemIndex}`].value,
                  data: [
                    parseFloat(this[`dataAddValueInput${statItemIndex}`].value),
                  ],
                };
              }
            } else {
              return {
                name: this[`dataAddNameInput${statItemIndex}`].value,
                data: [
                  parseFloat(this[`dataAddValueInput${statItemIndex}`].value),
                ],
              };
            }
          });
        const newData = {
          ...monthStatistics,
          income: parseFloat(this["incomeInput"].value),
          data: newDataData,
        };
        return newData;
      } else {
        return monthStatistics;
      }
    });
    await this.props.setStatistics(currentStatistics);

    const newAccounts = this.props.localStorageParsed.map((account) => {
      if (account.Login === this.props.userName) {
        const newUser = { ...account, statistics: currentStatistics };

        return newUser;
      } else {
        return account;
      }
    });
    window.localStorage.setItem("accounts", JSON.stringify(newAccounts));
    await this.setState({
      currentMonth: currentStatistics.find(
        (monthStatistics) =>
          monthStatistics.month === this.state.currentMonth.month
      ),
      editMode: false,
    });

    this.diagramFunc(this.state.currentMonth, window);
  } else {
    this.setState({ Errors: "Please Fill All Necessary Inputs" });
    window.scrollTo(0, 0);
  }
};
export const addAnotherDataEntry = function () {
  const newState = [...this.state.inputDoubleValue, false];

  this.setState({
    dataEntryAmount: this.state.dataEntryAmount + 1,
    inputDoubleValue: newState,
    inputValues: [
      ...this.state.inputValues,
      { name: "", value1: "", value2: "" },
    ],
  });
};
export const twoValuesSetter = function (index) {
  const newState = [...this.state.inputDoubleValue];
  newState[index] = !newState[index];
  this.setState({ inputDoubleValue: newState });
};
export const dataAddValueContWidthSetter = function (value) {
  if (!this.dataAddValueCont) {
    this.dataAddValueCont = value;
  }

  if (this.dataAddValueCont && !this.state.dataAddValueContWidth) {
    const dataAddValueContWidth = window
      .getComputedStyle(this.dataAddValueCont)
      .getPropertyValue("width");
    this.setState({
      dataAddValueContWidth: dataAddValueContWidth.slice(
        0,
        dataAddValueContWidth.length - 2
      ),
    });
  }
};

export const changeCurrentMonthData = async function () {
  const twoValuesCopy = this.state.currentMonth.data.map((dataObject) => {
    if (dataObject.data.length === 1) {
      return false;
    } else {
      return true;
    }
  });

  await this.setState({
    chartXYPositions: [],
    infoIndex: [],
    currentData: null,
    editMode: true,
    dataEntryAmount: this.state.currentMonth.data.length,
    inputDoubleValue: twoValuesCopy,
  });
};
export const deleteEntireDataEntry = function (entryIndex) {
  const twoValuesCopy = this.state.inputDoubleValue.filter(
    (val, index) => index !== entryIndex
  );
  const inputValuesCopy = this.state.inputValues.filter(
    (val, index) => index !== entryIndex
  );

  const currentMonthCopy = {
    ...this.state.currentMonth,
    data: this.state.currentMonth.data.filter(
      (val, index) => index !== entryIndex
    ),
  };

  this.setState({
    dataEntryAmount: this.state.dataEntryAmount - 1,
    inputDoubleValue: twoValuesCopy,
    currentMonth: currentMonthCopy,
    inputValues: inputValuesCopy,
  });
};
export const incomeInfoClass = class {
  constructor(that, totalSpent) {
    this.balance = that.state.currentMonth.income - totalSpent;
    this.balanceFloored =
      this.balance > 0 ? Math.floor(this.balance) : Math.ceil(this.balance);
    this.decimalPart = (this.balance > 0
      ? this.balance - this.balanceFloored
      : this.balanceFloored - this.balance
    )
      .toFixed(2)
      .toString()
      .slice(2, 4);
    this.incomeFloored =
      that.state.currentMonth.income > 0
        ? Math.floor(that.state.currentMonth.income)
        : Math.ceil(that.state.currentMonth.income);
    this.incomeDecimal = (that.state.currentMonth.income > 0
      ? that.state.currentMonth.income - this.incomeFloored
      : this.incomeFloored - that.state.currentMonth.income
    )
      .toFixed(2)
      .toString()
      .slice(2, 4);
    this.expenseFloored = Math.floor(totalSpent);
    this.expenseDecimal = (totalSpent - this.expenseFloored)
      .toFixed(2)
      .toString()
      .slice(2, 4);
  }
};
const scroller = async function (month) {
  const elementDistanceFromLeft = this[month.month];
  const elementWidthComputed = window
    .getComputedStyle(elementDistanceFromLeft)
    .getPropertyValue("width");

  const elementWidth = elementWidthComputed.slice(
    0,
    elementWidthComputed.length - 2
  );
  const monthsContainerWidthComputed = window
    .getComputedStyle(this.months)
    .getPropertyValue("width");
  const monthsContainerWidth = monthsContainerWidthComputed.slice(
    0,
    monthsContainerWidthComputed.length - 2
  );
  const monthsScrollBarWidthComputed = window
    .getComputedStyle(this.monthsScrollBar)
    .getPropertyValue("width");
  const monthsScrollBarWidth = monthsScrollBarWidthComputed.slice(
    0,
    monthsScrollBarWidthComputed.length - 2
  );

  if (
    elementDistanceFromLeft.offsetLeft <
      monthsContainerWidth - monthsScrollBarWidth / 2 ||
    elementDistanceFromLeft.offsetRight <
      monthsContainerWidth - monthsScrollBarWidth / 2
  ) {
    this.monthsScrollBar.scrollLeft =
      elementDistanceFromLeft.offsetLeft -
      monthsScrollBarWidth / 2 +
      elementWidth / 2;
  }
};
const sectorMaker = async function (
  radius,
  value,
  ind,
  {
    diagramHeight,
    diagramWidth,
    dataSum,
    diagramCanvas,
    degreeCalculator,
    data,
    wind,
  }
) {
  this.setState((prevState) => {
    return { infoIndex: [...prevState.infoIndex, null] };
  });
  const lineagGradStartEndSetter = async (degree, index) => {
    const linearGradYStart = diagramHeight / 2 - Math.sin(degree) * -radius;

    const linearGradXStart = diagramWidth / 2 + Math.cos(degree) * radius;
    const linearGradXEnd =
      value.data.length > 1
        ? diagramWidth / 2 +
          Math.cos(degree + (value.data[index] * 2 * Math.PI) / dataSum) *
            radius
        : diagramWidth / 2 +
          Math.cos(degree + (value.data[0] * Math.PI) / dataSum) * radius;
    const linearGradYEnd =
      value.data.length > 1
        ? diagramHeight / 2 -
          Math.sin(degree + (value.data[index] * 2 * Math.PI) / dataSum) *
            -radius
        : diagramHeight / 2 -
          Math.sin(degree + (value.data[0] * Math.PI) / dataSum) * -radius;

    if (index === 0) {
      await this.setState((prevstate, props) => {
        return {
          chartXYPositions: [
            ...prevstate.chartXYPositions,
            {
              linearGradXEnd,
              linearGradYEnd,
            },
          ],
        };
      });
    }

    return [linearGradXStart, linearGradYStart, linearGradXEnd, linearGradYEnd];
  };

  const randomNumber = Math.random();
  const colorNumber = (arg) => {
    return (
      "hsl(" +
      360 * randomNumber * arg +
      "," +
      (70 + 25 * randomNumber) +
      "%," +
      (50 + 10 * randomNumber * arg) +
      "%)"
    );
  };

  await diagramCanvas.beginPath();
  await diagramCanvas.moveTo(diagramWidth / 2, diagramHeight / 2);
  await diagramCanvas.arc(
    diagramWidth / 2,
    diagramHeight / 2,
    radius,
    degreeCalculator,
    degreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum
  );
  const linearStats = await lineagGradStartEndSetter(degreeCalculator, 0);

  const grd = diagramCanvas.createLinearGradient(...linearStats);

  await grd.addColorStop(0, colorNumber(1));
  await grd.addColorStop(1, colorNumber(0.8));
  diagramCanvas.fillStyle = grd;
  await diagramCanvas.fill();
  degreeCalculator = degreeCalculator + (value.data[0] * 2 * Math.PI) / dataSum;

  if (value.data.length > 1) {
    await diagramCanvas.beginPath();
    await diagramCanvas.moveTo(diagramWidth / 2, diagramHeight / 2);
    await diagramCanvas.arc(
      diagramWidth / 2,
      diagramHeight / 2,
      radius,
      degreeCalculator,
      degreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum
    );
    const linearStats1 = await lineagGradStartEndSetter(degreeCalculator, 1);

    const grd1 = diagramCanvas.createLinearGradient(...linearStats1);
    grd1.addColorStop(0, colorNumber(0.8));
    grd1.addColorStop(1, colorNumber(1));
    diagramCanvas.fillStyle = grd1;
    await diagramCanvas.fill();
    degreeCalculator =
      degreeCalculator + (value.data[1] * 2 * Math.PI) / dataSum;
  }
  const passingArguments = {
    diagramHeight,
    diagramWidth,
    dataSum,
    diagramCanvas,
    degreeCalculator,
    data,
    wind,
  };
  if (ind < data.length - 1) {
    return (ind + 1) % 2 === 0
      ? wind.screen.width > 500
        ? await sectorMaker.call(
            this,
            130,
            data[ind + 1],
            ind + 1,
            passingArguments
          )
        : await sectorMaker.call(
            this,
            90,
            data[ind + 1],
            ind + 1,
            passingArguments
          )
      : wind.screen.width > 500
      ? await sectorMaker.call(
          this,
          120,
          data[ind + 1],
          ind + 1,
          passingArguments
        )
      : await sectorMaker.call(
          this,
          80,
          data[ind + 1],
          ind + 1,
          passingArguments
        );
  }
  return;
};
