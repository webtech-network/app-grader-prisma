# Prisma Documentation

Educational platform for programming education that uses the **Autograder** system for automatic code grading with intelligent feedback integrated with Canvas LMS.

## 📚 Main Documents

### 1. [Architecture Recommendations](./architecture/ARCHITECTURE_RECOMMENDATIONS.md)
Technology stack, architectural decisions, and implementation roadmap.

**Read if you want to:**
- Understand the complete system architecture
- Learn about chosen technologies and why
- See the implementation roadmap
- Compare deployment options

### 2. [Database Design](./architecture/DATABASE_DESIGN.md)
Complete schema, relationships, queries, and scalability strategies.

**Read if you want to:**
- Understand the data model
- See optimized SQL queries
- Implement migrations
- Configure backups and replication

### 3. [Complete Index](./architecture/INDEX.md)
Detailed navigation by role, topic, and technology.

**Read if you want to:**
- Quickly find a specific topic
- Navigate through concepts and technologies
- See glossary of terms

## 🚀 Quick Start

### For New Developers

1. Read [Architecture Recommendations](./architecture/ARCHITECTURE_RECOMMENDATIONS.md) - "Context Analysis" section
2. See [Database Design](./architecture/DATABASE_DESIGN.md) - ER Diagram
3. Set up environment following the [Roadmap](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-implementation-roadmap)

### To Implement Features

1. Check [Database Design](./architecture/DATABASE_DESIGN.md) for required tables
2. Follow patterns in [Architecture Recommendations](./architecture/ARCHITECTURE_RECOMMENDATIONS.md)
3. Implement following microservices flow

## 🎯 System Overview

### What is it?

An intelligent autograder that:
- ✅ Executes student code in a secure environment (sandbox)
- ✅ Generates personalized and contextualized feedback
- ✅ Links learning resources to specific errors
- ✅ Integrates with Canvas LMS via OAuth2
- ✅ Provides analytics and dashboards for instructors

### Technology Stack (MVP)

```
Frontend:  Vue 3 + Vite
Backend:   Spring Boot + Java 17
Database:  PostgreSQL
Auth:      Canvas OAuth2
Autograder: Intelligent feedback system
```

### Architecture

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

## 📖 Core Concepts

### Prisma (Platform)
Complete educational platform for programming education, including class management, activities, submissions, and student progress tracking.

### Autograder (Grading System)
Component responsible for automatic grading that executes tests and generates intelligent feedback. The Autograder is integrated into Prisma to process student submissions.

### Canvas OAuth2
Single sign-on via Canvas LMS. All users (students and instructors) log in through Canvas.

### Sandbox Execution
Student code is executed in an isolated and secure environment to prevent attacks.

### Learning Resources
Educational URLs linked to specific tests. When a test fails, the resource is automatically recommended.

## 🔗 Quick Links

- [Technology Stack](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#recommended-technology-stack)
- [Canvas Authentication](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-authentication-via-canvas-lms)
- [Feedback System](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-autograder-system-with-intelligent-feedback)
- [Code Execution](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-code-execution---critical)
- [Database Schema](./architecture/DATABASE_DESIGN.md#entities-and-tables)
- [Deployment](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-deployment)
- [Roadmap](./architecture/ARCHITECTURE_RECOMMENDATIONS.md#-implementation-roadmap)

## 💡 Frequently Asked Questions

**Q: Why Canvas OAuth2 instead of custom auth?**
A: Integration with existing LMS, SSO for students, automatic class synchronization.

**Q: Why execute code in a sandbox?**
A: Security. Untrusted code needs to run in an isolated environment.

**Q: How does the feedback system work?**
A: The Autograder analyzes test results and generates contextualized and personalized feedback to help students learn.

## 📝 Contributing

When adding new documentation:
1. Maintain consistency with existing docs
2. Add links in INDEX.md
3. Use code examples when relevant
4. Include diagrams for complex concepts

---

**Last updated:** 2024-02-13
**Version:** 1.0.0
