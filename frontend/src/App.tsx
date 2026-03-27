import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardProfessor from './pages/DashboardProfessor';
import DashboardAluno from './pages/DashboardAluno';

const AppRoutes: React.FC = () => {
  const { token, role } = useContext(AuthContext);

  const renderDashboard = () => {
    if (role === 'PROFESSOR') return <DashboardProfessor />;
    if (role === 'ALUNO') return <DashboardAluno />;
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