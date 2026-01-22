/**################################################################################################
 * Arquivo operacoes_em_tela.js
 * - Responsável por funções de usabilidade e manipulação de elementos do formulário na UI.
 * - Controla a visibilidade de painéis, tabelas e menus (show/hide, toggle).
 * - Gerencia estados de carregamento (loading/spinner), toasts e feedbacks ao usuário.
 * - Aplica formatações visuais e máscaras em tempo de interação (classes, estilos, foco).
 * - Implementa atalhos e comportamentos de navegação (teclado, cliques, scroll).
 * - Suporte à acessibilidade (aria-attributes, foco, leitura de estado).
 *
 * Reuso / Observações:
 * - Mantenha consistência de IDs/classes conforme o HTML para evitar quebras de seleção.
 * - Centralize transições/animções e delays em helpers (ex.: TRANSITION_DELAY, toggleSection()).
 * - Padronize feedbacks via funções utilitárias (ex.: showToast(), showLoading(), hideLoading()).
 * - Valide estados antes de alternar telas para não perder dados (ex.: checar tabelas/totalizadores).
 * - Se houver integrações com outros módulos (importação/validação), exponha APIs claras (ex.: resetIntegracaoState()).
 * - Considere boas práticas de acessibilidade (aria-hidden, aria-live, gerenciamento de foco).
 #####################################################################################################*/


const worker = new Worker("worker.js");
var processedSpreadsheetData = [];
var paymentMethodAssignments = {};
var validationErrors = {};
var integrar = false;

//const table = document.querySelector('#ssma-table');
//const  histTable = document.querySelector('#hist-table');
 


/**
 * Função: iniciar()
 * ---------------------------------------------------------
 * Propósito:
 *  - Validar se o projeto (#CODPRJ) está informado.
 *  - Trocar a UI do estado "inicial" para "importação".
 *  - Exibir aviso (FLUIGC.toast) quando faltar dados.
 *
 * Fluxo:
 *  1) Lê #CODPRJ e #DESCPROJETO.
 *  2) Se #CODPRJ for nulo/vazio => mostra toast e interrompe.
 *  3) Caso válido:
 *     - Oculta #selection-menu.
 *     - Mostra .info-painel, .importar-planilha, .table-importacao.
 *     - Atualiza o texto do painel (use o alvo correto, ex.: #info-painel-selecao).
 *
 * Reuso (como adaptar):
 *  - Troque IDs dos campos (#CODPRJ, #DESCPROJETO) pelos do seu formulário.
 *  - Ajuste seletores das seções (menu/painel/importação/tabela).
 *  - Prefira alterar o conteúdo em um elemento específico (ex.: #info-painel-selecao)
 *    para não sobrescrever o container inteiro (#info-painel).
 *  - Se usar classe .is-hidden no CSS, considere add/removeClass em vez de show/hide.
 *  - (Opcional) Persista estado (ex.: localStorage ou input hidden #UI_STATE) e
 *    reaplique no DOMContentLoaded para manter a UI no estado "iniciado".
 *
 * Dependências:
 *  - jQuery (DOM): $("#..."), .hide(), .show(), .text()
 *  - FLUIGC.toast (alertas)
 *  - isNulo(valor) (utilitária de validação)
 */



function iniciar() {
  console.log('[UI] 🚀 iniciar()');
  
  // === Expandir container ANTES de tudo ===
  expandirContainer();
  
  var codprj = $("#CODPRJ").val();
  const operacao = $("#OPERACAO").val();
  const projeto  = $("#DESCPROJETO").val();

  integrar = true;

  // Validação mínima
  if (isNulo(codprj)) {
    integrar = false;
    if (typeof FLUIGC !== 'undefined' && FLUIGC.toast) {
      FLUIGC.toast({
        title: 'Atenção: ',
        message: 'O projeto deve ser informado!',
        type: 'warning',
        timeout: 15000
      });
    }
    return;
  }

  // --- Transição de UI ---
  $("#selection-menu").hide();
  $(".info-painel").show();
  $(".excel-value").show();
  $(".field-with-btn").show();
  $(".competencia-label").show();
  $(".table-importacao").show();
  $("#projetoValue").text("Projeto: "+codprj+", "+projeto);
  console.log("[UI] Projeto: "+codprj+", "+projeto);

  // ✅ CHAMAR buscarCompetenciaAtual() AQUI, depois que a UI está visível
  buscarCompetenciaAtual();

  // Mostrar blocos
  const idsParaMostrar = [
    'ssmaContainer',
    'block-acompanhamento',
    'block-histograma',
    'block-hh',
    'curve-block'
  ];

  idsParaMostrar.forEach(id => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[UI] Elemento #${id} não encontrado.`);
      return;
    }
    el.style.display = 'block';
  });

  // --- Inicializações de Validação ---
  if (typeof setupDelegationForSSMA === 'function') {
    setupDelegationForSSMA();
  } else {
    console.warn('[SSMA] setupDelegationForSSMA() não está disponível.');
  }

  if (typeof setupDelegationForHistograma === 'function') {
    setupDelegationForHistograma();
  } else {
    console.warn('[HISTOGRAMA] setupDelegationForHistograma() não está disponível.');
  }

  if (typeof setupDelegationForHH === 'function') {
    setupDelegationForHH();
  } else {
    console.warn('[HH] setupDelegationForHH() não está disponível.');
  }

  if (typeof setupDelegationForFisico === 'function') {
    setupDelegationForFisico();
  } else {
    console.warn('[FISICO] setupDelegationForFisico() não está disponível.');
  }

  
  if (typeof setupDelegationForCurve === 'function') {
    setupDelegationForCurve();
  } else {
    console.warn('[CURVA] setupDelegationForCurve() não está disponível.');
  }

  // --- Inicializações de Formatação ---
  formatSSMA();
  formatFisico();
  formatHistograma();
  formatHH();
  formatCurva();
  formatAllTablesNumbersBR();

  // --- Animação de competência ---
  const competenciaField = document.querySelector('.competencia-header-wrapper');
  if (competenciaField) {
    competenciaField.classList.add('visible');
  }

   computeHistogramDesvio();
   computeFisicoDesvio();
   recomputePrevAccCurve();

   setupHistogramAutoCalcBindings();
   setupFisicoAutoCalcBindings();
   setupCurveAutoCalcBindings();

  // --- Painel informativo ---
  $("#info-painel").text(`Projeto: ${codprj}, ${projeto}`);
}

// ========================================
// FUNÇÃO PARA EXPANDIR O CONTAINER
// ========================================
function expandirContainer() {
  console.log('[UI] 🔧 Expandindo container...');
  
  // 1. Container principal
  const mainContainer = document.getElementById('main-app-container');
  if (!mainContainer) {
    console.error('[UI] ❌ #main-app-container não encontrado!');
    return;
  }

  // 2. Container fluig-style-guide (PAI que limita largura)
  const fluigStyleGuide = document.querySelector('.fluig-style-guide');
  
  // 3. Aplica estilos no container principal
  mainContainer.style.setProperty('max-width', '2000px', 'important');
  mainContainer.style.setProperty('width', '100%', 'important');
  mainContainer.style.setProperty('margin', '0 auto', 'important');
  mainContainer.style.setProperty('padding-left', '20px', 'important');
  mainContainer.style.setProperty('padding-right', '20px', 'important');

  // 4. CRÍTICO: Remove limitação do fluig-style-guide
  if (fluigStyleGuide) {
    fluigStyleGuide.style.setProperty('max-width', 'none', 'important');
    fluigStyleGuide.style.setProperty('width', '100%', 'important');
    console.log('[UI] ✅ fluig-style-guide expandido');
  }

  // 5. Ajusta a main-content também
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.setProperty('max-width', '2000px', 'important');
    mainContent.style.setProperty('width', '100%', 'important');
  }

  // 6. Garante que body não limita
  document.body.style.setProperty('overflow-x', 'auto', 'important');

  console.log('[UI] ✅ Container expandido com sucesso!');
  console.log('[UI] 📊 Larguras:', {
    fluigStyleGuide: fluigStyleGuide ? getComputedStyle(fluigStyleGuide).width : 'N/A',
    mainContainer: getComputedStyle(mainContainer).width,
    mainContent: mainContent ? getComputedStyle(mainContent).width : 'N/A'
  });


}



// Expõe no escopo global
window.iniciar = iniciar;
window.expandirContainer = expandirContainer;


/**
 * Função voltarInicio()
 * ---------------------------------------------------------
 * - Retorna a UI ao estado inicial.
 * - Mostra menu (#selection-menu) e oculta painéis.
 * - Limpa tabela (#imported-data-body), feedback e totais.
 * - Esconde badge de erros e reseta validationErrors.
 * - **RETORNA O CONTAINER AO TAMANHO ORIGINAL (1000px)**
 *
 * Reuso:
 * - Ajuste seletores para seu layout.
 * - Centralize IDs/classes em constantes para manutenção.
 * - Pode usar classes (.is-hidden) para controle visual.
 */

function voltarInicio() {
  console.log("[UI] Voltando ao início...");

  loading.show();

  setTimeout(function() {
    integrar = false;

    // ============================================================
    // 🔙 RETORNAR CONTAINER AO TAMANHO ORIGINAL
    // ============================================================
    retrairContainer();

    // ============================================================
    // OCULTAR O CAMPO DE COMPETÊNCIA COM ANIMAÇÃO
    // ============================================================
    const competenciaField = document.querySelector(".competencia-header-wrapper");
    if (competenciaField) {
      competenciaField.classList.remove("visible");
    }

    // ============================================================
    // MOSTRAR/OCULTAR PAINÉIS
    // ============================================================
    $("#selection-menu").show();
    $(".info-painel").hide();
    $(".competencia-label").hide();
    $(".table-importacao").hide();
    $(".field-with-btn").hide();

    // ============================================================
    // LIMPAR DADOS E FEEDBACK
    // ============================================================
    $("#imported-data-body").empty();
    $("#imported-data-body").append('<tr><td colspan="6">Nenhum dado importado.</td></tr>');
    $("#total-com-impostos").text("R$ 0,00");
    $("#total-sem-impostos").text("R$ 0,00");
    $("#import-feedback").empty();
    $(".error-counter-badge").hide();

    // ============================================================
    // OCULTAR BLOCOS DE RELATÓRIOS
    // ============================================================
    document.getElementById("ssmaContainer").style.display = "none";
    document.getElementById("block-acompanhamento").style.display = "none";
    document.getElementById("block-histograma").style.display = "none";
    document.getElementById("block-hh").style.display = "none";
    document.getElementById("curve-block").style.display = "none";

    // ============================================================
    // RESETAR VALIDAÇÕES
    // ============================================================
    validationErrors = {};

    loading.hide();

    console.log("[UI] ✅ Retornado ao estado inicial");
  }, 500);
}

// ========================================
// FUNÇÃO PARA RETRAIR O CONTAINER
// ========================================
function retrairContainer() {
  console.log('[UI] 🔧 Retraindo container ao tamanho original...');
  
  // 1. Container principal
  const mainContainer = document.getElementById('main-app-container');
  if (!mainContainer) {
    console.error('[UI] ❌ #main-app-container não encontrado!');
    return;
  }

  // 2. Container fluig-style-guide
  const fluigStyleGuide = document.querySelector('.fluig-style-guide');
  
  // 3. RETORNA ao tamanho original (1000px)
  mainContainer.style.setProperty('max-width', '1000px', 'important');
  mainContainer.style.setProperty('width', '100%', 'important');
  mainContainer.style.setProperty('margin', '0 auto', 'important');
  mainContainer.style.setProperty('flex', '0 0 1000px', 'important');
  mainContainer.style.setProperty('padding-left', '15px', 'important');
  mainContainer.style.setProperty('padding-right', '15px', 'important');

  // 4. Remove a expansão do fluig-style-guide (volta ao padrão)
  if (fluigStyleGuide) {
    fluigStyleGuide.style.removeProperty('max-width');
    fluigStyleGuide.style.removeProperty('width');
    console.log('[UI] ✅ fluig-style-guide restaurado');
  }

  // 5. Restaura a main-content também
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.removeProperty('max-width');
    mainContent.style.removeProperty('width');
  }

  console.log('[UI] ✅ Container retraído para 1000px!');
  console.log('[UI] 📊 Larguras:', {
    fluigStyleGuide: fluigStyleGuide ? getComputedStyle(fluigStyleGuide).width : 'N/A',
    mainContainer: getComputedStyle(mainContainer).width,
    mainContent: mainContent ? getComputedStyle(mainContent).width : 'N/A'
  });
}

// Expõe no escopo global
window.voltarInicio = voltarInicio;
window.retrairContainer = retrairContainer;

