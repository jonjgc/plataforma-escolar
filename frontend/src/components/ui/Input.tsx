import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, multiline, style, ...props }) => {
  const inputStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    outline: 'none',
    fontSize: '15px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    fontFamily: 'inherit',
    background: '#fff',
    boxSizing: 'border-box',
    ...style
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#80bdff';
    e.target.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#ced4da';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '14px', marginBottom: '6px', color: '#495057', fontWeight: 600 }}>
          {label}
        </label>
      )}
      
      {multiline ? (
        <textarea
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};