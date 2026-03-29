import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
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

const RespostaWrapper: React.FC<{ atividades: Atividade[], minhasRespostas: Resposta[], carregarDados: () => void }> = ({ atividades, minhasRespostas, carregarDados }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const atividadeSelecionada = atividades.find(a => a.id === Number(id));
  const respostaEnviada = minhasRespostas.find(r => r.atividade === Number(id));
  
  const textoInicial = respostaEnviada ? respostaEnviada.texto : '';
  const isEdicao = !!respostaEnviada;

  const handleEnviarResposta = async (textoDigitado: string) => {
    if (!atividadeSelecionada) return;

    try {
      if (isEdicao && respostaEnviada) {
        await api.patch(`/respostas/${respostaEnviada.id}/`, { texto: textoDigitado });
        alert('Resposta atualizada com sucesso!');
      } else {
        await api.post('/respostas/', {
          texto: textoDigitado,
          atividade: atividadeSelecionada.id
        });
        alert('Resposta enviada com sucesso!');
      }
      
      carregarDados();
      navigate('/aluno/atividades');
      
    } catch (error: any) {
      console.error("Erro ao enviar resposta", error);
      alert(error.response?.data?.detail || 'Erro ao processar sua resposta.');
    }
  };

  return (
    <>
      <ListaAtividadesAluno 
        atividades={atividades}
        minhasRespostas={minhasRespostas}
        atividadeSelecionadaId={atividadeSelecionada?.id || null}
        onAbrirResposta={(atv) => navigate(`/aluno/responder/${atv.id}`)}
      />

      {atividadeSelecionada && (
        <FormularioResposta 
          atividade={atividadeSelecionada}
          textoInicial={textoInicial}
          isEdicao={isEdicao}
          onSubmit={handleEnviarResposta}
          onCancelar={() => navigate('/aluno/atividades')}
        />
      )}
    </>
  );
};

const DashboardAluno: React.FC = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [minhasRespostas, setMinhasRespostas] = useState<Resposta[]>([]);
  const navigate = useNavigate();

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
    <Header titulo="Portal do Aluno" />
    
    <main style={{ marginTop: '20px' }}>
        <h3>Suas Atividades</h3>
        
        <Routes>
          <Route path="atividades" element={
            <ListaAtividadesAluno 
              atividades={atividades}
              minhasRespostas={minhasRespostas}
              atividadeSelecionadaId={null}
              onAbrirResposta={(atv) => navigate(`/aluno/responder/${atv.id}`)}
            />
          } />

          <Route path="responder/:id" element={
            <RespostaWrapper atividades={atividades} minhasRespostas={minhasRespostas} carregarDados={carregarDados} />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardAluno;