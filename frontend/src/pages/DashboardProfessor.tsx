import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import CriarAtividadeForm from '../components/professor/CriarAtividadeForm';
import PainelCorrecao from '../components/professor/PainelCorrecao';
import ListaAtividades from '../components/professor/ListaAtividades';
import { Header } from '../components/ui/Header';

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
  turma: number;
}

export interface Turma {
  id: number;
  nome: string;
}

export interface Resposta {
  id: number;
  atividade: number;
  aluno: number; 
  aluno_nome?: string;
  texto: string;
  criado_em?: string;
  nota?: number | null;
  feedback?: string | null;
}

const CorrecaoWrapper: React.FC<{ atividades: Atividade[], turmas: Turma[] }> = ({ atividades, turmas }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(true);

  const atividade = atividades.find(a => a.id === Number(id));

  const carregarRespostas = async () => {
    if (!atividade) return;
    try {
      const res = await api.get(`/atividades/${atividade.id}/respostas/`);
      setRespostas(res.data);
    } catch (error) {
      console.error("Erro ao carregar respostas", error);
      alert("Erro ao carregar as respostas desta atividade.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRespostas();
  }, [atividade]);

  if (!atividade) return <p>Atividade não encontrada.</p>;
  if (loading) return <p>Carregando respostas...</p>;

  return (
    <PainelCorrecao 
      atividade={atividade} 
      respostas={respostas} 
      nomeTurma={turmas.find(t => t.id === atividade.turma)?.nome || 'Turma não identificada'}
      onVoltar={() => navigate('/professor/atividades')}
      onAvaliacaoSalva={carregarRespostas} 
    />
  );
};

const DashboardProfessor: React.FC = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const { nome } = useContext(AuthContext);
  const nomeProfessor = nome || 'Professor';
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resAtividades, resTurmas] = await Promise.all([
        api.get('/atividades/'),
        api.get('/turmas/')
      ]);
      setAtividades(resAtividades.data);
      setTurmas(resTurmas.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  return (
   <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
    <Header titulo="Portal do Professor" />
    <div style={{ margin: '20px 0', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
      <h2 style={{ fontSize: '24px', color: '#2b3035', margin: '0 0 5px 0' }}>
        Bem-vindo(a), {nomeProfessor}! 👋
      </h2>
      <p style={{ color: '#6c757d', margin: '0', fontSize: '15px' }}>
        Aqui está o resumo das suas turmas e atividades publicadas.
      </p>
    </div>
    
    <Routes>
      <Route path="atividades" element={
        <>
          <CriarAtividadeForm turmas={turmas} onSucesso={carregarDados} />
          <section style={{ marginTop: '30px' }}>
            <h3>Atividades Publicadas (Clique em uma para ver as respostas)</h3>
            <ListaAtividades 
              atividades={atividades} 
              onVerRespostas={(atividade) => navigate(`/professor/correcao/${atividade.id}`)} 
            />
          </section>
        </>
      } />

      <Route path="correcao/:id" element={
        <CorrecaoWrapper atividades={atividades} turmas={turmas} />
      } />
    </Routes>
    </div>
  );
};

export default DashboardProfessor;