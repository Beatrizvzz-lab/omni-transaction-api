# 💸 Omni Wallet API

API RESTful para simular um sistema simples de transações monetárias entre usuários.

---

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Postman](https://www.postman.com/)

---

## 📦 Instalação

```bash
# clone o repositório
$ git clone <repo-url>

# entre na pasta do projeto
$ cd omni-wallet-api

# instale as dependências
$ npm install
```

---

## 🐳 Subindo com Docker

```bash
# Suba o PostgreSQL
$ docker compose up -d

# Verifique se o banco está rodando
$ docker ps

# (Opcional) Verifique se a tabela está criada
$ docker exec -it omni-postgres psql -U postgres -d omni_wallet -c '\dt'
```

> O banco está configurado no arquivo `.env` e inicializado automaticamente com o TypeORM.

---

## ⚙️ Variáveis de Ambiente

Configure um arquivo `.env` na raiz com o seguinte conteúdo:

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
JWT_SECRET=
```

---

## 🔐 Autenticação

Utiliza JWT (Bearer Token) com tempo de expiração de 1h.

> As rotas de login e cadastro são públicas. Todas as demais exigem autenticação.

---

## 📮 Endpoints

### POST `/users/signup`

Cria um novo usuário.

```json
{
  "username": "string",
  "password": "string",
  "birthdate": "yyyy-mm-dd"
}
```

### POST `/auth/signin`

Autentica o usuário e retorna o token JWT.

```json
{
  "username": "string",
  "password": "string"
}
```

### GET `/users` _(protegido)_

Lista todos os usuários cadastrados.

### POST `/transfer` _(protegido)_

Realiza uma transferência entre dois usuários.

```json
{
  "fromId": "uuid",
  "toId": "uuid",
  "amount": 100
}
```

---

## 🧪 Testes com Postman

A collection de testes está incluída no repositório:

```
/postman/Omni.postman_collection.json
```

### Como importar:

1. Abra o Postman
2. Clique em `Import`
3. Selecione o arquivo `.json`
4. Configure o Bearer Token nas rotas protegidas

---

## 🛠️ To-Do (extras)

- [ ] Registrar histórico de transferências (TransferEntity)
- [ ] Testes unitários com Jest
- [ ] Deploy (ex: Render, Railway)

---

## 👨‍💻 Desenvolvedor

Feito com 💙 por Beatriz Lira
