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
    aluno_nome = serializers.SerializerMethodField()

    class Meta:
        model = Resposta
        fields = ['id', 'atividade', 'aluno', 'aluno_nome', 'texto', 'nota', 'feedback', 'criado_em', 'atualizado_em']
        read_only_fields = ['aluno', 'aluno_nome', 'nota', 'feedback']

    def get_aluno_nome(self, obj):
        if getattr(obj.aluno, 'nome', None):
            return obj.aluno.nome
        return getattr(obj.aluno, 'email', f"Aluno ID {obj.aluno.id}")

class RespostaProfessorSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.SerializerMethodField()

    class Meta:
        model = Resposta
        fields = ['id', 'atividade', 'aluno', 'aluno_nome', 'texto', 'nota', 'feedback']
        read_only_fields = ['atividade', 'aluno', 'aluno_nome', 'texto']

    def get_aluno_nome(self, obj):
        if getattr(obj.aluno, 'nome', None):
            return obj.aluno.nome
        return getattr(obj.aluno, 'email', f"Aluno ID {obj.aluno.id}")