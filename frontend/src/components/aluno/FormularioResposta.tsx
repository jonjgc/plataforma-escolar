import React, { useState, useEffect } from 'react';
import { Atividade } from '../../pages/DashboardAluno';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FormularioRespostaProps {
  atividade: Atividade; textoInicial: string; isEdicao: boolean;
  onSubmit: (texto: string) => void; onCancelar: () => void;
}

const FormularioResposta: React.FC<FormularioRespostaProps> = ({ atividade, textoInicial, isEdicao, onSubmit, onCancelar }) => {
  const [texto, setTexto] = useState(textoInicial);

  useEffect(() => { setTexto(textoInicial); }, [textoInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(texto);
  };

  return (
    <Card style={{ marginTop: '30px', borderTop: '4px solid #007bff' }}>
      <h4 style={{ color: '#0056b3', marginTop: 0 }}>
        {isEdicao ? 'Editando Resposta:' : 'Respondendo:'} {atividade.titulo}
      </h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        
        <Input multiline placeholder="Escreva sua resposta aqui..." value={texto} onChange={e => setTexto(e.target.value)} required style={{ minHeight: '150px' }} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" variant="success" fullWidth>
            {isEdicao ? 'Atualizar Resposta' : 'Enviar Resposta'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FormularioResposta;