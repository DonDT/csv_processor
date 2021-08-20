import React, { Component } from "react";
import { currencyValidator } from "./validator";
//const uuidV4 = require("uuid").v1;

interface IProps {
  csvFiles: Object;
  headers: string[];
  token: string;
}
interface IState {
  csvFiles: object;
  currencies: object;
  currencyTickerError: boolean;
}

class DisplayView extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      csvFiles: {},
      currencies: {},
      currencyTickerError: true,
    };
  }

  async componentDidMount() {
    const currencies = await this.fetchCurrencyObject();
    this.setState({ csvFiles: this.props.csvFiles, currencies });
  }

  fetchCurrencyObject = async () => {
    const response = await fetch(
      "https://openexchangerates.org/api/currencies.json"
    );
    const data = await response.json();
    return data;
  };

  componentDidUpdate(preProps: any) {
    if (this.props.csvFiles !== preProps.csvFiles) {
      this.setState({ csvFiles: this.props.csvFiles });
    }
  }

  onTextChange = (e: any, file: any, fieldIndex: number) => {
    e.preventDefault();
    let allData = this.state.csvFiles;
    //  Getting the particular item
    let item = Object.values(allData)[0][file];
    let value = e.target.value;
    // change it's value
    item[fieldIndex] = value;
    Object.values(allData)[0][file] = item;

    // validating the currency field
    const { currencies } = this.state;
    let currencyTickerError = this.state.currencyTickerError;
    if (fieldIndex === 3) {
      currencyTickerError = currencyValidator(value, currencies);
    }
    this.setState({ csvFiles: allData, currencyTickerError });
  };

  renderTableRows = () => {
    let inputsCount: number = 1;
    let files = Object.values(this.state.csvFiles)[0];
    if (files) {
      if (files.length === 0)
        return (
          <tr>
            <td></td>
          </tr>
        );
      let allFields = files.map((file: any, fileIndex: number) => {
        if (fileIndex !== 0)
          return (
            <tr key={`${file[1]}_${fileIndex}`}>
              {file.map((item: any, i: number) => {
                inputsCount++; // used this to give each field a unique count id
                return (
                  <td key={`file_${inputsCount}`}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => this.onTextChange(e, fileIndex, i)}
                      key={`file_${inputsCount}`}
                    />
                  </td>
                );
              })}
            </tr>
          );
      });
      return allFields;
    } else
      return (
        <tr>
          <td></td>
        </tr>
      );
  };

  renderHeaders = (headers: string[]) => {
    if (headers.length)
      return headers.map((header, index) => {
        return <th key={index}>{header}</th>;
      });
    else return <th></th>;
  };

  onUpdateFile = async () => {
    const { token } = this.props;
    try {
      await fetch("/api/updateFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hi: "Love of life",
          updatedFile: this.state.csvFiles,
        }),
      });
    } catch (error) {}
  };

  render() {
    const {
      state: { currencyTickerError },
      props: { headers },
    } = this;

    let allFiles = Object.values(this.state.csvFiles)[0];
    let sum = 0;
    if (allFiles) {
      sum = allFiles.reduce((acc: number, cur: string[], curIndex: number) => {
        if (curIndex !== 0) {
          acc +=
            parseFloat(cur[7].replace(/,/g, ".")) +
            parseFloat(cur[6].replace(/,/g, ".")) +
            parseFloat(cur[5].replace(/,/g, "."));
        }
        return acc;
      }, 0);
    }
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>
                {" "}
                <strong>Current document:</strong>
              </td>
              <td
                style={{
                  textTransform: "capitalize",
                  textDecoration: "underline",
                }}
              >
                {Object.keys(this.state.csvFiles)[0]}
              </td>
            </tr>
            <tr>{this.renderHeaders(headers)}</tr>
          </thead>
          <tbody>{this.renderTableRows()}</tbody>
          <tfoot>
            <tr>
              <td>Calculation result: {sum}</td>
              <td>
                <button
                  onClick={this.onUpdateFile}
                  disabled={!currencyTickerError}
                >
                  Save Changes
                </button>
              </td>
              <td>
                {!currencyTickerError && (
                  <strong>Please check ticker symbol</strong>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default DisplayView;
