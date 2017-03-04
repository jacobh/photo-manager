// @flow
import React, { Component } from "react";
import Immutable from "immutable";
import Home from "../components/Home";
import glob from "glob";
import sha1File from "sha1-file";
const { dialog } = require("electron").remote;

import { connect } from "react-redux";
import { createPhoto, generateOriginalPreview } from "../actions/photos";

const SIZES = new Map([
  ["thumbnail", 200],
  ["large", 2000],
  ["original", Infinity]
]);

function resizeToFitArg(dimensions, maxSize) {
  if (maxSize === Infinity) {
    return "";
  }
  if (dimensions.width > dimensions.height) {
    return `-resize ${maxSize} 0`;
  } else {
    return `-resize 0 ${maxSize}`;
  }
}

class HomePage extends Component {
  constructor(props) {
    console.log("constructing,,");
    super(props);
    this.state = {
      photosDirectory: undefined,
      files: Immutable.Map()
    };
    this.loadFiles = this.loadFiles.bind(this);
    this.processRawFile = this.processRawFile.bind(this);
    this.displayPhotosDirectoryDialog = this.displayPhotosDirectoryDialog.bind(
      this
    );
  }

  componentDidMount() {
    this.displayPhotosDirectoryDialog();
  }

  async displayPhotosDirectoryDialog() {
    const photosDirectory = dialog.showOpenDialog({
      title: "Select Photos Directory",
      properties: ["openDirectory"]
    })[0];
    this.setState({ photosDirectory }, () => {
      this.loadFiles();
    });
  }

  async processRawFile(filePath) {
    const hash = sha1File(filePath);
    this.props.dispatch(createPhoto(hash, filePath));
    this.props.dispatch(generateOriginalPreview(hash));
  }

  loadFiles() {
    console.log("loading files...");
    console.log(this.state.photosDirectory);
    glob.glob(`${this.state.photosDirectory}/**/*.dng`, { nocase: true }, (
      err,
      files
    ) => {
      console.log("files loaded", err);
      for (let file of files) {
        this.processRawFile(file);
      }
    });
  }

  render() {
    console.log("render home page");
    console.log(this.state);
    return (
      <div>
        <ul>
          {this.props.photos.toSet().map(photo => (
            <li key={photo.get("hash")}>
              <img src={`file://${photo.get("originalPath")}`} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(state => ({ photos: state.photos }))(HomePage);