(function restrictMetaToNumbersOrPercent() {
    console.log("entrou na funcao restrictMetaToNumbersOrPercent");
  const metaInputs = document.querySelectorAll('#ssma-table tbody tr td:nth-child(2) input.ssma-input');

  metaInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      const controlKeys = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
      const isCtrlCmd = e.ctrlKey || e.metaKey;
      if (controlKeys.includes(e.key) || isCtrlCmd) return;

      const isDigit = /^\d$/.test(e.key);
      const isDecimalSep = /[.,]/.test(e.key);
      const isPercent = e.key === '%' && !input.value.includes('%');
      const isSign = e.key === '-' && !input.value.includes('-');
      if (!(isDigit || isDecimalSep || isPercent || isSign)) e.preventDefault();
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      // mantém dígitos, vírgula/ponto, sinal e %
      const clean = text.replace(/[^\d,.\-%]/g, '');
      input.value = clean;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    input.addEventListener('input', () => {
      let v = input.value.replace(/[^\d,.\-%]/g, '');
      input.value = v;
      const isNumber = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(v);
      const isPercent = /^-?\d+(,\d+)?%$|^-?\d{1,3}(\.\d{3})+(,\d+)?%$/.test(v);
      const isValid = isNumber || isPercent;
      input.classList.toggle('cell-error', !isValid && v !== '');

    });
  });
})();


/**############################################################################################################
 * Arquivo table_sorting.js
 * - Responsável por adicionar funcionalidade de ordenação em tabelas HTML
 * - Detecta automaticamente tipos de dados (texto/número)
 * - Mantém estado visual da ordenação (setas, highlights)
 * - Cicla entre ordenação crescente, decrescente e ordem original
 *
 * Reuso / Observações:
 * - Reutilizável em qualquer tabela HTML
 * - Não depende de bibliotecas externas
 * - Compatível com formatação de moeda brasileira (R$ X.XXX,XX)
 * - Para usar: setupTableSorting('id-do-tbody', 'id-do-thead')
############################################################################################################*/

/**
 * Função setupTableSorting()
 * 
 * OBJETIVO:
 * - Adiciona funcionalidade de ordenação (crescente/decrescente) aos cabeçalhos da tabela
 * - Permite ordenar por texto (Competência) ou por valores numéricos (Materiais, Impostos, etc.)
 * - Mantém estado visual indicando coluna e direção da ordenação atual
 * 
 * COMPORTAMENTO:
 * - Primeiro clique: ordena crescente (A-Z ou 0-9)
 * - Segundo clique: ordena decrescente (Z-A ou 9-0)
 * - Terceiro clique: volta à ordem original
 * 
 * @param {string} tbodyId - ID do tbody da tabela
 * @param {string} theadId - ID do thead (opcional, para adicionar classes)
 */
function setupTableSorting(tbodyId = 'imported-data-body', theadId = null) {
    
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error('Tbody não encontrado:', tbodyId);
        return;
    }

    const thead = theadId ? document.getElementById(theadId) : tbody.closest('table')?.querySelector('thead');
    if (!thead) {
        console.error('Thead não encontrado');
        return;
    }

    const headers = thead.querySelectorAll('th');
    let originalOrder = [];
    let sortState = { colIndex: null, direction: null };

    function saveOriginalOrder() {
        originalOrder = Array.from(tbody.querySelectorAll('tr'));
    }

    function getColumnType(colIndex) {
        const rows = tbody.querySelectorAll('tr');
        let numericCount = 0;
        const sampleSize = Math.min(3, rows.length);

        for (let i = 0; i < sampleSize; i++) {
            const cell = rows[i].cells[colIndex];
            if (!cell) continue;

            const text = cell.textContent.trim();
            const cleanText = text.replace(/R\$|\s/g, '').replace(/\./g, '').replace(',', '.');
            
            if (!isNaN(parseFloat(cleanText)) && isFinite(cleanText)) {
                numericCount++;
            }
        }

        return numericCount >= sampleSize / 2 ? 'number' : 'text';
    }

    function getCellValue(cell, type) {
        const text = cell.textContent.trim();

        if (type === 'number') {
            const cleanText = text
                .replace(/R\$|\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.');
            
            const num = parseFloat(cleanText);
            return isNaN(num) ? 0 : num;
        }

        return text.toLowerCase();
    }

    function sortTable(colIndex, direction) {
        if (direction === null) {
            originalOrder.forEach(row => tbody.appendChild(row));
            updateSortIndicators(null, null);
            return;
        }

        const columnType = getColumnType(colIndex);
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[colIndex];
            const cellB = rowB.cells[colIndex];

            if (!cellA || !cellB) return 0;

            const valueA = getCellValue(cellA, columnType);
            const valueB = getCellValue(cellB, columnType);

            let comparison = 0;
            
            if (columnType === 'number') {
                comparison = valueA - valueB;
            } else {
                comparison = valueA.localeCompare(valueB, 'pt-BR');
            }

            return direction === 'asc' ? comparison : -comparison;
        });

        rows.forEach(row => tbody.appendChild(row));
        updateSortIndicators(colIndex, direction);
    }

    function updateSortIndicators(activeColIndex, direction) {
        headers.forEach((header, index) => {
            header.classList.remove('sorted-asc', 'sorted-desc', 'sortable');
            
            const existingArrow = header.querySelector('.sort-arrow');
            if (existingArrow) existingArrow.remove();

            header.classList.add('sortable');

            if (index === activeColIndex && direction) {
                header.classList.add(`sorted-${direction}`);
                
                const arrow = document.createElement('span');
                arrow.className = 'sort-arrow';
                arrow.textContent = direction === 'asc' ? ' ↑' : ' ↓';
                header.appendChild(arrow);
            }
        });
    }

    function handleHeaderClick(event) {
        const header = event.currentTarget;
        const colIndex = Array.from(headers).indexOf(header);

        let nextDirection;
        
        if (sortState.colIndex === colIndex) {
            if (sortState.direction === 'asc') {
                nextDirection = 'desc';
            } else if (sortState.direction === 'desc') {
                nextDirection = null;
            } else {
                nextDirection = 'asc';
            }
        } else {
            nextDirection = 'asc';
        }

        sortState.colIndex = nextDirection ? colIndex : null;
        sortState.direction = nextDirection;

        sortTable(colIndex, nextDirection);
    }

    saveOriginalOrder();

    headers.forEach((header) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.title = 'Clique para ordenar';
        header.addEventListener('click', handleHeaderClick);
    });

    console.log('✅ Ordenação de tabela configurada com sucesso');
}

/**############################################################################################################
 * Adicione ao arquivo table_sorting.js (ou crie table_filters.js)
 * 
 * Funções para filtrar visualização da tabela:
 * - Mostrar apenas linhas com erros
 * - Mostrar apenas linhas sem erros
 * - Mostrar todas as linhas
 * - Contador de linhas visíveis/ocultas
############################################################################################################*/

/**
 * Função filterTableByErrors()
 * 
 * OBJETIVO:
 * - Filtra a visualização da tabela baseado na presença de erros
 * - Oculta/exibe linhas usando CSS (display: none)
 * - Mantém as linhas no DOM (não remove, apenas esconde)
 * - Atualiza contadores de linhas visíveis
 * 
 * MODOS DE FILTRO:
 * - 'errors-only': Mostra APENAS linhas com erro
 * - 'valid-only': Mostra APENAS linhas válidas (sem erro)
 * - 'all': Mostra TODAS as linhas (remove filtro)
 * 
 * COMPORTAMENTO:
 * - Identifica erros pela classe CSS 'cell-error' nas células
 * - Preserva a ordenação atual da tabela
 * - Atualiza totalizadores se necessário
 * - Fornece feedback visual sobre quantidade filtrada
 * 
 * @param {string} tbodyId - ID do tbody da tabela
 * @param {string} filterMode - 'errors-only' | 'valid-only' | 'all'
 * @param {string} feedbackElementId - ID do elemento para mostrar estatísticas (opcional)
 * @returns {Object} - Estatísticas do filtro { total, visible, hidden, withErrors, valid }
 */
function filterTableByErrors(tbodyId = 'imported-data-body', filterMode = 'all', feedbackElementId = null) {
    
    // ========================================================================
    // ETAPA 1: VALIDAÇÃO E REFERÊNCIAS
    // ========================================================================
    
    const tbody = document.getElementById(tbodyId);
    if (!tbody) {
        console.error('Tbody não encontrado:', tbodyId);
        return null;
    }

    const rows = tbody.querySelectorAll('tr');
    
    // Estatísticas que serão retornadas
    const stats = {
        total: rows.length,
        visible: 0,
        hidden: 0,
        withErrors: 0,
        valid: 0
    };

    // ========================================================================
    // ETAPA 2: FUNÇÃO AUXILIAR - VERIFICA SE LINHA TEM ERRO
    // ========================================================================
    
    /**
     * Verifica se uma linha (tr) contém alguma célula com erro
     * @param {HTMLTableRowElement} row - Linha da tabela
     * @returns {boolean} - true se houver erro, false caso contrário
     */
    function rowHasError(row) {
        // Procura por células com classe 'cell-error'
        return row.querySelector('td.cell-error') !== null;
    }

    // ========================================================================
    // ETAPA 3: APLICAÇÃO DO FILTRO
    // ========================================================================
    
    rows.forEach(row => {
        const hasError = rowHasError(row);
        let shouldShow = true;

        // Conta estatísticas
        if (hasError) {
            stats.withErrors++;
        } else {
            stats.valid++;
        }

        // Determina se deve mostrar a linha baseado no modo
        switch (filterMode) {
            case 'errors-only':
                // Mostra APENAS linhas com erro
                shouldShow = hasError;
                break;
                
            case 'valid-only':
                // Mostra APENAS linhas válidas (sem erro)
                shouldShow = !hasError;
                break;
                
            case 'all':
            default:
                // Mostra TODAS as linhas
                shouldShow = true;
                break;
        }

        // Aplica visibilidade
        if (shouldShow) {
            row.style.display = '';  // Mostra (valor padrão)
            stats.visible++;
        } else {
            row.style.display = 'none';  // Oculta
            stats.hidden++;
        }
    });

    // ========================================================================
    // ETAPA 4: FEEDBACK VISUAL (OPCIONAL)
    // ========================================================================
    
    if (feedbackElementId) {
        const feedbackElement = document.getElementById(feedbackElementId);
        if (feedbackElement) {
            let message = '';
            
            switch (filterMode) {
                case 'errors-only':
                    message = `
                        <div class="alert alert-warning">
                            <strong>🔍 Filtro Ativo:</strong> Exibindo apenas linhas com erro.
                            <br>
                            <small>
                                ${stats.visible} linha(s) com erro | 
                                ${stats.hidden} linha(s) válida(s) oculta(s)
                            </small>
                        </div>
                    `;
                    break;
                    
                case 'valid-only':
                    message = `
                        <div class="alert alert-info">
                            <strong>🔍 Filtro Ativo:</strong> Exibindo apenas linhas válidas.
                            <br>
                            <small>
                                ${stats.visible} linha(s) válida(s) | 
                                ${stats.hidden} linha(s) com erro oculta(s)
                            </small>
                        </div>
                    `;
                    break;
                    
                case 'all':
                    message = `
                        <div class="alert alert-success">
                            <strong>✅ Filtro Removido:</strong> Exibindo todas as linhas.
                            <br>
                            <small>
                                ${stats.total} linha(s) no total | 
                                ${stats.withErrors} com erro | 
                                ${stats.valid} válida(s)
                            </small>
                        </div>
                    `;
                    break;
            }
            
            feedbackElement.innerHTML = message;
        }
    }

    // ========================================================================
    // ETAPA 5: LOG E RETORNO
    // ========================================================================
    
    console.log('📊 Estatísticas do Filtro:', stats);
    return stats;
}


/**
 * Função setupFilterButtons()
 * 
 * OBJETIVO:
 * - Configura botões de filtro rápido para a tabela
 * - Adiciona event listeners para alternar entre modos
 * - Atualiza estado visual dos botões (ativo/inativo)
 * 
 * @param {string} tbodyId - ID do tbody da tabela
 * @param {Object} buttonIds - Objeto com IDs dos botões { showAll, showErrors, showValid }
 * @param {string} feedbackElementId - ID do elemento de feedback (opcional)
 */
