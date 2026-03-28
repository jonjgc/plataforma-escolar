import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Button } from './Button';

interface HeaderProps {
  titulo: string;
}

export const Header: React.FC<HeaderProps> = ({ titulo }) => {
  const { logout } = useContext(AuthContext);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '2px solid #f1f3f5', 
      paddingBottom: '15px',
      marginBottom: '25px'
    }}>
      <h2 style={{ margin: 0, color: '#2b3035', fontSize: '24px' }}>{titulo}</h2>
      
      <Button variant="danger" onClick={logout}>
        Sair do Sistema
      </Button>
    </header>
  );
};