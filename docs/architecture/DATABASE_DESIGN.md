# Database Design - Prisma

## Visão Geral

Este documento descreve o design completo do banco de dados para o Prisma, incluindo todas as entidades, relacionamentos e índices necessários para suportar:

- Gestão de usuários (alunos e professores)
- Organização de turmas e matrículas
- Atividades de programação com testes automatizados
- Submissões de código dos alunos
- Sistema de feedback (Default e AI)
- Recursos de aprendizagem vinculados
- Histórico e analytics

## Diagrama ER (Entity-Relationship)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │────────▶│ Enrollment  │◀────────│    Class    │
│             │  1:N    │             │  N:1    │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                                                 │
      │ 1:N                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐                               ┌─────────────┐
│ Submission  │                               │  Activity   │
│             │                               │             │
└─────────────┘                               └─────────────┘
      │                                                 │
      │ 1:1                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐                               ┌─────────────┐
│  Feedback   │                               │  TestCase   │
│             │                               │             │
└─────────────┘                               └─────────────┘
      │                                                 │
      │ N:M                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐                               ┌─────────────┐
│  Learning   │                               │ TestResult  │
│  Resource   │                               │             │
└─────────────┘                               └─────────────┘
```

## Entidades e Tabelas

### 1. User (Usuários)

Armazena informações de alunos e professores.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Campos:**
- `id`: Identificador único do usuário
- `email`: Email único para login
- `password_hash`: Hash da senha (bcrypt)
- `full_name`: Nome completo do usuário
- `role`: Papel do usuário (student, instructor, admin)
- `avatar_url`: URL da foto de perfil
- `created_at`: Data de criação da conta
- `updated_at`: Data da última atualização
- `last_login_at`: Data do último login
- `is_active`: Conta ativa ou desativada

### 2. Class (Turmas)

Representa turmas/disciplinas.

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    semester VARCHAR(20),
    year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_instructor ON classes(instructor_id);
CREATE INDEX idx_classes_code ON classes(code);
CREATE INDEX idx_classes_active ON classes(is_active);
```

**Campos:**
- `id`: Identificador único da turma
- `code`: Código da turma (ex: CS101)
- `name`: Nome da disciplina
- `description`: Descrição detalhada
- `instructor_id`: Professor responsável
- `semester`: Semestre (ex: "1º Semestre", "2º Semestre")
- `year`: Ano letivo
- `is_active`: Turma ativa ou arquivada

### 3. Enrollment (Matrículas)

Relacionamento entre alunos e turmas.

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
    final_grade DECIMAL(5,2),
    UNIQUE(user_id, class_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

**Campos:**
- `id`: Identificador único da matrícula
- `user_id`: Aluno matriculado
- `class_id`: Turma
- `enrolled_at`: Data de matrícula
- `status`: Status da matrícula (active, dropped, completed)
- `final_grade`: Nota final (calculada)

### 4. Activity (Atividades)

Atividades de programação com configuração de feedback.

```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    problem_statement TEXT NOT NULL,
    starter_code TEXT,
    solution_code TEXT,
    language VARCHAR(50) NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    due_date TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Feedback Configuration (JSON)
    feedback_config JSONB DEFAULT '{
        "mode": "default",
        "general": {
            "report_title": "Relatório de Avaliação",
            "show_score": true,
            "show_passed_tests": false,
            "add_report_summary": true
        },
        "ai": {
            "provide_solutions": "hint",
            "feedback_tone": "encouraging but direct",
            "feedback_persona": "Code Buddy",
            "assignment_context": "",
            "extra_orientations": ""
        },
        "default": {
            "category_headers": {
                "base": "Requisitos Obrigatórios",
                "bonus": "Funcionalidades Extras",
                "penalty": "Penalidades"
            }
        }
    }'::jsonb
);

CREATE INDEX idx_activities_class ON activities(class_id);
CREATE INDEX idx_activities_published ON activities(is_published);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_feedback_config ON activities USING gin(feedback_config);
```

**Campos:**
- `id`: Identificador único da atividade
- `class_id`: Turma à qual pertence
- `title`: Título da atividade
- `description`: Descrição breve
- `difficulty`: Nível de dificuldade
- `problem_statement`: Enunciado completo do problema
- `starter_code`: Código inicial fornecido
- `solution_code`: Solução de referência (privada)
- `language`: Linguagem de programação (javascript, python, java)
- `max_score`: Pontuação máxima
- `due_date`: Data de entrega
- `is_published`: Atividade visível para alunos
- `feedback_config`: Configuração de feedback (JSON)

### 5. TestCase (Casos de Teste)

Casos de teste automatizados para cada atividade.

```sql
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('base', 'bonus', 'penalty')),
    weight DECIMAL(5,2) DEFAULT 1.00,
    input_data JSONB,
    expected_output JSONB,
    test_code TEXT NOT NULL,
    timeout_ms INTEGER DEFAULT 5000,
    is_hidden BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_cases_activity ON test_cases(activity_id);
CREATE INDEX idx_test_cases_category ON test_cases(category);
CREATE INDEX idx_test_cases_order ON test_cases(order_index);
```

**Campos:**
- `id`: Identificador único do teste
- `activity_id`: Atividade à qual pertence
- `name`: Nome do teste (ex: "test_two_sum_basic")
- `description`: Descrição do que o teste valida
- `category`: Categoria (base, bonus, penalty)
- `weight`: Peso do teste no cálculo da nota
- `input_data`: Dados de entrada (JSON)
- `expected_output`: Saída esperada (JSON)
- `test_code`: Código do teste a ser executado
- `timeout_ms`: Timeout em milissegundos
- `is_hidden`: Teste oculto (não mostra detalhes ao aluno)
- `order_index`: Ordem de execução

### 6. LearningResource (Recursos de Aprendizagem)

Recursos educacionais vinculados a testes.

```sql
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    resource_type VARCHAR(50) CHECK (resource_type IN ('documentation', 'tutorial', 'video', 'article', 'book')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_resources_type ON learning_resources(resource_type);
```

**Campos:**
- `id`: Identificador único do recurso
- `title`: Título do recurso
- `description`: Descrição do conteúdo
- `url`: URL do recurso
- `resource_type`: Tipo de recurso

### 7. TestResourceLink (Vínculo Teste-Recurso)

Relacionamento N:M entre testes e recursos.

```sql
CREATE TABLE test_resource_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_case_id, learning_resource_id)
);

CREATE INDEX idx_test_resource_test ON test_resource_links(test_case_id);
CREATE INDEX idx_test_resource_resource ON test_resource_links(learning_resource_id);
```

### 8. Submission (Submissões)

Submissões de código dos alunos.

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
    score DECIMAL(5,2),
    execution_time_ms INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluated_at TIMESTAMP
);

