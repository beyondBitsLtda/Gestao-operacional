# Formulário Modelo para Fluig – Importação em Excel

> **DELP – 2025**

## 📋 Sobre o Projeto
[cite_start]Este projeto tem como objetivo facilitar os desenvolvimentos internos do time de TI no Fluig[cite: 13]. [cite_start]A ideia central é que nenhum desenvolvimento seja iniciado do zero, economizando tempo e padronizando processos[cite: 14].

[cite_start]Inicialmente, o foco deste modelo são formulários que integrem arquivos vindos do Excel, manipulando e validando informações em tela antes de integrá-las ao RM[cite: 15].

---

## 🏗 Mudança na Arquitetura;
Data - 12/12/2025
[cite_start] - Será necessário acrescentar um arquivo DocumentReady.js para: 
 Inicializar a interface visível (mostrar menu inicial, esconder telas seguintes);
- Criar o objeto `ws = new Client()` e chamar `ws.init()` para abrir o WebSocket;
- Bloquear o uso de:
  - Clique direito;
  - `F12`;
  - `Ctrl+U`, `Ctrl+S`;
  para usuários que **não** possuem a role `admin`;
- Buscar roles do usuário via dataset `dsRoleUsuario`.

## 🏗 Mudança na Arquitetura;
Data - 18/12/2025

Será necessário acrescentar o arquivo Sessions.js para:

- Gerenciar a conexão e o estado do WebSocket (ws), controlando o status da sessão e o tipo de cliente;

- Implementar funcionalidades administrativas de sessão, como LockSession (bloqueio total), TornarAdministrador e DesconectarUsuario;

- Renderizar dinamicamente a lista de usuários conectados na sidebar (#divRightBar) com verificação de papéis (Admin/Usuário);

- Tratar mensagens recebidas do servidor para notificações (Toast) e execução remota de scripts (resolveExecScript).

- Será necessário acrescentar o arquivo selectZoom.js para:

- Interceptar o evento de seleção do campo Zoom (setSelectedZoomItem) especificamente para o input "PROJETO";

- Executar validação prévia de negócio (verificar se o Centro de Custo está inativo) antes de preencher os dados;

- Preencher automaticamente os campos ocultos de contexto (Coligada, Filial, IDPRJ, Revisão) baseados na seleção;

- Inicializar (ws.initSession()) ou encerrar (ws.disconnectSession()) a sessão colaborativa atrelada ao projeto selecionado.

- Será necessário acrescentar o arquivo worker.js para:

- Desacoplar o processamento pesado de validação da thread principal da UI, utilizando um Web Worker;

- Executar a função verificaErros de forma assíncrona para validar regras complexas (Ordem de Produção, Notas Fiscais, Datas) sem travar o navegador;

- Realizar consultas a Datasets externos (ex: dsVerificaNotaFiscal) dentro do contexto do worker;

- Normalizar e formatar dados numéricos massivos antes do retorno para a interface.