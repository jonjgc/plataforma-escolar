import React, { useState } from 'react';
import { api } from '../../services/api';

interface Turma {
  id: number;
  nome: string;
}

interface CriarAtividadeFormProps {
  turmas: Turma[];
  onSucesso: () => void;
}

const CriarAtividadeForm: React.FC<CriarAtividadeFormProps> = ({ turmas, onSucesso }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [turmaId, setTurmaId] = useState('');

  const handleCriarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/atividades/', {
        titulo,
        descricao,
        data_entrega: dataEntrega,
        turma: turmaId
      });
      
      alert('Atividade criada com sucesso!');
      setTitulo('');
      setDescricao('');
      setDataEntrega('');
      setTurmaId('');
      onSucesso(); 
    } catch (error) {
      console.error("Erro ao criar atividade", error);
      alert('Erro ao criar a atividade. Verifique os dados.');
    }
  };

  return (
    <section style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <h3>Nova Atividade</h3>
      <form onSubmit={handleCriarAtividade} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <input type="text" placeholder="Título da Atividade" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ padding: '10px' }} />
        <textarea placeholder="Descrição (o que o aluno deve fazer)" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: '10px', minHeight: '80px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Data e Hora de Entrega</label>
            <input type="datetime-local" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} required style={{ padding: '10px', width: '90%' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Turma</label>
            <select value={turmaId} onChange={e => setTurmaId(e.target.value)} required style={{ padding: '10px', width: '100%' }}>
              <option value="" disabled>Selecione uma Turma</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Publicar Atividade
        </button>
      </form>
    </section>
  );
};

export default CriarAtividadeForm;