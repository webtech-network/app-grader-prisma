# Índice da Documentação - Prisma

## 📂 Estrutura de Documentos

```
docs/
├── README.md                                    # Visão geral e quick start
└── architecture/
    ├── INDEX.md                                 # Este arquivo (índice detalhado)
    ├── README.md                                # Guia de navegação da arquitetura
    ├── ARCHITECTURE_RECOMMENDATIONS.md          # Stack e decisões arquiteturais
    └── DATABASE_DESIGN.md                       # Schema e modelagem de dados
```

## 🎯 Navegação Rápida por Papel

### 👨‍💻 Desenvolvedor Frontend
1. [Stack Frontend](./ARCHITECTURE_RECOMMENDATIONS.md#-frontend)
2. [Integração com Backend](./ARCHITECTURE_RECOMMENDATIONS.md#layer-1-frontend-vue-3)

### 👨‍💻 Desenvolvedor Backend
1. [Stack Backend](./ARCHITECTURE_RECOMMENDATIONS.md#-backend-spring-boot-3--java-17-recomendado)
2. [Database Schema](./DATABASE_DESIGN.md#entidades-e-tabelas)
3. [Autenticação Canvas](./ARCHITECTURE_RECOMMENDATIONS.md#-autenticação-via-canvas-lms)

### 🏗️ Arquiteto de Software
1. [Decisões Arquiteturais](./ARCHITECTURE_RECOMMENDATIONS.md#-arquitetura-recomendada-microserviços-com-serverless)
2. [Modelagem de Dados](./DATABASE_DESIGN.md#diagrama-er-entity-relationship)
3. [Escalabilidade](./DATABASE_DESIGN.md#escalabilidade)

### 📊 Product Manager
1. [Roadmap](./ARCHITECTURE_RECOMMENDATIONS.md#-roadmap-de-implementação)
2. [Comparação de Custos](./ARCHITECTURE_RECOMMENDATIONS.md#-comparação-de-opções)

## 📖 Navegação por Tópico

### 🏛️ Arquitetura
- [Visão Geral](./ARCHITECTURE_RECOMMENDATIONS.md#-arquitetura-recomendada-microserviços-com-serverless)
- [Microserviços](./ARCHITECTURE_RECOMMENDATIONS.md#layer-3-microserviços)
- [Deployment](./ARCHITECTURE_RECOMMENDATIONS.md#-deployment)

### 🗄️ Banco de Dados
- [Diagrama ER](./DATABASE_DESIGN.md#diagrama-er-entity-relationship)
- [Tabelas](./DATABASE_DESIGN.md#entidades-e-tabelas)
- [Queries Comuns](./DATABASE_DESIGN.md#queries-comuns)
- [Índices](./DATABASE_DESIGN.md#índices-e-performance)

### 🤖 Autograder & Feedback
- [Sistema de Feedback](./ARCHITECTURE_RECOMMENDATIONS.md#-sistema-de-autograder-com-feedback-inteligente)
- [Configuração](./ARCHITECTURE_RECOMMENDATIONS.md#configuração-do-autograder)
- [Otimizações](./ARCHITECTURE_RECOMMENDATIONS.md#otimizações)

### 🔐 Autenticação
- [Canvas OAuth2](./ARCHITECTURE_RECOMMENDATIONS.md#-autenticação-via-canvas-lms)
- [Fluxo de Auth](./ARCHITECTURE_RECOMMENDATIONS.md#fluxo-oauth2-com-canvas)
- [Segurança](./ARCHITECTURE_RECOMMENDATIONS.md#segurança)

### ⚡ Execução de Código
- [Sandbox](./ARCHITECTURE_RECOMMENDATIONS.md#-execução-de-código---crítico)
- [Segurança](./ARCHITECTURE_RECOMMENDATIONS.md#-execução-de-código---crítico)

## 🔍 Busca Rápida

### Conceitos Chave

| Conceito | Documento | Seção |
|----------|-----------|-------|
| **Autograder** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Sistema de Autograder |
| **Canvas OAuth2** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Autenticação via Canvas |
| **Sandbox** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Execução de Código |
| **Learning Resources** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | LearningResource |
| **Spring Boot** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Backend |
| **JPA/Hibernate** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | ORM |
| **PostgreSQL** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Banco de Dados |
| **Microserviços** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Layer 3 |

### Stack Tecnológico

| Tecnologia | Uso | Documento |
|------------|-----|-----------|
| **Vue 3** | Frontend | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-frontend) |
| **Spring Boot** | Backend | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-backend-spring-boot-3--java-17-recomendado) |
| **PostgreSQL** | Database | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) |
| **Redis** | Cache | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-cache) |
| **Canvas LMS** | Auth & Sync | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-autenticação-via-canvas-lms) |
| **JPA/Hibernate** | ORM | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md#migrations-e-versionamento) |

## 📝 Glossário

- **Prisma**: Plataforma educacional completa para ensino de programação
- **Autograder**: Sistema de correção automática integrado ao Prisma com feedback inteligente
- **Canvas OAuth2**: Autenticação via Canvas LMS (SSO)
- **Sandbox**: Ambiente isolado para executar código não confiável
- **Learning Resource**: Recurso educacional vinculado a testes
- **Submission**: Código submetido pelo aluno
- **Activity**: Problema de programação com testes
- **Class**: Turma/disciplina
- **Enrollment**: Matrícula de aluno em turma

---

**Dica**: Use Ctrl+F (ou Cmd+F) para buscar termos específicos!
