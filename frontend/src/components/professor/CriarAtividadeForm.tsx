import React, { useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Turma { id: number; nome: string; }
interface CriarAtividadeFormProps { turmas: Turma[]; onSucesso: () => void; }

const CriarAtividadeForm: React.FC<CriarAtividadeFormProps> = ({ turmas, onSucesso }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [turmaId, setTurmaId] = useState('');

  const handleCriarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/atividades/', { titulo, descricao, data_entrega: dataEntrega, turma: turmaId });
      alert('Atividade criada com sucesso!');
      setTitulo(''); setDescricao(''); setDataEntrega(''); setTurmaId('');
      onSucesso(); 
    } catch (error) {
      alert('Erro ao criar a atividade. Verifique os dados.');
    }
  };

  return (
    <Card style={{ marginTop: '20px' }}>
      <h3 style={{ marginTop: 0, color: '#2b3035' }}>Nova Atividade</h3>
      
      <form onSubmit={handleCriarAtividade} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        <Input label="Título da Atividade" type="text" placeholder="Ex: Redação sobre a Guerra Fria" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        
        <Input label="Descrição (o que o aluno deve fazer)" multiline placeholder="Escreva os detalhes aqui..." value={descricao} onChange={e => setDescricao(e.target.value)} required />
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          
          {/* flex: '1 1 200px' significa: cresça, encolha, mas a base é 200px */}
          <div style={{ flex: '1 1 200px' }}>
            <Input label="Data e Hora de Entrega" type="datetime-local" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} required />
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '14px', marginBottom: '6px', color: '#495057', fontWeight: 600, display: 'block' }}>Turma</label>
            <select value={turmaId} onChange={e => setTurmaId(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '15px' }}>
              <option value="" disabled>Selecione uma Turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>

        </div>
        
        <Button type="submit" variant="success" style={{ marginTop: '10px' }}>
          Publicar Atividade
        </Button>
      </form>
    </Card>
  );
};

export default CriarAtividadeForm;