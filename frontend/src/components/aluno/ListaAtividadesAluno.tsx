import React from 'react';
import { Atividade, Resposta } from '../../pages/DashboardAluno';

interface ListaAtividadesAlunoProps {
  atividades: Atividade[];
  minhasRespostas: Resposta[];
  atividadeSelecionadaId: number | null;
  onAbrirResposta: (atividade: Atividade) => void;
}

const ListaAtividadesAluno: React.FC<ListaAtividadesAlunoProps> = ({
  atividades,
  minhasRespostas,
  atividadeSelecionadaId,
  onAbrirResposta
}) => {
  const prazoEncerrado = (dataString: string) => {
    return new Date() > new Date(dataString);
  };

  if (atividades.length === 0) {
    return <p>Nenhuma atividade disponível no momento.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {atividades.map(atv => {
        const respostaEnviada = minhasRespostas.find(r => r.atividade === atv.id);
        const isEncerrado = prazoEncerrado(atv.data_entrega);
        const jaAvaliada = respostaEnviada?.nota !== null && respostaEnviada?.nota !== undefined;

        return (
          <div key={atv.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: atividadeSelecionadaId === atv.id ? '#e7f3ff' : '#fff' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{atv.titulo}</h4>
            <p style={{ fontSize: '14px', color: '#444' }}>{atv.descricao}</p>
            
            <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666', marginTop: '10px' }}>
              <span>📅 Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</span>
              {respostaEnviada && <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Respondida</span>}
              {isEncerrado && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>❌ Encerrada</span>}
            </div>
            
            {jaAvaliada && (
              <div style={{ marginTop: '15px', padding: '12px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '6px', color: '#155724' }}>
                <strong style={{ fontSize: '16px' }}>Nota: {respostaEnviada.nota} / 10</strong>
                {respostaEnviada.feedback && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontStyle: 'italic' }}>
                    " {respostaEnviada.feedback} "
                  </p>
                )}
              </div>
            )}
            
            {!atividadeSelecionadaId && !isEncerrado && !jaAvaliada && (
              <button 
                onClick={() => onAbrirResposta(atv)}
                style={{ marginTop: '15px', padding: '8px 12px', cursor: 'pointer', background: respostaEnviada ? '#ffc107' : '#007bff', color: respostaEnviada ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
              >
                {respostaEnviada ? 'Editar Resposta' : 'Responder'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListaAtividadesAluno;