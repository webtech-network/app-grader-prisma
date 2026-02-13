eries

---

**Last updated:** 2024-02-13
**Version:** 1.0.0


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
5. Implement cache (Redis) for frequent qup_20240115.dump
```

## Scalability

### Partitioning

For large tables (submissions, test_results), consider partitioning by date:

```sql
-- Partition submissions by month
CREATE TABLE submissions_2024_01 PARTITION OF submissions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE submissions_2024_02 PARTITION OF submissions
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Replication

- **Master-Slave**: For distributed reading
- **Read Replicas**: For analytics and report queries_TIMESTAMP
);

CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

## Backup and Recovery

### Backup Strategy

1. **Full Backup**: Daily at 2 AM
2. **Incremental Backup**: Every 6 hours
3. **Retention**: 30 days of backups
4. **Restore Test**: Weekly in test environment

```bash
# Full backup
pg_dump -Fc prisma_db > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d prisma_db backu     SELECT a.id FROM activities a
            JOIN classes c ON a.class_id = c.id
            WHERE c.instructor_id = current_user_id()
        )
    );
```

### Audit

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id UUID REFERENCES users(id),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENTNDEX idx_users_role ON users(role);
```

## Security and Permissions

### Row Level Security (RLS) - PostgreSQL

```sql
-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Students only see their own submissions
CREATE POLICY student_submissions ON submissions
    FOR SELECT
    USING (user_id = current_user_id());

