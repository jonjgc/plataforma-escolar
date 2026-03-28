import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      marginTop: 'auto',
      color: '#6c757d',
      fontSize: '14px',
      borderTop: '1px solid #e9ecef',
      backgroundColor: '#f4f7f6',
      width: '100%'
    }}>
      &copy; 2026 Plataforma Escolar. Todos os direitos reservados.
    </footer>
  );
};