import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PainelCorrecao from './PainelCorrecao';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { api } from '../../services/api';

const mockAtividade = {
  id: 1,
  titulo: 'Redação sobre a Guerra Fria',
  descricao: 'Escreva 30 linhas',
  data_entrega: '2026-04-01T00:00:00Z',
  turma: 1
};

const mockRespostas = [
  {
    id: 100,
    atividade: 1,
    aluno: 2,
    aluno_nome: 'João da Silva',
    texto: 'Esta é a minha redação...',
  }
];

describe('Componente PainelCorrecao', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('não deve permitir salvar uma avaliação com nota maior que 10', () => {
    render(
      <PainelCorrecao atividade={mockAtividade} respostas={mockRespostas} nomeTurma="Turma A" onVoltar={() => {}} onAvaliacaoSalva={() => {}} />
    );

    const inputNota = screen.getByRole('spinbutton');
    fireEvent.change(inputNota, { target: { value: '11' } });

    const botaoSalvar = screen.getByRole('button', { name: /Salvar Avaliação/i });
    fireEvent.click(botaoSalvar);

    expect(window.alert).toHaveBeenCalledWith('A nota é obrigatória e deve ser entre 0 e 10.');
  });

  it('não deve permitir salvar uma avaliação com nota menor que 0', () => {
    render(
      <PainelCorrecao atividade={mockAtividade} respostas={mockRespostas} nomeTurma="Turma A" onVoltar={() => {}} onAvaliacaoSalva={() => {}} />
    );

    const inputNota = screen.getByRole('spinbutton');
    fireEvent.change(inputNota, { target: { value: '-2' } });

    const botaoSalvar = screen.getByRole('button', { name: /Salvar Avaliação/i });
    fireEvent.click(botaoSalvar);

    expect(window.alert).toHaveBeenCalledWith('A nota é obrigatória e deve ser entre 0 e 10.');
  });

  it('deve exibir mensagem amigável quando não houver respostas da turma', () => {
    render(
      <PainelCorrecao atividade={mockAtividade} respostas={[]} nomeTurma="Turma A" onVoltar={() => {}} onAvaliacaoSalva={() => {}} />
    );

    const mensagem = screen.getByText('Nenhum aluno respondeu a esta atividade ainda.');
    expect(mensagem).toBeInTheDocument();
  });

  it('deve chamar a função onVoltar ao clicar no botão de voltar', () => {
    const onVoltarMock = vi.fn(); 

    render(
      <PainelCorrecao atividade={mockAtividade} respostas={mockRespostas} nomeTurma="Turma A" onVoltar={onVoltarMock} onAvaliacaoSalva={() => {}} />
    );

    const botaoVoltar = screen.getByText('← Voltar para Atividades');
    fireEvent.click(botaoVoltar);

    expect(onVoltarMock).toHaveBeenCalledTimes(1);
  });

  it('deve salvar a avaliação com sucesso e chamar a API corretamente (Caminho Feliz)', async () => {

    const apiPatchSpy = vi.spyOn(api, 'patch').mockResolvedValueOnce({ data: {} } as any);
    const onAvaliacaoSalvaMock = vi.fn();

    render(
      <PainelCorrecao atividade={mockAtividade} respostas={mockRespostas} nomeTurma="Turma A" onVoltar={() => {}} onAvaliacaoSalva={onAvaliacaoSalvaMock} />
    );

    const inputNota = screen.getByRole('spinbutton');
    fireEvent.change(inputNota, { target: { value: '8.5' } });

    const botaoSalvar = screen.getByRole('button', { name: /Salvar Avaliação/i });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(apiPatchSpy).toHaveBeenCalledWith('/respostas/100/', {
        nota: 8.5,
        feedback: ''
      });

      expect(window.alert).toHaveBeenCalledWith('Avaliação salva com sucesso!');
      expect(onAvaliacaoSalvaMock).toHaveBeenCalledTimes(1);
    });
  });

});