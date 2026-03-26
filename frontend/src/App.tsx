import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';

const Dashboard: React.FC = () => {
  const { role, logout } = useContext(AuthContext);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo! Você é um {role}</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;