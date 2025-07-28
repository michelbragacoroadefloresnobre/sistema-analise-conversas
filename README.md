# Sistema de Análise de Conversas - Coroa de Flores Nobre

![Node.js](https://img.shields.io/badge/Node.js-18.x-blue?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-darkblue?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)

## 📖 Sobre o Projeto

Este projeto é um sistema de backend desenvolvido para a **Coroa de Flores Nobre** com o objetivo de automatizar a análise e a geração de relatórios de performance do atendimento ao cliente realizado via WhatsApp.

A aplicação recebe dados processados por um workflow do N8N, que utiliza Inteligência Artificial para avaliar cada conversa. Com base nesses dados, o sistema salva as análises em um banco de dados, gera relatórios diários em HTML e os envia por e-mail para os gestores, além de disponibilizar uma interface web para consulta detalhada de cada conversa.

## ✨ Funcionalidades Principais

- **Validação de Dados:** Utiliza **Zod** para garantir a integridade dos dados recebidos do workflow de automação.
- **Armazenamento Estruturado:** Persiste todas as análises em um banco de dados **PostgreSQL** através do ORM **Prisma**.
- **Geração de Relatórios:** Cria relatórios diários em HTML de forma dinâmica utilizando o template engine **EJS**.
- **Visualização Detalhada:** Oferece um endpoint web para visualizar a análise completa de cada conversa individualmente.
- **Envio de E-mails:** Utiliza **Nodemailer** para enviar os relatórios gerados automaticamente para uma lista de destinatários.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Validação:** Zod
- **Template Engine:** EJS
- **Envio de E-mail:** Nodemailer

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma instância do **PostgreSQL** rodando
- [Git](https://git-scm.com/)

### Guia de Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://seu-repositorio-git/aqui.git
    cd nome-do-projeto
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`:

    ```bash
    cp .env.example .env
    ```

    Agora, abra o arquivo `.env` e preencha as variáveis com as suas informações:

| Variável         | Descrição                                                              | Exemplo                             |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| `PORT`           | A porta em que o servidor Express irá rodar.                           | `3000`                              |
| `DATABASE_URL`   | A URL de conexão completa para o seu banco de dados PostgreSQL.        | `postgres://USER:PASS@HOST:PORT/DB` |
| `WEBSITE_URL`    | A URL base da sua aplicação. Usada para gerar os links nos relatórios. | `http://localhost:3000`             |
| `SMTP_HOST`      | O endereço do servidor SMTP para envio de e-mails.                     | `smtp.gmail.com`                    |
| `SMTP_PORT`      | A porta do servidor SMTP.                                              | `465`                               |
| `SMTP_USER`      | O nome de usuário para autenticação no servidor SMTP.                  | `seu-email@gmail.com`               |
| `SMTP_PASS`      | A senha de autenticação. **(Para o Gmail, use uma Senha de App)**.     | `suasenhadappdeaqui`                |
| `MAIL_RECIPENTS` | Lista de e-mails, separados por vírgula, que receberão os relatórios.  | `chefe@email.com,gestor@email.com`  |

4.  **Configure o Banco de Dados com Prisma:**

    Execute o comando abaixo para aplicar as migrações e criar as tabelas no seu banco de dados. O Prisma irá ler a `DATABASE_URL` do seu arquivo `.env`.

    ```bash
    npx prisma migrate deploy
    ```

    Este comando também irá gerar o Prisma Client automaticamente. Caso precise gerá-lo manualmente, rode:

    ```bash
    npx prisma generate
    ```

### Executando a Aplicação

- **Modo de Desenvolvimento:**
  Para rodar o servidor em modo de desenvolvimento com hot-reload (usando `ts-node-dev` ou similar):

  ```bash
  npm run dev
  ```

- **Modo de Produção:**
  Para compilar o código TypeScript e iniciar o servidor em modo de produção:

  ```bash
  # 1. Compilar o código
  npm run build

  # 2. Iniciar o servidor
  npm run start
  ```

O servidor estará rodando no endereço `http://localhost:PORT`, onde `PORT` é o valor que você definiu no arquivo `.env`.

## 🔗 Endpoints da API

- `POST /reports`
  - Recebe o JSON da análise de conversas (geralmente enviado pelo N8N), gera o relatório e envia para o email dos colaboradores.
- `GET /conversations/:id`
  - Retorna uma página HTML com a análise detalhada de uma conversa específica, buscando pelo seu ID no banco de dados.
- `GET /resports?type=daily`
  - Endpoint de exemplo para visualizar o relatório diário completo em HTML no navegador.
