import React, { Component } from "react";
import { parse } from "papaparse";
import Search from "./components/search";
import DisplayView from "./components/displayView";
import jwt from "jwt-decode";
import "./App.css";

interface sessionFiles {
  csvFiles: Array<any>;
  iat: number;
  id: string;
}

interface IProps {}
interface IState {
  csvFiles: Object;
  dropBoxColor: boolean;
  headers: string[];
  sessionCsvFiles: Array<any>;
  token: string;
}
export interface CsvFiles {
  [key: string]: Object;
}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dropBoxColor: false,
      csvFiles: {},
      headers: [],
      sessionCsvFiles: [],
      token: "",
    };
  }

  onDrop = async (e: any) => {
    e.preventDefault();
    // change box color
    this.setState({ dropBoxColor: false });
    const files = e.dataTransfer.files;
    let result: any;
    let fileName: any;
    // return an array of csv files only
    Array.from(files)
      .filter((file: any) => file.type === "text/csv")
      .forEach(async (file: any) => {
        fileName = file.name.split(".")[0];
        const doc = await file.text();
        result = parse(doc);
        const headers = result.data[0];
        const csv_file: any = {};
        csv_file[fileName] = result.data;
        this.setState({ csvFiles: csv_file, headers }, async () => {
          await this.saveFiles();
        });
      });
  };

  saveFiles = async () => {
    const { csvFiles } = this.state;
    // save to database
    try {
      const onSave = await fetch("/api/saveFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ hi: "Save this file", csvFiles }),
      });
      const serverResult = await onSave.text();
      const token = await JSON.parse(serverResult).token;
      // set csvFiles to state
      const parsedToken: sessionFiles = jwt(token);
      const sessionCsvFiles = parsedToken.csvFiles;

      this.setState({ sessionCsvFiles, token });
    } catch (error) {
      console.log("Error connecting to server", error);
    }
    //
  };

  onDragOver = (e: any) => {
    e.preventDefault();
  };

  setCsvFile = (file: object) => {
    this.setState({ csvFiles: file });
  };

  render() {
    const { csvFiles, dropBoxColor, headers, sessionCsvFiles, token } =
      this.state;

    return (
      <div className="App">
        <div className="left_col">
          <div className="left_container">
            <div
              className={`dropbox ${dropBoxColor ? "overDropbox" : ""}`}
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e)}
              onDragEnter={() => this.setState({ dropBoxColor: true })}
              onDragLeave={() => this.setState({ dropBoxColor: false })}
            >
              <span className="drop_text">DropZone</span>
            </div>
            <div className="search center_view">
              <Search
                sessionCsvFiles={sessionCsvFiles}
                setCsvFile={this.setCsvFile}
              />
            </div>
          </div>
        </div>
        <div className="right_col">
          <DisplayView csvFiles={csvFiles} headers={headers} token={token} />
        </div>
      </div>
    );
  }
}

export default App;