CREATE INDEX idx_submissions_activity ON submissions(activity_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
```

**Campos:**
- `id`: Identificador único da submissão
- `activity_id`: Atividade submetida
- `user_id`: Aluno que submeteu
- `code`: Código submetido
- `language`: Linguagem utilizada
- `status`: Status da avaliação
- `score`: Nota obtida
- `execution_time_ms`: Tempo de execução
- `submitted_at`: Data/hora da submissão
- `evaluated_at`: Data/hora da avaliação

### 9. TestResult (Resultados de Testes)

Resultados individuais de cada teste executado.

```sql
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    passed BOOLEAN NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    execution_time_ms INTEGER,
    error_message TEXT,
    output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_results_submission ON test_results(submission_id);
CREATE INDEX idx_test_results_test_case ON test_results(test_case_id);
CREATE INDEX idx_test_results_passed ON test_results(passed);
```

**Campos:**
- `id`: Identificador único do resultado
- `submission_id`: Submissão avaliada
- `test_case_id`: Teste executado
- `passed`: Teste passou ou falhou
- `score`: Pontos obtidos neste teste
- `execution_time_ms`: Tempo de execução
- `error_message`: Mensagem de erro (se falhou)
- `output`: Saída do teste

### 10. Feedback (Feedback Gerado)

Feedback gerado para cada submissão.

```sql
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('default', 'ai')),
    content TEXT NOT NULL,
    summary TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- AI-specific fields
    ai_model VARCHAR(50),
    ai_tokens_used INTEGER,
    ai_generation_time_ms INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_feedbacks_submission ON feedbacks(submission_id);
CREATE INDEX idx_feedbacks_mode ON feedbacks(mode);
CREATE INDEX idx_feedbacks_generated_at ON feedbacks(generated_at DESC);
```

**Campos:**
- `id`: Identificador único do feedback
- `submission_id`: Submissão relacionada (1:1)
- `mode`: Modo usado (default ou ai)
- `content`: Conteúdo completo do feedback (markdown)
- `summary`: Resumo do feedback
- `generated_at`: Data/hora de geração
- `ai_model`: Modelo de IA usado (se AI mode)
- `ai_tokens_used`: Tokens consumidos (se AI mode)
- `ai_generation_time_ms`: Tempo de geração (se AI mode)
- `metadata`: Dados adicionais (JSON)

### 11. FeedbackResourceLink (Recursos Recomendados no Feedback)

Recursos de aprendizagem recomendados em cada feedback.

```sql
CREATE TABLE feedback_resource_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feedback_id, learning_resource_id)
);

