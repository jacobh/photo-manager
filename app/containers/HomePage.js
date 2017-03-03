// @flow
import React, {Component} from 'react';
import Home from '../components/Home';
import glob from 'glob';
import sizeOf from 'image-size';
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
      files: [],
    };
    this.loadFiles = this.loadFiles.bind(this);
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

  loadFiles() {
    console.log('loading files...');
    console.log(this.state.photosDirectory);
    glob.glob(`${this.state.photosDirectory}/**/*.dng`, {nocase: true}, (
      err,
      files,
    ) => {
      console.log('files loaded', err);
      this.setState({files});
      for (let file of files) {
        exec(`nice -20 ./bin/libraw/bin/dcraw_emu -W -T "${file}"`, () => {
          const dimensions = sizeOf(file);
          console.log(dimensions);
          for (let [label, size] of SIZES) {
            exec(
              `nice -20 ./bin/libwebp/examples/cwebp \
                -preset photo \
                ${resizeToFitArg(dimensions, size)} \
                -q 80 \
                -m 6 \
                "${file}.tiff" \
                -o "${file}.${label}.webp"
              `,
              err => {
                console.log(err);
              },
            );
          }
        });
        console.log(file);
      }
    });
  }

  render() {
    console.log('render home page');
    console.log(this.state);
    return (
      <div>
        <ul>
          {this.state.files.map(file => <li key={file}>{file}</li>)}
        </ul>
      </div>
    );
  }
}
