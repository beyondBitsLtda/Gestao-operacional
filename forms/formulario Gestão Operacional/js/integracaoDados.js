// =========================================================================
// FUNÇÃO CORRIGIDA - VERIFICA INTEGRAÇÃO POR CATEGORIA ESPECÍFICA
// =========================================================================

function verificarIntegracaoExistente(tipo, codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('=== VERIFICANDO INTEGRAÇÃO ===');
        console.log('Tipo:', tipo);
        console.log('Categoria:', nomeCategoria);
        console.log('Competência:', competencia);
        
        var constraints = [];
        
        // Constraints obrigatórias
        constraints.push(DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('TIPO', tipo, null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST));
        
        // ✅ ADICIONA NOME_CATEGORIA se fornecido (para tipos que usam categoria) 
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log('→ Filtrando por categoria:', nomeCategoria);
        }
        
        console.log('→ Total de constraints:', constraints.length);
        
        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        
        if (!dataset) {
            console.log('⚠ Dataset retornou null');
            return false;
        }
        
        if (!dataset.values) {
            console.log('⚠ Dataset.values não existe');
            return false;
        }
        
        var existe = dataset.values.length > 0;
        console.log('→ Registros encontrados:', dataset.values.length);
        console.log('→ Já existe?', existe);
        console.log('==============================\n');
        
        return existe;
        
    } catch (error) {
        console.error('❌ ERRO ao verificar integração:', error);
        console.error('Stack:', error.stack);
        return false;
    }
}
// =========================================================================
// FUNÇÃO PARA BUSCAR COMPETÊNCIA ATUAL (MÊS ANTERIOR)
// =========================================================================
function buscarCompetenciaAtual(){
    var data = new Date();
    var mesAtual = data.getMonth(); // 0-11
    var ano = data.getFullYear();
    
    // Subtrair 1 mês
    var mes = mesAtual - 1;
    
    // Se for janeiro, volta para dezembro do ano anterior
    if(mes < 0){
        mes = 11;
        ano = ano - 1;
    }
    
    // Formatar como MM/YYYY (adiciona 1 porque getMonth retorna 0-11)
    var competencia = (mes + 1 < 10 ? '0' + (mes + 1) : (mes + 1)) + '/' + ano;
    
    console.log('Competência:', competencia);
    document.getElementById('COMPETENCIAREFERENCIA').value = competencia;
    return competencia;
}

function buscarDadosChave(){
    
    var chave = document.getElementById('CHAVE').value;
    console.log('Chave atual do formulário:', chave);
    return chave;
}

// =========================================================================
// FUNÇÕES DE COLETA DE DADOS DAS TABELAS
// =========================================================================

// Função para coletar dados da tabela SSMA
function coletarDadosSSMA() {
    var dados = [];
    var tabela = document.getElementById('ssma-table');
    
    if (!tabela) {
        console.log('Tabela SSMA não encontrada');
        return dados;
    }
    
    var linhas = tabela.querySelectorAll('tbody tr');
    
    linhas.forEach(function(linha) {
        var nomeCategoria = linha.querySelector('.ssma-label').textContent.trim();
        var inputs = linha.querySelectorAll('.ssma-input');
        var meta = inputs[0].value;
        var resultado = inputs[1].value;
        
        dados.push({
            NOME_CATEGORIA: nomeCategoria,
            META: parseFloat(meta.replace('%', '').replace(',', '.')) || 0,
            RESULTADO: parseFloat(resultado.replace('%', '').replace(',', '.')) || 0
        });
    });
    
    console.log('Dados SSMA coletados:', dados);
    return dados;
}

// Função para coletar dados do Histograma
function coletarDadosHistograma() {
    var dados = [];
    var tabela = document.getElementById('hist-table');
    
    if (!tabela) {
        console.log('Tabela Histograma não encontrada');
        return dados;
    }
    
    var linhas = tabela.querySelectorAll('tbody tr');
    
    linhas.forEach(function(linha) {
        var nomeCategoria = linha.querySelector('.hist-rowhead').textContent.trim();
        var inputs = linha.querySelectorAll('.hist-input');
        
        dados.push({
            NOME_CATEGORIA: nomeCategoria,
            MAO_DE_OBRA_INDIRETA: parseInt(inputs[0].value) || 0,
            MAO_DE_OBRA_DIRETA: parseInt(inputs[1].value) || 0,
            EQUIPAMENTOS: parseInt(inputs[2].value) || 0,
            VEICULOS: parseInt(inputs[3].value) || 0
        });
    });
    
    console.log('Dados Histograma coletados:', dados);
    return dados;
}

// Função para coletar dados do Histograma Auxiliar (tabela HH)
function coletarDadosHistogramaAuxiliar() {
    var dados = [];
    var tabela = document.getElementById('hh-table');
    
    if (!tabela) {
        console.log('Tabela HH não encontrada');
        return dados;
    }
    
    var linhas = tabela.querySelectorAll('tbody tr');
    
    linhas.forEach(function(linha) {
        var labels = linha.querySelectorAll('.hh-label');
        var values = linha.querySelectorAll('.excel-input');
        
        for (var i = 0; i < labels.length; i++) {
            var nomeCategoria = labels[i].textContent.trim();
            var valor = values[i].value;
            
            dados.push({
                NOME_CATEGORIA: nomeCategoria,
                VALOR_CATEGORIA: parseFloat(valor.replace(',', '.')) || 0
            });
        }
    });
    
    console.log('Dados Histograma Auxiliar coletados:', dados);
    return dados;
}

