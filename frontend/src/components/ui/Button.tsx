import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  style, 
  ...props 
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...style
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#007bff', color: '#fff' },
    secondary: { background: '#6c757d', color: '#fff' },
    danger: { background: '#dc3545', color: '#fff' },
    success: { background: '#28a745', color: '#fff' },
    warning: { background: '#ffc107', color: '#212529' }
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </button>
  );
};