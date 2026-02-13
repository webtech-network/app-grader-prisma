# Recomendações de Arquitetura - Prisma

## Análise do Contexto

### Requisitos Identificados

1. **Frontend interativo** com editor de código (Monaco)
2. **Execução de código** do aluno (JavaScript, Python, Java)
3. **Sistema de feedback** inteligente
4. **Gestão de turmas e atividades**
5. **Submissões e histórico**
6. **Dashboard e analytics**
7. **Recursos de aprendizagem vinculados**

### Desafios Técnicos

- ⚠️ **Segurança**: Executar código não confiável de alunos
- ⚠️ **Escalabilidade**: Múltiplas submissões simultâneas
- ⚠️ **Performance**: Feedback rápido
- ⚠️ **Custo**: Processamento de feedback pode ser custoso
- ⚠️ **Disponibilidade**: Sistema deve estar sempre acessível

## 🏆 Arquitetura Recomendada: **Microserviços com Serverless**

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue 3)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Monaco     │  │  Dashboard   │  │   Classes    │         │
│  │   Editor     │  │   Analytics  │  │  Activities  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST/GraphQL API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│              Auth, Rate Limiting, Load Balancing                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Auth       │    │   Core API   │    │  Execution   │
│   Service    │    │   Service    │    │   Service    │
│  (Node.js)   │    │  (Node.js)   │    │  (Isolated)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │  PostgreSQL  │    │   Message    │
│   (Users)    │    │  (Main DB)   │    │    Queue     │
└──────────────┘    └──────────────┘    │  (RabbitMQ)  │
                                         └──────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │   Workers    │
                                         │  (Sandbox)   │
                                         └──────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │   Feedback   │
                                         │   Service    │
                                         │  (AI/Default)│
                                         └──────────────┘
```

## Stack Tecnológico Recomendado

### 🎨 Frontend

**Tecnologia:** Vue 3 + Vite (já implementado)

**Justificativa:**
- ✅ Já está funcionando
- ✅ Monaco Editor integrado
- ✅ Reativo e performático
- ✅ Ótima DX (Developer Experience)

**Adicionar:**
- **Pinia** - State management (melhor que Vuex para Vue 3)
- **VueUse** - Composables utilitários
- **Axios** - HTTP client
- **TanStack Query (Vue Query)** - Cache e sincronização de dados
- **Tailwind CSS** - Styling (opcional, já tem CSS variables)

### 🔧 Backend: **Spring Boot 3 + Java 17** (Recomendado)

**Por quê Spring Boot?**

✅ **Ecossistema maduro** - Framework enterprise battle-tested
✅ **Spring Security** - Autenticação e autorização robustas
✅ **Spring Data JPA** - ORM poderoso com Hibernate
✅ **Injeção de Dependência** - IoC container nativo
✅ **Anotações** - Código limpo e expressivo
✅ **REST APIs** - Spring Web MVC
✅ **Testável** - JUnit 5 + Mockito integrados
✅ **Documentação** - Swagger/OpenAPI com Springdoc
✅ **Performance** - JVM otimizada
✅ **Comunidade** - Enorme base de desenvolvedores

**Estrutura de Pacotes:**

```java
src/main/java/com/autograder/
├── config/              // Configurações (Security, OpenAPI, etc)
├── controller/          // REST Controllers
│   ├── AuthController.java
│   ├── ActivityController.java
│   ├── SubmissionController.java
│   └── FeedbackController.java
├── service/             // Lógica de negócio
│   ├── AuthService.java
│   ├── ActivityService.java
│   ├── SubmissionService.java
│   ├── AutograderService.java
│   └── CanvasService.java
├── repository/          // Spring Data JPA Repositories
│   ├── UserRepository.java
│   ├── ActivityRepository.java
│   └── SubmissionRepository.java
├── model/               // Entidades JPA
│   ├── User.java
│   ├── Activity.java
│   ├── Submission.java
│   └── Feedback.java
├── dto/                 // Data Transfer Objects
│   ├── request/
│   └── response/
├── security/            // Configuração de segurança
│   ├── JwtTokenProvider.java
│   ├── CanvasOAuth2Service.java
│   └── SecurityConfig.java
└── exception/           // Exception handlers
    └── GlobalExceptionHandler.java
