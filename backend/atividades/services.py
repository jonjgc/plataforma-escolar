from django.utils import timezone
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Resposta

class RespostaService:
    @staticmethod
    def validar_prazo_atividade(atividade):
        if timezone.now() > atividade.data_entrega:
            raise ValidationError("O prazo para esta atividade já encerrou.")

    @staticmethod
    def editar_resposta_aluno(resposta, texto):
        RespostaService.validar_prazo_atividade(resposta.atividade)
        
        if texto:
            resposta.texto = texto
            resposta.save()
        return resposta

    @staticmethod
    def avaliar_resposta_professor(professor, resposta, nota, feedback=None):
        if resposta.atividade.professor != professor:
            raise PermissionDenied("Você só pode corrigir respostas de atividades que você criou.")
        
        resposta.nota = nota
        if feedback is not None:
            resposta.feedback = feedback
        
        resposta.save()
        return resposta