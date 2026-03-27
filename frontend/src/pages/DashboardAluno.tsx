import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
}

interface Resposta {
  id: number;
  atividade: number;
  texto: string;
  nota?: number | null;
  feedback?: string | null;
}

const DashboardAluno: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [minhasRespostas, setMinhasRespostas] = useState<Resposta[]>([]);
  
  const [respostaTexto, setRespostaTexto] = useState('');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [respostaExistenteId, setRespostaExistenteId] = useState<number | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resAtividades = await api.get('/atividades/');
      setAtividades(resAtividades.data);
      const resRespostas = await api.get('/me/respostas/');
      setMinhasRespostas(resRespostas.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  const handleAbrirResposta = (atv: Atividade) => {
    setAtividadeSelecionada(atv);
    
    const respostaEnviada = minhasRespostas.find(r => r.atividade === atv.id);
    
    if (respostaEnviada) {
      setRespostaTexto(respostaEnviada.texto);
      setRespostaExistenteId(respostaEnviada.id);
    } else {
      setRespostaTexto('');
      setRespostaExistenteId(null);
    }
  };

  const handleEnviarResposta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividadeSelecionada) return;

    try {
      if (respostaExistenteId) {
        await api.patch(`/respostas/${respostaExistenteId}/`, {
          texto: respostaTexto
        });
        alert('Resposta atualizada com sucesso!');
      } else {
        await api.post('/respostas/', {
          texto: respostaTexto,
          atividade: atividadeSelecionada.id
        });
        alert('Resposta enviada com sucesso!');
      }
      
      setRespostaTexto('');
      setAtividadeSelecionada(null);
      setRespostaExistenteId(null);
      carregarDados();
      
    } catch (error: any) {
      console.error("Erro ao enviar resposta", error);
      alert(error.response?.data?.detail || 'Erro ao processar sua resposta.');
    }
  };

  const prazoEncerrado = (dataString: string) => {
    return new Date() > new Date(dataString);
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
            {atividades.map(atv => {
              const respostaEnviada = minhasRespostas.find(r => r.atividade === atv.id);
              const isEncerrado = prazoEncerrado(atv.data_entrega);
              const jaAvaliada = respostaEnviada?.nota !== null && respostaEnviada?.nota !== undefined;

              return (
                <div key={atv.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: atividadeSelecionada?.id === atv.id ? '#e7f3ff' : '#fff' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{atv.titulo}</h4>
                  <p style={{ fontSize: '14px', color: '#444' }}>{atv.descricao}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    <span>📅 Prazo: {new Date(atv.data_entrega).toLocaleString('pt-BR')}</span>
                    {respostaEnviada && <span style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Respondida</span>}
                    {isEncerrado && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>❌ Encerrada</span>}
                  </div>
                  
                  {/* BLOCO DE AVALIAÇÃO DO PROFESSOR */}
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
                  
                  {!atividadeSelecionada && !isEncerrado && !jaAvaliada && (
                    <button 
                      onClick={() => handleAbrirResposta(atv)}
                      style={{ marginTop: '15px', padding: '8px 12px', cursor: 'pointer', background: respostaEnviada ? '#ffc107' : '#007bff', color: respostaEnviada ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                    >
                      {respostaEnviada ? 'Editar Resposta' : 'Responder'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {atividadeSelecionada && (
          <section style={{ marginTop: '30px', padding: '20px', border: '2px solid #007bff', borderRadius: '8px' }}>
            <h4>{respostaExistenteId ? 'Editando Resposta:' : 'Respondendo:'} {atividadeSelecionada.titulo}</h4>
            <form onSubmit={handleEnviarResposta} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <textarea 
                placeholder="Escreva sua resposta aqui..." 
                value={respostaTexto} 
                onChange={e => setRespostaTexto(e.target.value)}
                required
                style={{ padding: '10px', minHeight: '120px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {respostaExistenteId ? 'Atualizar Resposta' : 'Enviar Resposta'}
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