```

**Exemplo de Controller:**

```java
@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {
    
    private final ActivityService activityService;
    
    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR')")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByClass(
            @PathVariable UUID classId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ActivityResponse> activities = activityService
            .findByClass(classId, userDetails.getUsername());
        return ResponseEntity.ok(activities);
    }
    
    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionResponse> submitCode(
            @PathVariable UUID id,
            @Valid @RequestBody SubmitCodeRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        SubmissionResponse response = activityService
            .submitCode(id, userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

**Exemplo de Service:**

```java
@Service
@RequiredArgsConstructor
@Transactional
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final SubmissionRepository submissionRepository;
    private final AutograderService autograderService;
    
    public List<ActivityResponse> findByClass(UUID classId, String username) {
        List<Activity> activities = activityRepository
            .findByClassIdAndIsPublishedTrue(classId);
        
        return activities.stream()
            .map(activity -> mapToResponse(activity, username))
            .collect(Collectors.toList());
    }
    
    public SubmissionResponse submitCode(UUID activityId, String username, SubmitCodeRequest request) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Criar submissão
        Submission submission = Submission.builder()
            .activity(activity)
            .user(user)
            .code(request.getCode())
            .language(request.getLanguage())
            .status(SubmissionStatus.PENDING)
            .build();
        
        submission = submissionRepository.save(submission);
        
        // Enviar para fila de processamento (async)
        autograderService.evaluateAsync(submission.getId());
        
        return mapToSubmissionResponse(submission);
    }
}
```

**Exemplo de Entity:**

```java
@Entity
@Table(name = "activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    @Column(name = "problem_statement", columnDefinition = "TEXT")
    private String problemStatement;
    
    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode;
    
    @Column(name = "max_score")
    private BigDecimal maxScore = BigDecimal.valueOf(100);
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "is_published")
    private Boolean isPublished = false;
    
    @Type(JsonBinaryType.class)
    @Column(name = "feedback_config", columnDefinition = "jsonb")
    private FeedbackConfig feedbackConfig;
    
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL)
    private List<TestCase> testCases = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**Dependências (pom.xml):**

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>com.vladmihalcea</groupId>
        <artifactId>hibernate-types-60</artifactId>
        <version>2.21.1</version>
    </dependency>
    
    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- OpenAPI/Swagger -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 🔧 Backend - Opção 2: **Python + FastAPI** (Alternativa)

**Por quê FastAPI?**

✅ **Performance** - Tão rápido quanto Node.js
✅ **Type hints** - Validação automática
✅ **Async/await** - Concorrência nativa
✅ **OpenAPI** - Documentação automática
✅ **Compatibilidade** - Fácil integrar com código Python existente

**Quando escolher:**
- Se já tem código Python (como o autograder original)
- Se a equipe é mais forte em Python
- Se precisa de bibliotecas científicas (NumPy, Pandas)

### 🗄️ Banco de Dados

**Tecnologia:** PostgreSQL 15+

**Justificativa:**
- ✅ **JSONB** - Perfeito para feedback_config
- ✅ **Views materializadas** - Analytics rápidos
- ✅ **Row Level Security** - Segurança granular
- ✅ **Full-text search** - Busca em código/feedback
- ✅ **Extensões** - pg_trgm, uuid-ossp
- ✅ **Escalável** - Replicação e particionamento

**ORM:** Spring Data JPA com Hibernate (Java) ou SQLAlchemy (Python)

### 🔐 Autenticação via Canvas LMS

**Tecnologia:** Canvas OAuth2 (RFC-6749)

**Fluxo de Autenticação:**

O sistema utiliza Canvas LMS como provedor de identidade único. Todos os usuários (alunos e professores) autenticam através do Canvas.

**Estratégia de Implementação:**

```java
// 1. Configuração do Developer Key no Canvas
@ConfigurationProperties(prefix = "canvas")
@Data
public class CanvasConfig {
    private String url;              // URL da instalação Canvas
    private String clientId;         // Developer Key ID
    private String clientSecret;     // Developer Key Secret
    private String redirectUri;      // URL de callback da aplicação
    private List<String> scopes;     // Permissões solicitadas
}

// 2. Payload do Access Token (1 hora de validade)
@Data
public class CanvasTokenPayload {
    private String sub;                  // Canvas user.id
    private String canvasUserId;         // ID do usuário no Canvas
    private String email;
    private String name;
    private String role;                 // 'student' | 'teacher' | 'admin'
    private String canvasDomain;         // Domínio da instituição
    private Long iat;
    private Long exp;                    // Expira em 1 hora
}

// 3. Refresh Token (armazenado em httpOnly cookie)
@Data
public class RefreshTokenData {
    private String canvasRefreshToken;   // Token do Canvas
    private UUID userId;
    private LocalDateTime expiresAt;     // 7 dias
}
```

**Fluxo OAuth2 com Canvas:**

```
1. Usuário clica em "Login com Canvas"
   ↓
2. Redirect para Canvas OAuth2:
   GET https://<canvas-url>/login/oauth2/auth
   ?client_id=XXX
   &response_type=code
   &redirect_uri=https://prisma.app/auth/callback
   &state=RANDOM_STATE
   &scope=/auth/userinfo
   ↓
3. Usuário autoriza no Canvas
   ↓
4. Canvas redireciona de volta:
   https://prisma.app/auth/callback
   ?code=AUTH_CODE
   &state=RANDOM_STATE
   ↓
5. Backend troca code por tokens:
   POST https://<canvas-url>/login/oauth2/token
   {
     grant_type: "authorization_code",
     client_id: "XXX",
     client_secret: "YYY",
     redirect_uri: "https://prisma.app/auth/callback",
     code: "AUTH_CODE"
   }
   ↓
6. Canvas retorna:
   {
     access_token: "CANVAS_ACCESS_TOKEN",
     refresh_token: "CANVAS_REFRESH_TOKEN",
     expires_in: 3600,
     user: { id, name, email }
   }
   ↓
7. Backend cria/atualiza usuário local
   ↓
8. Backend gera JWT próprio + armazena refresh token
   ↓
9. Frontend recebe tokens e armazena
```

**Implementação Spring Boot:**

```java
// security/CanvasOAuth2Service.java
@Service
@RequiredArgsConstructor
public class CanvasOAuth2Service {
    
    @Value("${canvas.url}")
    private String canvasUrl;
    
    @Value("${canvas.client-id}")
    private String clientId;
    
    @Value("${canvas.client-secret}")
    private String clientSecret;
    
    private final RestTemplate restTemplate;
    private final UserService userService;
    
    public String getAuthorizationUrl(String state) {
        return UriComponentsBuilder
            .fromHttpUrl(canvasUrl + "/login/oauth2/auth")
            .queryParam("client_id", clientId)
            .queryParam("response_type", "code")
            .queryParam("redirect_uri", getRedirectUri())
            .queryParam("state", state)
            .queryParam("scope", "/auth/userinfo")
            .toUriString();
    }
    
    public CanvasTokenResponse exchangeCodeForToken(String code) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", getRedirectUri());
        params.add("code", code);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<MultiValueMap<String, String>> request = 
            new HttpEntity<>(params, headers);
        
        ResponseEntity<CanvasTokenResponse> response = restTemplate.postForEntity(
            canvasUrl + "/login/oauth2/token",
            request,
            CanvasTokenResponse.class
        );
        
        return response.getBody();
    }
    
    public CanvasUser getCanvasUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<Void> request = new HttpEntity<>(headers);
        
        ResponseEntity<CanvasUser> response = restTemplate.exchange(
            canvasUrl + "/api/v1/users/self",
            HttpMethod.GET,
            request,
            CanvasUser.class
        );
        
        return response.getBody();
    }
}

