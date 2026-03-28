import React, { useState } from 'react';
import { api } from '../../services/api';
import { Atividade, Resposta } from '../../pages/DashboardProfessor';

interface PainelCorrecaoProps {
  atividade: Atividade;
  respostas: Resposta[];
  onVoltar: () => void;
  onAvaliacaoSalva: () => void;
}

const PainelCorrecao: React.FC<PainelCorrecaoProps> = ({ atividade, respostas, onVoltar, onAvaliacaoSalva }) => {
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

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
      onAvaliacaoSalva(); 
    } catch (error) {
      console.error("Erro ao avaliar resposta", error);
      alert("Erro ao salvar a avaliação.");
    }
  };

  return (
    <section style={{ marginTop: '30px', padding: '20px', border: '2px solid #0056b3', borderRadius: '8px', background: '#fff' }}>
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
        <button onClick={onVoltar} style={{ padding: '6px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px', fontSize: '12px' }}>
          ← Voltar para Atividades
        </button>
        <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>Respostas para: {atividade.titulo}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{atividade.descricao}</p>
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
  );
};

export default PainelCorrecao;