# Meu Frontend - Consumo de API com Autenticação JWT

Uma Single Page Application (SPA) desenvolvida em **React** para consumir uma API RESTful segura. 

Este projeto é a camada visual do ecossistema, focado em demonstrar o ciclo completo de autenticação, desde a captura de credenciais até o gerenciamento de rotas privadas com base em Tokens JWT.

---

## Tecnologias Utilizadas

* **React (com Vite)**: Biblioteca principal para construção da interface e renderização ultrarápida no ambiente de desenvolvimento.
* **React Router DOM**: Gerenciamento de rotas (Navegação SPA) e criação de rotas protegidas.
* **Fetch API**: Consumo nativo e assíncrono dos endpoints do Back-end.
* **LocalStorage**: Persistência do Token JWT no navegador do usuário.

---

## O que foi implementado neste projeto

* **State Management (useState)**: Controle do formulário de login (Controlled Components) e armazenamento dos dados vindos da API.
* **Efeitos Colaterais (useEffect)**: Disparo automático de requisições HTTP assim que o componente é montado na tela.
* **Autenticação de Ponta a Ponta**: 
  * Envio de credenciais seguras para o Back-end.
  * Captura e armazenamento do Token JWT no cofre do navegador (`localStorage`).
  * Injeção do Token no cabeçalho (Header `Authorization: Bearer`) para consumo de rotas trancadas.
* **Rotas Privadas (Protected Routes)**: Implementação de um componente Wrapper (`<RotaPrivada>`) que intercepta usuários não autenticados e os redireciona imediatamente para o Login.

---

## Estrutura de Pastas

A arquitetura do projeto foi pensada para manter a separação de responsabilidades:

```text
src/
 ├── components/    # Componentes reaproveitáveis e lógicos (ex: RotaPrivada.jsx)
 ├── pages/         # Telas completas da aplicação (ex: Login.jsx, Dashboard.jsx)
 ├── App.jsx        # Ponto de entrada e central de roteamento (React Router)
 ├── main.jsx       # Inicialização do React e montagem no DOM