// Função para coletar dados das Informações Físicas e Financeiras
function coletarDadosInformacoesFisicas() {
    var dados = [];
    var tabela = document.getElementById('fisico-table');
    
    if (!tabela) {
        console.log('Tabela Informações Físicas não encontrada');
        return dados;
    }
    
    var linhas = tabela.querySelectorAll('tbody tr');
    
    linhas.forEach(function(linha) {
        var nomeCategoria = linha.querySelector('.fisico-rowhead').textContent.trim();
        var inputs = linha.querySelectorAll('.excel-input');
        
        // Converter datas de DD/MM/YYYY para YYYY-MM-DD
        var inicio = converterData(inputs[0].value);
        var termino = converterData(inputs[1].value);
        var avFisico = inputs[2].value;
        
        dados.push({
            NOME_CATEGORIA: nomeCategoria,
            INICIO: inicio,
            TERMINO: termino,
            AV_FISICO: parseFloat(avFisico.replace('%', '').replace(',', '.')) || 0
        });
    });
    
    console.log('Dados Informações Físicas coletados:', dados);
    return dados;
}

// Função auxiliar para converter data de DD/MM/YYYY para YYYY-MM-DD
function converterData(dataStr) {
    if (!dataStr || dataStr.trim() === '') return null;
    
    var partes = dataStr.split('/');
    if (partes.length === 3) {
        return partes[2] + '-' + partes[1] + '-' + partes[0];
    }
    return null;
}

function coletarDadosCurvaAvanco() {

  // helper: pega valor de um input pelo name (fallback quando HOT não traz ANO/SEMANA)
  function valByName(name) {
    var el = document.querySelector("[name='" + name + "']");
    return el ? String(el.value || "").trim() : "";
  }

  // ✅ Se Handsontable estiver ativo, coleta direto dele (fonte de verdade)
  if (window.hotInstance && typeof getCurveData === 'function') {
    const rows = getCurveData(); // vem do handsontable_curve.js

    // 🔎 logs de diagnóstico (pra matar o problema do ANO vazio)
    console.log("getCurveData() raw:", rows);
    console.log("Inputs ANO (fallback):", {
      curveANO: valByName("curveANO"),
      curveANO2: valByName("curveANO2"),
      curvesemana: valByName("curvesemana"),
      curvesemana2: valByName("curvesemana2")
    });

    const dados = rows.map((r, i) => {
      // ✅ fallback por linha (1ª linha usa curveANO, 2ª usa curveANO2)
      const anoFallback = (i === 0) ? valByName("curveANO") : valByName("curveANO2");
      const semFallback = (i === 0) ? valByName("curvesemana") : valByName("curvesemana2");

      const ano = String((r.ano || anoFallback || "")).trim();
      const semana = String((r.semana || semFallback || "")).trim();

      return {
        PERIODO: (r.periodo || '').toString().trim(),
        PREV_ACC: parseFloat(String(r.prevAcc || '').replace('%','').replace(',', '.')) || 0,
        REPLAN_ACC: parseFloat(String(r.replanAcc || '').replace('%','').replace(',', '.')) || 0,
        REAL_ACC: parseFloat(String(r.realAcc || '').replace('%','').replace(',', '.')) || 0,
        PREV_LB_SEM: parseFloat(String(r.prevSem || '').replace('%','').replace(',', '.')) || 0,
        REPLAN_SEM: parseFloat(String(r.replanSem || '').replace('%','').replace(',', '.')) || 0,
        REAL_SEM: parseFloat(String(r.realSem || '').replace('%','').replace(',', '.')) || 0,
        // ✅ aqui está a correção principal
        ANO: ano,
        SEMANA: semana
      };
    });

    console.log('Dados Curva de Avanço coletados (HOT) - pós fallback:', dados);
    return dados;
  }

  // ✅ Fallback: se NÃO tiver HOT, coleta do HTML (modo antigo)
  var dados = [];
  var tabela = document.getElementById('curve-table');

  if (!tabela) {
    console.log('Tabela Curva de Avanço não encontrada');
    return dados;
  }

  var linhas = tabela.querySelectorAll('tbody tr');

  linhas.forEach(function(linha, idx) {
    // ✅ CORREÇÃO: Pega apenas o valor selecionado do <select>
    const periodoCell = linha.querySelector('.curve-rowhead');
    let periodo = '';

    if (periodoCell) {
      const select = periodoCell.querySelector('select.curve-period');
      if (select) {
        periodo = select.value || '';
        } else {
        const input = periodoCell.querySelector('input');
        periodo = input ? input.value : periodoCell.textContent.trim();
      }
    }

    // ✅ Pega o valor do ANO do <select> ou <input>
    const anoCell = linha.cells[7];
    let ano = '';
    if (anoCell) {
      const anoSelect = anoCell.querySelector('select.curve-year');
      const anoInput = anoCell.querySelector('input.curve-input-ano');
      if (anoSelect) {
        ano = anoSelect.value || '';
      } else if (anoInput) {
        ano = anoInput.value || '';
        } else {
        ano = anoCell.textContent.trim();
      }
    }

    var inputs = linha.querySelectorAll('.curve-input');

    // 🔎 logs por linha (HTML)
    console.log("Linha HTML curva #" + (idx + 1), {
      periodo: periodo,
      ano: ano,
      semana: (inputs[6] && inputs[6].value) ? inputs[6].value : ""
    });

    dados.push({
      PERIODO: periodo,
      PREV_ACC: parseFloat((inputs[0] && inputs[0].value ? inputs[0].value : '').replace('%', '').replace(',', '.')) || 0,
      REPLAN_ACC: parseFloat((inputs[1] && inputs[1].value ? inputs[1].value : '').replace('%', '').replace(',', '.')) || 0,
      REAL_ACC: parseFloat((inputs[2] && inputs[2].value ? inputs[2].value : '').replace('%', '').replace(',', '.')) || 0,
      PREV_LB_SEM: parseFloat((inputs[3] && inputs[3].value ? inputs[3].value : '').replace('%', '').replace(',', '.')) || 0,
      REPLAN_SEM: parseFloat((inputs[4] && inputs[4].value ? inputs[4].value : '').replace('%', '').replace(',', '.')) || 0,
      REAL_SEM: parseFloat((inputs[5] && inputs[5].value ? inputs[5].value : '').replace('%', '').replace(',', '.')) || 0,
      ANO: String(ano || "").trim(),
      SEMANA: (inputs[6] && inputs[6].value) ? inputs[6].value : ''
    });
  });

  console.log('Dados Curva de Avanço coletados (HTML):', dados);
  return dados;
}