-- Policy: Instructors see submissions from their classes
CREATE POLICY instructor_submissions ON submissions
    FOR SELECT
    USING (
        activity_id IN (
       ame VARCHAR(255) NOT NULL,
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
CREATE Iration tool (Flyway, Liquibase, or similar)
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
    full_n_object(
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

1. **Tool**: Use database migcs

```sql
SELECT 
    COUNT(DISTINCT s.activity_id) AS activities_submitted,
    AVG(s.score) AS average_score,
    COUNT(CASE WHEN s.score >= a.max_score * 0.7 THEN 1 END) AS activities_passed
FROM submissions s
JOIN activities a ON s.activity_id = a.id
WHERE s.user_id = $1 AND a.class_id = $2 AND s.status = 'completed';
```

### 5. Get test results with linked resources

```sql
SELECT 
    tr.*,
    tc.name AS test_name,
    tc.description AS test_description,
    tc.category,
    json_agg(
        json_buildql
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

### 4. Calculate student dashboard statistiame;
```

### 2. List class activities with student progress

```sql
SELECT 
    a.*,
    s.score AS student_score,
    s.submitted_at AS last_submission,
    CASE 
        WHEN s.id IS NULL THEN 'Pending'
        WHEN s.score >= a.max_score * 0.7 THEN 'Completed'
        ELSE 'In progress'
    END AS status
FROM activities a
LEFT JOIN submissions s ON a.id = s.activity_id AND s.user_id = $1
WHERE a.class_id = $2 AND a.is_published = true
ORDER BY a.due_date;
```

### 3. Get complete submission feedback

```sission` (details)

### Materialized Views

- **activity_stats**: Refresh every 1 hour
- **student_progress**: Refresh every 30 minutes

```sql
-- Automatic refresh (via cron job or trigger)
REFRESH MATERIALIZED VIEW CONCURRENTLY activity_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY student_progress;
```

## Common Queries

### 1. List student's classes

```sql
SELECT c.*, e.enrolled_at, e.status
FROM classes c
JOIN enrollments e ON c.id = e.class_id
WHERE e.user_id = $1 AND e.status = 'active'
ORDER BY c.nrningResource** (via FeedbackResourceLink): Feedback can recommend multiple resources

### 1:1 (One to One)

- **Submission → Feedback**: Each submission has one unique feedback

## Indexes and Performance

### Main Indexes

1. **Email search**: `idx_users_email` (login)
2. **Activities by class**: `idx_activities_class` (listing)
3. **Submissions by student**: `idx_submissions_user` (history)
4. **Submissions by activity**: `idx_submissions_activity` (ranking)
5. **Results by submission**: `idx_test_results_submn have multiple activities
- **Class → Enrollment**: One class can have multiple enrollments
- **Activity → TestCase**: One activity can have multiple tests
- **Activity → Submission**: One activity can have multiple submissions
- **Submission → TestResult**: One submission can have multiple test results

### N:M (Many to Many)

- **User ↔ Class** (via Enrollment): Students can be in multiple classes
- **TestCase ↔ LearningResource** (via TestResourceLink): Tests can have multiple linked resources
- **Feedback ↔ Lea ON c.id = a.class_id AND a.is_published = true
LEFT JOIN submissions s ON a.id = s.activity_id AND e.user_id = s.user_id AND s.status = 'completed'
WHERE e.status = 'active'
GROUP BY e.user_id, e.class_id;

CREATE UNIQUE INDEX idx_student_progress_user_class ON student_progress(user_id, class_id);
```

## Relationships

### 1:N (One to Many)

- **User → Submission**: One user can have multiple submissions
- **User → Class** (as instructor): One instructor can have multiple classes
- **Class → Activity**: One class ca StudentProgress (Student Progress)

Materialized view for individual tracking.

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
JOIN activities asions,
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

### 13.ack_resource_links(learning_resource_id);
```

**Fields:**
- `id`: Unique identifier
- `feedback_id`: Feedback recommending the resource
- `learning_resource_id`: Recommended resource
- `reason`: Recommendation reason (e.g., "Test X failed")

### 12. ActivityStats (Activity Statistics)

Materialized view for analytics and dashboard.

```sql
CREATE MATERIALIZED VIEW activity_stats AS
SELECT 
    a.id AS activity_id,
    a.class_id,
    COUNT(DISTINCT s.user_id) AS total_students,
    COUNT(s.id) AS total_submis
CREATE TABLE feedback_resource_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feedback_id, learning_resource_id)
);

CREATE INDEX idx_feedback_resource_feedback ON feedback_resource_links(feedback_id);
CREATE INDEX idx_feedback_resource_resource ON feedbentifier
- `submission_id`: Related submission (1:1)
- `mode`: Mode used (default or ai)
- `content`: Complete feedback content (markdown)
- `summary`: Feedback summary
- `generated_at`: Generation date/time
- `ai_model`: AI model used (if AI mode)
- `ai_tokens_used`: Tokens consumed (if AI mode)
- `ai_generation_time_ms`: Generation time (if AI mode)
- `metadata`: Additional data (JSON)

### 11. FeedbackResourceLink (Recommended Resources in Feedback)

Learning resources recommended in each feedback.

```sql content TEXT NOT NULL,
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

**Fields:**
- `id`: Unique feedback id: Executed test
- `passed`: Test passed or failed
- `score`: Points obtained in this test
- `execution_time_ms`: Execution time
- `error_message`: Error message (if failed)
- `output`: Test output

### 10. Feedback (Generated Feedback)

Feedback generated for each submission.

```sql
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('default', 'ai')),
   E CASCADE,
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

**Fields:**
- `id`: Unique result identifier
- `submission_id`: Evaluated submission
- `test_case_id`ted code
- `language`: Language used
- `status`: Evaluation status
- `score`: Score obtained
- `execution_time_ms`: Execution time
- `submitted_at`: Submission date/time
- `evaluated_at`: Evaluation date/time

### 9. TestResult (Test Results)

Individual results of each executed test.

```sql
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETexecution_time_ms INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluated_at TIMESTAMP
);

CREATE INDEX idx_submissions_activity ON submissions(activity_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
```

**Fields:**
- `id`: Unique submission identifier
- `activity_id`: Submitted activity
- `user_id`: Student who submitted
- `code`: SubmitCES activities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
    score DECIMAL(5,2),
    source_id);
```

### 8. Submission (Submissions)

Student code submissions.

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCREATE INDEX idx_test_resource_test ON test_resource_links(test_case_id);
CREATE INDEX idx_test_resource_resource ON test_resource_links(learning_resource_id UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_case_id, learning_resource_id)
);

X idx_learning_resources_type ON learning_resources(resource_type);
```

**Fields:**
- `id`: Unique resource identifier
- `title`: Resource title
- `description`: Content description
- `url`: Resource URL
- `resource_type`: Resource type

### 7. TestResourceLink (Test-Resource Link)

N:M relationship between tests and resources.

```sql
CREATE TABLE test_resource_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    learning_reen test (doesn't show details to student)
- `order_index`: Execution order

### 6. LearningResource (Learning Resources)

Educational resources linked to tests.

```sql
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    resource_type VARCHAR(50) CHECK (resource_type IN ('documentation', 'tutorial', 'video', 'article', 'book')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDE INDEX idx_test_cases_order ON test_cases(order_index);
```

**Fields:**
- `id`: Unique test identifier
- `activity_id`: Activity it belongs to
- `name`: Test name (e.g., "test_two_sum_basic")
- `description`: Description of what the test validates
- `category`: Category (base, bonus, penalty)
- `weight`: Test weight in grade calculation
- `input_data`: Input data (JSON)
- `expected_output`: Expected output (JSON)
- `test_code`: Test code to be executed
- `timeout_ms`: Timeout in milliseconds
- `is_hidden`: Hidd    description TEXT,
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
CREATEsolution_code`: Reference solution (private)
- `language`: Programming language (javascript, python, java)
- `max_score`: Maximum score
- `due_date`: Due date
- `is_published`: Activity visible to students
- `feedback_config`: Feedback configuration (JSON)

### 5. TestCase (Test Cases)

Automated test cases for each activity.

```sql
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
lass ON activities(class_id);
CREATE INDEX idx_activities_published ON activities(is_published);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_feedback_config ON activities USING gin(feedback_config);
```

**Fields:**
- `id`: Unique activity identifier
- `class_id`: Class it belongs to
- `title`: Activity title
- `description`: Brief description
- `difficulty`: Difficulty level
- `problem_statement`: Complete problem statement
- `starter_code`: Provided starter code
- `": true
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
                "base": "Required Features",
                "bonus": "Extra Features",
                "penalty": "Penalties"
            }
        }
    }'::jsonb
);

