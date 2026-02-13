# Architecture Recommendations - Prisma

## Context Analysis

### Identified Requirements

1. **Interactive frontend** with code editor (Monaco)
2. **Code execution** for students (JavaScript, Python, Java)
3. **Intelligent feedback** system
4. **Class and activity management**
5. **Submissions and history**
6. **Dashboard and analytics**
7. **Linked learning resources**

### Technical Challenges

- ⚠️ **Security**: Execute untrusted student code
- ⚠️ **Scalability**: Multiple simultaneous submissions
- ⚠️ **Performance**: Fast feedback
- ⚠️ **Cost**: Feedback processing can be expensive
- ⚠️ **Availability**: System must always be accessible

## 🏆 Recommended Architecture

### Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue 3)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Monaco     │  │  Dashboard   │  │   Classes    │         │
│  │   Editor     │  │   Analytics  │  │  Activities  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
│              Auth, Business Logic, Data Management               │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │     Redis    │    │  Autograder  │
│  (Main DB)   │    │    (Cache)   │    │   Service    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Recommended Technology Stack

### 🎨 Frontend

**Technology:** Vue 3 + Vite (already implemented)

**Justification:**
- ✅ Already working
- ✅ Monaco Editor integrated
- ✅ Reactive and performant
- ✅ Great DX (Developer Experience)

**Add:**
- **Pinia** - State management (better than Vuex for Vue 3)
- **VueUse** - Utility composables
- **Axios** - HTTP client
- **TanStack Query (Vue Query)** - Data caching and synchronization
- **Tailwind CSS** - Styling (optional, already has CSS variables)

### 🗄️ Database

**Technology:** PostgreSQL 15+

**Justification:**
- ✅ **JSONB** - Perfect for feedback_config
- ✅ **Materialized views** - Fast analytics
- ✅ **Row Level Security** - Granular security
- ✅ **Full-text search** - Search in code/feedback
- ✅ **Extensions** - pg_trgm, uuid-ossp
- ✅ **Scalable** - Replication and partitioning

### 🔐 Authentication via Canvas LMS

**Technology:** Canvas OAuth2 (RFC-6749)

**Authentication Flow:**

The system uses Canvas LMS as the single identity provider. All users (students and instructors) authenticate through Canvas.

**OAuth2 Flow with Canvas:**

```
1. User clicks "Login with Canvas"
   ↓
2. Redirect to Canvas OAuth2:
   GET https://<canvas-url>/login/oauth2/auth
   ?client_id=XXX
   &response_type=code
   &redirect_uri=https://prisma.app/auth/callback
   &state=RANDOM_STATE
   &scope=/auth/userinfo
   ↓
3. User authorizes on Canvas
   ↓
4. Canvas redirects back:
   https://prisma.app/auth/callback
   ?code=AUTH_CODE
   &state=RANDOM_STATE
   ↓
5. Backend exchanges code for tokens:
   POST https://<canvas-url>/login/oauth2/token
   {
     grant_type: "authorization_code",
     client_id: "XXX",
     client_secret: "YYY",
     redirect_uri: "https://prisma.app/auth/callback",
     code: "AUTH_CODE"
   }
   ↓
6. Canvas returns:
   {
     access_token: "CANVAS_ACCESS_TOKEN",
     refresh_token: "CANVAS_REFRESH_TOKEN",
     expires_in: 3600,
     user: { id, name, email }
   }
   ↓
7. Backend creates/updates local user
   ↓
8. Backend generates own JWT + stores refresh token
   ↓
9. Frontend receives tokens and stores them
```

**Security:**

1. **Token Storage:**
   - Canvas access tokens: Encrypted in database
   - Refresh tokens: httpOnly cookies (not accessible via JavaScript)
   - Never expose tokens in URLs or logs

2. **Validation:**
   - Verify state parameter to prevent CSRF
   - Validate redirect_uri to prevent open redirect
   - Implement rate limiting on refresh endpoint

3. **Canvas Developer Key:**
   - Request from institution administrator
   - Configure correct redirect_uri
   - Define minimum necessary scopes

**Required Configuration:**

```env
# .env
CANVAS_URL=https://canvas.institution.edu
CANVAS_CLIENT_ID=your_developer_key_id
CANVAS_CLIENT_SECRET=your_developer_key_secret
CANVAS_REDIRECT_URI=https://prisma.app/auth/canvas/callback
```

### ⚡ Code Execution - **CRITICAL**

**Problem:** Executing untrusted code is DANGEROUS

**Recommended Solution: Container-based Sandboxing**

The system must execute student code in an isolated and secure environment (sandbox) to prevent:
- File system access
- Execution of malicious commands
- Excessive resource consumption
- Network attacks

**Sandbox Requirements:**
- Complete process isolation
- Execution time limit (timeout)
- Memory and CPU limits
- No network access
- Read-only environment

### 🤖 Autograder System with Intelligent Feedback

**Architecture:**

The autograder system has integrated AI for feedback generation. There's no need to choose between "AI mode" and "Default mode" - the autograder always uses intelligent analysis.

**Autograder Configuration:**

