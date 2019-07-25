# Dashboard Público

Esse repositório contém o source-code da API Pública de Resgate de Dados do Sistema, assim como a interface gráfica.

API construída em Node + Express + GraphQL + Sequelize (MySQL).

WebApp construído com React + Redux.

Escritos em ES6 usando Babel + Webpack.

## 📝 Documentação

A [documentação](https://sdec-brasil.github.io/docs/) ([repo](https://github.com/sdec-brasil/docs)) do projeto possui:

- Explicações sobre a arquitetura do sistema
- Referência para as API's
- Fluxos para as diferentes ações do sistema
- ++++

## ▶️ Rodando
- Clone o repo `git clone git@github.com:sdec-brasil/dashboard-publico.git dashboard-publico`
- Instale os módulos NPM da API `cd api` e `npm install`
- Instale os módulos NPM do WebApp `cd web` e `npm install`
- Modifique `/api/src/config/database.json` para credenciais de banco de dados
- Modique `/api/src/config/config.json` para porta da API (opcional)
- Modifique `/web/.env` para a porta web (opcional)
- Rode a API com `cd api` e `npm start`. Pode usar o GraphiQL em http://localhost:8000/
- Rode o Webapp com `cd web` e `npm start`, navegue em http://localhost:3000/

### Exemplos de Logs
```
[nodemon] starting `babel-node src/index.js --presets es2015,stage-2`
SETUP - Connecting database...
SETUP - Loading modules...
SETUP - GraphQL...
SETUP - Syncing database tables...
INFO - Database connected.
INFO - Database sync complete.
SETUP - Starting server...
INFO - Server started on port 3000.
```

## 🏗 Estrutura do Repositório
    dashboard-publico
      ├── api (api.example.com)
      │   ├── src
      │   │   ├── config
      │   │   ├── models
      │   │   ├── schema
      │   │   ├── setup
      │   │   └── index.js
      │   │
      │   └── package.json
      │
      ├── web (example.com)
      │   ├── public
      │   ├── src
      │   │   ├── components
      │   │   ├── setup
      │   │   └── index.js
      │   │
      │   ├── .env
      │   └── package.json
      │
      ├── .gitignore
      └── README.md

## 📜 License
Copyright (c) 2017-18 Atul Yadav http://github.com/atulmy (Boilerplate)  
Copyright (c) 2019 SDEC-Brasil (Tiago Loriato, Francisco Thiesen, David Beyda)

The MIT License (http://www.opensource.org/licenses/mit-license.php)
