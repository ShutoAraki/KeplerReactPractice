// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import {connect} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
// Kepler.gl actions
import {addDataToMap} from 'kepler.gl/actions';
// Kepler.gl Data processing APIs
import Processors from 'kepler.gl/processors';
// Kepler.gl Schema APIs
import KeplerGlSchema from 'kepler.gl/schemas';

import Button from './button';
import DropdownButton from './dropdown-button';
import downloadJsonFile from "./file-download";

//TODO: Figure out what is happening to the environment variable
// const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // eslint-disable-line
const MAPBOX_TOKEN = "pk.eyJ1Ijoic2h1dG9hcmFraSIsImEiOiJja2F4bGpwZGgwMXdoMnNwaTZwNzZ1N2ozIn0.4MK9evmXh1eQPTUauJQbMg"

// Get the list of headers and pick the ones you want without reading the whole file
// 

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data_files: []
    }
  }

  componentDidMount() {
    const api_call = 'http://localhost:8000/fetch/'; 
    fetch(api_call)
    .then(res => res.json())
    .then((data) => {
      this.setState({data_files: data.filenames})
      console.log(this.state.data_files);
    })
    .catch(console.log);
  }

  getData = (data_file) => {
    const api_call = 'http://localhost:8000/fetch/' + data_file.name;
    fetch(api_call)
    .then(res => res.text())
    .then((data) => {
      const processedData = Processors.processCsvData(data);
      const dataset = {
        data: processedData,
        info: {
          id: data_file.id,
          label: data_file.name
        }
      };
      const config_json = JSON.parse(data_file.config);
      console.log(config_json);
      // addDataToMap action to inject dataset into kepler.gl instance
      this.props.dispatch(addDataToMap({datasets: dataset, config: config_json}));
    })
    .catch(console.log);
  };

  getMapConfig() {
    // retrieve kepler.gl store
    const {keplerGl} = this.props;
    // retrieve current kepler.gl instance store
    const {map} = keplerGl;
    /// create the config object
    return KeplerGlSchema.getConfigToSave(map);
  }

  exportMapConfig = () => {
    // create the config object
    const mapConfig = this.getMapConfig();
    // save it as a json file
    downloadJsonFile(mapConfig, 'kepler.gl.json');
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
        <Button onClick={this.exportMapConfig}>Export Config</Button>
        <DropdownButton
          title="Select dataset"
          data_files={this.state.data_files}
          getData={this.getData}
        />
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
