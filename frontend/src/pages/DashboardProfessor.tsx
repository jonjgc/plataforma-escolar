import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import CriarAtividadeForm from '../components/professor/CriarAtividadeForm';

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
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

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

  const handleAvaliarResposta = async (respostaId: number) => {
    const nota = notas[respostaId];
    const feedback = feedbacks[respostaId] || '';

    if (!nota || Number(nota) < 0 || Number(nota) > 10) {
      alert("A nota é obrigatória e deve ser entre 0 e 10.");
      return;
    }

    try {
      await api.patch(`/respostas/${respostaId}/`, {
        nota: Number(nota),
        feedback: feedback
      });
      alert('Avaliação salva com sucesso!');
      if (atividadeSelecionada) handleVerRespostas(atividadeSelecionada);
    } catch (error) {
      console.error("Erro ao avaliar resposta", error);
      alert("Erro ao salvar a avaliação.");
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
            {atividades.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhuma atividade criada ainda.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {atividades.map(atv => (
                  <li 
                    key={atv.id} 
                    onClick={() => handleVerRespostas(atv)}
                    style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '6px', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{atv.titulo}</h4>
                      <span style={{ fontSize: '12px', background: '#e9ecef', padding: '4px 8px', borderRadius: '4px' }}>🔍 Ver Respostas</span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', color: '#333' }}>{atv.descricao}</p>
                    <small style={{ color: '#666', fontWeight: 'bold' }}>Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <section style={{ marginTop: '30px', padding: '20px', border: '2px solid #0056b3', borderRadius: '8px', background: '#fff' }}>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <button onClick={() => setAtividadeSelecionada(null)} style={{ padding: '6px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px', fontSize: '12px' }}>
              ← Voltar para Atividades
            </button>
            <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>Respostas para: {atividadeSelecionada.titulo}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{atividadeSelecionada.descricao}</p>
          </div>

          {respostas.length === 0 ? (
             <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Nenhum aluno respondeu a esta atividade ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {respostas.map(resp => (
                <div key={resp.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '6px', background: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Aluno ID: {resp.aluno}</span>
                  </div>
                  <div style={{ background: '#fff', padding: '15px', border: '1px solid #e9ecef', borderRadius: '4px', whiteSpace: 'pre-wrap', marginBottom: '15px' }}>
                    {resp.texto}
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
                    <div style={{ width: '100px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Nota (0 a 10)*</label>
                      <input type="number" min="0" max="10" step="0.1" required value={notas[resp.id] ?? (resp.nota ?? '')} onChange={e => setNotas({...notas, [resp.id]: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Feedback</label>
                      <textarea value={feedbacks[resp.id] ?? (resp.feedback ?? '')} onChange={e => setFeedbacks({...feedbacks, [resp.id]: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '40px' }} />
                    </div>
                    <button onClick={() => handleAvaliarResposta(resp.id)} style={{ marginTop: '22px', padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Salvar Nota
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DashboardProfessor;