// =========================================================================
// FUNÇÕES DE SALVAMENTO NO BANCO DE DADOS
// =========================================================================

// Função para obter valor de campo
function getCampo(fieldId) {
    var campo = document.getElementById(fieldId);
    return campo ? campo.value : '';
}

// =========================================================================
// FUNÇÃO ÚNICA: CAPTURAR DESVIO_INICIO / DESVIO_TERMINO (SEM ALTERAR CÁLCULO)
// =========================================================================
/**
 * getDesvioInicioTerminoFromTela(contexto)
 * ---------------------------------------------------------
 * Objetivo:
 * - Ler os campos de desvio já calculados na tela.
 * - Mapear para as colunas DESVIO_INICIO e DESVIO_TERMINO.
 *
 * Regra aplicada:
 * - DESVIO_INICIO: valor do desvio base (linha "Desvio", coluna "Início" do Físico).
 * - DESVIO_TERMINO: valor do desvio término (linha "Desvio", coluna "Término" do Físico).
 * - Se não existir campo de término, retorna "0" (documentado no CHANGELOG).
 */
function getDesvioInicioTerminoFromTela(contexto) {
    // === Helper interno: normalizar número pt-BR para string numérica ===
    function normalizeNumberBR(value) {
        if (value === null || value === undefined) return '';
        var raw = String(value).replace('%', '').trim();
        if (!raw) return '';
        var normalized = raw.replace(/\./g, '').replace(',', '.');
        var num = parseFloat(normalized);
        return isNaN(num) ? '' : String(num);
    }

    var scope = contexto || 'GLOBAL';
    var inicioValor = '';
    var terminoValor = '';

    // Prioridade: tabela de Informações Físicas (Início/Término)
    var fisicoTable = document.getElementById('fisico-table');
    if (fisicoTable) {
        var inicioInput = fisicoTable.querySelector("input[name='desvioLB']");
        var terminoInput = fisicoTable.querySelector("input[name='desvioLBTermino']");

        inicioValor = normalizeNumberBR(inicioInput ? inicioInput.value : '');
        terminoValor = normalizeNumberBR(terminoInput ? terminoInput.value : '');
    } else {
        console.warn('[INTEGRACAO][DESVIO] #fisico-table não encontrada. Tentando fallback no histograma...');
        var histTable = document.getElementById('hist-table');
        if (histTable) {
            var histInicio = histTable.querySelector("input[name='desvioLB']");
            inicioValor = normalizeNumberBR(histInicio ? histInicio.value : '');
            terminoValor = ''; // histograma não possui término
        }
    }

    // Se não houver término, define como "0" (regra documentada)
    if (!terminoValor) {
        terminoValor = '0';
    }

    console.log('[INTEGRACAO][DESVIO]', scope, {
        DESVIO_INICIO: inicioValor,
        DESVIO_TERMINO: terminoValor
    });

    return {
        DESVIO_INICIO: inicioValor,
        DESVIO_TERMINO: terminoValor
    };
}

// Função principal para salvar todos os dados
function salvarDados() {
    try {
        //FLUIGC.loading(window, "Salvando dados...");
        
        // Buscar competência atual
        var competencia = buscarCompetenciaAtual();
        var chave = buscarDadosChave();
        
        // Dados do projeto
        var codColigada = getCampo('CODCOLIGADA');
        var codPrj = getCampo('CODPRJ');
        var idPrj = getCampo('IDPRJ');
        var usuario = getCampo('USUARIOATUAL');
        console.log("Usuário antes do fallback: "+usuario);
       

        // Validar dados obrigatórios
        if (!codColigada || !codPrj || !idPrj) {
            FLUIGC.toast({
                title: 'Erro',
                message: 'Dados do projeto não encontrados. Selecione um projeto primeiro.',
                type: 'warning'
            });
            FLUIGC.loading(window, '', true);
            return;
        }
        
        // Extrair mês e ano da competência
        var partes = competencia.split('/');
        var mes = parseInt(partes[0]);
        var ano = parseInt(partes[1]);
        
        console.log('Iniciando salvamento dos dados...');
        console.log('Projeto:', codPrj, 'Competência:', competencia);
        console.log(chave);
        
        // Coletar dados de todas as tabelas
        var dadosSSMA = coletarDadosSSMA();
        var dadosHistograma = coletarDadosHistograma();
        var dadosHistogramaAux = coletarDadosHistogramaAuxiliar();
        var dadosInformacoesFisicas = coletarDadosInformacoesFisicas();
        var dadosCurvaAvanco = coletarDadosCurvaAvanco();
        syncCurvaHotParaInputs(dadosCurvaAvanco);
        
        var totalRegistros = dadosSSMA.length + dadosHistograma.length + 
                           dadosHistogramaAux.length + dadosInformacoesFisicas.length + 
                           dadosCurvaAvanco.length;
        
        console.log('Total de registros a salvar:', totalRegistros);
        
        // Salvar cada conjunto de dados
        var sucessoSSMA = salvarSSMA(dadosSSMA, codColigada, codPrj, idPrj, mes, ano, competencia,chave, usuario);
        var sucessoHistograma = salvarHistograma(dadosHistograma, codColigada, codPrj, idPrj, mes, ano, competencia,chave, usuario);
        var sucessoHistogramaAux = salvarHistogramaAuxiliar(dadosHistogramaAux, codColigada, codPrj, idPrj, mes, ano, competencia,chave, usuario);
        var sucessoInfoFisicas = salvarInformacoesFisicas(dadosInformacoesFisicas, codColigada, codPrj, idPrj, mes, ano, competencia, chave, usuario);
        var sucessoCurva = salvarCurvaAvanco(dadosCurvaAvanco, codColigada, codPrj, idPrj, mes, ano, competencia, chave, usuario);
        
        FLUIGC.loading(window, '', true);
        
        if (sucessoSSMA && sucessoHistograma && sucessoHistogramaAux && sucessoInfoFisicas && sucessoCurva) {
            FLUIGC.toast({
                title: 'Sucesso!',
                message: 'Todos os dados foram salvos com sucesso!',
                type: 'success'
            });

            // ✅ Força o Fluig a persistir os valores nos cardValues (inclui curva HOT -> inputs)
            if (document.forms["form"]) {
                console.log("[salvarDados] Submit do formulário disparado para gravar cardValues.");
                document.forms["form"].submit();
            } else {
                console.warn("[salvarDados] Form name=\"form\" não encontrado; não foi possível dar submit.");
            }
        } else {
            FLUIGC.toast({
                title: 'Atenção',
                message: 'Alguns dados podem não ter sido salvos. Verifique o console.',
                type: 'warning'
            });
        } 
        
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        FLUIGC.loading(window, '', true);
        FLUIGC.toast({
            title: 'Erro',
            message: 'Erro ao salvar dados: ' + error.message,
            type: 'danger'
        });
    }
}

