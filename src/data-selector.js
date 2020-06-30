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

    removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    addColumn = (event) => {
        const column_name = event.target.value;
        if (event.target.checked) {
            this.state.selectedColumns.push(column_name);
            console.log(JSON.stringify(this.state));
        } else {
            this.state.selectedColumns = this.removeA(this.state.selectedColumns, column_name);
        }
        console.log(this.state.selectedColumns);
    }

    submitSelections = () => {
       console.log(this.state);
       const dataType = this.state.data_type.split(" ")[0].toLowerCase();
       console.log("selectedColumns");
       console.log(this.state.selectedColumns.filter(word => word.split("-")[0] === dataType + 'Data'));
    //    const filteredData = this.state.selectedColumns.filter(word => word.split("-")[0] === dataType + 'Data').sort((a, b) => a.split("-")[1].localeCompare(b.split("-")[1]));
       const filteredData = this.state.selectedColumns.filter(word => word.split("-")[0] === dataType + 'Data');
       this.props.getAggData({
           data_type: dataType,
           selectedColumns: filteredData
       });
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
            backgroundColor: 'transparent'
        };

        const selectButtonStyle = {
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
            // textAlign: 'center'
        };
        
        const scrollableMenu = {
            width: WIDTH + 'px',
            height: '200px',
            maxHeight: '200px',
            overflowX: 'hidden'
        };

        const cardStyle = {
            width: WIDTH + 'px',
            margin: '5px',
            fontSize: '1vw',
            textAlight: 'left'
        };

        const dataType = this.state.data_type.split(" ")[0].toUpperCase();

        // Grab only the current data type and sort it by the topic name alphabetically
        const filteredDataFiles = this.props.data_files.filter(word => word.name.split("-")[0] === dataType.toLowerCase() + 'Data').sort((a, b) => a.name.split("-")[1].localeCompare(b.name.split("-")[1]));
        {/* <select style={scrollableMenu} multiple={true} onChange={this.addColumn}>
                                    {data_file.all_columns.map(column_name => (
                                       <option style={cardStyle} value={data_file.name + ":" + column_name} key={column_name}>{column_name}</option> 
                                    ))}
                                </select> */}
        return (
            <div style={dataSelectorStyle} id="data-selector">
                <button style={selectButtonStyle} className="btn btn-primary" onClick={this.switchHexChomeText}>
                    <b>{dataType}</b><small>{this.state.data_type.split(" ").slice(1, 3)}</small>
                </button>

                <div style={accordionStyle} id="accordion">
                    {filteredDataFiles.map(data_file => (
                        <div className="card" key={data_file.id}>
                                <button className="btn btn-link dropdown-toggle" data-toggle="collapse" data-target={"#collapse" + data_file.id} aria-expanded="true" aria-controls={"collapse" + data_file.id}>
                                    {data_file.name.split("-")[1]}
                                </button>
                            <div style={scrollableMenu} id={"collapse" + data_file.id} className="collapse" aria-labelledby={"heading" + data_file.id} data-parent="#accordion">
                                {data_file.all_columns.map(column_name => (
                                    <div style={cardStyle} className="form-check" key={column_name}>
                                        <input className="form-check-input" type="checkbox" value={data_file.name + ':' + column_name} id="defaultCheck1" onChange={this.addColumn}/>
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            {column_name}
                                        </label>
                                    </div>
                                ))}
                                
                            </div>
                        </div>
                    ))}
                </div>

                <Button onClick={this.submitSelections}>Load the {dataType} data</Button>
            </div>
            
        ) 
    }
}

export default DatasetSelector;