// @flow
import React, {Component} from 'react';
import Immutable from 'immutable';
import Home from '../components/Home';
import glob from 'glob';
import sizeOf from 'image-size';
import {hashFilePath} from '../utils/hash.js';
const {dialog} = require('electron').remote;
const {exec} = require('child_process');

const SIZES = new Map([
  ['thumbnail', 200],
  ['large', 2000],
  ['original', Infinity],
]);

function resizeToFitArg(dimensions, maxSize) {
  if (maxSize === Infinity) {
    return '';
  }
  if (dimensions.width > dimensions.height) {
    return `-resize ${maxSize} 0`;
  } else {
    return `-resize 0 ${maxSize}`;
  }
}

export default class HomePage extends Component {
  constructor(props) {
    console.log('constructing,,');
    super(props);
    this.state = {
      photosDirectory: undefined,
      files: Immutable.Map(),
    };
    this.loadFiles = this.loadFiles.bind(this);
    this.processRawFile = this.processRawFile.bind(this);
    this.displayPhotosDirectoryDialog = this.displayPhotosDirectoryDialog.bind(
      this,
    );
  }

  componentDidMount() {
    this.displayPhotosDirectoryDialog();
  }

  async displayPhotosDirectoryDialog() {
    const photosDirectory = dialog.showOpenDialog({
      title: 'Select Photos Directory',
      properties: ['openDirectory'],
    })[0];
    this.setState({photosDirectory}, () => {
      this.loadFiles();
    });
  }

  async processRawFile(filePath) {
    const hash = await hashFilePath(filePath);
    this.setState(currentState => {
      return {
        files: currentState.files.set(
          hash,
          Immutable.Map({hash, path: filePath}),
        ),
      };
    });
    exec(`nice -20 ./bin/libraw/bin/dcraw_emu -W -T "${filePath}"`, () => {
      const dimensions = sizeOf(filePath);
      for (let [label, size] of SIZES) {
        let resizePath = `${filePath}.${label}.webp`;
        exec(
          `nice -20 ./bin/libwebp/examples/cwebp \
            -preset photo \
            ${resizeToFitArg(dimensions, size)} \
            -q 80 \
            -m 6 \
            "${filePath}.tiff" \
            -o "${resizePath}"
          `,
          err => {
            if (err) {
              console.log(err);
            } else {
              this.setState(currentState => {
                return {
                  files: currentState.files.setIn(
                    [hash, `${label}Path`],
                    resizePath,
                  ),
                };
              });
            }
          },
        );
      }
    });
    console.log(filePath);
  }

  loadFiles() {
    console.log('loading files...');
    console.log(this.state.photosDirectory);
    glob.glob(`${this.state.photosDirectory}/**/*.dng`, {nocase: true}, (
      err,
      files,
    ) => {
      console.log('files loaded', err);
      for (let file of files) {
        this.processRawFile(file);
      }
    });
  }

  render() {
    console.log('render home page');
    console.log(this.state);
    return (
      <div>
        <ul>
          {this.state.files.map(file => (
            <li key={file.get('hash')}>
              <img src={`file://${file.get('thumbnailPath')}`} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
