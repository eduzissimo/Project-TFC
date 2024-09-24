# Boas vindas ao repositório do Trybe Futebol Clube!

<details>
<summary><strong>👨‍💻 O que foi desenvolvido</strong></summary><br />

  O `TFC` é um site informativo sobre partidas e classificações de futebol! ⚽️

  Nesse projeto, foi construído **um back-end dockerizado utilizando modelagem de dados através do Sequelize**. No projeto foi **respeitado as regras de negócio** providas no projeto e **a API é capaz de ser consumida por um front-end já provido nesse projeto**.

  O back-end foi implementado as regras de negócio para popular adequadamente a tabela disponível no front-end que será exibida para a pessoa usuária do sistema.

</details>

<details>
<summary><strong>🏟️ Estrutura do projeto</strong></summary><br />

O projeto é composto de 4 entidades importantes para sua estrutura:

1️⃣ **Banco de dados:**
  - Será um container docker MySQL já configurado no docker-compose através de um serviço definido como `db`.
  - Tem o papel de fornecer dados para o serviço de _backend_.
  - Durante a execução dos testes sempre vai ser acessado pelo `sequelize` e via porta `3306` do `localhost`;
  - Também pode conectar a um Cliente MySQL (Workbench, Beekeeper, DBeaver e etc), colocando as credenciais configuradas no docker-compose no serviço `db`.

2️⃣ **Back-end:**
 - Será o ambiente que realizará a maior parte das implementações exigidas.
 - Deve rodar na porta `3001`, pois o front-end faz requisições para ele nessa porta por padrão;
 - A aplicação deve ser inicializada a partir do arquivo `app/backend/src/server.ts`;
 - O `express` é executado e a aplicação ouve a porta que vem das variáveis de ambiente;


3️⃣ **Front-end:**
  - O front já está concluído, não é necessário realizar modificações no mesmo. A única exceção será seu Dockerfile que precisará ser configurado.
  - O front se comunica com serviço de back-end pela url `http://localhost:3001` através dos endpoints que fora construido.

4️⃣ **Docker:**
  - O `docker-compose` tem a responsabilidade de unir todos os serviços conteinerizados (backend, frontend e db) e subir o projeto completo com o comando `npm run compose:up`;

</details>
