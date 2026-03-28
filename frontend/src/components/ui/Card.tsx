import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onClick }) => {
  const baseStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div 
      style={baseStyle}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.04)';
        }
      }}
    >
      {children}
    </div>
  );
};