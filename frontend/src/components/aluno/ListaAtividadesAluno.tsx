import React from 'react';
import { Atividade, Resposta } from '../../pages/DashboardAluno';
import { Card } from '../ui/Card'; 

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
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
        <p>Nenhuma atividade disponível no momento.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '15px' }}>
      {atividades.map(atv => {
        const respostaEnviada = minhasRespostas.find(r => r.atividade === atv.id);
        const isEncerrado = prazoEncerrado(atv.data_entrega);
        const jaAvaliada = respostaEnviada?.nota !== null && respostaEnviada?.nota !== undefined;
        const canInteract = !atividadeSelecionadaId && !isEncerrado && !jaAvaliada;
        const bgSelecionada = atividadeSelecionadaId === atv.id ? '#e7f3ff' : undefined;

        return (
          <Card 
            key={atv.id} 
            style={{ background: bgSelecionada }} // Mantém o destaque se selecionada
            onClick={canInteract ? () => onAbrirResposta(atv) : undefined} 
          >

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, color: '#2b3035', fontSize: '18px' }}>
                  {atv.titulo}
                </h4>
                <div style={{ display: 'flex', gap: '5px', fontSize: '11px', fontWeight: 'bold' }}>
                  {respostaEnviada && <span style={{ color: '#fff', backgroundColor: '#28a745', padding: '3px 8px', borderRadius: '12px' }}>✓ Respondida</span>}
                  {isEncerrado && <span style={{ color: '#fff', backgroundColor: '#dc3545', padding: '3px 8px', borderRadius: '12px' }}>✕ Encerrada</span>}
                </div>
              </div>

              <p style={{ margin: '8px 0', fontSize: '15px', color: '#495057', lineHeight: '1.4' }}>
                {atv.descricao}
              </p>
              
              <div style={{ fontSize: '13px', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                📅 <span>Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</span>
              </div>
              
              {jaAvaliada && (
                <div style={{ marginTop: '15px', padding: '15px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '6px', color: '#155724' }}>
                  <strong style={{ fontSize: '17px', display: 'block', marginBottom: '8px' }}>
                    Nota: {respostaEnviada.nota} / 10
                  </strong>
                  {respostaEnviada.feedback && (
                    <p style={{ margin: '0', fontSize: '14px', fontStyle: 'italic', borderTop: '1px solid #c3e6cb', paddingTop: '8px' }}>
                      " {respostaEnviada.feedback} "
                    </p>
                  )}
                </div>
              )}

              {canInteract && (
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px dashed #eee', paddingTop: '10px' }}>
                  <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '14px' }}>
                    {respostaEnviada ? 'Editar Resposta ›' : 'Responder ›'}
                  </span>
                </div>
              )}

            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ListaAtividadesAluno;