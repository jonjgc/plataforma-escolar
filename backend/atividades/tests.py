from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError, PermissionDenied
from usuarios.models import User
from .models import Turma, Atividade, Resposta
from .services import RespostaService

class TestDataFactory:
    @staticmethod
    def criar_usuario(email, role):
        return User.objects.create_user(email=email, password='password123', role=role)

    @staticmethod
    def criar_turma(nome, alunos=None):
        turma = Turma.objects.create(nome=nome)
        if alunos:
            turma.alunos.set(alunos)
        return turma

    @staticmethod
    def criar_atividade(titulo, turma, professor, dias_para_entrega=5):
        data_entrega = timezone.now() + timedelta(days=dias_para_entrega)
        return Atividade.objects.create(
            titulo=titulo, descricao="Descricao Teste", 
            turma=turma, data_entrega=data_entrega, professor=professor
        )

    @staticmethod
    def criar_resposta(atividade, aluno, texto="Minha resposta"):
        return Resposta.objects.create(atividade=atividade, aluno=aluno, texto=texto)

class RegrasDeNegocioTestCase(TestCase):
    def setUp(self):
        self.professor_1 = TestDataFactory.criar_usuario("prof1@teste.com", "PROFESSOR")
        self.professor_2 = TestDataFactory.criar_usuario("prof2@teste.com", "PROFESSOR")
        self.aluno_1 = TestDataFactory.criar_usuario("aluno1@teste.com", "ALUNO")
        self.turma = TestDataFactory.criar_turma("Turma A", alunos=[self.aluno_1])
        self.atividade_aberta = TestDataFactory.criar_atividade("Atividade 1", self.turma, self.professor_1, dias_para_entrega=2)
        self.atividade_vencida = TestDataFactory.criar_atividade("Atividade 2", self.turma, self.professor_1, dias_para_entrega=-2)
        self.resposta_aluno = TestDataFactory.criar_resposta(self.atividade_aberta, self.aluno_1)

    def test_aluno_nao_pode_responder_atividade_vencida(self):
        with self.assertRaises(ValidationError):
            RespostaService.validar_prazo_atividade(self.atividade_vencida)

    def test_professor_pode_corrigir_sua_propria_atividade(self):
        resposta_corrigida = RespostaService.avaliar_resposta_professor(
            professor=self.professor_1, 
            resposta=self.resposta_aluno, 
            nota=8.5, 
            feedback="Muito bom!"
        )
        self.assertEqual(resposta_corrigida.nota, 8.5)
        self.assertEqual(resposta_corrigida.feedback, "Muito bom!")

    def test_professor_nao_pode_corrigir_atividade_de_outro(self):
        with self.assertRaises(PermissionDenied):
            RespostaService.avaliar_resposta_professor(
                professor=self.professor_2, 
                resposta=self.resposta_aluno, 
                nota=9.0
            )