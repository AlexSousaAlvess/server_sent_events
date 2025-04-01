
# 📘 Documentação do MVP de E-commerce com Microserviços

Este projeto é uma PoC que evoluiu para um MVP de e-commerce com arquitetura de microsserviços. Ele inclui autenticação, controle de produtos e estoque, simulação de compras e um sistema de notificações multicanal.

---

## 🧱 Arquitetura Geral

- **API Gateway**: Roteia requisições, valida JWT e propaga headers de autenticação.
- **Auth Service**: Cadastro, login, emissão e validação de JWT, controle de perfis.
- **Product Service**: Cadastro e listagem de produtos.
- **Stock Service**: Controle de estoque, integrado via Kafka.
- **Purchase Service**: Registra compras, emite eventos Kafka para estoque e notificações.
- **Notification Service**: Escuta eventos Kafka e envia notificações por SSE, e futuramente por e-mail e SMS.

---

## 🧑 Perfis de Usuário

| Perfil     | Acesso                                                        |
|------------|---------------------------------------------------------------|
| CLIENTE    | Apenas listagem e compra de produtos                          |
| OPERADOR   | Recebe notificação de sucesso na compra                       |
| SUPERVISOR | Recebe notificação com vendedor e estoque                     |
| GERENTE    | Pode cadastrar produtos e vê valor total da venda             |

---

## 🔐 Autenticação

- JWT assinado com secret de 256 bits.
- Header propagado entre os serviços via Gateway.
- Filtro `JwtAuthGatewayFilterFactory` no Gateway valida e injeta headers:
  - `x-user-email`
  - `x-user-role`

---

## 📦 Serviços e Casos de Uso

### 🔹 Auth Service
- `POST /auth/register` → Registro de usuário com role.
- `POST /auth/login` → Retorna JWT.
- `GET /auth/profile` → Retorna dados do usuário autenticado.

### 🔹 Gateway Service
- Redireciona chamadas aos serviços conforme a rota.
- Aplica filtro de JWT.
- Libera CORS para `http://localhost:3000`.

### 🔹 Product Service
- `GET /product` → Lista produtos.
- `POST /product` → Cadastra produto (GERENTE).
- `GET /product/{id}` → Detalhes.

### 🔹 Stock Service
- Atualiza estoque após compra via evento Kafka.
- `GET /stock/{productId}` → Verifica saldo.
- `PUT /stock/{productId}` → Atualiza saldo.

### 🔹 Purchase Service
- `POST /purchases` → Cria compra.
- Gera eventos para:
  - Atualizar estoque.
  - Notificar usuários com base no perfil.

### 🔹 Notification Service
- Escuta tópico `notificacoes`.
- Armazena notificações no banco.
- `GET /notifications/unread` → Não lidas.
- `PATCH /notifications/{id}/read` → Marcar como lida.
- Envia eventos via SSE para o frontend.
- Futuro: envio por e-mail e SMS.

---

## 💬 Notificações Simuladas

| Perfil     | Conteúdo da Notificação                                      |
|------------|--------------------------------------------------------------|
| OPERADOR   | "Compra realizada com sucesso"                               |
| SUPERVISOR | "Produto X tem Y unidades. Vendido por: Operador Fulano"     |
| GERENTE    | "Venda de R$ 250,00 realizada. Produto X vendido a R$ 50,00" |


## Fluxo da notificação após o cliente efetua a compra

| Perfil     | Tipo de Notificação                                          |
|------------|--------------------------------------------------------------|
| OPERADOR   | "Compra realizada com sucesso"                               |
|------------|--------------------------------------------------------------|
| SUPERVISOR | - Quantidade atual do produto                                |
|            | - Vendedor (quem realizou a venda, ou seja, o userEmail)     |
|------------|--------------------------------------------------------------|
| GERENTE    | - Valor total da compra                                      |
|            | - Valor da venda atual                                       |
|------------|--------------------------------------------------------------|
| CLIENTE    | Recebe notificação via e-mail e SMS com a                    |
|            |  confirmação da compra.                                      |



Quando um CLIENTE realiza uma compra:
🔔 Notificações enviadas para:
Perfil	Tipo de Notificação
OPERADOR	"Compra efetuada com sucesso"
SUPERVISOR	- Quantidade atual do produto
- Vendedor (quem realizou a venda, ou seja, o userEmail)
GERENTE	- Valor total da compra
- Valor da venda atual
CLIENTE	Recebe notificação via e-mail e SMS com a confirmação da compra.

---

## 🚀 Tecnologias

- Java 17 + Spring Boot
- PostgreSQL
- Apache Kafka
- React (Next.js) + Tailwind
- Spring Cloud Gateway
- JWT com jjwt

---

## 🛠️ Build

- Cada serviço é independente e roda com sua porta e banco isolado.
- Kafka e Zookeeper são necessários para eventos.
- Rodar frontend em `localhost:3000`.
- Gateway centraliza o acesso via `localhost:8080`.

---

## 📎 Autor

Desenvolvido por Alex Souza como experimento de arquitetura orientada a eventos e microsserviços para e-commerce.
