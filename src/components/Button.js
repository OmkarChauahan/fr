import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button' }) => {
  const baseStyle = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
  };
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={baseStyle + ' ' + variants[variant]}
    >
      {children}
    </button>
  );
};

export default Button;