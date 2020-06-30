import React from 'react';

const buttonStyle = {
  position: 'absolute',
  zIndex: 100,
  bottom: 0,
  right: 0,
  width: '200px',
  height: '40px',
  color: '#FFFFFF',
  cursor: 'pointer',
  border: 0,
  borderRadius: '3px',
  fontSize: '12px',
  margin:'30px',
  backgroundImage: "linear-gradient(to right, rgba(78,125,203,0.5), rgba(65,148,222,0.5) 24%, rgba(0,163,163,0.5))"
};

const Button = ({onClick, children}) => (
  <button className="btn" style={buttonStyle} onClick={onClick}>{children}</button>
);

export default Button;