// controller/AuthController.java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final CanvasOAuth2Service canvasOAuth2Service;
    private final AuthService authService;
    private final UserService userService;
    
    @GetMapping("/canvas/login")
    public ResponseEntity<Map<String, String>> initiateCanvasLogin() {
        String state = UUID.randomUUID().toString();
        String authUrl = canvasOAuth2Service.getAuthorizationUrl(state);
        
        return ResponseEntity.ok(Map.of(
            "authorizationUrl", authUrl,
            "state", state
        ));
    }
    
    @GetMapping("/canvas/callback")
    public void handleCanvasCallback(
            @RequestParam String code,
            @RequestParam String state,
            HttpServletResponse response
    ) throws IOException {
        // 1. Trocar code por tokens
        CanvasTokenResponse canvasTokens = canvasOAuth2Service.exchangeCodeForToken(code);
        
        // 2. Buscar informações do usuário no Canvas
        CanvasUser canvasUser = canvasOAuth2Service.getCanvasUserInfo(
            canvasTokens.getAccessToken()
        );
        
        // 3. Criar ou atualizar usuário local
        User user = userService.findOrCreateFromCanvas(canvasUser);
        
        // 4. Armazenar tokens do Canvas
        userService.updateCanvasTokens(
            user.getId(),
            canvasTokens.getAccessToken(),
            canvasTokens.getRefreshToken(),
            LocalDateTime.now().plusSeconds(canvasTokens.getExpiresIn())
        );
        
        // 5. Gerar JWT próprio da aplicação
        TokenResponse tokens = authService.generateTokens(user);
        
        // 6. Armazenar refresh token em httpOnly cookie
        Cookie refreshCookie = new Cookie("refresh_token", tokens.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 dias
        response.addCookie(refreshCookie);
        
        // 7. Redirecionar para frontend com access token
        response.sendRedirect(
            String.format("%s/auth/success?token=%s", 
                System.getenv("FRONTEND_URL"), 
                tokens.getAccessToken()
            )
        );
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @CookieValue("refresh_token") String refreshToken
    ) {
        // 1. Validar refresh token local
        UUID userId = authService.validateRefreshToken(refreshToken);
        
        // 2. Verificar se Canvas token ainda é válido
        CanvasTokenInfo canvasTokens = userService.getCanvasTokens(userId);
        
        if (canvasTokens.isExpired()) {
            // 3. Renovar Canvas token usando refresh token
            CanvasTokenResponse newCanvasTokens = canvasOAuth2Service
                .refreshCanvasToken(canvasTokens.getRefreshToken());
            
            userService.updateCanvasTokens(
                userId,
                newCanvasTokens.getAccessToken(),
                newCanvasTokens.getRefreshToken(),
                LocalDateTime.now().plusSeconds(newCanvasTokens.getExpiresIn())
            );
        }
        
        // 4. Gerar novo access token da aplicação
        TokenResponse tokens = authService.generateAccessToken(userId);
        
        return ResponseEntity.ok(tokens);
    }
}
```

**Sincronização com Canvas:**

```java
// service/CanvasService.java
@Service
@RequiredArgsConstructor
public class CanvasService {
    