function formatPercentBR(n) {
  // backend só checa vazio/#VALOR!, então pode mandar número puro também,
  // mas manter % ajuda na consistência com a tela
  if (n === null || n === undefined || n === "") return "";
  var num = Number(n);
  if (isNaN(num)) return "";
  // se vier 0.12 (12%), transforma em 12,0%
  // se vier 12 (12%), mantém 12,0%
  if (num > 0 && num <= 1) num = num * 100;
  return num.toFixed(1).replace(".", ",") + "%";
}

function setByName(name, value) {
  var el = document.querySelector("[name='" + name + "']");
  if (el) el.value = (value === undefined || value === null) ? "" : String(value);
}

function syncCurvaHotParaInputs(dadosCurvaAvanco) {
  if (!dadosCurvaAvanco || !dadosCurvaAvanco.length) return;

  var l1 = dadosCurvaAvanco[0] || {};
  var l2 = dadosCurvaAvanco[1] || {};

  // Sem-20 (Acumulado)
  setByName("curveprevacc",     formatPercentBR(l1.PREV_ACC));
  setByName("curverepplanacc",  formatPercentBR(l1.REPLAN_ACC));
  setByName("curverealacc",     formatPercentBR(l1.REAL_ACC));

  // Ano/Semana
  setByName("curveANO",         l1.ANO || "");
  setByName("curvesemana",      l1.SEMANA || "");

  // Sem-21 (Acumulado)
  // no seu HTML a linha 2 usa: curveprevblock / curverepplanblock / curverealblock :contentReference[oaicite:1]{index=1}
  setByName("curveprevblock",    formatPercentBR(l2.PREV_ACC));
  setByName("curverepplanblock", formatPercentBR(l2.REPLAN_ACC));
  setByName("curverealblock",    formatPercentBR(l2.REAL_ACC));

  setByName("curveANO2",         l2.ANO || "");
  setByName("curvesemana2",      l2.SEMANA || "");
}

// =========================================================================
// [INTEGRACAO] CARREGAR ÚLTIMA INTEGRAÇÃO AO SELECIONAR PROJETO (ZOOM)
// =========================================================================
/**
 * Fluxo resumido:
 * 1) Consulta o dataset dsgestaoOperacional (OPERACAO=consultar) por tipo/bloco.
 * 2) Escolhe o registro mais recente (critério: RECMODIFIEDON quando disponível).
 * 3) Preenche apenas registros com EFETIVADO = 0.
 * 4) Recalcula desvios e formata números.
 */
function loadLastIntegrationForProject() {
    console.log('[INTEGRACAO][LOAD] Iniciando carregamento da última integração...');

    try {
        var codColigada = getCampo('CODCOLIGADA');
        var codPrj = getCampo('CODPRJ');
        var idPrj = getCampo('IDPRJ');

        if (!codColigada || !codPrj || !idPrj) {
            console.warn('[INTEGRACAO][LOAD] Dados do projeto incompletos. Abortando carregamento.');
            return;
        }

        // Competência base: usa campo preenchido ou calcula via helper existente
        var competencia = getCampo('COMPETENCIAREFERENCIA') || buscarCompetenciaAtual();
        var partes = String(competencia).split('/');
        var mes = parseInt(partes[0], 10);
        var ano = parseInt(partes[1], 10);

        var tipos = [
            'SSMA',
            'HISTOGRAMA',
            'HISTOGRAMA_AUXILIAR',
            'INFORMACOES_FISICAS',
            'CURVA_AVANCO'
        ];

        tipos.forEach(function(tipo) {
            var registros = fetchDatasetByTipo(tipo, codColigada, codPrj, idPrj, mes, ano, competencia);
            if (!registros.length) {
                console.log('[INTEGRACAO][LOAD] Nenhum registro encontrado para tipo:', tipo);
                return;
            }

            var latest = pickLatestIntegrationRecords(registros, tipo);
            if (!latest.latestRecords.length) {
                console.log('[INTEGRACAO][LOAD] Nenhum registro selecionado após pickLatest para tipo:', tipo);
                return;
            }

            fillTablesByTipo(tipo, latest.latestRecords);
        });

        // Pós-preenchimento: recalcula e formata
        if (typeof computeHistogramDesvio === 'function') computeHistogramDesvio();
        if (typeof computeFisicoDesvio === 'function') computeFisicoDesvio();
        if (typeof formatAllTablesNumbersBR === 'function') formatAllTablesNumbersBR();

    } catch (error) {
        console.error('[INTEGRACAO][LOAD] Erro ao carregar última integração:', error);
        if (typeof FLUIGC !== 'undefined' && FLUIGC.toast) {
            FLUIGC.toast({
                title: 'Erro',
                message: 'Erro ao carregar última integração: ' + error.message,
                type: 'danger'
            });
        }
    }
}