function setupFilterButtons(tbodyId, buttonIds, feedbackElementId = null) {
    
    const buttons = {
        showAll: document.getElementById(buttonIds.showAll),
        showErrors: document.getElementById(buttonIds.showErrors),
        showValid: document.getElementById(buttonIds.showValid)
    };

    // Verifica se todos os botões existem
    const allButtonsExist = Object.values(buttons).every(btn => btn !== null);
    if (!allButtonsExist) {
        console.error('Nem todos os botões de filtro foram encontrados:', buttonIds);
        return;
    }

    /**
     * Atualiza estado visual dos botões (ativo/inativo)
     */
    function updateButtonStates(activeButton) {
        Object.values(buttons).forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-primary');
        });

        if (activeButton) {
            activeButton.classList.remove('btn-outline-primary');
            activeButton.classList.add('active', 'btn-primary');
        }
    }

    // Event Listeners
    buttons.showAll.addEventListener('click', function() {
        filterTableByErrors(tbodyId, 'all', feedbackElementId);
        updateButtonStates(this);
    });

    buttons.showErrors.addEventListener('click', function() {
        filterTableByErrors(tbodyId, 'errors-only', feedbackElementId);
        updateButtonStates(this);
    });

    buttons.showValid.addEventListener('click', function() {
        filterTableByErrors(tbodyId, 'valid-only', feedbackElementId);
        updateButtonStates(this);
    });

    // Define botão "Todas" como ativo inicialmente
    updateButtonStates(buttons.showAll);

    console.log('✅ Botões de filtro configurados com sucesso');
}


/**
 * Função atualizarBadgesDeErro()
 * - Percorre o objeto global validationErrors.
 * - Conta quantos erros existem por coluna.
 * - Atualiza o número no badge e altera o display para visível.
 */
function atualizarBadgesDeErro() {
    // 1. Resetar visualmente todos os badges para 0 e ocultá-los
    const badges = document.querySelectorAll('.error-counter-badge');
    badges.forEach(badge => {
        badge.style.display = 'none';
        const counter = badge.querySelector('.error-count');
        if (counter) counter.innerText = '0';
    });

    // 2. Agrupar erros por coluna
    // O objeto validationErrors tem formato: { "linha_0_Materiais": {linha: 0, coluna: "Materiais", mensagem: "..."} }
    const errosPorColuna = {};

    Object.values(validationErrors).forEach(erro => {
        const nomeColuna = erro.coluna; // Ex: "Materiais"
        
        if (!errosPorColuna[nomeColuna]) {
            errosPorColuna[nomeColuna] = 0;
        }
        errosPorColuna[nomeColuna]++;
    });

    // 3. Atualizar o DOM com os contadores
    Object.keys(errosPorColuna).forEach(coluna => {
        // Busca o badge correspondente pelo atributo data-column-name
        // Aspas duplas no seletor para lidar com espaços ou caracteres especiais se houver
        const badge = document.querySelector(`.error-counter-badge[data-column-name="${coluna}"]`);
        
        if (badge) {
            const qtdErros = errosPorColuna[coluna];
            const spanCount = badge.querySelector('.error-count');
            
            if (spanCount) {
                spanCount.innerText = qtdErros;
            }
            
            // Mostra o badge (pode usar 'inline-block', 'flex', etc, conforme seu CSS)
            badge.style.display = 'inline-block'; 
        }
    });
}

function buscarCompetenciaAtual(){
    var data = new Date();
    var mesAtual = data.getMonth(); // 0-11 (janeiro = 0, dezembro = 11)
    var ano = data.getFullYear();
    
    // Subtrair 1 mês
    var mes = mesAtual - 1;
    
    // Se o mês for -1 (estava em janeiro), ajusta para dezembro do ano anterior
    if(mes < 0){
        mes = 11; // dezembro
        ano = ano - 1;
    }
    
    // Formatar como MM/AAAA (mês começa em 0, então adiciona 1)
    var competencia = (mes + 1 < 10 ? '0' + (mes + 1) : (mes + 1)) + '/' + ano;
    $("#competenciaValue").text("Competência: "+competencia);
     document.getElementById('COMPETENCIAREFERENCIA').value = competencia;
    console.log(competencia);
    //document.getElementById('COMPETENCIAREFERENCIA').value = competencia;
    return competencia;
}
/**
 * Delegação de eventos para validar inputs das colunas Meta (2ª) e Resultado (3ª)
 * por tipo de linha, baseado no texto da 1ª célula (td.ssma-label).
 * Linhas IFS/IPS/IPL aceitam número ou porcentagem. Demais: apenas número.
 */
function setupDelegationForSSMA() {
  const table = document.querySelector('#ssma-table');
  if (!table) {
    console.warn('[SSMA] #ssma-table não encontrado ao configurar delegação.');
    return;
  }

  if (table.dataset.eventsBound === 'true') return; // evita duplicidade
  table.dataset.eventsBound = 'true';

  // Conjunto de labels que aceitam porcentagem
  const percentRowLabels = new Set(['IFS', 'IPS', 'IPL']);

  // Retorna 'percent' ou 'number' de acordo com o label da linha
  function getRuleForRow(row) {
    const labelCell = row.querySelector('td.ssma-label');
    const label = (labelCell?.textContent || '').trim();
    return percentRowLabels.has(label) ? 'percent' : 'number';
  }

  // Verifica se o alvo é input nas colunas 2 (Meta) ou 3 (Resultado)
  function isSSMAInput(target) {
    return target.matches('tbody tr td:nth-child(2) input.ssma-input') ||
           target.matches('tbody tr td:nth-child(3) input.ssma-input');
  }

  // Utilitários de validação (AJUSTE: aceita milhar pt-BR)
  const reNumber   = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/; // aceita 1000 e 1.000,00 (pt-BR)
  const rePercent  = /^-?\d+(,\d+)?%$|^-?\d{1,3}(\.\d{3})+(,\d+)?%$/; // aceita 1000% e 1.000,00% (pt-BR)

  function validateByRule(value, rule) {
    const v = value.trim();
    if (v === '') return true; // vazio = não marca erro (ajuste se quiser obrigatoriedade)
    if (rule === 'percent') return reNumber.test(v) || rePercent.test(v);
    return reNumber.test(v); // rule === 'number'
  }

  // Remoção/sanitização por regra
  function sanitize(value, rule) {
    if (rule === 'percent') {
      // mantém dígitos, vírgula, ponto, sinal e %
      return value.replace(/[^\d,.\-%]/g, '');
    }
    // apenas número (mantém dígitos, vírgula, ponto e sinal)
    return value.replace(/[^\d,.\-]/g, '');
  }

  // ===== Eventos =====
  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isSSMAInput(input)) return;
    input.classList.remove('cell-error');
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!isSSMAInput(input)) return;

    const row = input.closest('tr');
    const rule = getRuleForRow(row);

    const control = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');
    const isPercent    = e.key === '%' && rule === 'percent' && !input.value.includes('%');

    // No modo 'number', não permite '%'
    const allowed = isDigit || isDecimalSep || isSign || isPercent;
    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    if (!isSSMAInput(input)) return;
    e.preventDefault();

    const row = input.closest('tr');
    const rule = getRuleForRow(row);

    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    input.value = sanitize(text, rule);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    if (!isSSMAInput(input)) return;

    const row = input.closest('tr');
    const rule = getRuleForRow(row);

    input.value = sanitize(input.value, rule);
    const ok = validateByRule(input.value, rule);
    input.classList.toggle('cell-error', !ok && input.value.trim() !== '');
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!isSSMAInput(input)) return;

    const row = input.closest('tr');
    const rule = getRuleForRow(row);

    const ok = validateByRule(input.value, rule);
    input.classList.toggle('cell-error', !ok && input.value.trim() !== '');

    // Normaliza para número JS e guarda em data-* para cálculos
    const value = input.value.trim();
    const numeric = value
      .replace(/\./g, '')     // remove milhar
      .replace(',', '.')      // vírgula -> ponto
      .replace('%','');       // tira % para converter
    const asNumber = parseFloat(numeric);
    input.dataset.value = isNaN(asNumber) ? '' : String(asNumber);
    input.dataset.isPercent = (rule === 'percent' && /%$/.test(value)) ? 'true' : 'false';
  });

  console.log('[SSMA] Delegação de eventos por linha (percent/number) ativada.');
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  setupDelegationForSSMA();
});


/**
 * Validação ao interagir com TODAS as colunas da tabela #histograma-table.
 * Apenas números (inteiros/decimais). Sem porcentagem.
 * Usa delegação de eventos no <table> (funciona com linhas recriadas).
 */
function setupDelegationForHistograma() {
  const table = document.querySelector('#hist-table');
  if (!table) {
    console.warn('[HISTOGRAMA] #histograma-table não encontrado ao configurar delegação.');
    return;
  }

  // evita registrar listeners mais de uma vez
  if (table.dataset.eventsBound === 'true') return;
  table.dataset.eventsBound = 'true';

  // É input dentro do tbody em QUALQUER coluna?
  function isHistoInput(target) {
    // ajuste a classe se necessário (ex.: .histo-input)
    return target.matches('tbody tr td input.hist-input');
  }

  
// ===== HISTOGRAMA: cálculo automático da linha "Desvio" =====
function computeHistogramDesvio() {
  const table = document.querySelector('#hist-table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Localizar linhas pelo rótulo da 1ª coluna
  const findRowByHead = (label) =>
    rows.find(r => (r.cells[0]?.textContent || '').trim().toLowerCase() === label.toLowerCase());

  const previstoRow = findRowByHead('Previsto');
  const realRow     = findRowByHead('Real');
  const desvioRow   = findRowByHead('Desvio');

  if (!previstoRow || !realRow || !desvioRow) return;

  // Percorrer colunas 1..N e calcular (Previsto - Real)
  for (let c = 1; c < desvioRow.cells.length; c++) {
    const prevCell  = previstoRow.cells[c];
    const realCell  = realRow.cells[c];
    const desvCell  = desvioRow.cells[c];

    // Garante <input class="hist-input"> na célula de Desvio
    let desvioInput = desvCell.querySelector('input.hist-input');
    if (!desvioInput) {
      desvioInput = document.createElement('input');
      desvioInput.className = 'hist-input';
      desvCell.textContent = '';
      desvCell.appendChild(desvioInput);
    }

    const prevVal = prevCell.querySelector('input.hist-input')?.value ??
                    (prevCell.textContent || '').trim();
    const realVal = realCell.querySelector('input.hist-input')?.value ??
                    (realCell.textContent || '').trim();

    const prevNum = parseNumberBR(prevVal) ?? 0;
    const realNum = parseNumberBR(realVal) ?? 0;
    const diff    = prevNum - realNum;

    desvioInput.value    = formatNumberBR(diff, 4);
    desvioInput.readOnly = true;               // não editável
    desvioInput.classList.remove('cell-error');
  }
}

// Amarre o cálculo no ciclo de eventos já delegado do Histograma
document.addEventListener('DOMContentLoaded', () => {
  // após a delegação original:
  computeHistogramDesvio();
});
(function hookHistogramRecalc() {
  const table = document.querySelector('#hist-table');
  if (!table) return;
  table.addEventListener('input',  computeHistogramDesvio);
  table.addEventListener('paste',  () => setTimeout(computeHistogramDesvio, 0));
  table.addEventListener('focusout', computeHistogramDesvio);
})();


  // regex para número (AJUSTE: aceita milhar pt-BR)
  const reNumber = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/; // aceita 1000 e 1.000,00 (pt-BR)

  // Sanitiza mantendo apenas dígitos, vírgula, ponto e sinal
  function sanitizeNumber(value) {
    return value.replace(/[^\d,.\-]/g, '');
  }

  // ===== Eventos =====
  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isHistoInput(input)) return;
    input.classList.remove('cell-error');
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!isHistoInput(input)) return;

    const control = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');

    // Sem %, apenas números
    const allowed = isDigit || isDecimalSep || isSign;
    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    if (!isHistoInput(input)) return;

    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    input.value = sanitizeNumber(text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    if (!isHistoInput(input)) return;

    input.value = sanitizeNumber(input.value);
    const value = input.value.trim();
    const ok = value === '' || reNumber.test(value);
    input.classList.toggle('cell-error', !ok && value !== '');
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!isHistoInput(input)) return;

    const value = input.value.trim();
    const ok = value === '' || reNumber.test(value);
    input.classList.toggle('cell-error', !ok && value !== '');

    // Normaliza para número JS e guarda em data-* para cálculos
    const numeric = value
      .replace(/\./g, '')   // remove milhar
      .replace(',', '.');   // vírgula -> ponto
    const asNumber = parseFloat(numeric);
    input.dataset.value = isNaN(asNumber) ? '' : String(asNumber);
  });

  console.log('[HISTOGRAMA] Delegação de eventos (apenas número) ativada.');
}

/* Inicialização:
   - Ao carregar o DOM
   - (Opcional) após seu iniciar() quando revelar os blocos */
document.addEventListener('DOMContentLoaded', () => {
  setupDelegationForHistograma();
});


/**
 * Validação ao interagir com TODAS as células de valor da tabela #hh-table.
 * Aceita apenas números (inteiros/decimais). Sem porcentagem.
 * Usa delegação de eventos no <table> para funcionar mesmo se você recriar linhas.
 */
