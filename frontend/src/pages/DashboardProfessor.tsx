import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import CriarAtividadeForm from '../components/professor/CriarAtividadeForm';
import PainelCorrecao from '../components/professor/PainelCorrecao';
import ListaAtividades from '../components/professor/ListaAtividades';

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
}

export interface Turma {
  id: number;
  nome: string;
}

export interface Resposta {
  id: number;
  atividade: number;
  aluno: number; 
  texto: string;
  criado_em?: string;
  nota?: number | null;
  feedback?: string | null;
}

const DashboardProfessor: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);

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

  const handleVerRespostas = async (atividade: Atividade) => {
    setAtividadeSelecionada(atividade);
    try {
      const res = await api.get(`/atividades/${atividade.id}/respostas/`);
      setRespostas(res.data);
    } catch (error) {
      console.error("Erro ao carregar respostas", error);
      alert("Erro ao carregar as respostas desta atividade.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>Portal do Professor</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </header>

      {!atividadeSelecionada ? (
        <>
          <CriarAtividadeForm turmas={turmas} onSucesso={carregarDados} />

          <section style={{ marginTop: '30px' }}>
            <h3>Atividades Publicadas (Clique em uma para ver as respostas)</h3>
            <ListaAtividades atividades={atividades} onVerRespostas={handleVerRespostas} />
          </section>
        </>
      ) : (
        <PainelCorrecao 
          atividade={atividadeSelecionada} 
          respostas={respostas} 
          onVoltar={() => setAtividadeSelecionada(null)} 
          onAvaliacaoSalva={() => handleVerRespostas(atividadeSelecionada)} 
        />
      )}
    </div>
  );
};

export default DashboardProfessor;