// =========================================================================
// [INTEGRACAO] HELPERS DE CONSULTA + ESCOLHA DO REGISTRO MAIS RECENTE
// =========================================================================
function fetchDatasetByTipo(tipo, codColigada, codPrj, idPrj, mes, ano, competencia) {
    try {
        var constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', tipo, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST)
        ];

        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        if (!dataset || !dataset.values) return [];
        return dataset.values;
    } catch (error) {
        console.error('[INTEGRACAO][LOAD] Erro ao consultar dataset para tipo:', tipo, error);
        return [];
    }
}

function parseDateMaybe(value) {
    if (!value) return null;
    var date = new Date(value);
    if (!isNaN(date.getTime())) return date.getTime();

    // Fallback: tenta DD/MM/YYYY
    var match = String(value).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
        var iso = match[3] + '-' + match[2] + '-' + match[1];
        var dateFallback = new Date(iso);
        return isNaN(dateFallback.getTime()) ? null : dateFallback.getTime();
    }
    return null;
}

function pickLatestIntegrationRecords(records, tipo) {
    var criterion = '';
    var latestRecords = [];

    // 1) Preferência: RECMODIFIEDON
    var timestamps = records
        .map(function(r) { return parseDateMaybe(r.RECMODIFIEDON); })
        .filter(function(ts) { return ts !== null; });

    if (timestamps.length) {
        var maxTs = Math.max.apply(null, timestamps);
        latestRecords = records.filter(function(r) { return parseDateMaybe(r.RECMODIFIEDON) === maxTs; });
        criterion = 'RECMODIFIEDON';
        console.log('[INTEGRACAO][PICK_LATEST]', { tipo: tipo, criterio: criterion, valor: maxTs });
        return { criterion: criterion, latestRecords: latestRecords };
    }

    // 2) Fallback: CHAVE (se existir no retorno)
    var hasChave = records.some(function(r) { return r.CHAVE; });
    if (hasChave) {
        var maxChave = records.reduce(function(acc, r) {
            return String(r.CHAVE) > String(acc) ? r.CHAVE : acc;
        }, records[0].CHAVE);
        latestRecords = records.filter(function(r) { return String(r.CHAVE) === String(maxChave); });
        criterion = 'CHAVE';
        console.log('[INTEGRACAO][PICK_LATEST]', { tipo: tipo, criterio: criterion, valor: maxChave });
        return { criterion: criterion, latestRecords: latestRecords };
    }

    // 3) Fallback final: mantém todos (mes/ano/competência já filtrados)
    criterion = 'COMPETENCIA';
    latestRecords = records;
    console.log('[INTEGRACAO][PICK_LATEST]', { tipo: tipo, criterio: criterion, valor: 'MES/ANO/COMPETENCIA' });
    return { criterion: criterion, latestRecords: latestRecords };
}

// =========================================================================
// [INTEGRACAO] HELPERS DE PREENCHIMENTO (EFETIVADO = 0)
// =========================================================================
function shouldSkipEfetivado(record) {
    var efetivado = record.EFETIVADO;
    return efetivado !== undefined && efetivado !== null && String(efetivado) !== '0';
}

function formatValueForInput(value) {
    if (typeof formatarValor === 'function') return formatarValor(value);
    if (value === null || value === undefined || value === 'null' || value === 'undefined') return '';
    return String(value);
}

function formatDateForInput(value) {
    if (typeof formatarDataBR === 'function') return formatarDataBR(value);
    if (!value || value === 'null' || value === 'undefined') return '';
    if (String(value).includes('/')) return value;
    if (String(value).includes('-')) {
        var partes = String(value).split('-');
        return partes.length === 3 ? (partes[2] + '/' + partes[1] + '/' + partes[0]) : value;
    }
    return String(value);
}

function fillTablesByTipo(tipo, records) {
    switch (tipo) {
        case 'SSMA':
            fillSSMATable(records);
            break;
        case 'HISTOGRAMA':
            fillHistogramaTable(records);
            break;
        case 'HISTOGRAMA_AUXILIAR':
            fillHistogramaAuxTable(records);
            break;
        case 'INFORMACOES_FISICAS':
            fillFisicoTable(records);
            break;
        case 'CURVA_AVANCO':
            fillCurvaTable(records);
            break;
        default:
            console.warn('[INTEGRACAO][FILL] Tipo desconhecido:', tipo);
    }
}

function fillSSMATable(records) {
    var table = document.getElementById('ssma-table');
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    records.forEach(function(registro) {
        if (shouldSkipEfetivado(registro)) {
            console.log('[INTEGRACAO][SKIP_EFETIVADO] SSMA', registro.NOME_CATEGORIA);
            return;
        }

        var categoria = (registro.NOME_CATEGORIA || '').trim();
        rows.forEach(function(row) {
            var label = row.querySelector('.ssma-label');
            if (label && label.textContent.trim() === categoria) {
                var inputs = row.querySelectorAll('.ssma-input');
                if (inputs.length >= 2) {
                    inputs[0].value = formatValueForInput(registro.META);
                    inputs[1].value = formatValueForInput(registro.RESULTADO);
                    console.log('[INTEGRACAO][FILL] SSMA', categoria);
                }
            }
        });
    });
}

