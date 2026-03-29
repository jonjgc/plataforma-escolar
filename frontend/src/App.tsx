import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Footer } from './components/ui/Footer'; 
import Login from './pages/Login';
import DashboardProfessor from './pages/DashboardProfessor';
import DashboardAluno from './pages/DashboardAluno';
import './index.css'

const AppRoutes: React.FC = () => {
  const { token, role } = useContext(AuthContext);
  const handleRedirect = () => {
    if (!token) return <Navigate to="/login" replace />;
    if (role === 'PROFESSOR') return <Navigate to="/professor/atividades" replace />;
    if (role === 'ALUNO') return <Navigate to="/aluno/atividades" replace />;
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : handleRedirect()} />
      <Route path="/" element={handleRedirect()} />
      <Route 
        path="/professor/*" 
        element={token && role === 'PROFESSOR' ? <DashboardProfessor /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/aluno/*" 
        element={token && role === 'ALUNO' ? <DashboardAluno /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <div style={{ flex: 1 }}>
            <AppRoutes />
          </div>

          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;