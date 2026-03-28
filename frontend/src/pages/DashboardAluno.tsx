import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import FormularioResposta from '../components/aluno/FormularioResposta';
import ListaAtividadesAluno from '../components/aluno/ListaAtividadesAluno';
import { Header } from '../components/ui/Header';

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
    <Header titulo="Portal do Aluno" />
    
    <main style={{ marginTop: '20px' }}>
        <h3>Suas Atividades</h3>
        
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