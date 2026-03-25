from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    alunos = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='turmas', 
        limit_choices_to={'role': 'ALUNO'},
        blank=True
    )

    def __str__(self):
        return self.nome

class Atividade(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='atividades')
    data_entrega = models.DateTimeField()
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='atividades_criadas',
        limit_choices_to={'role': 'PROFESSOR'}
    )

    def __str__(self):
        return self.titulo

class Resposta(models.Model):
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE, related_name='respostas')
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='respostas',
        limit_choices_to={'role': 'ALUNO'}
    )
    texto = models.TextField()
    nota = models.FloatField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]
    )
    feedback = models.TextField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('atividade', 'aluno')

    def __str__(self):
        return f"Resposta de {self.aluno.email} - {self.atividade.titulo}"
