from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Turma, Atividade, Resposta
from .serializers import TurmaSerializer, AtividadeSerializer, RespostaAlunoSerializer, RespostaProfessorSerializer
from .permissions import IsProfessor, IsAluno
from .services import RespostaService

# Fluxo Professor e Aluno

class MeAtividadesView(generics.ListAPIView):
    serializer_class = AtividadeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'PROFESSOR':
            return Atividade.objects.filter(professor=user)
        elif user.role == 'ALUNO':
            return Atividade.objects.filter(turma__alunos=user)
        return Atividade.objects.none()

# Fluxo do PROFESSOR

class AtividadeCreateView(generics.ListCreateAPIView):
    queryset = Atividade.objects.all() 
    serializer_class = AtividadeSerializer
    permission_classes = [IsProfessor]

    def perform_create(self, serializer):
        serializer.save(professor=self.request.user)

class AtividadeRespostasView(generics.ListAPIView):
    serializer_class = RespostaProfessorSerializer
    permission_classes = [IsProfessor]

    def get_queryset(self):
        atividade_id = self.kwargs['id']
        atividade = get_object_or_404(Atividade, id=atividade_id, professor=self.request.user)
        return Resposta.objects.filter(atividade=atividade)

# Fluxo do ALUNO

class RespostaCreateView(generics.CreateAPIView):
    serializer_class = RespostaAlunoSerializer
    permission_classes = [IsAluno]

    def perform_create(self, serializer):
        atividade = serializer.validated_data['atividade']
        
        if not atividade.turma.alunos.filter(id=self.request.user.id).exists():
            raise permissions.PermissionDenied("Você não pertence à turma desta atividade.")
        
        RespostaService.validar_prazo_atividade(atividade)
        
        serializer.save(aluno=self.request.user)

class MeRespostasView(generics.ListAPIView):
    serializer_class = RespostaAlunoSerializer
    permission_classes = [IsAluno]

    def get_queryset(self):
        return Resposta.objects.filter(aluno=self.request.user)

class RespostaUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, id):
        resposta = get_object_or_404(Resposta, id=id)
        user = request.user

        if user.role == 'ALUNO':
            if resposta.aluno != user:
                raise permissions.PermissionDenied("Você só pode editar suas próprias respostas.")
            
            texto = request.data.get('texto')
            resposta_atualizada = RespostaService.editar_resposta_aluno(resposta, texto)
            return Response(RespostaAlunoSerializer(resposta_atualizada).data)

        elif user.role == 'PROFESSOR':
            nota = request.data.get('nota')
            feedback = request.data.get('feedback')
            
            if nota is None:
                return Response({"erro": "A nota é obrigatória para correção."}, status=400)
                
            resposta_atualizada = RespostaService.avaliar_resposta_professor(user, resposta, nota, feedback)
            return Response(RespostaProfessorSerializer(resposta_atualizada).data)

class TurmaViewSet(viewsets.ModelViewSet):
    queryset = Turma.objects.all()
    serializer_class = TurmaSerializer
    permission_classes = [IsAuthenticated]