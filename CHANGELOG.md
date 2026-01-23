# CHANGELOG - Gestão Operacional (Fluig Forms)

## Resumo
- Aplicado “skin” visual estilo Handsontable nas tabelas alvo (SSMA, Físico, Histograma e HH), mantendo intacta a Curva de Avanço.  
- Bloqueadas ações de adicionar/remover linhas dentro das tabelas “hot-skin”.  
- Integração atualizada para enviar DESVIO_INICIO/DESVIO_TERMINO no salvamento e carregar a última integração ao selecionar o projeto no Zoom.
- Dataset `dsgestaoOperacional.js` ajustado para suportar as novas colunas DESVIO_*, corrigir execução dos SELECTs, aplicar filtro opcional de categoria e expor consulta de última integração mantendo o padrão OPERACAO/TIPO.

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

---

## Ajustes no dataset dsgestaoOperacional.js (correção de compatibilidade)
### O que foi ajustado
- **Execução dos SELECTs:** onde o SQL era montado em `myQuerySelect`, agora é atribuído a `myQuery` antes do `executeQuery`, mantendo o mesmo SQL base.  
- **Filtro de categoria:** criação do `filtroCategoria` com fallback seguro (sem categoria → filtro vazio), preservando a lógica de consulta.  
- **Novas colunas DESVIO_INICIO/DESVIO_TERMINO:** leitura das constraints e inclusão nos **SELECTs**, **INSERTs** e **UPDATEs** para suportar as novas integrações do front.  
- **Consulta de última integração:** novo bloco `OPERACAO=consultar` + `TIPO=ULTIMA_INTEGRACAO`, retornando o registro mais recente (EFETIVADO=0) por projeto, sem alterar a estrutura do dataset.

### Por que foi necessário
- O front-end passou a enviar **DESVIO_INICIO/DESVIO_TERMINO** e a consultar dados para **popular tabelas automaticamente** (SSMA, Físico, Histograma, HH e Curva).  
- Sem essas adaptações, o dataset não retornava dados (SELECT não executado) ou não reconhecia os novos campos.  
- A carga de “última integração” depende do retorno consistente de **RECMODIFIEDON/CHAVE/EFETIVADO** e do filtro opcional por categoria.

### Funções do front dependentes desses ajustes
- `loadLastIntegrationForProject()`, `fetchDatasetByTipo()` e `fillTablesByTipo()` (carregar última integração).  
- `salvarSSMA()`, `salvarHistograma()`, `salvarHistogramaAuxiliar()`, `salvarInformacoesFisicas()` e `salvarCurvaAvanco()` (envio de DESVIO_*).

### Como testar (passo a passo)
1. Selecionar um projeto no Zoom (campos ocultos são preenchidos automaticamente).  
2. Verificar nos logs `[INTEGRACAO][LOAD]` se o dataset retornou registros.  
3. Confirmar o preenchimento automático das tabelas SSMA, Histograma, HH, Físico e Curva.  
4. Executar **Validar & Salvar** e conferir no log do dataset as constraints `DESVIO_INICIO` e `DESVIO_TERMINO`.  
5. Confirmar que apenas registros com `EFETIVADO = 0` foram retornados e/ou atualizados.