    @Value("${canvas.url}")
    private String canvasUrl;
    
    private final RestTemplate restTemplate;
    private final UserService userService;
    private final ClassService classService;
    private final EnrollmentService enrollmentService;
    
    public void syncClassesFromCanvas(UUID userId) {
        CanvasTokenInfo canvasTokens = userService.getCanvasTokens(userId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(canvasTokens.getAccessToken());
        
        HttpEntity<Void> request = new HttpEntity<>(headers);
        
        ResponseEntity<CanvasCourse[]> response = restTemplate.exchange(
            canvasUrl + "/api/v1/courses",
            HttpMethod.GET,
            request,
            CanvasCourse[].class
        );
        
        // Sincronizar turmas localmente
        for (CanvasCourse course : response.getBody()) {
            classService.createOrUpdate(ClassCreateRequest.builder()
                .canvasId(course.getId())
                .code(course.getCourseCode())
                .name(course.getName())
                .instructorId(userId)
                .build());
        }
    }
    
    public void syncStudentsFromCanvas(UUID classId) {
        ClassEntity classEntity = classService.findById(classId);
        CanvasTokenInfo canvasTokens = userService.getCanvasTokens(
            classEntity.getInstructorId()
        );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(canvasTokens.getAccessToken());
        
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(canvasUrl + "/api/v1/courses/" + classEntity.getCanvasId() + "/users")
            .queryParam("enrollment_type[]", "student");
        
        HttpEntity<Void> request = new HttpEntity<>(headers);
        
        ResponseEntity<CanvasUser[]> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.GET,
            request,
            CanvasUser[].class
        );
        
        // Criar matrículas localmente
        for (CanvasUser student : response.getBody()) {
            enrollmentService.createOrUpdate(EnrollmentRequest.builder()
                .userId(student.getId())
                .classId(classId)
                .build());
        }
    }
}
```

**Segurança:**

1. **Armazenamento de Tokens:**
   - Access tokens do Canvas: Criptografados no banco de dados
   - Refresh tokens: httpOnly cookies (não acessíveis via JavaScript)
   - Nunca expor tokens em URLs ou logs

2. **Validação:**
   - Verificar state parameter para prevenir CSRF
   - Validar redirect_uri para prevenir open redirect
   - Implementar rate limiting no endpoint de refresh

3. **Developer Key Canvas:**
   - Solicitar ao administrador da instituição
   - Configurar redirect_uri correto
   - Definir scopes mínimos necessários

**Configuração Necessária:**

```env
# .env
CANVAS_URL=https://canvas.institution.edu
CANVAS_CLIENT_ID=your_developer_key_id
CANVAS_CLIENT_SECRET=your_developer_key_secret
CANVAS_REDIRECT_URI=https://prisma.app/auth/canvas/callback
```

**Adicionar:**
- **Spring Security OAuth2 Client** - Integração OAuth2 com Canvas
- **RestTemplate/WebClient** - Chamadas à API do Canvas
- **Spring Boot Starter OAuth2 Client** - Suporte OAuth2

### ⚡ Execução de Código - **CRÍTICO**

**Problema:** Executar código não confiável é PERIGOSO

**Solução Recomendada: Sandboxing com Containers**

O sistema deve executar código de alunos em ambiente isolado e seguro (sandbox) para prevenir:
- Acesso ao sistema de arquivos
- Execução de comandos maliciosos
- Consumo excessivo de recursos
- Ataques de rede

**Requisitos do Sandbox:**
- Isolamento completo de processos
- Limite de tempo de execução (timeout)
- Limite de memória e CPU
- Sem acesso à rede
- Ambiente read-only

**Implementação:**

```java
// service/CodeExecutionService.java
@Service
@RequiredArgsConstructor
public class CodeExecutionService {
    
    public ExecutionResult executeCode(String code, List<TestCase> testCases, String language) {
        // Implementar execução em sandbox seguro
        // - Validar código antes da execução
        // - Aplicar limites de recursos
        // - Capturar output e erros
        // - Retornar resultados dos testes
        
        return ExecutionResult.builder()
            .success(true)
            .testResults(runTests(code, testCases))
            .executionTime(executionTimeMs)
            .build();
    }
    
