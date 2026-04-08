# AgendaPro - Sistema de Agendamento de Serviços

AgendaPro é uma aplicação web para gerenciamento de agendamentos de serviços, desenvolvida com **Laravel** no backend e **React + TypeScript** no frontend. Esta aplicação foi desenvolvida para aprimorar meus conhecimentos técnicos e implementar regras de negócio robustas.

## 🎯 Características

- ✅ Autenticação de usuários com JWT
- ✅ Gerenciamento de serviços
- ✅ Sistema de agendamentos com status
- ✅ Paginação de dados
- ✅ Interface responsiva e moderna
- ✅ Validação de formulários
- ✅ Tratamento de erros com feedback visual

## 🏗️ Estrutura do Projeto

```
agendapro/
├── backend/         # Laravel API
├── frontend/        # React + TypeScript
```

## 📖 Estrutura Backend

```
app/
├── Http/
│   ├── Controllers/      # Controllers da API
│   └── Middleware/       # Middlewares de autenticação
├── Models/
│   ├── User.php
│   ├── Service.php
│   └── Appointment.php
└── Providers/

database/
├── migrations/           # Migrations do banco
├── factories/            # Factories para testes
└── seeders/             # Seeds para popular dados

routes/
├── api.php              # Rotas da API
```

## 📖 Estrutura Frontend

```
src/
├── pages/               # Páginas da aplicação
│   ├── Login/
│   ├── Register/
│   ├── Service/
│   └── Appointment/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes UI base
├── services/           # Integração com API
│   ├── auth-service.ts
│   ├── service-service.ts
│   └── appointment-service.ts
├── schemas/            # Validações Zod
└── types/              # Tipos TypeScript
```

## 🔑 Endpoints da API

### Autenticação
- `POST /login` - Login do usuário
- `POST /register` - Registro de novo usuário
- `GET /user` - Dados do usuário autenticado

### Serviços
- `GET /services?page=1` - Listar serviços (paginado)
- `POST /services` - Criar serviço
- `PUT /services/{id}` - Atualizar serviço
- `DELETE /services/{id}` - Deletar serviço

### Agendamentos
- `GET /appointments?page=1` - Listar agendamentos (paginado)
- `POST /appointments` - Criar agendamento
- `PUT /appointments/{id}` - Atualizar agendamento
- `DELETE /appointments/{id}` - Deletar agendamento

## 🛠️ Tecnologias Utilizadas

### Backend
- **Laravel** - Framework PHP
- **JWT** - Autenticação
- **MySQL** - Banco de dados

### Frontend
- **React** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 🤝 Contribuindo

Contribuições são bem-vindas!