import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
}

const DashboardAluno: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [resposta, setResposta] = useState('');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);

  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    try {
      const response = await api.get('/atividades/');
      setAtividades(response.data);
    } catch (error) {
      console.error("Erro ao buscar atividades", error);
    }
  };

  const handleEnviarResposta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividadeSelecionada) return;

    try {
      await api.post('/respostas/', {
        texto: resposta,
        atividade: atividadeSelecionada.id
      });
      
      alert('Resposta enviada com sucesso!');
      setResposta('');
      setAtividadeSelecionada(null);
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
      alert('Erro ao enviar resposta. Verifique se você já respondeu esta atividade.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h2>Portal do Aluno</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
      </header>

      <main style={{ marginTop: '20px' }}>
        <h3>Suas Atividades</h3>
        {atividades.length === 0 ? (
          <p>Nenhuma atividade disponível no momento.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {atividades.map(atv => (
              <div key={atv.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: atividadeSelecionada?.id === atv.id ? '#e7f3ff' : '#fff' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{atv.titulo}</h4>
                <p style={{ fontSize: '14px', color: '#444' }}>{atv.descricao}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</p>
                
                {!atividadeSelecionada && (
                  <button 
                    onClick={() => setAtividadeSelecionada(atv)}
                    style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
                  >
                    Responder
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {atividadeSelecionada && (
          <section style={{ marginTop: '30px', padding: '20px', border: '2px solid #007bff', borderRadius: '8px' }}>
            <h4>Respondendo: {atividadeSelecionada.titulo}</h4>
            <form onSubmit={handleEnviarResposta} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <textarea 
                placeholder="Escreva sua resposta aqui..." 
                value={resposta} 
                onChange={e => setResposta(e.target.value)}
                required
                style={{ padding: '10px', minHeight: '120px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Enviar Resposta
                </button>
                <button 
                  type="button" 
                  onClick={() => setAtividadeSelecionada(null)}
                  style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardAluno;