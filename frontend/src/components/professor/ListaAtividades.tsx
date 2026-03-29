import React from 'react';
import { Atividade } from '../../pages/DashboardProfessor';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ListaAtividadesProps {
  atividades: Atividade[];
  onVerRespostas: (atividade: Atividade) => void;
}

const ListaAtividades: React.FC<ListaAtividadesProps> = ({ atividades, onVerRespostas }) => {
  if (atividades.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
        <p>Nenhuma atividade publicada ainda.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '15px' }}>
      {atividades.map((atividade) => (
        <Card key={atividade.id} onClick={() => onVerRespostas(atividade)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0, color: '#2b3035', fontSize: '18px' }}>
                {atividade.titulo}
              </h4>
              <span style={{ fontSize: '12px', color: '#6c757d', backgroundColor: '#f8f9fa', padding: '4px 8px', borderRadius: '4px' }}>
                Entrega: {new Date(atividade.data_entrega).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <p style={{ margin: '10px 0', color: '#495057', fontSize: '14px', lineHeight: '1.5' }}>
              {atividade.descricao}
            </p>

            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => onVerRespostas(atividade)}>
                Ver Respostas
              </Button>
            </div>
            
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListaAtividades;