// @flow
import React, {Component} from 'react';
import Home from '../components/Home';
import glob from 'glob';
const {dialog} = require('electron').remote;

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
    glob.glob(`${this.state.photosDirectory}/**/*.*`, (err, files) => {
      console.log('files loaded', err);
      this.setState({files});
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
