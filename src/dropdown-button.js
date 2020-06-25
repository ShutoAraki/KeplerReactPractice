import React from 'react';

class DatasetSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedColumns: []
        };
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

    // POST request to get the proper csv
    // Add the info to data_file and pass it to this.props.getData
    
    render() {
        const dropdownStyle = {
            position: 'absolute',
            zIndex: 100,
            top: 10,
            right: 200,
            width: '120px',
            height: '40px',
            backgroundColor: '#1f7cf4',
            color: '#FFFFFF',
            cursor: 'pointer',
            border: 0,
            borderRadius: '3px',
            fontSize: '12px',
            margin:'30px',
        };
        
        const scrollableMenu = {
            height: 'auto',
            maxHeight: '500px',
            overflowX: 'hidden'
        };

        return (
            <div className="dropdown">
                <button style={dropdownStyle} type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.title}
                </button>
                <div style={scrollableMenu} className="dropdown-menu">
                    {
                        this.props.data_files.map(data_file => (
                            <div className="dropdown-item" key={data_file.id}>
                                <div className="dropdown">
                                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {data_file.name}
                                    </button>
                                    
                                    <div className="dropdown-submenu">
                                        <select className="selectpicker" multiple={true} onChange={this.addColumn}>
                                            {data_file.columns.map(column_name => (
                                                <option className="dropdown-item" value={data_file.name + ":" + column_name} key={column_name}>{column_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button type="button" className="btn btn-primary" onClick={this.submitSelections}>Load the data</button>
            </div>
        ) 
    }
}

export default DatasetSelector;