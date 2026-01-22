# Formulário Modelo para Fluig – Importação em Excel

> **DELP – 2025**

## 📋 Sobre o Projeto
[cite_start]Este projeto tem como objetivo facilitar os desenvolvimentos internos do time de TI no Fluig[cite: 13]. [cite_start]A ideia central é que nenhum desenvolvimento seja iniciado do zero, economizando tempo e padronizando processos[cite: 14].

[cite_start]Inicialmente, o foco deste modelo são formulários que integrem arquivos vindos do Excel, manipulando e validando informações em tela antes de integrá-las ao RM[cite: 15].

---

## 🏗 Arquitetura

A estrutura do projeto foi desenhada para ser modular, documentada e facilmente customizável .

### 1. Front-end (`index_modelo.html`)  
[cite_start]Arquivo com as estruturas padrão para criação de formulários no Fluig[cite: 16]. 
* **Componentes:** Inclui modais, tabelas, divs e estrutura de campos padrão.
* [cite_start]**Funcionalidades Nativas:** Campo de pesquisa por OS já implementado[cite: 17].
* [cite_start]**Campos Template:** Uma série de campos de diferentes tipos (texto, zoom, data) mantidos ocultos no código, organizados para reaproveitamento rápido[cite: 17].

### 2. Estilização (`style_modelo.css`)
* [cite_start]Utiliza os padrões visuais e a paleta de cores padronizada do Fluig[cite: 18].
* [cite_start]Estilos predefinidos para alertas em campos ou colunas[cite: 19].
* [cite_start]Estilização responsiva para modais e tabelas[cite: 20].

### 3. Lógica (JavaScript)
A lógica foi separada em arquivos distintos para facilitar a manutenção:

* [cite_start]**import_excel.js:** Responsável por importar a planilha, visualizar dados e realizar validações iniciais (tipo de arquivo, abas, colunas)[cite: 20].
* [cite_start]**validacao_dados_excel.js:** Arquivo dedicado às validações de tipos de campos e regras de negócio específicas do formulário[cite: 21].
* [cite_start]**operacoes_em_tela.js:** Controla ordenação de colunas, filtros e escrita em campos[cite: 22].

### 4. Integração de Dados (datasets.sql)
* [cite_start]Arquivo responsável pelas principais integrações com o banco de dados (SELECT, INSERT, UPDATE)[cite: 23].
* *Nota:* As operações estão organizadas para serem customizáveis. [cite_start]Em um primeiro momento, o foco principal é a leitura (SELECT), com INSERTs e UPDATEs sendo implementados conforme a necessidade[cite: 25].

### 5. API:

 * [cite_start]**Handsontable**  api para renderizar tabelas em formato de excel no front-end.

---

## 🚀 Como Utilizar

Este repositório serve como um "scaffold" (esqueleto). Para iniciar um novo projeto:

1.  **Clonar:** Clone este repositório.
2.  **Renomear:** Altere os nomes dos arquivos HTML e JS para refletir o novo relatório/formulário.
3.  **Configurar Excel:** No arquivo de integração JS, ajuste os parâmetros para ler as colunas específicas da sua planilha.
4.  **Habilitar Campos:** No `index_modelo.html`, localize os campos ocultos, remova a classe de ocultação e ajuste os IDs conforme a necessidade.
5.  **Regras de Negócio:** Implemente as validações específicas no arquivo de regras funcionais.
6.  **Dataset:** Ajuste a query SQL no arquivo de dataset para buscar ou gravar os dados corretos.

[cite_start]Para instruções detalhadas de operação e customização, consulte os comentários internos nos arquivos de código[cite: 26].

---

## 📦 Requisitos
* Acesso ao ambiente de desenvolvimento Fluig.
* Permissão para publicação de Diagramas/Formulários e Datasets.

---
*Gerado para o time de TI - DELP 2025*