    private List<TestResult> runTests(String code, List<TestCase> testCases) {
        // Executar cada teste em ambiente isolado
        // Comparar output esperado vs obtido
        return testResults;
    }
}
```

### 🤖 Sistema de Autograder com Feedback Inteligente

**Arquitetura:**

O sistema de autograder já possui IA integrada para geração de feedback. Não há necessidade de escolher entre "modo AI" e "modo Default" - o autograder sempre utiliza análise inteligente.

```java
// service/AutograderService.java
@Service
@RequiredArgsConstructor
@Transactional
public class AutograderService {
    
    private final TestExecutionService testExecutionService;
    private final FeedbackService feedbackService;
    private final LearningResourceService learningResourceService;
    
    public EvaluationResult evaluateSubmission(
            Submission submission,
            AutograderConfig config
    ) {
        // 1. Executar testes automatizados
        List<TestResult> testResults = testExecutionService.executeTests(submission);
        
        // 2. Gerar feedback inteligente
        Feedback feedback = generateIntelligentFeedback(
            submission,
            testResults,
            config
        );
        
        // 3. Vincular recursos de aprendizagem
        List<LearningResource> resources = learningResourceService
            .linkResources(testResults);
        
        return EvaluationResult.builder()
            .score(calculateScore(testResults))
            .testResults(testResults)
            .feedback(feedback)
            .resources(resources)
            .build();
    }
    
    private Feedback generateIntelligentFeedback(
            Submission submission,
            List<TestResult> testResults,
            AutograderConfig config
    ) {
        // 1. Preparar contexto para análise
        String context = buildAnalysisContext(submission, testResults, config);
        
        // 2. Gerar feedback inteligente
        FeedbackRequest request = FeedbackRequest.builder()
            .context(context)
            .config(config)
            .build();
        
        FeedbackResponse response = feedbackService.generateFeedback(request);
        
        // 3. Processar e estruturar feedback
        return processFeedback(response, testResults);
    }
    
    private String buildSystemPrompt(AutograderConfig config) {
        return String.format("""
            Você é um assistente educacional especializado em programação.
            
            Seu papel é analisar código de estudantes e fornecer feedback construtivo que:
            - Explica o que está correto e o que precisa melhorar
            - Identifica a causa raiz dos erros
            - Sugere melhorias específicas e acionáveis
            - Mantém um tom %s
            - %s
            
            Contexto da atividade: %s
            
            %s
            """,
            config.getFeedbackTone() != null ? config.getFeedbackTone() : "encorajador mas direto",
            getSolutionGuidance(config.getProvideSolutions()),
            config.getAssignmentContext(),
            config.getExtraOrientations() != null ? config.getExtraOrientations() : ""
        );
    }
    
    private String getSolutionGuidance(String provideSolutions) {
        return switch (provideSolutions) {
            case "full" -> "Fornece soluções completas";
            case "hint" -> "Dá dicas sutis";
            default -> "Não fornece soluções diretas";
        };
    }
    
    private String buildAnalysisContext(
            Submission submission,
            List<TestResult> testResults,
            AutograderConfig config
    ) {
        List<TestResult> failedTests = testResults.stream()
            .filter(t -> !t.isPassed())
            .toList();
        
        List<TestResult> passedTests = testResults.stream()
            .filter(TestResult::isPassed)
            .toList();
        
        StringBuilder context = new StringBuilder();
        context.append("# Análise de Submissão\n\n");
        context.append("## Código do Estudante:\n");
        context.append(String.format("```%s\n%s\n```\n\n", 
            submission.getLanguage(), 
            submission.getCode()
        ));
        
        context.append("## Resultados dos Testes:\n\n");
        context.append(String.format("### Testes que Falharam (%d):\n", failedTests.size()));
        
        for (TestResult test : failedTests) {
            context.append(String.format("""
                - **%s**: %s
                  Categoria: %s
                  Entrada: %s
                  Saída esperada: %s
                  Saída obtida: %s
                
                """,
                test.getName(),
                test.getErrorMessage(),
                test.getCategory(),
                test.getInputData(),
                test.getExpectedOutput(),
                test.getActualOutput()
            ));
        }
        
        if (config.isShowPassedTests()) {
            context.append(String.format("\n### Testes que Passaram (%d):\n", passedTests.size()));
            passedTests.forEach(t -> 
                context.append(String.format("- %s\n", t.getName()))
            );
        }
        
        context.append("""
            
            ## Tarefa:
            Analise o código e os resultados dos testes. Forneça feedback estruturado que ajude o estudante a:
            1. Entender o que deu errado e por quê
            2. Aprender com os erros
            3. Melhorar a solução
            
            Seja específico e educativo.
            """);
        
        return context.toString();
    }
}
```

**Configuração do Autograder:**

```java
// model/AutograderConfig.java
@Data
@Builder
public class AutograderConfig {
    // Configurações gerais
    private String reportTitle;
    private boolean showScore;
    private boolean showPassedTests;
    private boolean addReportSummary;
    
