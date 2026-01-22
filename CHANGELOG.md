# CHANGELOG - Gestão Operacional (Fluig Forms)

## Resumo
- Aplicado “skin” visual estilo Handsontable nas tabelas alvo (SSMA, Físico, Histograma e HH), mantendo intacta a Curva de Avanço.  
- Bloqueadas ações de adicionar/remover linhas dentro das tabelas “hot-skin”.  
- Integração atualizada para enviar DESVIO_INICIO/DESVIO_TERMINO no salvamento e carregar a última integração ao selecionar o projeto no Zoom.

## Arquivos alterados/criados
- **Alterados**
  - `forms/formulario Gestão Operacional/gestaoOperacionalFS.html`
  - `forms/formulario Gestão Operacional/js/operacoes_em_tela.js`
  - `forms/formulario Gestão Operacional/js/integracaoDados.js`
  - `forms/formulario Gestão Operacional/js/control/selectZoom.js`
- **Criados**
  - `forms/formulario Gestão Operacional/style/hot-skin.css`
  - `CHANGELOG.md`

## Funções adicionadas (assinatura + chamadas)
- **`applyHotSkinTables()`**  
  - **Onde:** `operacoes_em_tela.js`  
  - **Chamado em:** `DOMContentLoaded`  
  - **Propósito:** garantir `.hot-skin-table` nas tabelas alvo (exceto Curva).

- **`blockHotSkinRowActions()`**  
  - **Onde:** `operacoes_em_tela.js`  
  - **Chamado em:** `DOMContentLoaded`  
  - **Propósito:** bloquear cliques em botões de adicionar/remover linhas dentro das tabelas hot-skin.

- **`getDesvioInicioTerminoFromTela(contexto)`**  
  - **Onde:** `integracaoDados.js`  
  - **Chamado em:** `salvarSSMA()`, `salvarHistograma()`, `salvarHistogramaAuxiliar()`, `salvarInformacoesFisicas()`, `salvarCurvaAvanco()`  
  - **Propósito:** ler os desvios já calculados na tela e mapear para `DESVIO_INICIO` e `DESVIO_TERMINO`.

- **`loadLastIntegrationForProject()`**  
  - **Onde:** `integracaoDados.js`  
  - **Chamado em:** `setSelectedZoomItem()` (`selectZoom.js`)  
  - **Propósito:** consultar e aplicar a última integração do projeto selecionado, respeitando `EFETIVADO`.

- **Helpers de integração (internos)**  
  - `fetchDatasetByTipo()`, `pickLatestIntegrationRecords()`, `fillTablesByTipo()`  
  - Funções de preenchimento: `fillSSMATable()`, `fillHistogramaTable()`, `fillHistogramaAuxTable()`, `fillFisicoTable()`, `fillCurvaTable()`

## Critério de “última integração”
1. **RECMODIFIEDON (timestamp)**: escolhido quando disponível no retorno do dataset.  
2. **CHAVE**: fallback se existir no retorno do dataset.  
3. **MES/ANO/COMPETENCIA**: fallback final (mantém todos os registros já filtrados pela competência corrente).  

> Observação: a consulta usa os filtros de competência/mês/ano por limitações do dataset atual.

## Mapeamento DESVIO_INICIO / DESVIO_TERMINO
- **DESVIO_INICIO:** input `desvioLB` da linha “Desvio” no bloco **Informações Físicas** (`#fisico-table`).  
- **DESVIO_TERMINO:** input `desvioLBTermino` da linha “Desvio” no bloco **Informações Físicas** (`#fisico-table`).  
- **Sem término:** quando o campo de término não existe ou está vazio, define-se **`DESVIO_TERMINO = "0"`** (regra documentada).

## Checklist de testes manuais
1. Selecionar um projeto no Zoom e verificar preenchimento automático dos campos ocultos.  
2. Confirmar que as tabelas SSMA, Físico, Histograma e HH recebem o visual “hot-skin”.  
3. Validar que botões de adicionar/remover linha dentro dessas tabelas (se existirem) não executam ação.  
4. Verificar preenchimento automático da última integração (logs `[INTEGRACAO][LOAD]`).  
5. Confirmar que registros com `EFETIVADO != 0` não são sobrescritos (`[INTEGRACAO][SKIP_EFETIVADO]`).  
6. Executar `Validar & Salvar` e conferir constraints `DESVIO_INICIO`/`DESVIO_TERMINO` no console/dataset.
