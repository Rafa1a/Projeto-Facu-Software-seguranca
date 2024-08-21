# Projeto de API Segura

Este projeto é uma API segura desenvolvida com Express e JWT para autenticação e controle de acesso. A API inclui funcionalidades básicas de autenticação, autorização e recuperação de dados com medidas de segurança aprimoradas.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para construir APIs.
- **Body-Parser**: Middleware para processar dados JSON no corpo das requisições.
- **Crypto**: Biblioteca para criptografia (não utilizada na versão final).
- **JSON Web Token (JWT)**: Para autenticação e autorização.

## Endpoints

### Login

- **POST** `/api/auth/login`
- **Descrição**: Realiza o login do usuário e gera um token JWT.
- **Corpo da Requisição**:
```json
    {
        "username": "user",
        "password": "123456"
    }
```
- **Resposta**:
```json
    {
        "token": "JWT_TOKEN_AQUI"
    }
```
### Recuperação dos Dados do Usuário Logado

- **GET** `/api/me`
- **Descrição**: Recupera os dados do usuário logado com base no token JWT fornecido.
- **Headers**:
  - `Authorization: Bearer JWT_TOKEN_AQUI`
- **Resposta**:
```json
    {
        "data": {
        "username": "user",
        "password": "123456",
        "id": 123,
        "email": "user@dominio.com",
        "perfil": "user"
        }
    }
```
### Recuperação dos Dados de Todos os Usuários

- **GET** `/api/users`
- **Descrição**: Recupera todos os usuários cadastrados. Requer perfil 'admin'.
- **Headers**:
- `Authorization: Bearer JWT_TOKEN_AQUI`
- **Resposta**:
```json
    {
    "data": [
        {
            "username": "user",
            "password": "123456",
            "id": 123,
            "email": "user@dominio.com",
            "perfil": "user"
        },
        {
            "username": "admin",
            "password": "123456789",
            "id": 124,
            "email": "admin@dominio.com",
            "perfil": "admin"
        },
        {
            "username": "colab",
            "password": "123",
            "id": 125,
            "email": "colab@dominio.com",
            "perfil": "user"
        }
    ]
    }
```
### Recuperação dos Contratos Existentes

- **GET** `/api/contracts/:empresa/:inicio`
- **Descrição**: Recupera os contratos com base na empresa e data de início. Requer perfil 'admin'.
- **Parâmetros**:
  - `empresa` (string): Nome da empresa.
  - `inicio` (string): Data de início no formato `YYYY-MM-DD`.
- **Headers**:
  - `Authorization: Bearer JWT_TOKEN_AQUI`
- **Resposta**:
```json
    {
        "data": []
    }
```
## Estrutura do Projeto

- **index.js**: Arquivo principal contendo a configuração da API e endpoints.
- **Repository**: Classe fake para simular execução de queries.
- **Validação**: Função `validateParameters` para validar parâmetros contra injeção SQL.

## Configuração

1. **Instalar Dependências**
    ```bash
    npm install
    ```
2. **Executar a Aplicação**
    ```bash
    node index.js
    ```
3. **Testar os Endpoints**
- Utilize ferramentas como Postman ou Boomerang para testar os endpoints.
    
## Segurança

- **JWT**: Utilizado para autenticação e autorização.
- **Validação de Entrada**: A função `validateParameters` valida os parâmetros de entrada para evitar injeção SQL e garantir que estejam no formato correto.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
