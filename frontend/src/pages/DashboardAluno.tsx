import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import FormularioResposta from '../components/aluno/FormularioResposta';
import ListaAtividadesAluno from '../components/aluno/ListaAtividadesAluno';

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  data_entrega: string;
}

export interface Resposta {
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
  
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [respostaExistenteId, setRespostaExistenteId] = useState<number | null>(null);
  const [textoInicial, setTextoInicial] = useState('');

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
      setTextoInicial(respostaEnviada.texto);
      setRespostaExistenteId(respostaEnviada.id);
    } else {
      setTextoInicial('');
      setRespostaExistenteId(null);
    }
  };

  const handleEnviarResposta = async (textoDigitado: string) => {
    if (!atividadeSelecionada) return;

    try {
      if (respostaExistenteId) {
        await api.patch(`/respostas/${respostaExistenteId}/`, { texto: textoDigitado });
        alert('Resposta atualizada com sucesso!');
      } else {
        await api.post('/respostas/', {
          texto: textoDigitado,
          atividade: atividadeSelecionada.id
        });
        alert('Resposta enviada com sucesso!');
      }
      
      setAtividadeSelecionada(null);
      setRespostaExistenteId(null);
      setTextoInicial('');
      carregarDados();
      
    } catch (error: any) {
      console.error("Erro ao enviar resposta", error);
      alert(error.response?.data?.detail || 'Erro ao processar sua resposta.');
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
        
        {/* COMPONENTE DA LISTA AQUI 👇 */}
        <ListaAtividadesAluno 
          atividades={atividades}
          minhasRespostas={minhasRespostas}
          atividadeSelecionadaId={atividadeSelecionada?.id || null}
          onAbrirResposta={handleAbrirResposta}
        />

        {atividadeSelecionada && (
          <FormularioResposta 
            atividade={atividadeSelecionada}
            textoInicial={textoInicial}
            isEdicao={!!respostaExistenteId}
            onSubmit={handleEnviarResposta}
            onCancelar={() => setAtividadeSelecionada(null)}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardAluno;