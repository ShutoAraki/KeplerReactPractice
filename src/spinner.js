import React from 'react';

const spinnerStyle = {
    position: 'absolute',
    zIndex: 100,
    top: 35,
    right: 380
};

function Spinner(props) {
    if (props.isLoading) {
        return (
            <div style={spinnerStyle} className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    } else {
        return null;
    }
}

export default Spinner;