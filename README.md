# Consulta de Empresas (CNPJ)

Aplicação para consultar informações públicas de empresas a partir do CNPJ, utilizando a [BrasilAPI](https://brasilapi.com.br/docs#tag/CNPJ) como fonte de dados.

Desenvolvido como teste técnico para a vaga de Estágio em Desenvolvimento — GardeTech.

## Deploy
 
- **Aplicação:** https://consulta-de-empresas-azure.vercel.app/
- **API:** https://consulta-de-empresas.onrender.com

> **Nota:** o back-end está hospedado no plano gratuito do Render, que "hiberna" após períodos de inatividade. A primeira requisição após um tempo sem uso pode levar até 1 minuto para responder, enquanto o servidor reinicia.

## Tecnologias utilizadas

- **Front-end:** React (Vite) + Pico CSS
- **Back-end:** Node.js + Express
- **Banco de dados:** MongoDB (Atlas) + Mongoose
- **API externa:** BrasilAPI — Consulta de CNPJ

## Como rodar localmente

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- Você precisará criar seu próprio cluster gratuito no MongoDB Atlas e usar a connection string dele, a aplicação cria o banco e as coleções automaticamente na primeira execução.


### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`. O script `dev` usa `nodemon`, que reinicia o servidor automaticamente a cada alteração de arquivo.

Crie um arquivo `.env` na pasta `backend`:
```
PORT=3000
MONGODB_URI=sua_connection_string_do_mongodb_atlas
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

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
- Histórico das últimas 5 consultas, armazenado em banco do dados (MongoDB)
- Cache de consultas por CNPJ (5 minutos), evitando chamadas repetidas desnecessárias à BrasilAPI

## Decisões técnicas

- **Separação de `app.js` e `server.js` no back-end**: a configuração do Express (`app.js`) foi separada da inicialização do servidor (`server.js`) para permitir testes automatizados da API sem a necessidade de subir uma porta real.
- **User-Agent customizado nas requisições à BrasilAPI**: a API bloqueava requisições feitas pelo back-end (retornando 403 Forbidden) por ausência de header `User-Agent`, provavelmente por estar atrás de proteção Cloudflare. Optei por identificar a própria aplicação no header (`consulta-empresas-cnpj/1.0`), em vez de simular um navegador, por ser uma abordagem mais transparente.
- **Cache em memória mantido separado da persistência**: o cache (`Map`, expiração de 5 minutos por CNPJ) continuou em memória mesmo após a adição do banco, pois resolve um problema diferente, evitar chamadas repetidas à API externa em um curto intervalo, enquanto o MongoDB resolve a durabilidade do histórico. Consultar o banco a cada requisição só para checar cache adicionaria latência desnecessária.
- **Componentização no front-end**: a interface foi dividida em três componentes independentes (`BuscaCnpj`, `ResultadoEmpresa`, `Historico`), cada um recebendo dados via props e sem conhecer a origem deles, a lógica de busca e os estados ficam centralizados no `App.jsx`.
- **Centralização das chamadas à API em `services/api.js`**: evita duplicar lógica de `fetch` nos componentes e facilita trocar a URL do back-end (por exemplo, ao migrar para produção) em um único lugar.
- **Pico CSS**: optei por uma biblioteca CSS minimalista que estiliza elementos HTML semânticos automaticamente, permitindo uma interface responsiva e organizada sem necessidade de escrever CSS extenso, adequado ao escopo e prazo do teste.
- **Tags semânticas (`<main>`, `<fieldset>`)**: utilizadas em vez de `<div>` genéricas, aproveitando a estilização automática do Pico CSS e melhorando a acessibilidade da aplicação.
- **Falha no histórico tratada silenciosamente**: caso a busca do histórico falhe, o erro não é exibido ao usuário, pois essa funcionalidade é secundária, a aplicação continua funcional para a busca principal de CNPJ mesmo que o histórico não carregue.
- **Priorização entre diferenciais**: diante do prazo, optei por priorizar a persistência em banco de dados (MongoDB) em vez dos testes automatizados, por ser uma tecnologia com a qual já tinha mais familiaridade e por representar, na minha avaliação, um ganho mais concreto de robustez para a aplicação.

## Limitações conhecidas
 
- Não foram implementados testes automatizados (Gherkin/jest-cucumber). A prioridade, dentro do prazo disponível, foi dada à persistência em banco de dados, diferencial com o qual tinha maior familiaridade técnica. Com mais tempo, os testes seriam a próxima adição, cobrindo ao menos os cenários de busca com CNPJ válido e CNPJ com formato inválido.
- O cache não possui invalidação manual, expira apenas por tempo (5 minutos fixos), sem possibilidade de configuração dinâmica.
- Não há testes end-to-end cobrindo a integração completa entre front-end e back-end.
- O histórico persistido em MongoDB é global (não segmentado por usuário/sessão); uma futura evolução seria associar as consultas a um identificador de sessão ou usuário autenticado.
## Autor
 
Kailany Silva
[LinkedIn](https://www.linkedin.com/in/kailany-silva-21059b206/)
