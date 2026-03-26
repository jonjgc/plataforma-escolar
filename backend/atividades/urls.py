from django.urls import path
from . import views

urlpatterns = [
    path('me/atividades/', views.MeAtividadesView.as_view(), name='me-atividades'),
    path('atividades/', views.AtividadeCreateView.as_view(), name='atividade-create'),
    path('atividades/<int:id>/respostas/', views.AtividadeRespostasView.as_view(), name='atividade-respostas'),
    path('respostas/', views.RespostaCreateView.as_view(), name='resposta-create'),
    path('me/respostas/', views.MeRespostasView.as_view(), name='me-respostas'),
    path('respostas/<int:id>/', views.RespostaUpdateView.as_view(), name='resposta-update'),
]