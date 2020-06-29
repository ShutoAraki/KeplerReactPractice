import React from 'react';
import Button from './button';

class DatasetSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_type: "Hex -> Chome",
            selectedColumns: []
        };
        this.switchHexChomeText = this.switchHexChomeText.bind(this);
    }

    addColumn = (event) => {
        const column_name = event.target.value;
        this.state.selectedColumns.push(column_name);
        console.log(this.state);
    }

    submitSelections = () => {
        const api_call = 'http://localhost:8000/columns/';
        fetch(api_call, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then((data) => {
            // this.props.data_files.columns = data;
            // Change columns property in data_files 
            this.props.data_files.map((data_file) => {
                if (data_file.name in data) {
                    data_file.columns = data[data_file.name];
                    this.props.getData(data_file);
                }
            })
            // console.log("submitSelections() =>");
            // console.log(this.props.data_files);


        })
        .catch(console.log);
    }

    switchHexChomeText() {
       if (this.state.data_type === "Hex -> Chome") {
           this.setState({data_type: "Chome -> Hex"});
       } else {
           this.setState({data_type: "Hex -> Chome"});
       }
    }

    // POST request to get the proper csv
    // Add the info to data_file and pass it to this.props.getData
    
    render() {

        const WIDTH = 200;
        const dataSelectorStyle = {
            position: 'absolute',
            zIndex: 100,
            top: 10,
            right:100,
            width: WIDTH + 'px',
            height: '40px',
            margin: '30px',
            textAlign: 'center'
        };

        const accordionStyle = {
            position: 'absolute',
            zIndex: 100,
            top: 55,
            right: 100,
            width: WIDTH + 'px',
            height: '20px',
            margin: '30px',
            textAlign: 'center'
        };
        
        const scrollableMenu = {
            height: 'auto',
            maxHeight: '300px',
            overflowX: 'hidden'
        };

        const cardStyle = {
            width: WIDTH + 'px',
        };

        const dataType = this.state.data_type.split(" ")[0].toUpperCase();

        return (
            <div id="data-selector">
                <button style={dataSelectorStyle} className="btn btn-primary" onClick={this.switchHexChomeText}>
                    <b>{dataType}</b><small>{this.state.data_type.split(" ").slice(1, 3)}</small>
                </button>
                
                <div style={accordionStyle} id="accordion">
                    {this.props.data_files.filter(word => word.name.split("-")[0] === dataType.toLowerCase() + 'Data').map(data_file => (
                        <div className="card" key={data_file.id}>
                            <div className="card-header" id={"heading" + data_file.id}>
                                <h5 className="mb-0">
                                <button className="btn btn-link" data-toggle="collapse" data-target={"#collapse" + data_file.id} aria-expanded="true" aria-controls={"collapse" + data_file.id}>
                                    {data_file.name.split("-")[1]}
                                </button>
                                </h5>
                            </div>
                            <div style={scrollableMenu} id={"collapse" + data_file.id} className="collapse" aria-labelledby={"heading" + data_file.id} data-parent="#accordion">
                                <select className="card-body" multiple={true} onChange={this.addColumn}>
                                    {data_file.all_columns.map(column_name => (
                                       <option style={cardStyle} className="card-body" value={data_file.name + ":" + column_name} key={column_name}>{column_name}</option> 
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
            </div>

                <Button onClick={this.submitSelections}>Load the data</Button>
            </div>
            
        ) 
    }
}

export default DatasetSelector;