CREATE INDEX idx_activities_ce VARCHAR(50) NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    due_date TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Feedback Configuration (JSON)
    feedback_config JSONB DEFAULT '{
        "mode": "default",
        "general": {
            "report_title": "Evaluation Report",
            "show_score": true,
            "show_passed_tests": false,
            "add_report_summaryleted)
- `final_grade`: Final grade (calculated)

### 4. Activity (Activities)

Programming activities with feedback configuration.

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
    languagCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
    final_grade DECIMAL(5,2),
    UNIQUE(user_id, class_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

**Fields:**
- `id`: Unique enrollment identifier
- `user_id`: Enrolled student
- `class_id`: Class
- `enrolled_at`: Enrollment date
- `status`: Enrollment status (active, dropped, comp_id`: Responsible instructor
- `semester`: Semester (e.g., "1st Semester", "2nd Semester")
- `year`: Academic year
- `is_active`: Class active or archived

### 3. Enrollment (Enrollments)

Relationship between students and classes.

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARASCADE,
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

**Fields:**
- `id`: Unique class identifier
- `code`: Class code (e.g., CS101)
- `name`: Course name
- `description`: Detailed description
- `instructorUser role (student, instructor, admin)
- `avatar_url`: Profile picture URL
- `created_at`: Account creation date
- `updated_at`: Last update date
- `last_login_at`: Last login date
- `is_active`: Account active or deactivated

### 2. Class (Classes)

Represents classes/courses.

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE C NULL CHECK (role IN ('student', 'instructor', 'admin')),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Fields:**
- `id`: Unique user identifier
- `email`: Unique email for login
- `password_hash`: Password hash (bcrypt)
- `full_name`: User's full name
- `role`: ──┐
│  Learning   │                               │ TestResult  │
│  Resource   │                               │             │
└─────────────┘                               └─────────────┘
```

## Entities and Tables

### 1. User (Users)

Stores information about students and instructors.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT                      ┌─────────────┐
│  Feedback   │                               │  TestCase   │
│             │                               │             │
└─────────────┘                               └─────────────┘
      │                                                 │
      │ N:M                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐                               ┌───────────                             │             │
└─────────────┘                               └─────────────┘
      │                                                 │
      │ 1:1                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐          Class    │
│             │  1:N    │             │  N:1    │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                                                 │
      │ 1:N                                        1:N │
      │                                                 │
      ▼                                                 ▼
┌─────────────┐                               ┌─────────────┐
│ Submission  │                               │  Activity   │
│             │  e complete database design for Prisma, including all entities, relationships, and indexes necessary to support:

- User management (students and instructors)
- Class organization and enrollments
- Programming activities with automated tests
- Student code submissions
- Feedback system (Default and AI)
- Linked learning resources
- History and analytics

## ER (Entity-Relationship) Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │────────▶│ Enrollment  │◀────────│   # Database Design - Prisma

## Overview

This document describes th