# Consulta de Empresas (CNPJ)

Aplicação para consultar informações públicas de empresas a partir do CNPJ, utilizando a [BrasilAPI](https://brasilapi.com.br/docs#tag/CNPJ) como fonte de dados.

Desenvolvido como teste técnico para a vaga de Estágio em Desenvolvimento de IA — GardeTech.

## Tecnologias utilizadas

- **Front-end:** React (Vite) + Pico CSS
- **Back-end:** Node.js + Express
- **API externa:** BrasilAPI — Consulta de CNPJ

## Como rodar localmente

### Pré-requisitos
- Node.js instalado (v18 ou superior)

### Backend

```bash
cd backend
npm install
node server.js
```

O servidor sobe em `http://localhost:3000`.

Crie um arquivo `.env` na pasta `backend` (opcional, tem valor padrão):
```
PORT=3000
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5174`.

Crie um arquivo `.env` na pasta `frontend`:
```
VITE_API_URL=http://localhost:3000/api
```

## Funcionalidades

- Busca de empresa por CNPJ, com máscara de formatação automática (`00.000.000/0000-00`)
- Exibição de: razão social, nome fantasia, situação cadastral, CNAE principal, data de abertura e endereço completo
- Validação de CNPJ (14 dígitos) no front-end e no back-end
- Tratamento de erros: CNPJ inválido, CNPJ não encontrado, falha de comunicação com a API externa
- Estado de carregamento durante a requisição
- Histórico das últimas 5 consultas realizadas na sessão
- Cache de consultas por CNPJ (5 minutos), evitando chamadas repetidas desnecessárias à BrasilAPI

## Decisões técnicas

- **Separação de `app.js` e `server.js` no back-end**: a configuração do Express (`app.js`) foi separada da inicialização do servidor (`server.js`) para permitir testes automatizados da API sem a necessidade de subir uma porta real.
- **User-Agent customizado nas requisições à BrasilAPI**: a API bloqueava requisições feitas pelo back-end (retornando 403 Forbidden) por ausência de header `User-Agent`, provavelmente por estar atrás de proteção Cloudflare. Optamos por identificar a própria aplicação no header (`consulta-empresas-cnpj/1.0`), em vez de simular um navegador, por ser uma abordagem mais transparente.
- **Histórico em memória**: as últimas 5 consultas são mantidas em um array no back-end, sem persistência em banco de dados, por ser suficiente para atender ao requisito obrigatório dentro do prazo do teste.
- **Cache simples em memória (Map)**: implementado com uma estrutura `Map` no back-end, com expiração de 5 minutos por CNPJ, evitando chamadas repetidas à BrasilAPI em buscas consecutivas do mesmo CNPJ.
- **Componentização no front-end**: a interface foi dividida em três componentes independentes (`BuscaCnpj`, `ResultadoEmpresa`, `Historico`), cada um recebendo dados via props e sem conhecer a origem deles — a lógica de busca e os estados ficam centralizados no `App.jsx`.
- **Centralização das chamadas à API em `services/api.js`**: evita duplicar lógica de `fetch` nos componentes e facilita trocar a URL do back-end (por exemplo, ao migrar para produção) em um único lugar.
- **Pico CSS**: optamos por uma biblioteca CSS minimalista que estiliza elementos HTML semânticos automaticamente, permitindo uma interface responsiva e organizada sem necessidade de escrever CSS extenso, adequado ao escopo e prazo do teste.
- **Tags semânticas (`<main>`, `<fieldset>`)**: utilizadas em vez de `<div>` genéricas, aproveitando a estilização automática do Pico CSS e melhorando a acessibilidade da aplicação.
- **Falha no histórico tratada silenciosamente**: caso a busca do histórico falhe, o erro não é exibido ao usuário, pois essa funcionalidade é secundária — a aplicação continua funcional para a busca principal de CNPJ mesmo que o histórico não carregue.

## Limitações conhecidas

- Os testes automatizados (Gherkin/jest-cucumber) cobrem apenas os cenários de busca com CNPJ válido e CNPJ com formato inválido. Com mais tempo, seriam adicionados cenários para CNPJ válido porém inexistente (404), falha de comunicação com a BrasilAPI (502/503) e validação do comportamento do cache.
- O cache não possui invalidação manual — expira apenas por tempo (5 minutos fixos), sem possibilidade de configuração dinâmica.
- Não há testes end-to-end cobrindo a integração completa entre front-end e back-end, apenas testes da API isoladamente.

## Autor

Kailany Silva