function fillHistogramaTable(records) {
    var table = document.getElementById('hist-table');
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    records.forEach(function(registro) {
        if (shouldSkipEfetivado(registro)) {
            console.log('[INTEGRACAO][SKIP_EFETIVADO] HISTOGRAMA', registro.NOME_CATEGORIA);
            return;
        }

        var categoria = (registro.NOME_CATEGORIA || '').trim();
        rows.forEach(function(row) {
            var label = row.querySelector('.hist-rowhead');
            if (label && label.textContent.trim() === categoria) {
                var inputs = row.querySelectorAll('.hist-input');
                if (inputs.length >= 4) {
                    inputs[0].value = formatValueForInput(registro.MAO_DE_OBRA_INDIRETA);
                    inputs[1].value = formatValueForInput(registro.MAO_DE_OBRA_DIRETA);
                    inputs[2].value = formatValueForInput(registro.EQUIPAMENTOS);
                    inputs[3].value = formatValueForInput(registro.VEICULOS);
                    console.log('[INTEGRACAO][FILL] HISTOGRAMA', categoria);
                }
            }
        });
    });
}

function fillHistogramaAuxTable(records) {
    var table = document.getElementById('hh-table');
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        var labels = row.querySelectorAll('.hh-label');
        var inputs = row.querySelectorAll('.excel-input');

        labels.forEach(function(label, idx) {
            var categoria = (label.textContent || '').trim();
            var registro = records.find(function(r) {
                return (r.NOME_CATEGORIA || '').trim() === categoria;
            });

            if (!registro) return;
            if (shouldSkipEfetivado(registro)) {
                console.log('[INTEGRACAO][SKIP_EFETIVADO] HISTOGRAMA_AUX', categoria);
                return;
            }

            if (inputs[idx]) {
                inputs[idx].value = formatValueForInput(registro.VALOR_CATEGORIA);
                console.log('[INTEGRACAO][FILL] HISTOGRAMA_AUX', categoria);
            }
        });
    });
}

function fillFisicoTable(records) {
    var table = document.getElementById('fisico-table');
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    records.forEach(function(registro) {
        if (shouldSkipEfetivado(registro)) {
            console.log('[INTEGRACAO][SKIP_EFETIVADO] FISICO', registro.NOME_CATEGORIA);
            return;
        }

        var categoria = (registro.NOME_CATEGORIA || '').trim();
        rows.forEach(function(row) {
            var label = row.querySelector('.fisico-rowhead');
            if (label && label.textContent.trim() === categoria) {
                var inputs = row.querySelectorAll('.excel-input');
                if (inputs.length >= 3) {
                    inputs[0].value = formatDateForInput(registro.INICIO);
                    inputs[1].value = formatDateForInput(registro.TERMINO);
                    inputs[2].value = formatValueForInput(registro.AV_FISICO);
                    console.log('[INTEGRACAO][FILL] FISICO', categoria);
                }
            }
        });
    });
}

function getCurveRowPeriodValue(row) {
    var periodCell = row.cells[0];
    if (!periodCell) return '';
    var select = periodCell.querySelector('select.curve-period');
    if (select) return select.value || '';
    var input = periodCell.querySelector('input');
    if (input) return input.value || '';
    return (periodCell.textContent || '').trim();
}

function fillCurvaTable(records) {
    var table = document.getElementById('curve-table');
    if (!table) return;

    var rows = Array.from(table.querySelectorAll('tbody tr'));
    records.forEach(function(registro) {
        if (shouldSkipEfetivado(registro)) {
            console.log('[INTEGRACAO][SKIP_EFETIVADO] CURVA', registro.PERIODO);
            return;
        }

        var periodo = (registro.PERIODO || '').trim();
        var row = rows.find(function(r) {
            return getCurveRowPeriodValue(r).trim() === periodo;
        });

        if (!row) return;

        var inputs = row.querySelectorAll('input.curve-input');
        if (inputs.length >= 6) {
            inputs[0].value = formatValueForInput(registro.PREV_ACC);
            inputs[1].value = formatValueForInput(registro.REPLAN_ACC);
            inputs[2].value = formatValueForInput(registro.REAL_ACC);
            inputs[3].value = formatValueForInput(registro.PREV_LB_SEM);
            inputs[4].value = formatValueForInput(registro.REPLAN_SEM);
            inputs[5].value = formatValueForInput(registro.REAL_SEM);
        }

        // Ano
        var anoSelect = row.querySelector('select.curve-year');
        var anoInput = row.querySelector('input.curve-input-ano');
        if (anoSelect) anoSelect.value = registro.ANO || '';
        if (anoInput) anoInput.value = registro.ANO || '';

        // Semana (geralmente o último input .curve-input)
        if (inputs.length >= 7) {
            inputs[6].value = registro.SEMANA || '';
        }

        console.log('[INTEGRACAO][FILL] CURVA', periodo);
    });
}

