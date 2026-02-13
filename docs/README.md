# Documentação do Prisma

Plataforma educacional para ensino de programação que utiliza o sistema **Autograder** para correção automática de código com feedback inteligente integrado ao Canvas LMS.

## 📚 Documentos Principais

### 1. [Recomendações de Arquitetura](./architecture/ARCHITECTURE_RECOMMENDATIONS.md)
Stack tecnológico, decisões arquiteturais e roadmap de implementação.

**Leia se você quer:**
- Entender a arquitetura completa do sistema
- Conhecer as tecnologias escolhidas e por quê
- Ver o roadmap de implementação
- Comparar opções de deployment

### 2. [Design do Banco de Dados](./architecture/DATABASE_DESIGN.md)
Schema completo, relacionamentos, queries e estratégias de escalabilidade.

**Leia se você quer:**
- Entender o modelo de dados
- Ver queries SQL otimizadas
- Implementar migrations
- Configurar backups e replicação

### 3. [Índice Completo](./architecture/INDEX.md)
Navegação detalhada por papel, tópico e tecnologia.

**Leia se você quer:**
- Encontrar rapidamente um tópico específico
- Navegar por conceitos e tecnologias
- Ver glossário de termos

## 🚀 Quick Start

### Para Desenvolvedores Novos

1. Leia [Recomendações de Arquitetura](./architecture/ARCHITECTURE_RECOMMENDATIONS.md) - Seção "Análise do Contexto"
2. Veja [Design do Banco de Dados](./architecture/DATABASE_DESIGN.md) - Diagrama ER
3. Configure o ambiente seguindo o [Roadmap](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-roadmap-de-implementação)

### Para Implementar Features

1. Consulte [Database Design](./architecture/DATABASE_DESIGN.md) para ver tabelas necessárias
2. Siga os padrões em [Architecture Recommendations](./architecture/ARCHITECTURE_RECOMMENDATIONS.md)
3. Implemente seguindo o fluxo de microserviços

## 🎯 Visão Geral do Sistema

### O que é?

Um autograder inteligente que:
- ✅ Executa código de alunos em ambiente seguro (sandbox)
- ✅ Gera feedback personalizado e contextualizado
- ✅ Vincula recursos de aprendizagem a erros específicos
- ✅ Integra com Canvas LMS via OAuth2
- ✅ Fornece analytics e dashboards para professores

### Stack Tecnológico (MVP)

```
Frontend:  Vue 3 + Vite
Backend:   Spring Boot + Java 17
Database:  PostgreSQL
Auth:      Canvas OAuth2
Autograder: Sistema de feedback inteligente
```

### Arquitetura

```
┌─────────────┐
│  Frontend   │ Vue 3 + Monaco Editor
└──────┬──────┘
       │ REST API
       ▼
┌─────────────┐
│   Backend   │ Spring Boot + JPA
└──────┬──────┘
       │
   ┌───┴───┬────────┐
   ▼       ▼        ▼
┌──────┐ ┌────┐ ┌──────────┐
│Postgres│Redis│ Autograder│
└────────┘└────┘ └──────────┘
```

## 📖 Conceitos Principais

### Prisma (Plataforma)
Plataforma educacional completa para ensino de programação, incluindo gestão de turmas, atividades, submissões e acompanhamento de progresso dos alunos.

### Autograder (Sistema de Correção)
Componente responsável pela correção automática que executa testes e gera feedback inteligente. O Autograder é integrado ao Prisma para processar as submissões dos alunos.

### Canvas OAuth2
Autenticação única via Canvas LMS. Todos os usuários (alunos e professores) fazem login através do Canvas.

### Sandbox Execution
Código dos alunos é executado em ambiente isolado e seguro para prevenir ataques.

### Learning Resources
URLs educacionais vinculadas a testes específicos. Quando um teste falha, o recurso é recomendado automaticamente.

## 🔗 Links Rápidos

- [Stack Tecnológico](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#stack-tecnológico-recomendado)
- [Autenticação Canvas](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-autenticação-via-canvas-lms)
- [Sistema de Feedback](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-sistema-de-autograder-com-feedback-inteligente)
- [Execução de Código](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-execução-de-código---crítico)
- [Schema do Banco](./architecture/DATABASE_DESIGN.md#entidades-e-tabelas)
- [Deployment](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-deployment)
- [Roadmap](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-roadmap-de-implementação)

## 💡 Dúvidas Frequentes

**Q: Por que Canvas OAuth2 em vez de auth próprio?**
A: Integração com LMS existente, SSO para alunos, sincronização automática de turmas.

**Q: Por que executar código em sandbox?**
A: Segurança. Código não confiável precisa rodar em ambiente isolado.

**Q: Como funciona o sistema de feedback?**
A: O Autograder analisa os resultados dos testes e gera feedback contextualizado e personalizado para ajudar o aluno a aprender.

## 📝 Contribuindo

Ao adicionar nova documentação:
1. Mantenha consistência com docs existentes
2. Adicione links no INDEX.md
3. Use exemplos de código quando relevante
4. Inclua diagramas para conceitos complexos

---

**Última atualização:** 2024-02-13
**Versão:** 1.0.0
