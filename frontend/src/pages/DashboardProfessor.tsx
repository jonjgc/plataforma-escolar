import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
}

interface Turma {
  id: number;
  nome: string;
}

const DashboardProfessor: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [turmaId, setTurmaId] = useState('');

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
      console.error("Erro ao carregar dados da API", error);
    }
  };

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
      
      carregarDados(); 
    } catch (error) {
      console.error("Erro ao criar atividade", error);
      alert('Erro ao criar a atividade. Verifique os dados.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>Portal do Professor</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </header>

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
          
          <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Publicar Atividade</button>
        </form>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h3>Atividades Publicadas</h3>
        {atividades.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma atividade criada ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {atividades.map(atv => (
              <li key={atv.id} style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '6px', background: '#fff' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{atv.titulo}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#333' }}>{atv.descricao}</p>
                <small style={{ color: '#666', fontWeight: 'bold' }}>Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardProfessor;