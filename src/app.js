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
import {addDataToMap, receiveMapConfig, addLayer} from 'kepler.gl/actions';
// Kepler.gl Data processing APIs
import Processors from 'kepler.gl/processors';
// Kepler.gl Schema APIs
import KeplerGlSchema from 'kepler.gl/schemas';

import DatasetSelector from './data-selector';
import Spinner from './spinner';
import downloadJsonFile from "./file-download";
import defaultConfig from './data/defaultConfig.json';
import greenLayer from './data/greenLayer';

//TODO: Figure out what is happening to the environment variable
// const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // eslint-disable-line
const MAPBOX_TOKEN = "pk.eyJ1Ijoic2h1dG9hcmFraSIsImEiOiJja2F4bGpwZGgwMXdoMnNwaTZwNzZ1N2ozIn0.4MK9evmXh1eQPTUauJQbMg"

// Get the list of headers and pick the ones you want without reading the whole file
// 

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data_files: [],
      isLoading: false,
      filename2bool: {},
      currentConfig: JSON.parse(defaultConfig)
    }
    this.getAggData = this.getAggData.bind(this);
  };

  componentDidMount() {
    // Get a list of files (id, name, config) --> Save it as data_files state
    const api_call = 'http://localhost:8000/fetch/'; 
    fetch(api_call)
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      this.setState({data_files: data.filenames});
    })
    .catch(console.log);
    
    this.resetConfig();
    this.state.data_files.map((filename) => {
      filename.all_columns.map((column_name) => {
        const full_filename = filename.name + ':' + column_name;
        this.state.filename2bool[full_filename] = false;
      })
    });
  };

  resetConfig() {
    const config = JSON.parse(defaultConfig);
    this.setState({currentConfig: config});
    const parsedConfig = KeplerGlSchema.parseSavedConfig(config);
    this.props.dispatch(receiveMapConfig(parsedConfig));
  };

  // It parses the naming format to extract appropriate data name string
  parseSelectedColumns(data_state) {
    const selectedColumns = data_state.selectedColumns
    return data_state.data_type + ":" + selectedColumns.map(word => word.split(":")[1]).join('/');
  };
  
  // Parses names like "hexData-Crime:crimeTotalRate"
  // to grab appropriate layer config 
  getLayerConfig(full_filename, data_name) {
    const topic = full_filename.split(":")[0].split("-")[1];
    const colname = full_filename.split(":")[1];
    if (topic === "Environment") {
      console.log("GREEN LAYER LOADING");
      console.log(data_name);
      const unique_id = Math.random().toString(36).substr(2, 9);
      return greenLayer(unique_id, data_name, colname);
    } else {
      return null;
    }
  };

  addLayerConfig(full_filename, data_name) {
    const layerConfig = this.getLayerConfig(full_filename, data_name);
    console.log("The layer config:");
    console.log(layerConfig);
    this.state.currentConfig.config.visState.layers.push(layerConfig);
  }

  // getAggData takes the dataType and selectedColumns from DatasetSelector
  // then add the whole data to the map 
  getAggData(data_files) {
    this.setState({isLoading: true});
    const api_call = 'http://localhost:8000/agg_fetch';
    console.log("API CALL");
    console.log(api_call);
    fetch(api_call, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_files)
    })
    .then(res => res.text())
    .then((data) => {
      const processedData = Processors.processCsvData(data);
      const data_name = this.parseSelectedColumns(data_files);
      const dataset = {
        data: processedData,
        info: {
          id: data_name,
          label: data_name
        }
      };
      console.log("Dataset info");
      console.log(dataset);
      this.resetConfig();
      data_files.selectedColumns.map(full_filename => this.addLayerConfig(full_filename, data_name));
      console.log(this.state.currentConfig);
      this.props.dispatch(addDataToMap({datasets: dataset, config: this.state.currentConfig}));
      // this.props.dispatch(addLayer(test_layer));
      this.setState({isLoading: false});
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
  };

  exportMapConfig = () => {
    // create the config object
    const mapConfig = this.getMapConfig();
    // save it as a json file
    downloadJsonFile(mapConfig, 'kepler.gl.json');
  };

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
        <button onClick={this.exportMapConfig}>Export Config</button>
        <DatasetSelector
          data_files={this.state.data_files}
          getAggData={this.getAggData}
          filename2bool={this.state.filename2bool}
        />
        <Spinner isLoading={this.state.isLoading}/>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
              appName="Best Basho Visualizer"
            />
          )}
        </AutoSizer>
      </div>
    );
  };
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
