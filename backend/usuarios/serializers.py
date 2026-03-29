from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Pega o token padrão gerado pelo SimpleJWT
        token = super().get_token(user)
        token['role'] = user.role
        token['nome'] = user.nome
        
        return token