CREATE INDEX idx_feedback_resource_feedback ON feedback_resource_links(feedback_id);
CREATE INDEX idx_feedback_resource_resource ON feedback_resource_links(learning_resource_id);
```

**Campos:**
- `id`: Identificador único
- `feedback_id`: Feedback que recomenda o recurso
- `learning_resource_id`: Recurso recomendado
- `reason`: Motivo da recomendação (ex: "Teste X falhou")

### 12. ActivityStats (Estatísticas de Atividades)

View materializada para analytics e dashboard.

```sql
CREATE MATERIALIZED VIEW activity_stats AS
SELECT 
    a.id AS activity_id,
    a.class_id,
    COUNT(DISTINCT s.user_id) AS total_students,
    COUNT(s.id) AS total_submissions,
    AVG(s.score) AS average_score,
    MAX(s.score) AS max_score,
    MIN(s.score) AS min_score,
    COUNT(CASE WHEN s.score >= a.max_score * 0.7 THEN 1 END) AS passing_students,
    AVG(s.execution_time_ms) AS avg_execution_time
FROM activities a
LEFT JOIN submissions s ON a.id = s.activity_id AND s.status = 'completed'
GROUP BY a.id, a.class_id;

CREATE UNIQUE INDEX idx_activity_stats_activity ON activity_stats(activity_id);
CREATE INDEX idx_activity_stats_class ON activity_stats(class_id);
```

### 13. StudentProgress (Progresso do Aluno)

View materializada para acompanhamento individual.

```sql
CREATE MATERIALIZED VIEW student_progress AS
SELECT 
    e.user_id,
    e.class_id,
    COUNT(DISTINCT a.id) AS total_activities,
    COUNT(DISTINCT s.activity_id) AS completed_activities,
    AVG(s.score) AS average_score,
    SUM(CASE WHEN s.score >= a.max_score * 0.7 THEN 1 ELSE 0 END) AS activities_passed,
    MAX(s.submitted_at) AS last_submission_date
FROM enrollments e
JOIN classes c ON e.class_id = c.id
JOIN activities a ON c.id = a.class_id AND a.is_published = true
LEFT JOIN submissions s ON a.id = s.activity_id AND e.user_id = s.user_id AND s.status = 'completed'
WHERE e.status = 'active'
GROUP BY e.user_id, e.class_id;

CREATE UNIQUE INDEX idx_student_progress_user_class ON student_progress(user_id, class_id);
```

## Relacionamentos

### 1:N (Um para Muitos)

- **User → Submission**: Um usuário pode ter várias submissões
- **User → Class** (como instrutor): Um instrutor pode ter várias turmas
- **Class → Activity**: Uma turma pode ter várias atividades
- **Class → Enrollment**: Uma turma pode ter várias matrículas
- **Activity → TestCase**: Uma atividade pode ter vários testes
- **Activity → Submission**: Uma atividade pode ter várias submissões
- **Submission → TestResult**: Uma submissão pode ter vários resultados de teste

### N:M (Muitos para Muitos)

- **User ↔ Class** (via Enrollment): Alunos podem estar em várias turmas
- **TestCase ↔ LearningResource** (via TestResourceLink): Testes podem ter vários recursos vinculados
- **Feedback ↔ LearningResource** (via FeedbackResourceLink): Feedback pode recomendar vários recursos

### 1:1 (Um para Um)

- **Submission → Feedback**: Cada submissão tem um único feedback

## Índices e Performance

### Índices Principais

1. **Busca por email**: `idx_users_email` (login)
2. **Atividades por turma**: `idx_activities_class` (listagem)
3. **Submissões por aluno**: `idx_submissions_user` (histórico)
4. **Submissões por atividade**: `idx_submissions_activity` (ranking)
5. **Resultados por submissão**: `idx_test_results_submission` (detalhes)

### Views Materializadas

- **activity_stats**: Atualizar a cada 1 hora
- **student_progress**: Atualizar a cada 30 minutos

```sql
-- Refresh automático (via cron job ou trigger)
REFRESH MATERIALIZED VIEW CONCURRENTLY activity_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY student_progress;
```

## Queries Comuns

### 1. Listar turmas de um aluno

```sql
SELECT c.*, e.enrolled_at, e.status
FROM classes c
JOIN enrollments e ON c.id = e.class_id
WHERE e.user_id = $1 AND e.status = 'active'
ORDER BY c.name;
```

### 2. Listar atividades de uma turma com progresso do aluno

```sql
SELECT 
    a.*,
    s.score AS student_score,
    s.submitted_at AS last_submission,
    CASE 
        WHEN s.id IS NULL THEN 'Pendente'
        WHEN s.score >= a.max_score * 0.7 THEN 'Concluída'
        ELSE 'Em andamento'
    END AS status
