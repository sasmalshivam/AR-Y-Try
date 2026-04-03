import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '', style = {}, ...props }) => {
  const btnClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  
  return (
    <button 
      className={`btn ${btnClass} ${className}`} 
      onClick={onClick} 
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
