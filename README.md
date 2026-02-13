# Prisma

Educational platform for programming education with automatic grading and intelligent feedback.

## 🎯 About the Project

Prisma is an educational platform that allows teachers to create programming activities and students to receive intelligent and personalized feedback on their submissions. The platform uses **Autograder** - an automatic grading system with intelligent feedback - to analyze student code and provide constructive guidance that helps in the learning process.

### Main Features

- 📝 **Integrated Code Editor** - Monaco Editor (same as VS Code)
- 🤖 **Autograder System** - Automatic grading with intelligent feedback
- 📊 **Progress Dashboard** - Activity and grade tracking
- 🏫 **Class Management** - Organization by courses
- 🔐 **Canvas Authentication** - Integration with Canvas LMS via OAuth2
- 📚 **Learning Resources** - Links to educational materials linked to tests

## 🚀 How to Run the Project

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prisma
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access in browser:
```
http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Generate production build
npm run preview      # Preview production build

# Tests
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
```

## 📁 Project Structure

```
prisma/
├── src/
│   ├── components/       # Reusable Vue components
│   │   ├── ActivityList.vue
│   │   ├── AppHeader.vue
│   │   ├── CodeEditor.vue
│   │   ├── ConsoleOutput.vue
│   │   ├── Dashboard.vue
│   │   ├── EditorPanel.vue
│   │   └── ProblemPanel.vue
│   ├── views/           # Application pages
│   │   ├── ClassesPage.vue
│   │   ├── ActivitiesPage.vue
│   │   └── ProblemPage.vue
│   ├── router/          # Route configuration
│   │   └── index.js
│   ├── data/            # Mock data (temporary)
│   │   ├── problems.js
│   │   └── studentData.js
│   ├── utils/           # Utility functions
│   │   ├── formatters.js
│   │   └── monaco-loader.js
│   ├── styles/          # Global styles
│   │   └── main.css
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── tests/               # Tests
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── docs/               # Documentation
│   ├── README.md
│   └── architecture/   # Architecture documentation
├── index.html
├── package.json
├── vite.config.js
└── vitest.config.js
```

## 🏗️ Architecture

### Frontend (Current)

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Routing**: Vue Router
- **Editor**: Monaco Editor
- **Tests**: Vitest + Vue Test Utils

### Backend (Planned)

- **Framework**: Spring Boot 3 + Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Auth**: Canvas OAuth2 + Spring Security
- **Cache**: Redis
- **Queue**: RabbitMQ

### Autograder System (Grading Component)

- **Code Execution**: Secure sandbox for code execution
- **Test Framework**: Customizable automated tests
- **Feedback System**: Intelligent feedback system
- **Learning Resources**: Educational material recommendation system

For more details about the architecture, see the [complete documentation](./docs/architecture/README.md).

## 📚 Documentation

Complete project documentation is available in the `docs/` folder:

- [Overview](./docs/README.md)
- [Architecture](./docs/architecture/README.md)
- [Architecture Recommendations](./docs/architecture/ARCHITECTURE_RECOMMENDATIONS.md)
- [Database Design](./docs/architecture/DATABASE_DESIGN.md)

## 🧪 Tests

The project uses Vitest for unit and integration tests.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- ✅ Unit tests for formatters
- ✅ Integration tests for navigation
- ✅ Vue component tests

## 🔄 Project Status

### ✅ Implemented

- [x] Classes and activities interface
- [x] Code editor with Monaco
- [x] Student progress dashboard
- [x] Routing system
- [x] Unit and integration tests

### 🚧 In Development

- [ ] Spring Boot backend
- [ ] Canvas OAuth2 authentication
- [ ] Submission system
- [ ] Autograder system integration

### 📋 Planned

- [ ] Ranking system
- [ ] Real-time notifications (WebSocket)
- [ ] Report export
- [ ] Advanced analytics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👥 Authors

- Prisma Team

## 🙏 Acknowledgments

- Canvas LMS for the integration API
- Vue.js community
- Spring Boot community

---

**Prisma** - Educational platform with intelligent automatic grading 🚀
