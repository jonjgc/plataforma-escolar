# Plataforma Escolar Full-Stack

Uma plataforma educacional completa e responsiva, dividida em dois portais (Professor e Aluno), construída com arquitetura moderna para facilitar a gestão de atividades, envios de respostas e correções. 

O projeto é totalmente containerizado com Docker e segue as regras de negócio tanto no backend (segurança e integridade de dados) quanto no frontend (validações de interface e UX).

## Tecnologias Utilizadas

O projeto foi construído utilizando o modelo Client-Server, separando claramente as responsabilidades entre Front e Back-end:

### Frontend (Pasta `/frontend`)
* **React(versão19.2.4) + TypeScript**: Construção da interface com tipagem estática para maior segurança.
* **Vite**: para o ambiente de desenvolvimento.
* **Design System Próprio**: Componentes reutilizáveis.
* **Axios**: Integração e consumo da API REST.
* **Vitest & React Testing Library**: Testes automatizados de interface, regras de negócio no cliente e simulação de chamadas de API.

### Backend (Pasta `/backend`)
* **Python + Django**: Framework principal para lógica e roteamento.
* **Django REST Framework (DRF)**: Criação da API RESTful.
* **PostgreSQL** (via Docker): Banco de dados relacional.
* **Autenticação & Permissões**: Modelagem customizada de Usuários (`role` baseado em ALUNO ou PROFESSOR).
* **Django TestCase e Factory Pattern**: Testes automatizados de backend para garantir a segurança das rotas e regras de negócio.

### Infraestrutura
* **Docker & Docker Compose**: Orquestração dos containers (Frontend, Backend e Banco de Dados), garantindo que o projeto rode perfeitamente em qualquer máquina.

## Regras de Negócio e Funcionalidades

O sistema foi desenhado para garantir a integridade do processo educacional:
- O Aluno deve estar vinculado a uma turma.
- O Aluno não pode enviar mais de uma resposta para a mesma atividade.
- O Aluno não pode acessar atividades de turmas às quais não pertence.
- O Aluno pode editar sua resposta livremente **antes** da data de entrega expirar.
- O Professor só tem permissão para corrigir atividades que ele mesmo criou.
- O Professor pode editar as notas e os feedbacks atribuídos.
- **Regra de Avaliação:** A nota é obrigatória e deve estar estritamente entre 0 e 10. O feedback em texto é opcional.

## Como rodar o projeto na sua máquina

Como o projeto utiliza Docker, a configuração é extremamente simples e não requer a instalação do Node ou do Python nativamente na sua máquina.

### Pré-requisitos
* Ter o Docker e o Docker Compose instalados.

### Passo 1: Clone e inicie os containers
No seu terminal, clone o repositório e suba os containers em segundo plano:
```bash
git clone https://github.com/jonjgc/plataforma-escolar.git
cd plataforma-escolar
docker-compose up -d --build
```

Verifique se os containers estão sendo executados, ao todo são 3, sendo um da interface web da plataforma(frontend), o outro é a API Django da aplicação(backend), e o Banco PostgreSQL. Para verificar execute o seguinte comando:

```bash
docker ps
```

Deverá aparecer assim após a execução o comando acima (exemplo):

```bash
CONTAINER ID   IMAGE                         COMMAND                  CREATED      STATUS       PORTS                                         NAMES
fc18173bde18   plataforma-escolar-frontend   "docker-entrypoint.s…"   3 days ago   Up 2 hours   0.0.0.0:5173->5173/tcp, [::]:5173->5173/tcp   escolar_frontend
e28b935d1860   plataforma-escolar-backend    "python manage.py ru…"   3 days ago   Up 2 hours   0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   escolar_backend
852cf3e5a15d   postgres:15-alpine            "docker-entrypoint.s…"   3 days ago   Up 2 hours   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   escolar_db
```

### Passo 2: Configure o Banco de Dados
Com os containers rodando, execute as migrações para criar as tabelas no banco de dados:

```bash
docker-compose exec backend python manage.py migrate
```

### Passo 3: Crie os usuários de teste
Para testar os painéis, crie rapidamente um Professor e um Aluno utilizando o shell do Django:

```bash
docker-compose exec backend python manage.py shell
```

Dentro do shell (>>>), cole os comandos abaixo:

```bash
#execute as duas linhas a baixo 
from usuarios.models import User
from atividades.models import Turma

#em seguida execute esta para criar o professor
prof = User.objects.create_user(email='professorced@teste.com', password='teste123', role='PROFESSOR', nome='Professor CED')

#esse comando vai criar uma turma
turma = Turma.objects.create(nome='Turma de Física')

#vai criar um aluno
aluno = User.objects.create_user(email='alunoced@teste.com', password='teste123', role='ALUNO', nome='Aluno CED')

#insere o aluno na turma criada
turma.alunos.add(aluno)

#por fim, saia do shell executando o comando abaixo
exit()
```

### Como testar a aplicação

Após a instalação, o Frontend estará disponível no seu navegador em: http://localhost:5173 e a API do Backend documentada no swagger com todos os endpoints em http://localhost:8000/api/docs/.

## 1️ Visão do Professor

Faça login com **professorced@teste.com** (Senha: `teste123`).

- Navegue pelo **Dashboard do Professor**.
- Crie uma **nova atividade para uma turma**.
- Clique em um dos **Cards de atividade** para abrir o **Painel de Correção**.
- Tente inserir uma **nota maior que 10** para ver a **validação do Frontend em ação**.

## 2 Visão do Aluno

Faça login com **alunoced@teste.com** (Senha: `teste123`).

- No **Portal do Aluno**, veja a lista de atividades.
- Clique em uma atividade com o **prazo aberto** para enviar sua resposta.
- Após o professor corrigir, verifique como **a nota e o feedback aparecem destacados no card da atividade**.

### Rodando os Testes Automatizados

O projeto conta com cobertura de testes para garantir sua estabilidade.

Para rodar os testes do Frontend (Vitest + React Testing Library):

```bash
docker-compose exec frontend npm run test
```

No backend foi usado testes automatizados de regras de negócio usando o Django TestCase com Factory Pattern, focados na validação das regras de negócio da camada de service. Use o comando abaixo para executar os testes:

```bash
docker-compose run --rm backend python manage.py test
```

#### Observação: 

Neste projeto eu utilizei React Context API para gerenciamento de estado global simples, implementado através do AuthContext, responsável por controlar informações de autenticação do usuário. Essa abordagem foi escolhida por ser leve, nativa do React e suficiente para a complexidade atual da aplicação. Caso o sistema evolua e passe a demandar um gerenciamento de estado mais robusto e escalável, uma possível evolução arquitetural seria a adoção de Redux, preferencialmente utilizando Redux Toolkit, que facilita a criação de stores, reducers e middlewares.