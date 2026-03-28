import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f4f7f6',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#0056b3', margin: '0 0 10px 0', fontSize: '28px' }}>Plataforma Escolar</h2>
            <p style={{ color: '#6c757d', margin: 0, fontSize: '15px' }}>Faça login para acessar sua conta</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {error && (
              <div style={{ padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '6px', fontSize: '14px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
                {error}
              </div>
            )}
            
            <Input 
              label="E-mail"
              type="email" 
              placeholder="exemplo@escola.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <Input 
              label="Senha"
              type="password" 
              placeholder="Sua senha secreta" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <Button type="submit" variant="primary" fullWidth style={{ marginTop: '10px', padding: '14px' }}>
              Entrar no Sistema
            </Button>
            
          </form>
        </Card>
        
      </div>
    </div>
  );
};

export default Login;