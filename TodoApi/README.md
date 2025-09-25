# TodoApi

Uma API RESTful simples para gerenciamento de tarefas (To-Do List) desenvolvida com ASP.NET Core Web API e .NET 8.

## Características

- **Framework**: ASP.NET Core Web API (.NET 8)
- **Banco de Dados**: SQLite com Entity Framework Core
- **Documentação**: Swagger/OpenAPI
- **CRUD Completo**: Create, Read, Update, Delete de tarefas

## Modelo de Dados

A entidade `TodoItem` possui os seguintes campos:

- `Id` (int): Identificador único (auto-incremento)
- `Title` (string): Título da tarefa (obrigatório)
- `Description` (string): Descrição da tarefa (opcional)
- `IsCompleted` (bool): Status de conclusão (padrão: false)

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/todos` | Lista todas as tarefas |
| GET | `/api/todos/{id}` | Retorna uma tarefa específica por ID |
| POST | `/api/todos` | Cria uma nova tarefa |
| PUT | `/api/todos/{id}` | Atualiza uma tarefa existente |
| DELETE | `/api/todos/{id}` | Remove uma tarefa |

## Pré-requisitos

- .NET 8 SDK instalado
- Visual Studio, Visual Studio Code ou qualquer editor compatível com .NET

## Como Executar

### 1. Navegue até a pasta do projeto
```bash
cd TodoApi
```

### 2. Restaure as dependências
```bash
dotnet restore
```

### 3. Execute o projeto
```bash
dotnet run
```

### 4. Acesse a aplicação

- **Front-end (Interface Web)**: http://localhost:5XXX (substitua XXX pela porta mostrada no terminal)
- **Swagger UI**: http://localhost:5XXX/swagger
- **API Base**: http://localhost:5XXX/api

## Exemplos de Uso

### Criar uma nova tarefa
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Comprar leite",
  "description": "Ir ao supermercado comprar leite",
  "isCompleted": false
}
```

### Listar todas as tarefas
```bash
GET /api/todos
```

### Atualizar uma tarefa
```bash
PUT /api/todos/1
Content-Type: application/json

{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao supermercado comprar leite",
  "isCompleted": true
}
```

### Deletar uma tarefa
```bash
DELETE /api/todos/1
```

## Estrutura do Projeto

```
TodoApi/
├── Controllers/
│   └── TodosController.cs     # Controller com endpoints CRUD
├── Data/
│   └── TodoContext.cs         # DbContext do Entity Framework
├── Models/
│   └── TodoItem.cs            # Modelo da entidade TodoItem
├── Properties/
│   └── launchSettings.json    # Configurações de execução
├── appsettings.json           # Configurações da aplicação
├── Program.cs                 # Ponto de entrada da aplicação
├── TodoApi.csproj            # Arquivo de projeto
└── README.md                 # Este arquivo
```

## Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução da aplicação. O arquivo `todos.db` será gerado na pasta raiz do projeto.

## Front-end

O projeto inclui uma interface web moderna e responsiva com as seguintes funcionalidades:

### ✨ Características do Front-end:
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Interface Moderna**: Design limpo com gradientes e animações suaves
- **CRUD Completo**: Criar, visualizar, editar e excluir tarefas
- **Filtros Inteligentes**: Visualizar todas, pendentes ou concluídas
- **Estatísticas em Tempo Real**: Contadores de tarefas por status
- **Validação de Dados**: Feedback visual para erros e sucessos
- **Modal de Edição**: Interface intuitiva para editar tarefas
- **Notificações**: Alertas de sucesso e erro
- **Acessibilidade**: Suporte a teclado e screen readers

### 🎨 Tecnologias do Front-end:
- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo com Flexbox e Grid
- **JavaScript Vanilla**: Sem dependências externas
- **Font Awesome**: Ícones modernos
- **CSS Animations**: Transições suaves

## Tecnologias Utilizadas

### Backend:
- **ASP.NET Core 8.0**: Framework web
- **Entity Framework Core 8.0**: ORM para acesso a dados
- **SQLite**: Banco de dados embarcado
- **Swagger**: Documentação automática da API

### Frontend:
- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e moderno
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones vetoriais

## Licença

Este projeto é um exemplo educacional e está disponível sob a licença MIT.
