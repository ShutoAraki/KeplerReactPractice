import React from 'react';

const dropdownStyle = {
    position: 'absolute',
    zIndex: 100,
    top: 0,
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
    maxHeight: '200px',
    overflowX: 'hidden'
};

const DropdownButton = ({title, data_files, getData}) => {
    return(
        <div className="dropdown">
            <button style={dropdownStyle} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {title}
            </button>
            <div style={scrollableMenu} className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {data_files.map(data_file => (
                <button className="dropdown-item" type="button" onClick={() => getData(data_file)} key={data_file.id}>{data_file.name}</button>
            ))}
            </div>
        </div>
    )
};

export default DropdownButton;