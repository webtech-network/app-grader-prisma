# Contribuindo para o Prisma

Obrigado por considerar contribuir para o Prisma! Este documento fornece diretrizes para contribuir com o projeto.

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/prisma.git
cd prisma

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/prisma.git
```

### 2. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch para sua feature/fix
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga as convenções de código do projeto
- Adicione testes para novas funcionalidades
- Atualize a documentação se necessário

### 4. Commit suas Mudanças

Use mensagens de commit claras e descritivas:

```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
```

#### Convenção de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, ponto e vírgula, etc (sem mudança de código)
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Atualizações de build, configs, etc

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-feature

# Abra um Pull Request no GitHub
```

## 📋 Checklist do Pull Request

Antes de submeter seu PR, verifique:

- [ ] O código está funcionando corretamente
- [ ] Todos os testes estão passando (`npm run test`)
- [ ] Não há erros de lint
- [ ] A documentação foi atualizada (se necessário)
- [ ] Os commits seguem a convenção
- [ ] O PR tem uma descrição clara do que foi feito

## 🧪 Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch
```

## 📝 Padrões de Código

### Vue.js

- Use Composition API
- Componentes devem ser Single File Components (.vue)
- Use `<script setup>` quando possível
- Nomeie componentes em PascalCase

### JavaScript

- Use ES6+ features
- Prefira `const` e `let` ao invés de `var`
- Use arrow functions quando apropriado
- Documente funções complexas

### CSS

- Use CSS Variables para cores e espaçamentos
- Prefira `scoped` styles em componentes
- Mantenha consistência com o design system

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. Descrição clara do problema
2. Passos para reproduzir
3. Comportamento esperado vs atual
4. Screenshots (se aplicável)
5. Ambiente (navegador, OS, versão do Node)

## 💡 Sugerindo Melhorias

Para sugerir melhorias:

1. Verifique se já não existe uma issue similar
2. Descreva claramente a melhoria proposta
3. Explique por que seria útil
4. Forneça exemplos de uso (se aplicável)

## 📚 Documentação

Ao adicionar novas funcionalidades:

- Atualize o README.md se necessário
- Adicione comentários no código
- Atualize a documentação em `docs/`
- Adicione exemplos de uso

## 🤝 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir:

- Abra uma issue com a tag `question`
- Entre em contato com os mantenedores

---

Obrigado por contribuir com o Prisma! 🎉