function setupDelegationForHH() {
  const table = document.querySelector('#hh-table');
  if (!table) {
    console.warn('[HH] #hh-table não encontrado ao configurar delegação.');
    return;
  }

  // Evita registrar listeners mais de uma vez
  if (table.dataset.eventsBound === 'true') return;
  table.dataset.eventsBound = 'true';

  // É input dentro do tbody, em células de valor?
  function isHHInput(target) {
    // Se quiser ser mais estrito: 'tbody tr td.hh-value input.excel-input'
    return target.matches('tbody tr td.hh-value input.excel-input');
  }

  // Regex para número (AJUSTE: aceita milhar pt-BR)
  const reNumber = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/; // aceita 1000 e 1.000,00 (pt-BR)

  // Sanitiza mantendo apenas dígitos, vírgula, ponto e sinal
  function sanitizeNumber(value) {
    return value.replace(/[^\d,.\-]/g, '');
  }

  // ===== Eventos =====
  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isHHInput(input)) return;
    input.classList.remove('cell-error');
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!isHHInput(input)) return;

    const control   = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');

    // Sem %, apenas números
    const allowed = isDigit || isDecimalSep || isSign;
    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    if (!isHHInput(input)) return;

    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    input.value = sanitizeNumber(text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    if (!isHHInput(input)) return;

    input.value = sanitizeNumber(input.value);
    const value = input.value.trim();
    const ok = value === '' || reNumber.test(value);
    input.classList.toggle('cell-error', !ok && value !== '');
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!isHHInput(input)) return;

    const value = input.value.trim();
    const ok = value === '' || reNumber.test(value);
    input.classList.toggle('cell-error', !ok && value !== '');

    // Normaliza para número JS e guarda em data-* para cálculos
    const numeric  = value.replace(/\./g, '').replace(',', '.'); // vírgula -> ponto
    const asNumber = parseFloat(numeric);
    input.dataset.value = isNaN(asNumber) ? '' : String(asNumber);
  });

  console.log('[HH] Delegação de eventos (apenas número) ativada.');
}

/**
 * Validação ao interagir com a tabela #fisico-table (Acompanhamento Físico).
 * Regras:
 *  - Colunas "Início" (2ª) e "Término" (3ª): seleção de datas (date picker).
 *  - Coluna "% Av. Físico" (4ª): número ou porcentagem.
 *  - Linha "Desvio" (qualquer coluna): apenas número (sem %).
 */