// =========================================================================
// SSMA - VERIFICA CADA CATEGORIA INDIVIDUALMENTE
// =========================================================================
function salvarSSMA(dados, codColigada, codPrj, idPrj, mes, ano, competencia,chave, usuario) {
    if (dados.length === 0) { 
        console.log('Nenhum dado SSMA para salvar');
        return true;
    }
    
    try {
        console.log('\n▶ INICIANDO SALVAMENTO SSMA');
        console.log('Total de itens:', dados.length);
        
        var sucessos = 0;
        var erros = 0;

        dados.forEach(function(item, index) {
            try {
                console.log('\n--- Item ' + (index + 1) + '/' + dados.length + ' ---');
                console.log('Categoria:', item.NOME_CATEGORIA);
                
                // ✅ VERIFICA SE JÁ EXISTE **ESTA CATEGORIA ESPECÍFICA**
                var jaExiste = verificarIntegracaoExistente(
                    'SSMA', 
                    codColigada, 
                    codPrj, 
                    idPrj, 
                    mes, 
                    ano, 
                    competencia,
                    item.NOME_CATEGORIA  // ← PASSA A CATEGORIA DO ITEM
                );
                
                var operacao = jaExiste ? 'atualizar' : 'incluir';
                console.log('→ Operação:', operacao);

                // Monta constraints
                var desvios = getDesvioInicioTerminoFromTela('SSMA');
                var constraints = [
                    DatasetFactory.createConstraint('OPERACAO', operacao, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('TIPO', 'SSMA', null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CHAVE', chave, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('META', item.META.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('RESULTADO', item.RESULTADO.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_INICIO', desvios.DESVIO_INICIO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_TERMINO', desvios.DESVIO_TERMINO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST)
                ];

                var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
                
                if (!dataset || !dataset.values) {
                    console.error('❌ Dataset retornou null/vazio');
                    erros++;
        } else {
                    console.log('✓ SSMA salvo com sucesso');
                    sucessos++;
                }
                
            } catch (e) {
                console.error('❌ Erro ao processar item:', e.message);
                erros++;
            }
        });
        
        console.log('\n▶ RESUMO SSMA:');
        console.log('✓ Sucessos:', sucessos);
        console.log('❌ Erros:', erros);
        
        return erros === 0;
        
    } catch (error) {
        console.error('❌ Erro crítico ao salvar SSMA:', error);
        return false;
    }
}

// =========================================================================
// HISTOGRAMA - VERIFICA CADA CATEGORIA INDIVIDUALMENTE
// =========================================================================
function salvarHistograma(dados, codColigada, codPrj, idPrj, mes, ano, competencia, chave, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Histograma para salvar');
        return { sucesso: true, mensagem: "Nenhum dado para salvar" };
    }
    
    try {
        console.log('\n▶ INICIANDO SALVAMENTO HISTOGRAMA');
        console.log('Total de itens:', dados.length);
        
        var sucessos = 0;
        var erros = 0;
        var mensagensErro = [];

        dados.forEach(function(item, index) {
            try {
                console.log('\n--- Item ' + (index + 1) + '/' + dados.length + ' ---');
                console.log('Categoria:', item.NOME_CATEGORIA);
                
                // ✅ VERIFICA SE JÁ EXISTE **ESTA CATEGORIA ESPECÍFICA**
                var jaExiste = verificarIntegracaoExistente(
                    'HISTOGRAMA', 
                    codColigada, 
                    codPrj, 
                    idPrj, 
                    mes, 
                    ano, 
                    competencia,
                    item.NOME_CATEGORIA  // ← PASSA A CATEGORIA DO ITEM
                );
                
                var operacao = jaExiste ? 'atualizar' : 'incluir';
                console.log('→ Operação:', operacao);

                var desvios = getDesvioInicioTerminoFromTela('HISTOGRAMA');
                var constraints = [
                    DatasetFactory.createConstraint('OPERACAO', operacao, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA', null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CHAVE', chave, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('MAO_DE_OBRA_INDIRETA', item.MAO_DE_OBRA_INDIRETA.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('MAO_DE_OBRA_DIRETA', item.MAO_DE_OBRA_DIRETA.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('EQUIPAMENTOS', item.EQUIPAMENTOS.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('VEICULOS', item.VEICULOS.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_INICIO', desvios.DESVIO_INICIO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_TERMINO', desvios.DESVIO_TERMINO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST)
                ];

                var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
                
                if (!dataset || !dataset.values) {
                    var msg = 'Dataset retornou null/vazio para ' + item.NOME_CATEGORIA;
                    console.error('❌', msg);
                    mensagensErro.push(msg);
                    erros++;
        } else {
                    console.log('✓ Histograma salvo com sucesso');
                    sucessos++;
                }
                
            } catch (e) {
                var msg = 'Erro ao processar ' + item.NOME_CATEGORIA + ': ' + e.message;
                console.error('❌', msg);
                mensagensErro.push(msg);
                erros++;
            }
        });
        
        console.log('\n▶ RESUMO HISTOGRAMA:');
        console.log('✓ Sucessos:', sucessos);
        console.log('❌ Erros:', erros);
        
        return {
            sucesso: erros === 0,
            mensagem: erros === 0 
                ? sucessos + " registro(s) salvos com sucesso!" 
                : sucessos + " salvos, " + erros + " erro(s): " + mensagensErro.join(", "),
            detalhes: { sucessos: sucessos, erros: erros, mensagensErro: mensagensErro }
        };
        
    } catch (error) {
        console.error('❌ Erro crítico:', error);
        return {
            sucesso: false,
            mensagem: 'Erro crítico: ' + error.message,
            detalhes: { sucessos: 0, erros: 1, mensagensErro: [error.message] }
        };
    }
}

// =========================================================================
// HISTOGRAMA AUXILIAR - VERIFICA CADA CATEGORIA INDIVIDUALMENTE
// =========================================================================
function salvarHistogramaAuxiliar(dados, codColigada, codPrj, idPrj, mes, ano, competencia, chave, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Histograma Auxiliar para salvar');
        return true;
    }
    
    try {
        console.log('\n▶ INICIANDO SALVAMENTO HISTOGRAMA AUXILIAR');
        
        dados.forEach(function(item, index) {
            console.log('\n--- Item ' + (index + 1) + ' ---');
            console.log('Categoria:', item.NOME_CATEGORIA);
            
            var jaExiste = verificarIntegracaoExistente(
                'HISTOGRAMA_AUXILIAR', 
                codColigada, 
                codPrj, 
                idPrj, 
                mes, 
                ano, 
                competencia,
                item.NOME_CATEGORIA
            );
            
            var operacao = jaExiste ? 'atualizar' : 'incluir';
            console.log('→ Operação:', operacao);

            var desvios = getDesvioInicioTerminoFromTela('HISTOGRAMA_AUXILIAR');
            var constraints = [
                DatasetFactory.createConstraint('OPERACAO', operacao, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA_AUXILIAR', null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CHAVE', chave, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('VALOR_CATEGORIA', item.VALOR_CATEGORIA.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('DESVIO_INICIO', desvios.DESVIO_INICIO, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('DESVIO_TERMINO', desvios.DESVIO_TERMINO, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST)
            ];
            
            var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
            console.log('✓ Salvo');
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro:', error);
        return false;
    }
}

// =========================================================================
// INFORMAÇÕES FÍSICAS - VERIFICA CADA CATEGORIA INDIVIDUALMENTE
// =========================================================================
function salvarInformacoesFisicas(dados, codColigada, codPrj, idPrj, mes, ano, competencia, chave,usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Informações Físicas para salvar');
        return true;
    }
    
    try {
        console.log('\n▶ INICIANDO SALVAMENTO INFORMAÇÕES FÍSICAS');
        
        dados.forEach(function(item, index) {
            console.log('\n--- Item ' + (index + 1) + ' ---');
            console.log('Categoria:', item.NOME_CATEGORIA);
            
            var jaExiste = verificarIntegracaoExistente(
                'INFORMACOES_FISICAS', 
                codColigada, 
                codPrj, 
                idPrj, 
                mes, 
                ano, 
                competencia,
                item.NOME_CATEGORIA
            );
            
            var operacao = jaExiste ? 'atualizar' : 'incluir';
            console.log('→ Operação:', operacao);

            var desvios = getDesvioInicioTerminoFromTela('INFORMACOES_FISICAS');
            var constraints = [
                DatasetFactory.createConstraint('OPERACAO', operacao, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('TIPO', 'INFORMACOES_FISICAS', null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('CHAVE', chave, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('INICIO', item.INICIO || '', null, ConstraintType.MUST),
                DatasetFactory.createConstraint('TERMINO', item.TERMINO || '', null, ConstraintType.MUST),
                DatasetFactory.createConstraint('AV_FISICO', item.AV_FISICO.toString(), null, ConstraintType.MUST),
                DatasetFactory.createConstraint('DESVIO_INICIO', desvios.DESVIO_INICIO, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('DESVIO_TERMINO', desvios.DESVIO_TERMINO, null, ConstraintType.MUST),
                DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST)
            ];
            
            var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
            console.log('✓ Salvo');
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro:', error);
        return false;
    }
}

// =========================================================================
// CURVA DE AVANÇO - USA PERÍODO+SEMANA COMO IDENTIFICADOR (NÃO USA CATEGORIA)
// =========================================================================
function salvarCurvaAvanco(dados, codColigada, codPrj, idPrj, mes, ano, competencia, chave, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Curva de Avanço para salvar');
        return { sucesso: true, mensagem: "Nenhum dado para salvar" };
    }
    
    try {
        console.log('\n▶ INICIANDO SALVAMENTO CURVA DE AVANÇO');
        
        var sucessos = 0;
        var erros = 0;
        var mensagensErro = [];

        dados.forEach(function(item, index) {
            try {
                console.log('\n--- Item ' + (index + 1) + ' ---');
                console.log('Período:', item.PERIODO, '| Semana:', item.SEMANA);
                
                // ✅ Para Curva de Avanço, não usa NOME_CATEGORIA
                // O identificador é PERIODO + SEMANA
                var jaExiste = verificarIntegracaoExistente(
                    'CURVA_AVANCO', 
                    codColigada, 
                    codPrj, 
                    idPrj, 
                    mes, 
                    ano, 
                    competencia,
                    null  // ← NÃO passa categoria
                );
                
                var operacao = jaExiste ? 'atualizar' : 'incluir';
                console.log('→ Operação:', operacao);

                var desvios = getDesvioInicioTerminoFromTela('CURVA_AVANCO');
                var constraints = [
                    DatasetFactory.createConstraint('OPERACAO', operacao, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('TIPO', 'CURVA_AVANCO', null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('CHAVE', chave, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('PERIODO', item.PERIODO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('PREV_ACC', item.PREV_ACC.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('REPLAN_ACC', item.REPLAN_ACC.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('REAL_ACC', item.REAL_ACC.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('PREV_LB_SEM', item.PREV_LB_SEM.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('REPLAN_SEM', item.REPLAN_SEM.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('REAL_SEM', item.REAL_SEM.toString(), null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('SEMANA', item.SEMANA, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('ANO_CURVA', item.ANO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_INICIO', desvios.DESVIO_INICIO, null, ConstraintType.MUST),
                    DatasetFactory.createConstraint('DESVIO_TERMINO', desvios.DESVIO_TERMINO, null, ConstraintType.MUST),

                ];

                var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
                
                if (!dataset || !dataset.values) {
                    var msg = 'Dataset null/vazio para período ' + item.PERIODO;
                    console.error('❌', msg);
                    mensagensErro.push(msg);
                    erros++;
        } else {
                    console.log('✓ Curva de Avanço salva');
                    sucessos++;
                }
                
            } catch (e) {
                var msg = 'Erro no período ' + item.PERIODO + ': ' + e.message;
                console.error('❌', msg);
                mensagensErro.push(msg);
                erros++;
            }
        });
        
        console.log('\n▶ RESUMO CURVA DE AVANÇO:');
        console.log('✓ Sucessos:', sucessos);
        console.log('❌ Erros:', erros);
        
        return {
            sucesso: erros === 0,
            mensagem: erros === 0 
                ? sucessos + " registro(s) salvos!" 
                : sucessos + " salvos, " + erros + " erro(s)",
            detalhes: { sucessos: sucessos, erros: erros, mensagensErro: mensagensErro }
        };
        
    } catch (error) {
        console.error('❌ Erro crítico:', error);
        return {
            sucesso: false,
            mensagem: 'Erro crítico: ' + error.message,
            detalhes: { sucessos: 0, erros: 1, mensagensErro: [error.message] }
        };
    }
}

