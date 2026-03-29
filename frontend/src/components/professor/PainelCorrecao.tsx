import React, { useState } from 'react';
import { api } from '../../services/api';
import { Atividade, Resposta } from '../../pages/DashboardProfessor';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PainelCorrecaoProps {
  atividade: Atividade;
  respostas: Resposta[];
  nomeTurma: string;
  onVoltar: () => void;
  onAvaliacaoSalva: () => void;
}

const PainelCorrecao: React.FC<PainelCorrecaoProps> = ({ atividade, respostas, nomeTurma, onVoltar, onAvaliacaoSalva }) => {
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
      alert("Erro ao salvar a avaliação.");
    }
  };

  return (
    <Card style={{ marginTop: '20px', borderTop: '4px solid #0056b3' }}>
      
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
        <Button variant="secondary" onClick={onVoltar} style={{ marginBottom: '15px', padding: '6px 12px', fontSize: '13px' }}>
          ← Voltar para Atividades
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, color: '#0056b3' }}>Respostas para: {atividade.titulo}</h3>
          <span style={{ background: '#e9ecef', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
            🏷️ Turma: {nomeTurma}
          </span>
        </div>
        
        <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#555' }}>{atividade.descricao}</p>
      </div>

      {respostas.length === 0 ? (
         <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>Nenhum aluno respondeu a esta atividade ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {respostas.map(resp => (
            <div key={resp.id} style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fcfcfc' }}>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2b3035' }}>
                  🧑‍🎓 Aluno: {resp.aluno_nome || `ID ${resp.aluno}`}
                </span>
              </div>
              
              <div style={{ background: '#fff', padding: '15px', border: '1px solid #ced4da', borderRadius: '6px', whiteSpace: 'pre-wrap', marginBottom: '20px', fontSize: '15px', color: '#333' }}>
                {resp.texto}
              </div>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', borderTop: '1px dashed #ccc', paddingTop: '20px', flexWrap: 'wrap' }}>
                
                <div style={{ flex: '1 1 120px', maxWidth: '150px' }}>
                  <Input 
                    label="Nota (0 a 10)*" 
                    type="number" min="0" max="10" step="0.1" required 
                    value={notas[resp.id] ?? (resp.nota ?? '')} 
                    onChange={e => setNotas({...notas, [resp.id]: e.target.value})} 
                  />
                </div>
                
                <div style={{ flex: '3 1 250px' }}>
                  <Input 
                    label="Feedback (Opcional)" 
                    multiline 
                    value={feedbacks[resp.id] ?? (resp.feedback ?? '')} 
                    onChange={e => setFeedbacks({...feedbacks, [resp.id]: e.target.value})} 
                    style={{ minHeight: '45px' }}
                  />
                </div>
                
                <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button variant="primary" onClick={() => handleAvaliarResposta(resp.id)}>
                    Salvar Avaliação
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PainelCorrecao;