import React, { useEffect, useState } from 'react';
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

const DashboardProfessor: React.FC = () => {
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
    <Header titulo="Portal do Professor" />
    
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
          nomeTurma={turmas.find(t => t.id === atividadeSelecionada.turma)?.nome || 'Turma não identificada'}
          onVoltar={() => setAtividadeSelecionada(null)} 
          onAvaliacaoSalva={() => handleVerRespostas(atividadeSelecionada)} 
        />
      )}
    </div>
  );
};

export default DashboardProfessor;