    // Configurações de feedback inteligente
    private String provideSolutions; // 'none' | 'hint' | 'full'
    private String feedbackTone;
    private String feedbackPersona;
    private String assignmentContext;
    private String extraOrientations;
    private List<String> submissionFilesToRead;
    
    // Recursos de aprendizagem
    private List<LearningResource> onlineContent;
}
```

**Otimizações:**

1. **Cache de feedback similar**
```java
// Se código é 95% similar, reusar e adaptar feedback
@Cacheable(value = "similar-submissions", key = "#codeHash")
public Submission findSimilarSubmission(String codeHash) {
    return submissionRepository.findByCodeHashAndSimilarityGreaterThan(
        codeHash, 
        0.95
    );
}

public Feedback generateOrReuseFeedback(Submission submission) {
    String codeHash = calculateCodeHash(submission.getCode());
    Submission similar = findSimilarSubmission(codeHash);
    
    if (similar != null && similar.getSimilarity() > 0.95) {
        return adaptFeedback(similar.getFeedback(), submission);
    }
    
    return generateIntelligentFeedback(submission);
}
```

2. **Batch processing para múltiplas submissões**
```java
// Processar várias submissões em paralelo
public List<Feedback> generateFeedbackBatch(List<Submission> submissions) {
    return submissions.parallelStream()
        .map(this::generateIntelligentFeedback)
        .collect(Collectors.toList());
}
```

3. **Fallback para feedback estruturado**
```java
public Feedback generateFeedbackWithFallback(
        Submission submission,
        List<TestResult> testResults,
        AutograderConfig config
) {
    try {
        return generateIntelligentFeedback(submission, testResults, config);
    } catch (Exception e) {
        logger.warn("AI feedback failed, using structured fallback", e);
        return generateStructuredFeedback(testResults, config);
    }
}
```

**Exemplo de Feedback Gerado:**

```markdown
# Relatório de Avaliação - Two Sum

## Pontuação: 67/100

## Análise Geral

Seu código demonstra compreensão básica do problema, mas há oportunidades de melhoria na eficiência e tratamento de casos especiais.

## O que funcionou bem ✓

- Você identificou corretamente a necessidade de encontrar dois números que somam ao target
- A lógica básica de iteração está correta
- O código é legível e bem estruturado

## Áreas para Melhorar

### 1. Complexidade de Tempo (Teste: test_performance)

**Problema:** Sua solução usa dois loops aninhados (O(n²)), o que é ineficiente para arrays grandes.

**Por quê isso importa:** Com 10.000 elementos, seu código faz 100 milhões de comparações.

**Sugestão:** Use um objeto/Map para armazenar números já vistos. Isso reduz a complexidade para O(n).

**Dica:** Para cada número, calcule `complement = target - num` e verifique se já viu esse complement.

### 2. Caso Especial não Tratado (Teste: test_duplicate_values)

**Problema:** Quando o array tem valores duplicados, seu código retorna o mesmo índice duas vezes.

**Exemplo que falhou:**
- Input: [3, 3], target: 6
- Esperado: [0, 1]
- Obtido: [0, 0]

**Solução:** Certifique-se de que `i !== j` antes de retornar os índices.

## Recursos Recomendados

