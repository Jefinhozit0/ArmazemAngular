# Armazém Angular - E-commerce com Angular e Node.js

![License](https://img.shields.io/badge/license-MIT-blue.svg)

Este projeto é uma aplicação de e-commerce completa desenvolvida com um frontend em **Angular** e um backend em **Node.js com Express**, utilizando um banco de dados **MySQL** para persistência de dados.

## 📝 Descrição

A plataforma permite que usuários se cadastrem, façam login, naveguem por produtos, adicionem itens a um carrinho de compras e finalizem seus pedidos. O projeto foi estruturado para separar claramente as responsabilidades entre o cliente (Angular) e o servidor (Node.js), comunicando-se através de uma API RESTful.

## ✨ Funcionalidades

-   **Autenticação de Usuários**: Sistema completo de cadastro e login.
-   **Gestão de Clientes**: Criação e autenticação de clientes.
-   **Carrinho de Compras**: Adição, remoção e visualização de itens no carrinho, com dados salvos no `localStorage` do navegador.
-   **Finalização de Pedido**: Envio dos dados do carrinho e do cliente logado para o backend para processamento.
-   **Recuperação de Senha (Planejado)**: Lógica de backend para envio de email de recuperação usando Nodemailer.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

#### **Frontend**
* [Angular](https://angular.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [Bootstrap](https://getbootstrap.com/) para estilização

#### **Backend**
* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/pt-br/)
* **Bibliotecas Principais:**
    * `mysql2`: Driver para conexão com o banco de dados MySQL.
    * `cors`: Para permitir requisições entre o frontend e o backend.
    * `dotenv`: Para gerenciar variáveis de ambiente.
    * `nodemailer`: Para o envio de emails.

#### **Banco de Dados**
* [MySQL](https://www.mysql.com/)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (que já inclui o npm)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* Um servidor MySQL (como o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/))
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) ou outro cliente de banco de dados.

## ⚙️ Instalação e Configuração

Siga os passos abaixo para obter uma cópia local do projeto e executá-la.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências do Backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure as Variáveis de Ambiente do Backend:**
    * Na pasta `backend`, crie um arquivo chamado `.env`.
    * Copie o conteúdo do arquivo `.env.example` (se houver) ou use o modelo abaixo e preencha com suas credenciais:

    ```env
    # Credenciais do Banco de Dados MySQL
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=SUA_SENHA_DO_MYSQL
    DB_DATABASE=armazem
    DB_PORT=3306

    # Credenciais de Email (para o "Esqueci minha senha")
    EMAIL_HOST=smtp-relay.brevo.com
    EMAIL_PORT=587
    EMAIL_USER=seu-email-de-servico@exemplo.com
    EMAIL_PASS=SUA_CHAVE_DE_SENHA_SMTP
    ```

4.  **Instale as dependências do Frontend:**
    ```bash
    cd ../armazemangular  # Ou o nome da sua pasta frontend
    npm install
    ```

## ▶️ Executando a Aplicação

Com tudo configurado, você precisará de dois terminais para rodar o projeto.

1.  **Para iniciar o Backend:**
    ```bash
    cd backend
    npm start
    ```
    O servidor estará rodando em `http://localhost:3000`.

2.  **Para iniciar o Frontend:**
    ```bash
    cd armazemangular # Ou o nome da sua pasta frontend
    ng serve
    ```
    A aplicação estará acessível em `http://localhost:4200`.

## 🌐 API Endpoints

O backend expõe os seguintes endpoints principais:

| Método | Rota                      | Descrição                               |
| :----- | :------------------------ | :---------------------------------------- |
| `POST` | `/api/clientes`           | Cria um novo cliente (cadastro).          |
| `POST` | `/api/clientes/login`     | Autentica um cliente existente.           |
| `GET`  | `/api/clientes`           | Lista todos os clientes.                  |
| `POST` | `/api/pedidos`            | Recebe os dados para finalizar uma compra.|
| `POST` | `/api/clientes/esqueci-senha` | Inicia o processo de recuperação de senha.|
| `GET`  | `/api/health`             | Verifica se o servidor está no ar.        |


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## 👨‍💻 Autor

**Jefferson** - *Jeffeson Silva de Almeida*
* GitHub: [@Jefinhozit0](https://github.com/Jefinhozit0)