FROM activities a
LEFT JOIN submissions s ON a.id = s.activity_id AND s.user_id = $1
WHERE a.class_id = $2 AND a.is_published = true
ORDER BY a.due_date;
```

### 3. Obter feedback completo de uma submissão

```sql
SELECT 
    f.*,
    json_agg(
        json_build_object(
            'title', lr.title,
            'description', lr.description,
            'url', lr.url,
            'type', lr.resource_type,
            'reason', frl.reason
        )
    ) AS recommended_resources
FROM feedbacks f
LEFT JOIN feedback_resource_links frl ON f.id = frl.feedback_id
LEFT JOIN learning_resources lr ON frl.learning_resource_id = lr.id
WHERE f.submission_id = $1
GROUP BY f.id;
```

### 4. Calcular estatísticas do dashboard do aluno

```sql
SELECT 
    COUNT(DISTINCT s.activity_id) AS activities_submitted,
    AVG(s.score) AS average_score,
    COUNT(CASE WHEN s.score >= a.max_score * 0.7 THEN 1 END) AS activities_passed
FROM submissions s
JOIN activities a ON s.activity_id = a.id
WHERE s.user_id = $1 AND a.class_id = $2 AND s.status = 'completed';
```

### 5. Obter resultados de testes com recursos vinculados

```sql
SELECT 
    tr.*,
    tc.name AS test_name,
    tc.description AS test_description,
    tc.category,
    json_agg(
        json_build_object(
            'title', lr.title,
            'url', lr.url,
            'description', lr.description
        )
    ) FILTER (WHERE lr.id IS NOT NULL) AS linked_resources
FROM test_results tr
JOIN test_cases tc ON tr.test_case_id = tc.id
LEFT JOIN test_resource_links trl ON tc.id = trl.test_case_id
LEFT JOIN learning_resources lr ON trl.learning_resource_id = lr.id
WHERE tr.submission_id = $1
GROUP BY tr.id, tc.id;
```

## Migrations and Versioning

### Migration Strategy

1. **Tool**: Use database migration tool (Flyway, Liquibase, or similar)
2. **Versioning**: Each migration has unique timestamp (V1__description.sql)
3. **Rollback**: Always create reversible migrations
4. **Testing**: Test migrations in staging environment

### Migration Example

```sql
-- V1__create_users_table.sql
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    canvas_id VARCHAR(255) UNIQUE,
    canvas_access_token TEXT,
    canvas_refresh_token TEXT,
    canvas_token_expires_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_canvas_id ON users(canvas_id);
CREATE INDEX idx_users_role ON users(role);
```

## Segurança e Permissões

### Row Level Security (RLS) - PostgreSQL

```sql
-- Habilitar RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Política: Alunos só veem suas próprias submissões
CREATE POLICY student_submissions ON submissions
    FOR SELECT
    USING (user_id = current_user_id());

-- Política: Instrutores veem submissões de suas turmas
CREATE POLICY instructor_submissions ON submissions
    FOR SELECT
    USING (
        activity_id IN (
            SELECT a.id FROM activities a
            JOIN classes c ON a.class_id = c.id
            WHERE c.instructor_id = current_user_id()
        )
    );
```

### Auditoria

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id UUID REFERENCES users(id),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

## Backup e Recuperação

### Estratégia de Backup

1. **Backup Completo**: Diário às 2h AM
2. **Backup Incremental**: A cada 6 horas
3. **Retenção**: 30 dias de backups
4. **Teste de Restore**: Semanal em ambiente de teste

```bash
# Backup completo
pg_dump -Fc prisma_db > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d prisma_db backup_20240115.dump
```

## Escalabilidade

### Particionamento

Para tabelas grandes (submissions, test_results), considerar particionamento por data:

```sql
-- Particionar submissions por mês
CREATE TABLE submissions_2024_01 PARTITION OF submissions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE submissions_2024_02 PARTITION OF submissions
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Replicação

- **Master-Slave**: Para leitura distribuída
- **Read Replicas**: Para queries de analytics e relatórios

## Final Considerations

This database design:

✅ Supports all Prisma requirements
✅ Allows horizontal and vertical scalability
✅ Includes indexes for common queries
✅ Implements appropriate relationships
✅ Supports auditing and security
✅ Facilitates analytics and reports
✅ Is extensible for future features

**Next Steps:**
1. Implement migrations with chosen migration tool
2. Create seeds for test data
3. Implement REST API over this schema
4. Configure automatic backups
5. Implement cache (Redis) for frequent queries

---

**Last updated:** 2024-02-13
**Version:** 1.0.0
