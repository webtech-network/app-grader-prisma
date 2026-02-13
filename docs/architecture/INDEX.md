# Documentation Index - Prisma

## 📂 Document Structure

```
docs/
├── README.md                                    # Overview and quick start
└── architecture/
    ├── INDEX.md                                 # This file (detailed index)
    ├── README.md                                # Architecture navigation guide
    ├── ARCHITECTURE_RECOMMENDATIONS.md          # Stack and architectural decisions
    └── DATABASE_DESIGN.md                       # Schema and data modeling
```

## 🎯 Quick Navigation by Role

### 👨‍💻 Frontend Developer
1. [Frontend Stack](./ARCHITECTURE_RECOMMENDATIONS.md#-frontend)
2. [Backend Integration](./ARCHITECTURE_RECOMMENDATIONS.md#layer-1-frontend-vue-3)

### 👨‍💻 Backend Developer
1. [Backend Stack](./ARCHITECTURE_RECOMMENDATIONS.md#-backend-spring-boot-3--java-17-recommended)
2. [Database Schema](./DATABASE_DESIGN.md#entities-and-tables)
3. [Canvas Authentication](./ARCHITECTURE_RECOMMENDATIONS.md#-authentication-via-canvas-lms)

### 🏗️ Software Architect
1. [Architectural Decisions](./ARCHITECTURE_RECOMMENDATIONS.md#-recommended-architecture-microservices-with-serverless)
2. [Data Modeling](./DATABASE_DESIGN.md#er-entity-relationship-diagram)
3. [Scalability](./DATABASE_DESIGN.md#scalability)

### 📊 Product Manager
1. [Roadmap](./ARCHITECTURE_RECOMMENDATIONS.md#-implementation-roadmap)
2. [Cost Comparison](./ARCHITECTURE_RECOMMENDATIONS.md#-comparison-of-options)

## 📖 Navigation by Topic

### 🏛️ Architecture
- [Overview](./ARCHITECTURE_RECOMMENDATIONS.md#-recommended-architecture-microservices-with-serverless)
- [Microservices](./ARCHITECTURE_RECOMMENDATIONS.md#layer-3-microservices)
- [Deployment](./ARCHITECTURE_RECOMMENDATIONS.md#-deployment)

### 🗄️ Database
- [ER Diagram](./DATABASE_DESIGN.md#er-entity-relationship-diagram)
- [Tables](./DATABASE_DESIGN.md#entities-and-tables)
- [Common Queries](./DATABASE_DESIGN.md#common-queries)
- [Indexes](./DATABASE_DESIGN.md#indexes-and-performance)

### 🤖 Autograder & Feedback
- [Feedback System](./ARCHITECTURE_RECOMMENDATIONS.md#-autograder-system-with-intelligent-feedback)
- [Configuration](./ARCHITECTURE_RECOMMENDATIONS.md#autograder-configuration)
- [Optimizations](./ARCHITECTURE_RECOMMENDATIONS.md#optimizations)

### 🔐 Authentication
- [Canvas OAuth2](./ARCHITECTURE_RECOMMENDATIONS.md#-authentication-via-canvas-lms)
- [Auth Flow](./ARCHITECTURE_RECOMMENDATIONS.md#oauth2-flow-with-canvas)
- [Security](./ARCHITECTURE_RECOMMENDATIONS.md#security)

### ⚡ Code Execution
- [Sandbox](./ARCHITECTURE_RECOMMENDATIONS.md#-code-execution---critical)
- [Security](./ARCHITECTURE_RECOMMENDATIONS.md#-code-execution---critical)

## 🔍 Quick Search

### Key Concepts

| Concept | Document | Section |
|----------|-----------|-------|
| **Autograder** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Autograder System |
| **Canvas OAuth2** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Authentication via Canvas |
| **Sandbox** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Code Execution |
| **Learning Resources** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | LearningResource |
| **Spring Boot** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Backend |
| **JPA/Hibernate** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | ORM |
| **PostgreSQL** | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Database |
| **Microservices** | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md) | Layer 3 |

### Technology Stack

| Technology | Use | Document |
|------------|-----|-----------|
| **Vue 3** | Frontend | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-frontend) |
| **Spring Boot** | Backend | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-backend-spring-boot-3--java-17-recommended) |
| **PostgreSQL** | Database | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) |
| **Redis** | Cache | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-cache) |
| **Canvas LMS** | Auth & Sync | [ARCHITECTURE_RECOMMENDATIONS.md](./ARCHITECTURE_RECOMMENDATIONS.md#-authentication-via-canvas-lms) |
| **JPA/Hibernate** | ORM | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md#migrations-and-versioning) |

## 📝 Glossary

- **Prisma**: Complete educational platform for programming education
- **Autograder**: Automatic grading system integrated into Prisma with intelligent feedback
- **Canvas OAuth2**: Authentication via Canvas LMS (SSO)
- **Sandbox**: Isolated environment to execute untrusted code
- **Learning Resource**: Educational resource linked to tests
- **Submission**: Code submitted by student
- **Activity**: Programming problem with tests
- **Class**: Course/class
- **Enrollment**: Student enrollment in a class

---

**Tip**: Use Ctrl+F (or Cmd+F) to search for specific terms!
