# Prisma Architecture

Complete technical documentation of the educational platform and its automatic grading system (Autograder) with intelligent feedback.

## 📚 Documents

### [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md)
**Technology stack, architectural decisions, and roadmap**

Contains:
- Requirements and challenges analysis
- Recommended stack (Vue 3, Spring Boot, PostgreSQL)
- Authentication via Canvas OAuth2
- Autograder system with intelligent feedback
- Secure code execution (sandbox)
- Deployment options (Docker)
- Implementation roadmap (6 weeks)
- Cost comparison

### [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)
**Complete schema and data modeling**

Contains:
- ER diagram with 13 tables
- Complete SQL schema
- Relationships and indexes
- Optimized common queries
- Backup and scalability strategies
- Migrations with Flyway/Liquibase
- Row Level Security (RLS)

### [INDEX.md](./INDEX.md)
**Detailed index and navigation**

Contains:
- Navigation by role (Frontend, Backend, Architect, PM)
- Navigation by topic (Auth, Database, Feedback, etc)
- Quick concept search
- Glossary of terms
- Links to official documentation

## 🎯 Where to start?

### I'm new to the project
1. Read [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - "Context Analysis" section
2. See [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - ER Diagram
3. Use [INDEX.md](./INDEX.md) to navigate specific topics

### I'm implementing a feature
1. Check [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - Required tables
2. See [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - Involved services
3. Follow defined architectural patterns

### I need to make technical decisions
1. Read [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) - Options comparison
2. See [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) - Scalability
3. Check [INDEX.md](./INDEX.md) - Useful external links

## 🔑 Core Concepts

### Prisma (Platform)
Complete educational platform that manages classes, activities, submissions, and student progress. Integrates with Canvas LMS and uses the Autograder for automatic grading.

### Autograder (Grading System)
Prisma component responsible for automatic grading that executes tests and generates intelligent feedback.

### Canvas OAuth2
Single sign-on via Canvas LMS. All users log in through Canvas, eliminating the need to manage passwords.

### Sandbox Execution
Student code is executed in an isolated environment to prevent attacks and ensure security.

### Learning Resources
Educational URLs linked to specific tests. When a test fails, relevant resources are automatically recommended.

## 🏗️ Architecture Summary

```
Frontend (Vue 3)
    ↓ REST API
Backend (Spring Boot)
    ↓
┌───┴───┬────────┬──────────┐
│       │        │          │
Postgres Redis  Autograder
```

**MVP Stack:**
- Frontend: Vue 3 + Vite
- Backend: Spring Boot 3 + Java 17
- Database: PostgreSQL
- Auth: Canvas OAuth2
- Autograder: Intelligent feedback system

## 📖 Recommended Reading

1. **Day 1:** [Context Analysis](./ARCHITECTURE_RECOMMENDATIONS.md#context-analysis)
2. **Day 2:** [Technology Stack](./ARCHITECTURE_RECOMMENDATIONS.md#recommended-technology-stack)
3. **Day 3:** [Database Design](./DATABASE_DESIGN.md#er-entity-relationship-diagram)
4. **Day 4:** [Canvas Authentication](./ARCHITECTURE_RECOMMENDATIONS.md#-authentication-via-canvas-lms)
5. **Day 5:** [Feedback System](./ARCHITECTURE_RECOMMENDATIONS.md#-autograder-system-with-intelligent-feedback)

## 🔗 Quick Links

- [Implementation Roadmap](./ARCHITECTURE_RECOMMENDATIONS.md#-implementation-roadmap)
- [Deployment Comparison](./ARCHITECTURE_RECOMMENDATIONS.md#-comparison-of-options)
- [Complete SQL Schema](./DATABASE_DESIGN.md#entities-and-tables)
- [Common Queries](./DATABASE_DESIGN.md#common-queries)
- [Glossary](./INDEX.md#-glossary)

---

**Last updated:** 2024-02-13