📚 [Hash Tables em JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
📚 [Análise de Complexidade](https://www.bigocheatsheet.com/)

## Próximos Passos

1. Refatore usando um Map para melhorar a performance
2. Adicione validação para evitar usar o mesmo índice duas vezes
3. Teste com arrays maiores para verificar a eficiência

Continue praticando! Você está no caminho certo. 🚀
```

### 📊 Message Queue

**Tecnologia:** RabbitMQ

**Por quê?**
- ✅ Desacoplar execução de código
- ✅ Processar submissões em background
- ✅ Retry automático em caso de falha
- ✅ Priorização de tarefas

**Fluxo:**

```
1. Aluno submete código
   ↓
2. API cria submission (status: pending)
   ↓
3. Envia mensagem para fila
   ↓
4. Worker pega mensagem
   ↓
5. Executa código em sandbox
   ↓
6. Gera feedback
   ↓
7. Atualiza submission (status: completed)
   ↓
8. Notifica frontend via WebSocket
```

**Implementação com Spring AMQP:**

```java
// config/RabbitMQConfig.java
@Configuration
public class RabbitMQConfig {
    
    public static final String SUBMISSION_QUEUE = "submission.queue";
    public static final String SUBMISSION_EXCHANGE = "submission.exchange";
    public static final String SUBMISSION_ROUTING_KEY = "submission.process";
    
    @Bean
    public Queue submissionQueue() {
        return QueueBuilder.durable(SUBMISSION_QUEUE)
            .withArgument("x-dead-letter-exchange", "submission.dlx")
            .build();
    }
    
    @Bean
    public TopicExchange submissionExchange() {
        return new TopicExchange(SUBMISSION_EXCHANGE);
    }
    
    @Bean
    public Binding binding(Queue submissionQueue, TopicExchange submissionExchange) {
        return BindingBuilder
            .bind(submissionQueue)
            .to(submissionExchange)
            .with(SUBMISSION_ROUTING_KEY);
    }
}

// service/SubmissionProducer.java
@Service
@RequiredArgsConstructor
public class SubmissionProducer {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void sendForProcessing(UUID submissionId) {
        SubmissionMessage message = SubmissionMessage.builder()
            .submissionId(submissionId)
            .timestamp(LocalDateTime.now())
            .build();
        
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.SUBMISSION_EXCHANGE,
            RabbitMQConfig.SUBMISSION_ROUTING_KEY,
            message
        );
    }
}

// service/SubmissionConsumer.java
@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionConsumer {
    
    private final AutograderService autograderService;
    private final SubmissionRepository submissionRepository;
    private final WebSocketService webSocketService;
    
    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_QUEUE)
    public void processSubmission(SubmissionMessage message) {
        log.info("Processing submission: {}", message.getSubmissionId());
        
        try {
            Submission submission = submissionRepository
                .findById(message.getSubmissionId())
                .orElseThrow();
            
            // Executar autograder
            EvaluationResult result = autograderService.evaluateSubmission(submission);
            
            // Atualizar submission
            submission.setStatus(SubmissionStatus.COMPLETED);
            submission.setScore(result.getScore());
            submission.setFeedback(result.getFeedback());
            submissionRepository.save(submission);
            
            // Notificar via WebSocket
            webSocketService.notifyFeedbackReady(
                submission.getUserId(),
                submission.getId()
            );
            
        } catch (Exception e) {
            log.error("Failed to process submission: {}", message.getSubmissionId(), e);
            throw new AmqpRejectAndDontRequeueException("Processing failed", e);
        }
    }
}
```

### 🔄 Cache

**Tecnologia:** Redis

**Casos de uso:**

1. **Session storage** - Tokens de refresh
2. **Rate limiting** - Limitar submissões por minuto
3. **Cache de queries** - Activities, classes
4. **Real-time data** - Ranking, leaderboard
5. **Pub/Sub** - Notificações em tempo real

```java
// Exemplo: Cache de atividades com Spring Data Redis
@Service
@RequiredArgsConstructor
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    
    @Cacheable(value = "activities", key = "#classId")
    public List<Activity> findByClass(UUID classId) {
        String cacheKey = "activities:class:" + classId;
        
        // Tentar cache primeiro
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return objectMapper.readValue(cached, 
                new TypeReference<List<Activity>>() {});
        }
        
        // Buscar do DB
        List<Activity> activities = activityRepository
            .findByClassIdAndIsPublishedTrue(classId);
        
        // Cachear por 5 minutos
        redisTemplate.opsForValue().set(
            cacheKey,
            objectMapper.writeValueAsString(activities),
            Duration.ofMinutes(5)
        );
        
        return activities;
    }
    
    @CacheEvict(value = "activities", key = "#activity.classId")
    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }
}
```

### 📡 Real-time Updates

**Tecnologia:** WebSockets (Spring WebSocket + STOMP)

**Casos de uso:**
- ✅ Notificar quando feedback está pronto
- ✅ Atualizar ranking em tempo real
- ✅ Mostrar progresso de execução
- ✅ Chat de suporte (futuro)

```java
// config/WebSocketConfig.java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("*")
            .withSockJS();
    }
}

