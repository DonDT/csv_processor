import React, { Component } from "react";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      showErrorMessage: false,
      foundMatch: true,
      matchedFile: {},
    };
  }

  onInputChange = (e) => {
    let inputVal = e.target.value;
    // searching saved files
    let sessionCsvFiles = this.props.sessionCsvFiles;
    let match = sessionCsvFiles.find(
      (file) => Object.keys(file)[0] === inputVal
    );

    this.setState({
      searchString: inputVal,
      showErrorMessage: false,
      foundMatch: !!match,
      matchedFile: match,
    });
  };

  onSearch = () => {
    const { searchString, foundMatch, matchedFile } = this.state;
    if (!searchString || !foundMatch) this.setState({ showErrorMessage: true });
    else if (foundMatch) {
      // sending the selected file to be displayed
      this.props.setCsvFile(matchedFile);
      this.setState({ searchString: "" });
    }
  };

  render() {
    const { showErrorMessage, searchString } = this.state;
    // file names list
    const renderFileNames = this.props.sessionCsvFiles.map((file, index) => (
      <li key={index}>{Object.keys(file)[0]}</li>
    ));

    return (
      <div style={{ display: "block" }}>
        {showErrorMessage && <div> Please modify search parameter</div>}
        <div>
          <input
            placeholder="file.csv"
            className="search_input"
            value={searchString}
            onChange={this.onInputChange}
          />
        </div>
        <button style={{ marginTop: "15px" }} onClick={this.onSearch}>
          Search
        </button>
        <ul>{renderFileNames}</ul>
      </div>
    );
  }
}

export default Search;
