import React from 'react';
import { Atividade } from '../../pages/DashboardProfessor';

interface ListaAtividadesProps {
  atividades: Atividade[];
  onVerRespostas: (atividade: Atividade) => void;
}

const ListaAtividades: React.FC<ListaAtividadesProps> = ({ atividades, onVerRespostas }) => {
  if (atividades.length === 0) {
    return <p style={{ color: '#666' }}>Nenhuma atividade criada ainda.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {atividades.map(atv => (
        <li 
          key={atv.id} 
          onClick={() => onVerRespostas(atv)}
          style={{ 
            border: '1px solid #ddd', 
            margin: '15px 0', 
            padding: '15px', 
            borderRadius: '6px', 
            background: '#fff', 
            cursor: 'pointer', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
          }}
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
  );
};

export default ListaAtividades;