import React, { useState, useEffect } from 'react';
import { Atividade } from '../../pages/DashboardAluno';

interface FormularioRespostaProps {
  atividade: Atividade;
  textoInicial: string;
  isEdicao: boolean;
  onSubmit: (texto: string) => void;
  onCancelar: () => void;
}

const FormularioResposta: React.FC<FormularioRespostaProps> = ({ 
  atividade, 
  textoInicial, 
  isEdicao, 
  onSubmit, 
  onCancelar 
}) => {
  const [texto, setTexto] = useState(textoInicial);

  useEffect(() => {
    setTexto(textoInicial);
  }, [textoInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(texto);
  };

  return (
    <section style={{ marginTop: '30px', padding: '20px', border: '2px solid #007bff', borderRadius: '8px', background: '#fff' }}>
      <h4 style={{ color: '#0056b3', marginTop: 0 }}>
        {isEdicao ? 'Editando Resposta:' : 'Respondendo:'} {atividade.titulo}
      </h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        <textarea 
          placeholder="Escreva sua resposta aqui..." 
          value={texto} 
          onChange={e => setTexto(e.target.value)}
          required
          style={{ padding: '10px', minHeight: '120px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isEdicao ? 'Atualizar Resposta' : 'Enviar Resposta'}
          </button>
          <button 
            type="button" 
            onClick={onCancelar}
            style={{ padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormularioResposta;