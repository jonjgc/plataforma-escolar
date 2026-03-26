import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardProfessor from './pages/DashboardProfessor';

const DashboardAlunoTemporario: React.FC = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
      <h2>Portal do Aluno</h2>
      <p>Em construção para o próximo commit...</p>
      <button onClick={logout} style={{ padding: '8px 16px', marginTop: '20px' }}>Sair</button>
    </div>
  );
};

// Componente que decide qual Dashboard renderizar baseado na 'role'
const AppRoutes: React.FC = () => {
  const { token, role } = useContext(AuthContext);

  const renderDashboard = () => {
    if (role === 'PROFESSOR') return <DashboardProfessor />;
    if (role === 'ALUNO') return <DashboardAlunoTemporario />;
    return <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={token ? renderDashboard() : <Navigate to="/login" />} />
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