// service/WebSocketService.java
@Service
@RequiredArgsConstructor
public class WebSocketService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public void notifyFeedbackReady(UUID userId, UUID submissionId) {
        FeedbackNotification notification = FeedbackNotification.builder()
            .submissionId(submissionId)
            .timestamp(LocalDateTime.now())
            .build();
        
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/feedback",
            notification
        );
    }
    
    public void broadcastRankingUpdate(UUID classId, List<RankingEntry> ranking) {
        messagingTemplate.convertAndSend(
            "/topic/ranking/" + classId,
            ranking
        );
    }
}
```

## 🏗️ Arquitetura Detalhada por Camadas

### Layer 1: Frontend (Vue 3)

```
src/
├── components/       # Componentes reutilizáveis
├── views/           # Páginas
├── composables/     # Lógica reutilizável (Vue 3 Composition API)
├── stores/          # Pinia stores
├── services/        # API clients
├── utils/           # Helpers
└── types/           # TypeScript types (se usar TS no frontend)
```

### Layer 2: API Gateway

**Responsabilidades:**
- Autenticação e autorização
- Rate limiting (100 req/min por usuário)
- Load balancing
- Request/response logging
- CORS handling

### Layer 3: Microserviços

#### Auth Service
- Login/Logout
- Registro
- Refresh tokens
- Password reset

#### Core API Service
- Users CRUD
- Classes CRUD
- Activities CRUD
- Enrollments

#### Execution Service
- Recebe código via queue
- Executa em sandbox
- Retorna resultados
- Timeout handling

#### Feedback Service
- Gera feedback (AI ou Default)
- Vincula recursos de aprendizagem
- Cache de feedbacks similares

#### Analytics Service
- Estatísticas de turmas
- Progresso de alunos
- Relatórios para professores
- Dashboards

### Layer 4: Data Layer

- **PostgreSQL** - Dados principais
- **Redis** - Cache e sessions
- **S3/MinIO** - Arquivos (código, uploads)
- **Elasticsearch** - Busca full-text (opcional)

## 🚀 Deployment

O deployment do Prisma pode ser feito em diferentes ambientes:

### Desenvolvimento Local

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
  
  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
```

### Produção

Para produção, considere:
- **Frontend**: Servidor web estático (Nginx, Apache)
- **Backend**: Servidor de aplicação Java (Tomcat, Jetty embutido no Spring Boot)
- **Database**: PostgreSQL com backups automáticos
- **Cache**: Redis para sessões e cache
- **Queue**: RabbitMQ para processamento assíncrono

## 📋 Roadmap de Implementação

### Fase 1: MVP (4-6 semanas)

**Semana 1-2: Setup e Infraestrutura**
- [ ] Setup Spring Boot + Spring Data JPA
- [ ] Configurar PostgreSQL
- [ ] Implementar autenticação Canvas OAuth2 com Spring Security
- [ ] Configurar Developer Key no Canvas
- [ ] CRUD de Users, Classes, Activities
- [ ] Sincronização com Canvas API usando RestTemplate

**Semana 3-4: Core Features**
- [ ] Sistema de submissões
- [ ] Sistema de execução de código seguro
- [ ] Autograder com feedback inteligente
- [ ] Dashboard básico

**Semana 5-6: Feedback Inteligente e Polish**
- [ ] Sistema de feedback inteligente
- [ ] Sistema de recursos de aprendizagem vinculados
- [ ] Otimizações de cache com Spring Cache e Redis
- [ ] Testes e deploy

### Fase 2: Melhorias (4-6 semanas)

- [ ] WebSockets com Spring WebSocket para real-time
- [ ] Analytics avançado
- [ ] Sistema de ranking
- [ ] Notificações por email com Spring Mail
- [ ] Exportar relatórios (PDF) com JasperReports

### Fase 3: Escala (ongoing)

- [ ] Otimizar sistema de execução de código
- [ ] Implementar cache Redis com Spring Data Redis
- [ ] Message queue com Spring AMQP (RabbitMQ)
- [ ] Monitoramento com Spring Boot Actuator + Prometheus
- [ ] CI/CD pipeline com GitHub Actions

## 🎯 Decisão Final Recomendada

### Para MVP (Próximos 2 meses):

```
Frontend:  Vue 3 + Vite (já pronto)
Backend:   Spring Boot 3 + Java 17
Database:  PostgreSQL
Auth:      Canvas OAuth2 + Spring Security
Autograder: Sistema de feedback inteligente
Deploy:    A definir
Cache:     Redis
```

**Por quê essa stack?**
- ✅ Spring Boot é robusto e enterprise-ready
- ✅ Excelente suporte para OAuth2 com Spring Security
- ✅ JPA/Hibernate para ORM poderoso
- ✅ Fácil de começar e escalar
- ✅ Escalável quando necessário
- ✅ Type-safe com Java
- ✅ Comunidade enorme e ativa

### Para Produção (6+ meses):

```
Frontend:  Vue 3 + Vite
Backend:   Spring Boot 3 + Microserviços
Database:  PostgreSQL
Auth:      Canvas OAuth2 + Spring Security
Autograder: Sistema de feedback com cache
Deploy:    A definir
Queue:     RabbitMQ
Cache:     Redis
```

## 🎓 Conclusão

**Minha recomendação:**

1. **Começar com stack básico** para validar o produto rapidamente
2. **Escalar conforme necessário** quando atingir mais usuários
3. **Implementar microserviços** quando a complexidade justificar

**Próximos passos imediatos:**

1. Criar projeto Spring Boot com Spring Initializr
2. Configurar Spring Data JPA com PostgreSQL
3. Implementar autenticação Canvas OAuth2 com Spring Security
4. Implementar sistema de execução de código seguro
5. Implementar sistema de feedback
6. Configurar deploy

Quer que eu crie um guia de implementação passo a passo para começar?
