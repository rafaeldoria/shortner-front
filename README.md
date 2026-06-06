# Shortener Front

## 1. Arquitetura do projeto

Interface construída com React, TypeScript e Vite, utilizando React Router para
navegação, Axios para comunicação com a API e Tailwind CSS para estilização.

```text
src/
  api/          Requisições ao backend e envio do token JWT
  components/   Layout e componentes da listagem de URLs
  contexts/     Estado global do tema da aplicação
  pages/        Telas de login, cadastro, listagem e nova URL
  schemas/      Validação dos formulários
  App.tsx       Definição das rotas
  main.tsx      Inicialização da aplicação React
```

Fluxo principal:

```text
Usuário -> Página -> Cliente HTTP -> Shortener Back
```

## 2. Como executar

Pré-requisitos: Node.js 20+, npm e o backend disponível.

```bash
npm ci
cp .env.example .env
```

Preencha o arquivo `.env` com a URL do backend (`VITE_API_URL`) e a URL pública
usada nos links encurtados (`VITE_SHORTENER_URL`).

Para executar em desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite, normalmente
`http://localhost:5173`.

Para validar e gerar a versão de produção:

```bash
npm run lint
npm run build
```

## 3. Projeto

Frontend de um encurtador de URLs: permite cadastrar e autenticar usuários,
criar links encurtados, listar os links salvos e copiar a URL curta gerada.
