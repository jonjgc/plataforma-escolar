from rest_framework import serializers
from .models import Turma, Atividade, Resposta

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = '__all__'

class AtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atividade
        fields = ['id', 'titulo', 'descricao', 'turma', 'data_entrega', 'professor']
        read_only_fields = ['professor']

class RespostaAlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        fields = ['id', 'atividade', 'aluno', 'texto', 'nota', 'feedback', 'criado_em', 'atualizado_em']
        read_only_fields = ['aluno', 'nota', 'feedback']

class RespostaProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        fields = ['id', 'atividade', 'aluno', 'texto', 'nota', 'feedback']
        read_only_fields = ['atividade', 'aluno', 'texto']