function setupDelegationForFisico() {
  const table = document.querySelector('#fisico-table');
  if (!table) {
    console.warn('[FISICO] #fisico-table não encontrado ao configurar delegação.');
    return;
  }


  // Evita registrar múltiplas vezes
  if (table.dataset.eventsBound === 'true') return;
  table.dataset.eventsBound = 'true';

  // Helpers de identificação
  function getRowLabel(tr) {
    const cell = tr.querySelector('td.fisico-rowhead');
    return (cell?.textContent || '').trim();
  }

  function getRuleForCell(tr, td) {
    const label = getRowLabel(tr);
    const isDesvio = label === 'Desvio';
    const colIndex = td.cellIndex; // 0 = label; 1 = Início; 2 = Término; 3 = % Av. Físico

    if (isDesvio) return 'number';           // linha Desvio: sempre número
    if (colIndex === 1 || colIndex === 2) return 'date';          // Início/Término: datas
    if (colIndex === 3) return 'percent';     // % Av. Físico: número ou %
    return 'none';
  }

  // --- Utilitários de número/porcentagem (AJUSTE: aceita milhar pt-BR) ---
  const reNumber   = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/; // aceita 1000 e 1.000,00 (pt-BR)
  const rePercent  = /^-?\d+(,\d+)?%$|^-?\d{1,3}(\.\d{3})+(,\d+)?%$/; // aceita 1000% e 1.000,00% (pt-BR)

  function sanitizeNumber(value) {
    return value.replace(/[^\d,.\-]/g, '');
  }
  function sanitizeNumberOrPercent(value) {
    // mantém dígitos, vírgula, ponto, sinal e %; limita % ao final (uma vez)
    let v = value.replace(/[^\d,.\-%]/g, '');
    v = v.replace(/%+/g, '%');        // colagens com múltiplos %
    if (v.includes('%')) {
      v = v.replace(/%/g, '') + '%';  // garante % apenas no final
    }
    return v;
  }
  function isValidByRule(value, rule) {
    const v = value.trim();
    if (v === '') return true;
    if (rule === 'number')  return reNumber.test(v);
    if (rule === 'percent') return reNumber.test(v) || rePercent.test(v);
    return true;
  }

  // --- Utilitários de data (BR <-> ISO) ---
  const reDateBR = /^\d{2}\/\d{2}\/\d{4}$/;

  function parseDateBRToISO(br) {
    if (!reDateBR.test(br)) return '';
    const [dd, mm, yyyy] = br.split('/');
    const d = Number(dd), m = Number(mm), y = Number(yyyy);
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1000) return '';
    const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    const test = new Date(iso);
    if (isNaN(test.getTime())) return '';
    return iso;
  }
  function formatISOToBR(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
    const [yyyy, mm, dd] = iso.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  // ===== EVENTOS =====
  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const td = input.closest('td'); const tr = input.closest('tr');
    if (!td || !tr) return;

    const rule = getRuleForCell(tr, td);
    input.classList.remove('cell-error');

    if (rule === 'date') {
      const iso = parseDateBRToISO((input.value || '').trim());
      input.type = 'date';
      input.value = iso || '';
    }
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const td = input.closest('td'); const tr = input.closest('tr');
    if (!td || !tr) return;

    const rule = getRuleForCell(tr, td);
    const control   = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    if (rule === 'date' && input.type === 'date') return;

    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');
    const isPercent    = e.key === '%' && rule === 'percent' && !input.value.includes('%');

    let allowed = false;
    if (rule === 'number')  allowed = isDigit || isDecimalSep || isSign;
    if (rule === 'percent') allowed = isDigit || isDecimalSep || isSign || isPercent;

    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const td = input.closest('td'); const tr = input.closest('tr');
    if (!td || !tr) return;

    const rule = getRuleForCell(tr, td);
    e.preventDefault();

    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    if (rule === 'date') {
      const trimmed = text.trim();
      let iso = '';
      if (reDateBR.test(trimmed)) {
        iso = parseDateBRToISO(trimmed);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        iso = trimmed;
      }
      input.type = 'date';
      input.value = iso || '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (rule === 'number') {
      input.value = sanitizeNumber(text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (rule === 'percent') {
      input.value = sanitizeNumberOrPercent(text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const td = input.closest('td'); const tr = input.closest('tr');
    if (!td || !tr) return;

    const rule = getRuleForCell(tr, td);

    if (rule === 'date') {
      input.classList.remove('cell-error');
    } else {
      if (rule === 'number') {
        input.value = sanitizeNumber(input.value);
      } else if (rule === 'percent') {
        input.value = sanitizeNumberOrPercent(input.value);
      }
      const ok = isValidByRule(input.value, rule);
      input.classList.toggle('cell-error', !ok && input.value.trim() !== '');
    }
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    const td = input.closest('td'); const tr = input.closest('tr');
    if (!td || !tr) return;

    const rule = getRuleForCell(tr, td);

    if (rule === 'date') {
      const iso = input.value;
      const br  = formatISOToBR(iso);
      input.type = 'text';
      input.value = br || '';
      input.dataset.dateISO = iso || '';
      const ok = !input.value || reDateBR.test(input.value);
      input.classList.toggle('cell-error', !ok && input.value !== '');
    } else {
      const ok = isValidByRule(input.value, rule);
      input.classList.toggle('cell-error', !ok && input.value.trim() !== '');
      const value = input.value.trim();
      const numeric = value
        .replace(/\./g, '')
        .replace(',', '.')
        .replace('%','');
      const asNumber = parseFloat(numeric);
      input.dataset.value = isNaN(asNumber) ? '' : String(asNumber);
      input.dataset.isPercent = (rule === 'percent' && /%$/.test(value)) ? 'true' : 'false';
    }
  });

  console.log('[FISICO] Delegação de eventos (datas/percent/número por coluna & linha) ativada.');

  
// ===== FÍSICO: cálculo automático da linha "Desvio" =====
function computeFisicoDesvio() {
  const table = document.querySelector('#fisico-table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const findRowByHead = (label) =>
    rows.find(r => (r.querySelector('td.fisico-rowhead')?.textContent || '').trim().toLowerCase() === label.toLowerCase());

  const previstoRow = findRowByHead('Previsto LB');
  const realizadoRow = findRowByHead('Realizado');
  const desvioRow    = findRowByHead('Desvio');

  if (!previstoRow || !realizadoRow || !desvioRow) return;

  // Mapeamento: 0=rótulo | 1=Início (date) | 2=Término (date) | 3=% Av. Físico (percent)
  for (let c = 1; c < desvioRow.cells.length; c++) {
    const prevCell = previstoRow.cells[c];
    const realCell = realizadoRow.cells[c];
    const desvCell = desvioRow.cells[c];

    // Garante input na célula de Desvio
    let desvioInput = desvCell.querySelector('input.excel-input');
    if (!desvioInput) {
      desvioInput = document.createElement('input');
      desvioInput.className = 'excel-input';
      desvCell.textContent = '';
      desvCell.appendChild(desvioInput);
    }

    const prevVal = prevCell.querySelector('input.excel-input')?.value ??
                    (prevCell.textContent || '').trim();
    const realVal = realCell.querySelector('input.excel-input')?.value ??
                    (realCell.textContent || '').trim();

    let resultText = '';
    if (c === 1 || c === 2) {
      // Datas: diferença de dias (Previsto LB - Realizado)
      const isoPrev = parseDateBRToISO(prevVal);
      const isoReal = parseDateBRToISO(realVal);
      const days = diffDaysISO(isoPrev, isoReal);
      resultText = (days === null) ? '' : String(days);
    } else if (c === 3) {
      // Percentual: subtração em %
      const prevPct = parsePercentBR(prevVal) ?? 0;
      const realPct = parsePercentBR(realVal) ?? 0;
      const diffPct = prevPct - realPct;
      resultText = formatPercentBR(diffPct, 4);
    } else {
      // (Se houver outras colunas numéricas, também subtrair)
      const prevNum = parseNumberBR(prevVal) ?? 0;
      const realNum = parseNumberBR(realVal) ?? 0;
      resultText = formatNumberBR(prevNum - realNum, 4);
    }

    desvioInput.value    = resultText;
    desvioInput.readOnly = true;           // não editável
    desvioInput.classList.remove('cell-error');
  }
}

// Amarre cálculo aos eventos já delegados do Físico
document.addEventListener('DOMContentLoaded', () => {
  computeFisicoDesvio();
});
(function hookFisicoRecalc() {
  const table = document.querySelector('#fisico-table');
  if (!table) return;
  table.addEventListener('input',  computeFisicoDesvio);
  table.addEventListener('paste',  () => setTimeout(computeFisicoDesvio, 0));
  table.addEventListener('focusout', computeFisicoDesvio);
})();

}


/**
 * Validação e UX para a tabela #curve-table (Curva de Avanço Físico).
 * Regras:
 *  - Coluna 0 (Período): seletor com opções Sem-01..Sem-52.
 *  - Coluna 8 (Semana): preenchida automaticamente com "Semana NN" e readOnly.
 *  - Coluna 7 (Ano): somente ano (YYYY) como número.
 *  - Colunas 1..6 (Acumulado/Semanal): números ou porcentagens.
 */
/*function setupDelegationForCurve() {
  const table = document.querySelector('#curve-table');
  if (!table) {
    console.warn('[CURVA] #curve-table não encontrado ao configurar delegação.');
    return;
  }
  if (table.dataset.eventsBound === 'true') return;
  table.dataset.eventsBound = 'true';

  // ===== Inicializa "Período" como <select> e liga "Semana" automática =====
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const periodCell = row.cells[0];
    const weekInput  = row.cells[8]?.querySelector('input.curve-input');
    if (!periodCell) return;

    const select = document.createElement('select');
    select.className = 'curve-period';
    for (let w = 1; w <= 52; w++) {
      const opt = document.createElement('option');
      const label = `Sem-${String(w).padStart(2, '0')}`;
      opt.value = label;
      opt.textContent = label;
      const current = (periodCell.textContent || '').trim();
      if (current.replace(/\s/g, '').toLowerCase() === label.toLowerCase()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }

    periodCell.textContent = '';
    periodCell.appendChild(select);

    if (weekInput) {
      weekInput.readOnly = true;
      const weekNum = select.value.split('-')[1];
      weekInput.value = `Semana ${weekNum}`;
    }
    select.addEventListener('change', () => {
      const weekNum = select.value.split('-')[1];
      if (weekInput) weekInput.value = `Semana ${weekNum}`;
    });
  });

  function isCurveInput(target) {
    return target.matches('tbody tr td input.curve-input');
  }

  // AJUSTE: aceita milhar pt-BR
  const reNumber   = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/; // aceita 1000 e 1.000,00 (pt-BR)
  const rePercent  = /^-?\d+(,\d+)?%$|^-?\d{1,3}(\.\d{3})+(,\d+)?%$/; // aceita 1000% e 1.000,00% (pt-BR)
  const reYear     = /^\d{4}$/;

  function sanitizeNumber(value) {
    return value.replace(/[^\d,.\-]/g, '');
  }
  function sanitizeNumberOrPercent(value) {
    let v = value.replace(/[^\d,.\-%]/g, '');
    v = v.replace(/%+/g, '%');
    if (v.includes('%')) {
      v = v.replace(/%/g, '') + '%';
    }
    return v;
  }

  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isCurveInput(input)) return;
    input.classList.remove('cell-error');

    const colIndex = input.closest('td')?.cellIndex ?? -1;
    if (colIndex === 7) {
      input.type = 'number';
      input.min = '1900';
      input.max = '2100';
      input.step = '1';
    }
    if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    if (!isCurveInput(input)) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;

    const control   = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');
    const isPercent    = e.key === '%' && colIndex >= 1 && colIndex <= 6 && !input.value.includes('%');

    let allowed = false;
    if (colIndex >= 1 && colIndex <= 6) {
      allowed = isDigit || isDecimalSep || isSign || isPercent;
    } else if (colIndex === 7) {
      allowed = isDigit;
    } else if (colIndex === 8) {
      allowed = false;
    }

    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    if (!isCurveInput(input)) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;

    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';

    if (colIndex >= 1 && colIndex <= 6) {
      input.value = sanitizeNumberOrPercent(text);
    } else if (colIndex === 7) {
      input.value = text.replace(/[^\d]/g, '');
    } else if (colIndex === 8) {
      return;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    if (!isCurveInput(input)) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;
    const value = input.value.trim();

    if (colIndex >= 1 && colIndex <= 6) {
      input.value = sanitizeNumberOrPercent(input.value);
      const ok = reNumber.test(value) || rePercent.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
    } else if (colIndex === 7) {
      input.value = sanitizeNumber(input.value);
      const ok = reYear.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
    } else if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!isCurveInput(input)) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;
    const value = input.value.trim();

    if (colIndex >= 1 && colIndex <= 6) {
      const numeric   = value.replace(/\./g, '').replace(',', '.').replace('%', '');
      const asNumber  = parseFloat(numeric);
      input.dataset.value     = isNaN(asNumber) ? '' : String(asNumber);
      input.dataset.isPercent = /%$/.test(value) ? 'true' : 'false';

      const ok = reNumber.test(value) || rePercent.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
    } else if (colIndex === 7) {
      input.type = 'text';
      const ok = reYear.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
      input.dataset.year = ok && value ? value : '';
    } else if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  console.log('[CURVA] Delegação de eventos (Período select, Semana auto, Ano numérico, percent/número) ativada.');
}
*/

  function formatSSMA() {
    const table = document.getElementById('ssma-table');
    if (!table) return;

    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
      th.classList.add('ssma-head');
      th.style.textAlign = 'center';
    });

    const inputs = table.querySelectorAll('input.ssma-input');

    const isNumericOrPercent = (raw) => {
      if (!raw) return false;
      const v = raw.trim();

      if (v.endsWith('%')) {
        const numPart = v.slice(0, -1).trim()
          .replace(/\./g, '')
          .replace(',', '.');
        return /^-?\d+(\.\d+)?$/.test(numPart);
      }

      const normalized = v.replace(/\./g, '').replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(normalized);
    };

    const classify = (inp) => {
      const val = (inp.value ?? '').trim();
      inp.classList.remove('numeric-right', 'text-center', 'error-text');

      if (/^#VALOR!?$/i.test(val)) {
        inp.classList.add('error-text');
      } else if (isNumericOrPercent(val)) {
        inp.classList.add('numeric-right');
      } else {
        inp.classList.add('text-center');
      }
    };

    inputs.forEach(inp => {
      classify(inp);
      ['input', 'change'].forEach(ev => inp.addEventListener(ev, () => classify(inp)));
    });
  }

  document.addEventListener('DOMContentLoaded', formatSSMA);



  function formatFisico() {
    const table = document.getElementById('fisico-table');
    if (!table) return;

    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
      th.classList.add('fisico-head');
      th.style.textAlign = 'center';
    });

    const inputs = table.querySelectorAll('input.excel-input');

    const isNumericOrPercentOrDate = (raw) => {
      if (!raw) return false;
      const v = raw.trim();

      if (/^#VALOR!?$/i.test(v)) return false;

      const brDate = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
      if (brDate.test(v)) return true;

      if (v.endsWith('%')) {
        const numPart = v.slice(0, -1).trim()
          .replace(/\./g, '')
          .replace(',', '.');
        return /^-?\d+(\.\d+)?$/.test(numPart);
      }

      const normalized = v.replace(/\./g, '').replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(normalized);
    };

    const classify = (inp) => {
      const val = (inp.value ?? '').trim();
      inp.classList.remove('numeric-right', 'text-center', 'error-text');

      if (/^#VALOR!?$/i.test(val)) {
        inp.classList.add('error-text');
      } else if (isNumericOrPercentOrDate(val)) {
        inp.classList.add('numeric-right');
      } else {
        inp.classList.add('text-center');
      }
    };

    inputs.forEach(inp => {
      classify(inp);
      ['input', 'change'].forEach(ev => inp.addEventListener(ev, () => classify(inp)));
    });

    const labelTds = table.querySelectorAll('tbody td.fisico-rowhead');
    labelTds.forEach(td => td.style.textAlign = 'center');
  }

  document.addEventListener('DOMContentLoaded', formatFisico);




  function formatHistograma() {
    const table = document.getElementById('hist-table');
    if (!table) return;

    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
      th.classList.add('hist-head');
      th.style.textAlign = 'center';
    });

    const inputs = table.querySelectorAll('input.hist-input');

    const isNumeric = (raw) => {
      if (!raw) return false;
      const v = raw.trim();
      if (/^#VALOR!?$/i.test(v)) return false;

      const normalized = v.replace(/\./g, '').replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(normalized);
    };

    const classify = (inp) => {
      const val = (inp.value ?? '').trim();
      inp.classList.remove('numeric-right', 'text-center', 'error-text');

      if (/^#VALOR!?$/i.test(val)) {
        inp.classList.add('error-text');
      } else if (isNumeric(val)) {
        inp.classList.add('numeric-right');
      } else {
        inp.classList.add('text-center');
      }
    };

    inputs.forEach(inp => {
      classify(inp);
      ['input', 'change'].forEach(ev => inp.addEventListener(ev, () => classify(inp)));
    });

    const labelTds = table.querySelectorAll('tbody td.hist-rowhead');
    labelTds.forEach(td => td.style.textAlign = 'center');
  }

  document.addEventListener('DOMContentLoaded', formatHistograma);


  function formatHH() {
    const table = document.getElementById('hh-table');
    if (!table) return;

    const labelTds = table.querySelectorAll('tbody td.hh-label');
    labelTds.forEach(td => { td.style.textAlign = 'center'; });

    const inputs = table.querySelectorAll('input.excel-input');

    const isNumericBR = (raw) => {
      if (!raw) return false;
      const v = raw.trim();
      if (/^#VALOR!?$/i.test(v)) return false;
      const normalized = v.replace(/\./g, '').replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(normalized);
    };

    const classify = (inp) => {
      const val = (inp.value ?? '').trim();
      inp.classList.remove('numeric-right', 'text-center', 'error-text');

      if (/^#VALOR!?$/i.test(val)) {
        inp.classList.add('error-text');
      } else if (isNumericBR(val)) {
        inp.classList.add('numeric-right');
      } else {
        inp.classList.add('text-center');
      }
    };

    inputs.forEach(inp => {
      classify(inp);
      ['input', 'change'].forEach(ev => inp.addEventListener(ev, () => classify(inp)));
    });
  }

  document.addEventListener('DOMContentLoaded', formatHH);



  function formatCurva() {
    const table = document.getElementById('curve-table');
    if (!table) return;

    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
      th.style.textAlign = 'center';
      if (!th.classList.contains('curve-head') &&
          !th.classList.contains('curve-group') &&
          !th.classList.contains('curve-subhead')) {
        th.classList.add('curve-head');
      }
    });

    const labelTds = table.querySelectorAll('tbody td.curve-rowhead');
    labelTds.forEach(td => { td.style.textAlign = 'center'; });

    const inputs = table.querySelectorAll('input.curve-input');

    const isPercentBR = (raw) => {
      if (!raw) return false;
      const v = raw.trim();
      if (!v.endsWith('%')) return false;
      const numPart = v.slice(0, -1).trim()
        .replace(/\./g, '')
        .replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(numPart);
    };

    const isNumericBR = (raw) => {
      if (!raw) return false;
      const v = raw.trim();
      const normalized = v.replace(/\./g, '').replace(',', '.');
      return /^-?\d+(\.\d+)?$/.test(normalized);
    };

    const classify = (inp) => {
      const val = (inp.value ?? '').trim();
      inp.classList.remove('numeric-right', 'text-center', 'error-text');

      if (/^#VALOR!?$/i.test(val)) {
        inp.classList.add('error-text');
        return;
      }

      if (isPercentBR(val)) {
        inp.classList.add('numeric-right');
        return;
      }

      const digitsOnly = /^[\d\.]+$/.test(val);
      if (digitsOnly && isNumericBR(val)) {
        inp.classList.add('numeric-right');
        return;
      }

      inp.classList.add('text-center');
    };

    inputs.forEach(inp => {
      classify(inp);
      ['input', 'change'].forEach(ev => inp.addEventListener(ev, () => classify(inp)));
    });
  }

  document.addEventListener('DOMContentLoaded', formatCurva);


  function isExcelError(val) {
    return /^#VALOR!?$/i.test(val.trim());
  }

  function isBRDate(val) {
    return /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(val.trim());
  }

  function parseNumberBR(raw) {
    if (!raw) return null;
    const v = raw.trim();
    const normalized = v.replace(/\./g, '').replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  }

  function formatNumberBR(num, decimals = 4) {
    try {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num);
    } catch (e) {
      const fixed = num.toFixed(decimals);
      const [intPart, decPart] = fixed.split('.');
      const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return withThousands + ',' + decPart;
    }
  }

  function formatInputValueBR(inp, decimals = 4) {
    const original = (inp.value ?? '').trim();
    if (original === '' || isExcelError(original) || isBRDate(original)) {
      return;
    }

    if (original.endsWith('%')) {
      const body = original.slice(0, -1).trim();
      const num = parseNumberBR(body);
      if (num !== null) {
        inp.value = formatNumberBR(num, decimals) + '%';
      }
      return;
    }

   const num = parseNumberBR(original);
   if (num !== null) {
      inp.value = formatNumberBR(num, decimals);
    }
  }

  function formatAllTablesNumbersBR() {
    const selectors = [
      'input.ssma-input',
      'input.excel-input',
      'input.hist-input',
      'input.curve-input'
    ];

    const inputs = document.querySelectorAll(selectors.join(','));

    inputs.forEach(inp => {
      formatInputValueBR(inp, 4);

      ['blur', 'change'].forEach(ev => {
        inp.addEventListener(ev, () => formatInputValueBR(inp, 4));
      });

      inp.addEventListener('paste', () => {
        setTimeout(() => formatInputValueBR(inp, 4), 0);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', formatAllTablesNumbersBR);

  function normalizeNumberBR(value) {
    if (!value) return '';
    const v = value.trim();
    return v.replace(/\./g, '').replace(',', '.');
  }

  /**
 * Configuração do campo de Ano como híbrido: lista suspensa + input manual
 * - Lista com anos de 2025 a 2052
 * - Aceita digitação manual
 * - Valida formato de 4 dígitos
 * - Valida ano mínimo (>= 2025)
 * - Aplica validação visual (classe cell-error)
 */

function setupYearFieldAsHybrid() {
  const table = document.querySelector('#curve-table');
  if (!table) {
    console.warn('[ANO HÍBRIDO] #curve-table não encontrado.');
    return;
  }

  const rows = table.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const yearCell = row.cells[7]; // Coluna 7 = Ano
    if (!yearCell) return;

    const existingInput = yearCell.querySelector('input.curve-input-ano');
    if (!existingInput) return;

    // Salva o valor atual
    const currentValue = existingInput.value.trim();

    // Cria o container híbrido
    const wrapper = document.createElement('div');
    wrapper.className = 'year-hybrid-wrapper';
    wrapper.style.cssText = 'position: relative; width: 100%;';

    // Cria o datalist para a lista suspensa
    const datalistId = 'year-options-' + Math.random().toString(36).substr(2, 9);
    const datalist = document.createElement('datalist');
    datalist.id = datalistId;

    // Popula com anos de 2025 a 2052
    for (let year = 2025; year <= 2052; year++) {
      const option = document.createElement('option');
      option.value = year;
      datalist.appendChild(option);
    }

    // Cria o novo input
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'curve-input-ano';
    newInput.list = datalistId;
    newInput.value = currentValue || '2025';
    newInput.placeholder = 'YYYY';
    newInput.maxLength = 4;
    newInput.style.cssText = 'width: 100%; text-align: center;';
    newInput.setAttribute('autocomplete', 'off');

    // Monta a estrutura
    wrapper.appendChild(newInput);
    wrapper.appendChild(datalist);

    // Substitui o input antigo
    yearCell.innerHTML = '';
    yearCell.appendChild(wrapper);

    // ===== VALIDAÇÃO =====
    const MIN_YEAR = 2025;
    const MAX_YEAR = 2052;
    const YEAR_REGEX = /^\d{4}$/;

    function validateYear(value) {
      const v = value.trim();
      
      // Vazio é permitido (opcional - remova esta linha se quiser obrigar)
      if (v === '') return { valid: true, message: '' };

      // Verifica formato de 4 dígitos
      if (!YEAR_REGEX.test(v)) {
        return { valid: false, message: 'Formato inválido. Use 4 dígitos (ex: 2025)' };
      }

      const yearNum = parseInt(v, 10);

      // Verifica se está no range válido
      if (yearNum < MIN_YEAR) {
        return { valid: false, message: `Ano deve ser >= ${MIN_YEAR}` };
      }

      if (yearNum > MAX_YEAR) {
        return { valid: false, message: `Ano deve ser <= ${MAX_YEAR}` };
      }

      return { valid: true, message: '' };
    }

    // ===== EVENTOS =====

    // Remove erro ao focar
    newInput.addEventListener('focusin', () => {
      newInput.classList.remove('cell-error');
      newInput.removeAttribute('title');
    });

    // Permite apenas dígitos
    newInput.addEventListener('keydown', (e) => {
      const control = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
      const isCtrlCmd = e.ctrlKey || e.metaKey;
      
      if (control.includes(e.key) || isCtrlCmd) return;

      const isDigit = /^\d$/.test(e.key);
      if (!isDigit) e.preventDefault();
    });

    // Sanitiza ao digitar (remove não-dígitos)
    newInput.addEventListener('input', () => {
      newInput.value = newInput.value.replace(/[^\d]/g, '');
      
      // Limita a 4 caracteres
      if (newInput.value.length > 4) {
        newInput.value = newInput.value.slice(0, 4);
      }
    });

    // Sanitiza ao colar
    newInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      const cleaned = text.replace(/[^\d]/g, '').slice(0, 4);
      newInput.value = cleaned;
      newInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Valida ao sair do campo
    newInput.addEventListener('focusout', () => {
      const validation = validateYear(newInput.value);
      
      if (!validation.valid) {
        newInput.classList.add('cell-error');
        newInput.title = validation.message;
      } else {
        newInput.classList.remove('cell-error');
        newInput.removeAttribute('title');
      }

      // Armazena o valor em dataset para uso posterior
      newInput.dataset.year = newInput.value;
    });

    // Valida ao selecionar da lista
    newInput.addEventListener('change', () => {
      const validation = validateYear(newInput.value);
      
      if (!validation.valid) {
        newInput.classList.add('cell-error');
        newInput.title = validation.message;
      } else {
        newInput.classList.remove('cell-error');
        newInput.removeAttribute('title');
      }
    });
  });

  console.log('✅ [ANO HÍBRIDO] Campo de ano configurado com lista suspensa + input manual');
}

// ===== INTEGRAÇÃO COM setupDelegationForCurve() =====

/**
 * Versão atualizada da setupDelegationForCurve() que integra o campo híbrido de ano
 * Substitua a função existente por esta
 */
/**
 * =====================================================
 * VALIDAÇÃO DO CAMPO DE ANO - INTEGRADA
 * =====================================================
 * 
 * Adicione este código ao seu arquivo operacoes_em_tela.js
 * 
 * SUBSTITUA a função setupDelegationForCurve() existente por esta versão
 * que já inclui a validação do campo de ano integrada.
 */

function setupDelegationForCurve() {
  const table = document.querySelector('#curve-table');
  if (!table) {
    console.warn('[CURVA] #curve-table não encontrado ao configurar delegação.');
    return;
  }
  if (table.dataset.eventsBound === 'true') return;
  table.dataset.eventsBound = 'true';

  // ===== Inicializa "Período" como <select> e liga "Semana" automática =====
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const periodCell = row.cells[0];
    const weekInput  = row.cells[8]?.querySelector('input.curve-input');
    if (!periodCell) return;

    const select = document.createElement('select');
    select.className = 'curve-period';
    for (let w = 1; w <= 52; w++) {
      const opt = document.createElement('option');
      const label = `Sem-${String(w).padStart(2, '0')}`;
      opt.value = label;
      opt.textContent = label;
      const current = (periodCell.textContent || '').trim();
      if (current.replace(/\s/g, '').toLowerCase() === label.toLowerCase()) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }

    periodCell.textContent = '';
    periodCell.appendChild(select);

    if (weekInput) {
      weekInput.readOnly = true;
      const weekNum = select.value.split('-')[1];
      weekInput.value = `Semana ${weekNum}`;
    }
    select.addEventListener('change', () => {
      const weekNum = select.value.split('-')[1];
      if (weekInput) weekInput.value = `Semana ${weekNum}`;
    });
  });

  
  // ===== INICIALIZAÇÃO DO CAMPO DE ANO COMO <select> =====
  // Ano deve se comportar como "Semana" (valor controlado pela UI), sem digitação livre.
  // Este trecho converte a coluna 7 (Ano) em <select> com opções 2025..2052.
  const getAnoBase = () => {
    // Tenta ano da competência (MM/YYYY -> YYYY); senão usa ano atual
    const el = document.getElementById('COMPETENCIAREFERENCIA');
    if (el && el.value) {
      const m = el.value.match(/(\d{4})$/);
      if (m) return m[1];
    }
    return String(new Date().getFullYear());
  };

  const rowsForYear = table.querySelectorAll('tbody tr');
  rowsForYear.forEach(row => {
    const anoCell   = row.cells[7];               // coluna 7 = Ano
    const semanaTd  = row.cells[8];               // coluna 8 = Semana
    const semanaInp = semanaTd?.querySelector('input.curve-input');
    if (!anoCell) return;

    // Valor atual no DOM (input antigo ou texto)
    const existingInput = anoCell.querySelector('input.curve-input-ano');
    const currentAno = existingInput
      ? (existingInput.value || '').trim()
      : (anoCell.textContent || '').trim();

    // Cria <select> de ano
    const anoSelect = document.createElement('select');
    anoSelect.className = 'curve-year';
    anoSelect.style.width = '100%';
    anoSelect.style.textAlign = 'center';

    const MIN_YEAR = 2025;
    const MAX_YEAR = 2052;

    let foundSelected = false;
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      if (currentAno && currentAno === String(y)) {
        opt.selected = true;
        foundSelected = true;
      }
      anoSelect.appendChild(opt);
    }
    // Se não achou selection explícita, usa competência/ano atual:
    if (!foundSelected) {
      anoSelect.value = getAnoBase();
    }

    // Substitui conteúdo da célula
    anoCell.textContent = '';
    anoCell.appendChild(anoSelect);

    // Validação visual simples (formato e faixa)
    const YEAR_REGEX = /^\d{4}$/;
    const validateYearSelect = (value) => {
      const okFormat = YEAR_REGEX.test(value);
      const num = parseInt(value, 10);
      const inRange = num >= MIN_YEAR && num <= MAX_YEAR;
      return okFormat && inRange;
    };

    // Aplica/limpa erro quando muda
    anoSelect.addEventListener('change', () => {
      const valid = validateYearSelect(anoSelect.value);
      // Usa uma classe de erro na célula (ou no select) como você já faz
      anoSelect.classList.toggle('cell-error', !valid);
      if (!valid) {
        anoSelect.title = `Ano deve ser 4 dígitos e entre ${MIN_YEAR} e ${MAX_YEAR}`;
      } else {
        anoSelect.removeAttribute('title');
      }
      // Semana continua readonly e coerente (deixa a lógica como já está)
      if (semanaInp) {
        const periodCell = row.cells[0];
        const periodSelect = periodCell?.querySelector('select.curve-period');
        const wk = (periodSelect?.value || 'Sem-01').split('-')[1];
        semanaInp.value = `Semana ${wk}`;
      }
    });

    // Estado inicial de validação
    const initialValid = validateYearSelect(anoSelect.value);
    anoSelect.classList.toggle('cell-error', !initialValid);
    if (!initialValid) {
      anoSelect.title = `Ano deve ser 4 dígitos e entre ${MIN_YEAR} e ${MAX_YEAR}`;
    } else {
      anoSelect.removeAttribute('title');
    }
  });


  // ===== VALIDAÇÃO DO CAMPO DE ANO =====
  const MIN_YEAR = 2025;
  const MAX_YEAR = 2052;
  const YEAR_REGEX = /^\d{4}$/;

  function validateYear(value) {
    const v = value.trim();
    if (v === '') return { valid: true, message: '' };
    if (!YEAR_REGEX.test(v)) {
      return { valid: false, message: 'Formato inválido. Use 4 dígitos (ex: 2025)' };
    }
    const yearNum = parseInt(v, 10);
    if (yearNum < MIN_YEAR) {
      return { valid: false, message: `Ano deve ser >= ${MIN_YEAR}` };
    }
    if (yearNum > MAX_YEAR) {
      return { valid: false, message: `Ano deve ser <= ${MAX_YEAR}` };
    }
    return { valid: true, message: '' };
  }

  function isYearInput(target) {
    return target.matches('tbody tr td input.curve-input-ano');
  }

  function isCurveInput(target) {
    return target.matches('tbody tr td input.curve-input');
  }

  const reNumber   = /^-?\d+(,\d+)?$|^-?\d{1,3}(\.\d{3})+(,\d+)?$/;
  const rePercent  = /^-?\d+(,\d+)?%$|^-?\d{1,3}(\.\d{3})+(,\d+)?%$/;

  function sanitizeNumber(value) {
    return value.replace(/[^\d,.\-]/g, '');
  }
  function sanitizeNumberOrPercent(value) {
    let v = value.replace(/[^\d,.\-%]/g, '');
    v = v.replace(/%+/g, '%');
    if (v.includes('%')) {
      v = v.replace(/%/g, '') + '%';
    }
    return v;
  }

  // ===== EVENTOS UNIFICADOS =====
  table.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isCurveInput(input) && !isYearInput(input)) return;
    
    input.classList.remove('cell-error');
    input.removeAttribute('title');

    const colIndex = input.closest('td')?.cellIndex ?? -1;
    if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  table.addEventListener('keydown', (e) => {
    const input = e.target;
    const isYear = isYearInput(input);
    const isCurve = isCurveInput(input);
    
    if (!isYear && !isCurve) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;

    const control = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End','Escape','Enter'];
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    if (control.includes(e.key) || isCtrlCmd) return;

    // VALIDAÇÃO ESPECÍFICA PARA ANO
    if (isYear) {
      const isDigit = /^\d$/.test(e.key);
      if (!isDigit) e.preventDefault();
      return;
    }

    // VALIDAÇÃO PARA CAMPOS NUMÉRICOS/PERCENTUAIS
    const isDigit      = /^\d$/.test(e.key);
    const isDecimalSep = /[.,]/.test(e.key);
    const isSign       = e.key === '-' && !input.value.includes('-');
    const isPercent    = e.key === '%' && colIndex >= 1 && colIndex <= 6 && !input.value.includes('%');

    let allowed = false;
    if (colIndex >= 1 && colIndex <= 6) {
      allowed = isDigit || isDecimalSep || isSign || isPercent;
    } else if (colIndex === 8) {
      allowed = false;
    }

    if (!allowed) e.preventDefault();
  });

  table.addEventListener('paste', (e) => {
    const input = e.target;
    const isYear = isYearInput(input);
    const isCurve = isCurveInput(input);
    
    if (!isYear && !isCurve) return;

    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;

    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';

    // PASTE ESPECÍFICO PARA ANO
    if (isYear) {
      const cleaned = text.replace(/[^\d]/g, '').slice(0, 4);
      input.value = cleaned;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    // PASTE PARA CAMPOS NUMÉRICOS/PERCENTUAIS
    if (colIndex >= 1 && colIndex <= 6) {
      input.value = sanitizeNumberOrPercent(text);
    } else if (colIndex === 8) {
      return;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  table.addEventListener('input', (e) => {
    const input = e.target;
    const isYear = isYearInput(input);
    const isCurve = isCurveInput(input);
    
    if (!isYear && !isCurve) return;

    // INPUT ESPECÍFICO PARA ANO
    if (isYear) {
      input.value = input.value.replace(/[^\d]/g, '');
      if (input.value.length > 4) {
        input.value = input.value.slice(0, 4);
      }
      return;
    }

    // INPUT PARA CAMPOS NUMÉRICOS/PERCENTUAIS
    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;
    const value = input.value.trim();

    if (colIndex >= 1 && colIndex <= 6) {
      input.value = sanitizeNumberOrPercent(input.value);
      const ok = reNumber.test(value) || rePercent.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
    } else if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  table.addEventListener('focusout', (e) => {
    const input = e.target;
    const isYear = isYearInput(input);
    const isCurve = isCurveInput(input);
    
    if (!isYear && !isCurve) return;

    // FOCUSOUT ESPECÍFICO PARA ANO
    if (isYear) {
      const validation = validateYear(input.value);
      
      if (!validation.valid) {
        input.classList.add('cell-error');
        input.title = validation.message;
      } else {
        input.classList.remove('cell-error');
        input.removeAttribute('title');
        input.dataset.year = input.value;
      }
      return;
    }

    // FOCUSOUT PARA CAMPOS NUMÉRICOS/PERCENTUAIS
    const td = input.closest('td'); 
    const colIndex = td?.cellIndex ?? -1;
    const value = input.value.trim();

    if (colIndex >= 1 && colIndex <= 6) {
      const numeric   = value.replace(/\./g, '').replace(',', '.').replace('%', '');
      const asNumber  = parseFloat(numeric);
      input.dataset.value     = isNaN(asNumber) ? '' : String(asNumber);
      input.dataset.isPercent = /%$/.test(value) ? 'true' : 'false';

      const ok = reNumber.test(value) || rePercent.test(value) || value === '';
      input.classList.toggle('cell-error', !ok && value !== '');
    } else if (colIndex === 8) {
      input.readOnly = true;
    }
  });

  // EVENTO CHANGE PARA SELEÇÃO DO DATALIST
  table.addEventListener('change', (e) => {
    const input = e.target;
    if (!isYearInput(input)) return;
    
    // Dispara validação ao selecionar do datalist
    input.dispatchEvent(new Event('focusout'));
  });

  console.log('[CURVA] Delegação de eventos (Período select, Semana auto, Ano validado, percent/número) ativada.');
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  setupDelegationForCurve();
});


// ===== CURVA: Recalcular "Prev Acc" em cascata =====
function recomputePrevAccCurve() {
  const table = document.querySelector('#curve-table');
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tbody tr'));

  let acc = 0; // base 0 para primeira linha
  rows.forEach((row, idx) => {
    const prevAccCell   = row.cells[1]; // Prev Acc
    const weeklyPrevCell= row.cells[4]; // Prev. LB/Sem

    if (!prevAccCell || !weeklyPrevCell) return;

    // Garante inputs
    let prevAccInput = prevAccCell.querySelector('input.curve-input');
    if (!prevAccInput) {
      prevAccInput = document.createElement('input');
      prevAccInput.className = 'curve-input';
      prevAccCell.textContent = '';
      prevAccCell.appendChild(prevAccInput);
    }
    const weeklyInput = weeklyPrevCell.querySelector('input.curve-input');
    const weeklyVal   = weeklyInput ? weeklyInput.value : (weeklyPrevCell.textContent || '').trim();

    const weekly = parsePercentBR(weeklyVal) ?? 0;
    acc += weekly;

    // Preencher e congelar Prev Acc
    prevAccInput.value    = formatPercentBR(acc, 4);
    prevAccInput.readOnly = true;               // não editável
    prevAccInput.classList.remove('cell-error');
    prevAccInput.dataset.value = String(acc);   // opcional, para integrações
  });
}

// Amarrar à sua delegação (coluna 4 altera o cálculo)
(function hookCurveRecalc() {
  const table = document.querySelector('#curve-table');
  if (!table) return;
  table.addEventListener('input', (e) => {
    const td = e.target.closest('td');
    if (!td) return;
    if (td.cellIndex === 4) {        // Prev. LB/Sem
      recomputePrevAccCurve();
    }
  });
  table.addEventListener('paste', () => setTimeout(recomputePrevAccCurve, 0));
  table.addEventListener('focusout', recomputePrevAccCurve);
});

// Atualizar também após criar/remover linhas
(function patchRowAddRemove() {
  const origAdd = window.addCurveRow || window.adicionarLinhaCurva;
  if (origAdd) {
    const wrappedAdd = function() {
      origAdd();
      recomputePrevAccCurve();
    };
    window.addCurveRow = wrappedAdd;
    window.adicionarLinhaCurva = wrappedAdd;
  }
  const origRemove = window.removeCurveRow || window.removerLinhaCurva;
  if (origRemove) {
    const wrappedRem = function() {
      origRemove();
      recomputePrevAccCurve();
    };
    window.removeCurveRow = wrappedRem;
    window.removerLinhaCurva = wrappedRem;
  }
})();

// Rodar no carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
  recomputePrevAccCurve();
});
``

// ===== FUNÇÃO AUXILIAR: PEGAR TODOS OS ANOS VÁLIDOS =====
function getAllYears() {
  const yearInputs = document.querySelectorAll('input.curve-input-ano');
  const years = [];
  
  yearInputs.forEach(input => {
    const year = parseInt(input.value, 10);
    if (!isNaN(year) && year >= 2025 && year <= 2052) {
      years.push(year);
    }
  });
  
  return years;
  
}

/**
 * =====================================================
 * FUNÇÕES AUXILIARES PARA HANDSONTABLE
 * =====================================================
 */

/**
 * Atualiza o contador de linhas
 */
function updateRowCount() {
  if (window.hotInstance) {
    const count = window.hotInstance.countSourceRows();
    const el = document.getElementById('curve-row-count');
    if (el) el.textContent = count;
  }
}


/**
 * Valida e mostra feedback visual
 */
function validateAndShowFeedback() {
    const alert = document.getElementById('curve-validation-alert');
    if (!alert) return;

    const isValid = validateCurveData();

    if (isValid) {
        alert.className = 'validation-alert success show';
        alert.innerHTML = '<i class="fa fa-check-circle"></i> ✅ Todos os dados estão válidos!';
    } else {
        alert.className = 'validation-alert error show';
        alert.innerHTML = '<i class="fa fa-exclamation-triangle"></i> ❌ Existem erros nos dados. Verifique as células destacadas em vermelho.';
    }

    // Esconde o alert após 5 segundos
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

/**
 * Exporta os dados em JSON
 */
function exportCurveData() {
    const data = getCurveData();
    const json = JSON.stringify(data, null, 2);
    
    // Cria um blob e faz download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curva_avanco_fisico_' + new Date().getTime() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('📥 Dados exportados:', data);
}

// Sobrescreve addCurveRow para atualizar contador
const originalAddRow = window.addCurveRow;
if (originalAddRow) {
    window.addCurveRow = function() {
        originalAddRow();
        updateRowCount();
    };
}

// Sobrescreve removeCurveRow para atualizar contador
const originalRemoveRow = window.removeCurveRow;
if (originalRemoveRow) {
    window.removeCurveRow = function() {
        originalRemoveRow();
        updateRowCount();
    };
}


function adicionarLinhaCurva() {
  const $tbody = $("#curve-table tbody");
  const $ultimaLinha = $tbody.find("tr:last");

  // --- 1) Ler período da última linha (select/input/texto) ---
  const $celulaPeriodo = $ultimaLinha.find("td.curve-rowhead");
  let labelPeriodoAtual = "";
  if ($celulaPeriodo.find("select, input").length > 0) {
    labelPeriodoAtual = $celulaPeriodo.find("select, input").val();
  } else {
    labelPeriodoAtual = ($celulaPeriodo.text() || "").trim();
  }
  if (!labelPeriodoAtual) labelPeriodoAtual = "Sem-00";

  // Incrementa período (Sem-20 -> Sem-21), preservando o sufixo com zero à esquerda
  let novoLabelPeriodo = "Sem-01";
  const mPer = labelPeriodoAtual.match(/(\d+)/);
  if (mPer) {
    const n = parseInt(mPer[0], 10) + 1;
    novoLabelPeriodo = "Sem-" + String(n).padStart(2, "0");
  } else {
    novoLabelPeriodo = labelPeriodoAtual;
  }

  // --- 2) Semana: deriva do período (Semana NN) ou incrementa a última ---
  const ultimoInputSemana = $ultimaLinha.find("td:last input.curve-input").val(); // col Semana é a última
  let novoLabelSemana = "Semana " + (novoLabelPeriodo.split("-")[1] || "01");
  if (ultimoInputSemana) {
    const mSem = ultimoInputSemana.match(/(\d+)/);
    if (mSem) {
      const nSem = parseInt(mSem[0], 10) + 1;
      novoLabelSemana = "Semana " + String(nSem).padStart(2, "0");
    }
  }

  // --- 3) Ano: reaproveita da última linha ou padrão 2025 ---
  const anoAnterior = $ultimaLinha.find(".curve-input-ano").val() || "2025";

  // --- 4) Montar nova <tr> com estrutura e classes iguais ---
  // a) Período como <select> com opções Sem-01..Sem-52
  const selectPeriodoId = "period-" + Math.random().toString(36).slice(2);
  const periodoSelectHTML = (() => {
    let opts = "";
    for (let w = 1; w <= 52; w++) {
      const label = `Sem-${String(w).padStart(2, "0")}`;
      const selected = (label.toLowerCase() === novoLabelPeriodo.toLowerCase()) ? " selected" : "";
      opts += `<option value="${label}"${selected}>${label}</option>`;
    }
    return `<select id="${selectPeriodoId}" class="curve-period">${opts}</select>`;
  })();

  // b) Ano com datalist 2025..2052 (id único para evitar conflitos)
  const datalistId = "years-list-" + Math.random().toString(36).slice(2);
  let yearOptions = "";
  for (let y = 2025; y <= 2052; y++) yearOptions += `<option value="${y}">`;
  const anoHTML = `
    <div class="year-hybrid-wrapper" style="position:relative;width:100%;">
      <input class="curve-input-ano" type="text" list="${datalistId}" value="${anoAnterior}"
             maxlength="4" placeholder="YYYY" autocomplete="off" style="width:100%;text-align:center;">
      <datalist id="${datalistId}">
        ${yearOptions}
      </datalist>
    </div>
  `;

  // c) Semana: somente leitura e já preenchida
  const semanaHTML = `<input class="curve-input" value="${novoLabelSemana}" readonly>`;

  // d) Colunas de valor (3 acumulado + 3 semanal) como inputs com classe curve-input
  const seisInputsValorHTML = Array.from({ length: 6 }, () =>
    `<td><input class="curve-input" value="0,0%"></td>`
  ).join("");

  // e) Montar a linha completa: 9 colunas
  const novaLinhaHTML =
    `<tr>
      <td class="curve-rowhead" style="text-align:center;">${periodoSelectHTML}</td>
      ${seisInputsValorHTML}
      <td>${anoHTML}</td>
      <td>${semanaHTML}</td>
    </tr>`;

  // --- 5) Inserir na tabela ---
  $tbody.append(novaLinhaHTML);

  // --- 6) Linkar Período -> Semana automaticamente ---
  const $recemInserida = $tbody.find("tr:last");
  const $selectPeriodo = $recemInserida.find(`#${selectPeriodoId}`);
  const $inputSemana = $recemInserida.find("td:last input.curve-input"); // última coluna = Semana
  $selectPeriodo.on("change", function () {
    const weekNum = (this.value || "Sem-01").split("-")[1];
    $inputSemana.val(`Semana ${weekNum}`);
  });

  // --- 7) Aplicar validações/formatadores iguais às linhas default ---
  // Importante: essas funções já existem no seu JS e trabalham por delegação e/ou formatação
  try {
    // Reaplicar delegação para a curva (se ainda não estiver marcada)
    if (typeof setupDelegationForCurve === "function") {
      setupDelegationForCurve(); // delegação por tabela garante funcionamento em linhas dinâmicas
    }
    // Aplicar formatação de cabeçalho/inputs
    if (typeof formatCurva === "function") formatCurva();
    // Normalização pt-BR em todos inputs
    if (typeof formatAllTablesNumbersBR === "function") formatAllTablesNumbersBR();
  } catch (e) {
    console.warn("[CURVA] Erro ao aplicar formatadores/validações pós-inserção:", e);
  }
}


/**
 * Remove a última linha da tabela
 * Impede a remoção se houver apenas uma linha
 */
function removerLinhaCurva() {
    var $tbody = $("#curve-table tbody");
    var linhas = $tbody.find("tr").length;

    if (linhas > 1) {
        $tbody.find("tr:last").remove();
    } else {
        FLUIGC.toast({
            title: 'Aviso',
            message: 'É necessário manter pelo menos uma linha na tabela.',
            type: 'warning'
        });
    }
}


/*****************************************************
 * AJUSTES - Operação Gerencial
 * - Histograma: Desvio = Previsto - Real (não editável)
 * - Físico/Financeiro: Desvio = Previsto LB - Realizado
 *   * Início/Término (datas): diferença em dias
 *   * % Av. Físico: diferença percentual
 *   * Demais colunas: diferença numérica
 * - Curva: Prev Acc(i) = Prev Acc(i-1) + Prev.LB/Sem(i)
 *   * readOnly, recalcula em add/remove/edições
 *****************************************************/

/* ==== Helpers numéricos/percentuais em pt-BR ==== */
function parseNumberBR(raw) {
  if (!raw) return null;
  const v = raw.trim().replace(/\./g, '').replace(',', '.');
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}
function formatNumberBR(num, decimals = 4) {
  try {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  } catch (e) {
    const fixed = Number(num).toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return withThousands + ',' + decPart;
  }
}
function parsePercentBR(raw) {
  if (!raw) return null;
  let v = raw.trim();
  if (v.endsWith('%')) v = v.slice(0, -1);
  return parseNumberBR(v);
}
function formatPercentBR(num, decimals = 4) {
  return formatNumberBR(num, decimals) + '%';
}

/* ==== Helpers de data BR ==== */
const reDateBR = /^\d{2}\/\d{2}\/\d{4}$/;
function parseDateBRToISO(br) {
  if (!br || !reDateBR.test(br)) return '';
  const [dd, mm, yyyy] = br.split('/');
  const iso = `${yyyy}-${mm}-${dd}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : iso;
}
function diffDaysISO(isoA, isoB) {
  if (!isoA || !isoB) return null;
  const a = new Date(isoA);
  const b = new Date(isoB);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
  // regra: Previsto LB - Realizado (mantém sinal)
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/* ======================================================
 * 1) HISTOGRAMA - Desvio = Previsto - Real (não editável)
 * ====================================================== */
function computeHistogramDesvio() {
  const table = document.querySelector('#hist-table');
  if (!table) return;

  const tbody = table.querySelector('tbody') || table;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // primeira célula é o rótulo da linha
  const headText = (tr) => (tr.cells[0]?.textContent || '').trim().toLowerCase();
  const previstoRow = rows.find(r => headText(r) === 'previsto');
  const realRow     = rows.find(r => headText(r) === 'real');
  const desvioRow   = rows.find(r => headText(r) === 'desvio');
  if (!previstoRow || !realRow || !desvioRow) return;

  for (let c = 1; c < desvioRow.cells.length; c++) {
    const prevCell = previstoRow.cells[c];
    const realCell = realRow.cells[c];
    const desvCell = desvioRow.cells[c];

    // garante input na célula Desvio
    let desvioInput = desvCell.querySelector('input.hist-input');
    if (!desvioInput) {
      desvioInput = document.createElement('input');
      desvioInput.className = 'hist-input';
      desvCell.textContent = '';
      desvCell.appendChild(desvioInput);
    }

    const getVal = (cell) => {
      const inp = cell.querySelector('input.hist-input');
      return (inp ? inp.value : cell.textContent || '').trim();
    };

    const prevVal = getVal(prevCell);
    const realVal = getVal(realCell);

    const prevNum = parseNumberBR(prevVal) ?? 0;
    const realNum = parseNumberBR(realVal) ?? 0;
    const diff    = prevNum - realNum;

    desvioInput.value    = formatNumberBR(diff, 4);
    desvioInput.readOnly = true;
    desvioInput.classList.remove('cell-error');
  }
}
function setupHistogramAutoCalcBindings() {
  const table = document.querySelector('#hist-table');
  if (!table) return;
  const tbody = table.querySelector('tbody') || table;
  tbody.addEventListener('input',  computeHistogramDesvio);
  tbody.addEventListener('focusout', computeHistogramDesvio);
  tbody.addEventListener('paste',  () => setTimeout(computeHistogramDesvio, 0));
}

/* ===================================================================
 * 2) INFORMAÇÕES FÍSICAS E FINANCEIRAS - Desvio = Previsto LB - Realizado
 *    datas -> diferença em dias | % -> diferença percentual | numérico
 * =================================================================== */

// tenta localizar a tabela do bloco "INFORMAÇÕES FÍSICAS E FINANCEIRAS"
function getFisicoTable() {
  const byId = document.querySelector('#fisico-table'); // se você tiver esse id
  if (byId) return byId;

  // fallback: tenta achar a tabela logo após um header com esse texto
  const headers = Array.from(document.querySelectorAll('div, h3, h4, strong, span'))
    .filter(el => (el.textContent || '').trim().toUpperCase().includes('INFORMAÇÕES FÍSICAS E FINANCEIRAS'));
  for (const h of headers) {
    const nextTable =
      h.parentElement?.querySelector('table') ||
      h.nextElementSibling?.querySelector?.('table');
    if (nextTable) return nextTable;
  }
  // último fallback: primeira tabela cujo elemento anterior tem esse texto
  const allTables = Array.from(document.querySelectorAll('table'));
  return allTables.find(t => {
    const prevText = (t.previousElementSibling?.textContent || '').trim().toUpperCase();
    return prevText.includes('INFORMAÇÕES FÍSICAS E FINANCEIRAS');
  }) || null;
}

function computeFisicoDesvio() {
  const table = getFisicoTable();
  if (!table) return;

  const tbody = table.querySelector('tbody') || table;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const headText = (tr) => (tr.cells[0]?.textContent || '').trim().toLowerCase();

  const previstoRow = rows.find(r => headText(r) === 'previsto lb');
  const realizadoRow = rows.find(r => headText(r) === 'realizado');
  const desvioRow    = rows.find(r => headText(r) === 'desvio');
  if (!previstoRow || !realizadoRow || !desvioRow) return;

  // 0=rótulo | 1=Início(date) | 2=Término(date) | 3=% Av. Físico(percent) | demais = numérico
  for (let c = 1; c < desvioRow.cells.length; c++) {
    const prevCell = previstoRow.cells[c];
    const realCell = realizadoRow.cells[c];
    const desvCell = desvioRow.cells[c];

    let desvioInput = desvCell.querySelector('input.excel-input');
    if (!desvioInput) {
      desvioInput = document.createElement('input');
      desvioInput.className = 'excel-input';
      desvCell.textContent = '';
      desvCell.appendChild(desvioInput);
    }

    const getVal = (cell) => {
      const inp = cell.querySelector('input.excel-input');
      return (inp ? inp.value : cell.textContent || '').trim();
    };

    const prevVal = getVal(prevCell);
    const realVal = getVal(realCell);

    let resultText = '';
    if (c === 1 || c === 2) {
      // datas: diferença de dias (Previsto LB - Realizado)
      const isoPrev = parseDateBRToISO(prevVal);
      const isoReal = parseDateBRToISO(realVal);
      const days = diffDaysISO(isoPrev, isoReal);
      resultText = (days === null) ? '' : String(days);
    } else if (c === 3) {
      // percentual
      const prevPct = parsePercentBR(prevVal) ?? 0;
      const realPct = parsePercentBR(realVal) ?? 0;
      resultText    = formatPercentBR(prevPct - realPct, 4);
    } else {
      // numérico
      const prevNum = parseNumberBR(prevVal) ?? 0;
      const realNum = parseNumberBR(realVal) ?? 0;
      resultText    = formatNumberBR(prevNum - realNum, 4);
    }

    desvioInput.value    = resultText;
    desvioInput.readOnly = true;
    desvioInput.classList.remove('cell-error');
  }
}
function setupFisicoAutoCalcBindings() {
  const table = getFisicoTable();
  if (!table) return;
  const tbody = table.querySelector('tbody') || table;
  ['input', 'focusout'].forEach(ev => tbody.addEventListener(ev, computeFisicoDesvio));
  tbody.addEventListener('paste', () => setTimeout(computeFisicoDesvio, 0));
}

/* ==========================================================
 * 3) CURVA - Prev Acc(i) = Prev Acc(i-1) + Prev.LB/Sem(i)
 * ========================================================== */

function getCurveTable() {
  return document.querySelector('#curve-table') || null;
}

function recomputePrevAccCurve() {
  const table = getCurveTable();
  if (!table) return;

  const tbody = table.querySelector('tbody') || table;
  const rows  = Array.from(tbody.querySelectorAll('tr'));

  let acc = 0; // base 0 => primeira linha = apenas o semanal
  rows.forEach((row) => {
    const prevAccCell    = row.cells[1]; // Prev Acc
    const weeklyPrevCell = row.cells[4]; // Prev. LB/Sem
    if (!prevAccCell || !weeklyPrevCell) return;

    let prevAccInput = prevAccCell.querySelector('input.curve-input');
    if (!prevAccInput) {
      prevAccInput = document.createElement('input');
      prevAccInput.className = 'curve-input';
      prevAccCell.textContent = '';
      prevAccCell.appendChild(prevAccInput);
    }

    const weeklyInput = weeklyPrevCell.querySelector('input.curve-input');
    const weeklyVal   = weeklyInput ? weeklyInput.value : (weeklyPrevCell.textContent || '').trim();
    const weekly      = parsePercentBR(weeklyVal) ?? 0;

    acc += weekly; // acumulado

    prevAccInput.value    = formatPercentBR(acc, 4);
    prevAccInput.readOnly = true;
    prevAccInput.classList.remove('cell-error');
    prevAccInput.dataset.value = String(acc); // opcional, para integrações
  });
}
function setupCurveAutoCalcBindings() {
  const table = getCurveTable();
  if (!table) return;
  const tbody = table.querySelector('tbody') || table;

  // recalcular quando qualquer coluna de valor (1..6) mudar; especialmente col 4 (Prev.LB/Sem)
  ['input', 'focusout'].forEach(ev => {
    tbody.addEventListener(ev, (e) => {
      const td = e.target.closest('td');
      if (!td) return;
      const idx = td.cellIndex;
      if (idx >= 1 && idx <= 6) {
        recomputePrevAccCurve();
      }
    });
  });
  tbody.addEventListener('paste', () => setTimeout(recomputePrevAccCurve, 0));
}

// Envelopar add/remove para garantir recálculo (compatível com suas funções existentes)
function patchCurveRowAddRemove() {
  const origAdd = window.addCurveRow || window.adicionarLinhaCurva;
  if (origAdd) {
    const wrappedAdd = function() {
      origAdd();
      // se sua delegação converte período/semana/ano em <select>, reaplique:
      if (typeof setupDelegationForCurve === 'function') setupDelegationForCurve();
      recomputePrevAccCurve();
    };
    window.addCurveRow = wrappedAdd;
    window.adicionarLinhaCurva = wrappedAdd;
  }
  const origRemove = window.removeCurveRow || window.removerLinhaCurva;
  if (origRemove) {
    const wrappedRem = function() {
      origRemove();
      recomputePrevAccCurve();
    };
    window.removeCurveRow = wrappedRem;
    window.removerLinhaCurva = wrappedRem;
  }
}

/* =========================
 * Inicialização dos cálculos
 * ========================= */
document.addEventListener('DOMContentLoaded', () => {
  // ligar eventos
  setupHistogramAutoCalcBindings();
  setupFisicoAutoCalcBindings();
  setupCurveAutoCalcBindings();
  patchCurveRowAddRemove();

  // primeira execução (caso haja dados importados default)
  computeHistogramDesvio();
  computeFisicoDesvio();
  recomputePrevAccCurve();
});

/* =========================
 * Sugestão: no final de iniciar()
 * =========================
 * Chame estas linhas ao final da função iniciar(), logo após mostrar
 * os blocos/tabelas (para garantir que o DOM está visível):
 *
 *   computeHistogramDesvio();
 *   computeFisicoDesvio();
 *   recomputePrevAccCurve();
 *
 * Opcionalmente, reforce os bindings:
 *
 *   setupHistogramAutoCalcBindings();
 *   setupFisicoAutoCalcBindings();
 *   setupCurveAutoCalcBindings();
 */


// Exporta funções
window.updateRowCount = updateRowCount;
window.validateAndShowFeedback = validateAndShowFeedback;
window.exportCurveData = exportCurveData;

console.log('[UI] ✅ Funções auxiliares do Handsontable carregadas');

window.getAllYears = getAllYears;
console.log('[CURVA] Script de validação carregado');

