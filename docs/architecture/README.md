# Arquitetura do Prisma

Documentação técnica completa da plataforma educacional e seu sistema de correção automática (Autograder) com feedback inteligente.

## 📚 Documentos

### [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md)
**Stack tecnológico, decisões arquiteturais e roadmap**

Contém:
- Análise de requisitos e desafios
- Stack recomendado (Vue 3, Spring Boot, PostgreSQL)
- Autenticação via Canvas OAuth2
- Sistema de autograder com feedback inteligente
- Execução segura de código (sandbox)
- Opções de deployment (Docker)
- Roadmap de implementação (6 semanas)
- Comparação de custos

### [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)
**Schema completo e modelagem de dados**

Contém:
- Diagrama ER com 13 tabelas
- Schema SQL completo
- Relacionamentos e índices
- Queries comuns otimizadas
- Estratégias de backup e escalabilidade
- Migrations com Flyway/Liquibase
- Row Level Security (RLS)

### [INDEX.md](./INDEX.md)
**Índice detalhado e navegação**

Contém:
- Navegação por papel (Frontend, Backend, Arquiteto, PM)
- Navegação por tópico (Auth, Database, Feedback, etc)
- Busca rápida de conceitos
- Glossário de termos
- Links para documentação oficial

## 🎯 Por onde começar?

### Sou novo no projeto
1. Leia [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - Seção "Análise do Contexto"
2. Veja [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - Diagrama ER
3. Use [INDEX.md](./INDEX.md) para navegar por tópicos específicos

### Vou implementar uma feature
1. Consulte [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - Tabelas necessárias
2. Veja [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - Serviços envolvidos
3. Siga os padrões arquiteturais definidos

### Preciso tomar decisões técnicas
1. Leia [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - Comparação de opções
2. Veja [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - Escalabilidade
3. Consulte [INDEX.md](./INDEX.md) - Links externos úteis

## 🔑 Conceitos Principais

### Prisma (Plataforma)
Plataforma educacional completa que gerencia turmas, atividades, submissões e progresso dos alunos. Integra-se com Canvas LMS e utiliza o Autograder para correção automática.

### Autograder (Sistema de Correção)
Componente do Prisma responsável pela correção automática que executa testes e gera feedback inteligente.

### Canvas OAuth2
Autenticação única via Canvas LMS. Todos os usuários fazem login através do Canvas, eliminando necessidade de gerenciar senhas.

### Sandbox Execution
Código dos alunos é executado em ambiente isolado para prevenir ataques e garantir segurança.

### Learning Resources
URLs educacionais vinculadas a testes específicos. Quando um teste falha, recursos relevantes são recomendados automaticamente.

## 🏗️ Arquitetura em Resumo

```
Frontend (Vue 3)
    ↓ REST API
Backend (Spring Boot)
    ↓
┌───┴───┬────────┬──────────┐
│       │        │          │
Postgres Redis  Autograder
```

**Stack MVP:**
- Frontend: Vue 3 + Vite
- Backend: Spring Boot 3 + Java 17
- Database: PostgreSQL
- Auth: Canvas OAuth2
- Autograder: Sistema de feedback inteligente

## 📖 Leitura Recomendada

1. **Dia 1:** [Análise do Contexto](./ARCHITECTURE_RECOMMENDATIONS.md#análise-do-contexto)
2. **Dia 2:** [Stack Tecnológico](./ARCHITECTURE_RECOMMENDATIONS.md#stack-tecnológico-recomendado)
3. **Dia 3:** [Database Design](./DATABASE_DESIGN.md#diagrama-er-entity-relationship)
4. **Dia 4:** [Autenticação Canvas](./ARCHITECTURE_RECOMMENDATIONS.md#-autenticação-via-canvas-lms)
5. **Dia 5:** [Sistema de Feedback](./ARCHITECTURE_RECOMMENDATIONS.md#-sistema-de-autograder-com-feedback-inteligente)

## 🔗 Links Rápidos

- [Roadmap de Implementação](./ARCHITECTURE_RECOMMENDATIONS.md#-roadmap-de-implementação)
- [Comparação de Deployment](./ARCHITECTURE_RECOMMENDATIONS.md#-comparação-de-opções)
- [Schema SQL Completo](./DATABASE_DESIGN.md#entidades-e-tabelas)
- [Queries Comuns](./DATABASE_DESIGN.md#queries-comuns)
- [Glossário](./INDEX.md#-glossário)

---

**Última atualização:** 2024-02-13
