# 🎫 Support Ticket API (Node.js Nativo)

Uma API RESTful completa para gerenciamento de tickets de suporte técnico, construída **100% com Node.js nativo**, sem o uso de frameworks externos como Express ou NestJS. 

Este projeto foi desenvolvido com o foco em dominar os fundamentos do Back-end, arquitetura de software e os módulos nativos do Node.js (HTTP, File System, Crypto e Streams).

## 🚀 Tecnologias e Arquitetura

* **Node.js (Built-in Modules):** `node:http`, `node:fs/promises`, `node:crypto`.
* **Sem Frameworks:** Roteamento dinâmico e middlewares construídos do zero.
* **Banco de Dados (Mock):** Sistema de persistência em arquivo JSON (`database.json`) utilizando o padrão *Factory* para isolamento de lógica.
* **Design Patterns:** Separação de responsabilidades (Controllers, Middlewares, Utils e Database) e abordagens de *Domain-Driven Design* (DDD) para regras de negócio (ex: rota dedicada para fechar tickets).

## ⚡ Funcionalidades (Features)

* [x] **Custom Router:** Extração inteligente de *Path Parameters* usando Expressões Regulares (Regex) e *Named Capture Groups*.
* [x] **Body Parser Nativo:** Leitura de requisições baseada em *Streams* e processamento de *Chunks* via *Async Iterators*.
* [x] **Validação Dinâmica:** Validação de campos obrigatórios e *Early Return* para tratamento seguro de erros HTTP (400, 404, 500).
* [x] **Sobrecarga de Rota (Inteligente):** Uma única rota `GET` capaz de distinguir automaticamente se o usuário está filtrando por ID (UUID) ou por Status (baseado no tamanho da string).

## 🛠️ Como executar o projeto

1. Clone este repositório:
```bash
git clone https://github.com/jaumnp/ApiTicket.git
```

2. Acesse a pasta do projeto:
```bash
cd ApiTicket
```

3. Inicie o servidor (Requer Node.js v18+):
```bash
node --watch server.js
```
> O servidor estará rodando em `http://localhost:3000`. O arquivo `db.json` será criado automaticamente na primeira inserção.

---

## 📖 Documentação das Rotas (Endpoints)

### 1. Criar Ticket
* **Método:** `POST`
* **URL:** `/tickets`
* **Body (JSON):**
```json
{
  "equipment": "Computador",
  "description": "Não liga após queda de energia",
  "user_name": "João Paulo"
}
```
* **Respostas:** `201 Created` (Sucesso) | `400 Bad Request` (Campos ausentes)

### 2. Listar e Filtrar Tickets
* **Método:** `GET`
* **URL:** `/tickets` (Lista todos) ou `/tickets/:idStatus`
* **Detalhes:** Esta rota aceita tanto o ID exato de um ticket quanto o nome de um status (`open` ou `closed`) como parâmetro de rota.
* **Respostas:** `200 OK` (Retorna a lista ou o objeto único).

### 3. Atualizar Informações do Ticket
* **Método:** `PUT`
* **URL:** `/tickets/:id`
* **Body (JSON):**
```json
{
  "equipment": "Monitor",
  "description": "Tela piscando"
}
```
* **Respostas:** `200 OK` | `404 Not Found` (ID inexistente)

### 4. Fechar Ticket (Regra de Negócio)
* **Método:** `PATCH`
* **URL:** `/tickets/:id/close`
* **Descrição:** Altera o status do ticket especificamente para "closed", sem necessidade de envio de dados no corpo da requisição.
* **Respostas:** `200 OK` | `404 Not Found`

### 5. Excluir Ticket
* **Método:** `DELETE`
* **URL:** `/tickets/:id`
* **Respostas:** `200 OK` | `404 Not Found`

---

## 👨‍💻 Desenvolvido por
**João Paulo Pires** - Desenvolvedor Full-Stack