```json
{
  "general": {
    "report_title": "Evaluation Report",
    "show_score": true,
    "show_passed_tests": false,
    "add_report_summary": true
  },
  "feedback": {
    "provide_solutions": "hint",
    "feedback_tone": "encouraging but direct",
    "feedback_persona": "Code Buddy",
    "assignment_context": "",
    "extra_orientations": ""
  }
}
```

**Example Generated Feedback:**

```markdown
# Evaluation Report - Two Sum

## Score: 67/100

## General Analysis

Your code demonstrates basic understanding of the problem, but there are opportunities for improvement in efficiency and handling special cases.

## What Worked Well ✓

- You correctly identified the need to find two numbers that sum to the target
- Basic iteration logic is correct
- Code is readable and well-structured

## Areas for Improvement

### 1. Time Complexity (Test: test_performance)

**Problem:** Your solution uses two nested loops (O(n²)), which is inefficient for large arrays.

**Why this matters:** With 10,000 elements, your code makes 100 million comparisons.

**Suggestion:** Use an object/Map to store numbers already seen. This reduces complexity to O(n).

**Hint:** For each number, calculate `complement = target - num` and check if you've seen that complement.

### 2. Unhandled Special Case (Test: test_duplicate_values)

**Problem:** When the array has duplicate values, your code returns the same index twice.

**Example that failed:**
- Input: [3, 3], target: 6
- Expected: [0, 1]
- Got: [0, 0]

**Solution:** Make sure `i !== j` before returning the indices.

## Recommended Resources

📚 [Hash Tables in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
📚 [Complexity Analysis](https://www.bigocheatsheet.com/)

## Next Steps

1. Refactor using a Map to improve performance
2. Add validation to avoid using the same index twice
3. Test with larger arrays to verify efficiency

Keep practicing! You're on the right track. 🚀
```

### 🔄 Cache

**Technology:** Redis

**Use cases:**

1. **Session storage** - Refresh tokens
2. **Rate limiting** - Limit submissions per minute
3. **Query cache** - Activities, classes
4. **Real-time data** - Ranking, leaderboard
5. **Pub/Sub** - Real-time notifications

### 📡 Real-time Updates

**Technology:** WebSockets

**Use cases:**
- ✅ Notify when feedback is ready
- ✅ Update ranking in real-time
- ✅ Show execution progress
- ✅ Support chat (future)

## 🚀 Deployment

Prisma deployment can be done in different environments:

### Local Development

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
  
  backend:
    build: ./backend
    ports: ["8080:8080"]
    depends_on: [postgres, redis]
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: prisma
      POSTGRES_PASSWORD: secret
  
  redis:
    image: redis:7-alpine
```

### Production

For production, consider:
- **Frontend**: Static web server (Nginx, Apache)
- **Backend**: Application server
- **Database**: PostgreSQL with automatic backups
- **Cache**: Redis for sessions and cache
- **Queue**: Message queue for async processing

## 📋 Implementation Roadmap

### Phase 1: MVP (4-6 weeks)

**Week 1-2: Setup and Infrastructure**
- [ ] Setup project structure
- [ ] Configure PostgreSQL
- [ ] Implement Canvas OAuth2 authentication
- [ ] Configure Developer Key on Canvas
- [ ] CRUD for Users, Classes, Activities
- [ ] Canvas API synchronization

**Week 3-4: Core Features**
- [ ] Submission system
- [ ] Secure code execution system
- [ ] Autograder with intelligent feedback
- [ ] Basic dashboard

**Week 5-6: Intelligent Feedback and Polish**
- [ ] Intelligent feedback system
- [ ] Linked learning resources system
- [ ] Cache optimizations
- [ ] Testing and deployment

### Phase 2: Improvements (4-6 weeks)

- [ ] WebSockets for real-time
- [ ] Advanced analytics
- [ ] Ranking system
- [ ] Email notifications
- [ ] Export reports (PDF)

### Phase 3: Scale (ongoing)

- [ ] Optimize code execution system
- [ ] Implement Redis cache
- [ ] Message queue
- [ ] Monitoring
- [ ] CI/CD pipeline

## 🎯 Final Recommended Decision

### For MVP (Next 2 months):

```
Frontend:  Vue 3 + Vite (already ready)
Backend:   To be defined
Database:  PostgreSQL
Auth:      Canvas OAuth2
Autograder: Intelligent feedback system
Deploy:    To be defined
Cache:     Redis
```

**Why this stack?**
- ✅ Vue 3 is already working
- ✅ PostgreSQL is robust and scalable
- ✅ Canvas OAuth2 provides SSO
- ✅ Easy to start and scale
- ✅ Large and active community

## 🎓 Conclusion

**My recommendation:**

1. **Start with basic stack** to validate the product quickly
2. **Scale as needed** when reaching more users
3. **Implement microservices** when complexity justifies it

**Immediate next steps:**

1. Define backend technology
2. Configure PostgreSQL
3. Implement Canvas OAuth2 authentication
4. Implement secure code execution system
5. Implement feedback system
6. Configure deployment

---

**Last updated:** 2024-02-13
**Version:** 1.0.0
