

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

// Função para coletar dados da Curva de Avanço
function coletarDadosCurvaAvanco() {
  // ✅ Se Handsontable estiver ativo, coleta direto dele (fonte de verdade)
  if (window.hotInstance && typeof getCurveData === 'function') {
    const rows = getCurveData(); // vem do handsontable_curve.js
    const dados = rows.map(r => ({
      PERIODO: (r.periodo || '').toString().trim(),
      PREV_ACC: parseFloat(String(r.prevAcc || '').replace('%','').replace(',', '.')) || 0,
      REPLAN_ACC: parseFloat(String(r.replanAcc || '').replace('%','').replace(',', '.')) || 0,
      REAL_ACC: parseFloat(String(r.realAcc || '').replace('%','').replace(',', '.')) || 0,
      PREV_LB_SEM: parseFloat(String(r.prevSem || '').replace('%','').replace(',', '.')) || 0,
      REPLAN_SEM: parseFloat(String(r.replanSem || '').replace('%','').replace(',', '.')) || 0,
      REAL_SEM: parseFloat(String(r.realSem || '').replace('%','').replace(',', '.')) || 0,
      SEMANA: (r.semana || '').toString().trim()
    }));

    console.log('Dados Curva de Avanço coletados (HOT):', dados);
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

  linhas.forEach(function(linha) {
    var periodo = linha.querySelector('.curve-rowhead')?.textContent?.trim() || '';
    var inputs = linha.querySelectorAll('.curve-input');

    dados.push({
      PERIODO: periodo,
      PREV_ACC: parseFloat(inputs[0].value.replace('%', '').replace(',', '.')) || 0,
      REPLAN_ACC: parseFloat(inputs[1].value.replace('%', '').replace(',', '.')) || 0,
      REAL_ACC: parseFloat(inputs[2].value.replace('%', '').replace(',', '.')) || 0,
      PREV_LB_SEM: parseFloat(inputs[3].value.replace('%', '').replace(',', '.')) || 0,
      REPLAN_SEM: parseFloat(inputs[4].value.replace('%', '').replace(',', '.')) || 0,
      REAL_SEM: parseFloat(inputs[5].value.replace('%', '').replace(',', '.')) || 0,
      SEMANA: inputs[6]?.value || ''
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

// Função principal para salvar todos os dados
function salvarDados() {
    try {
        //FLUIGC.loading(window, "Salvando dados...");
        
        // Buscar competência atual
        var competencia = buscarCompetenciaAtual();
        
        // Dados do projeto
        var codColigada = getCampo('CODCOLIGADA');
        var codPrj = getCampo('CODPRJ');
        var idPrj = getCampo('IDPRJ');
        var usuario = getCampo('USUARIOATUAL');
        
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
        
        // Coletar dados de todas as tabelas
        var dadosSSMA = coletarDadosSSMA();
        var dadosHistograma = coletarDadosHistograma();
        var dadosHistogramaAux = coletarDadosHistogramaAuxiliar();
        var dadosInformacoesFisicas = coletarDadosInformacoesFisicas();
        var dadosCurvaAvanco = coletarDadosCurvaAvanco();
        
        var totalRegistros = dadosSSMA.length + dadosHistograma.length + 
                           dadosHistogramaAux.length + dadosInformacoesFisicas.length + 
                           dadosCurvaAvanco.length;
        
        console.log('Total de registros a salvar:', totalRegistros);
        
        // Salvar cada conjunto de dados
        var sucessoSSMA = salvarSSMA(dadosSSMA, codColigada, codPrj, idPrj, mes, ano, competencia, usuario);
        var sucessoHistograma = salvarHistograma(dadosHistograma, codColigada, codPrj, idPrj, mes, ano, competencia, usuario);
        var sucessoHistogramaAux = salvarHistogramaAuxiliar(dadosHistogramaAux, codColigada, codPrj, idPrj, mes, ano, competencia, usuario);
        var sucessoInfoFisicas = salvarInformacoesFisicas(dadosInformacoesFisicas, codColigada, codPrj, idPrj, mes, ano, competencia, usuario);
        var sucessoCurva = salvarCurvaAvanco(dadosCurvaAvanco, codColigada, codPrj, idPrj, mes, ano, competencia, usuario);
        
        FLUIGC.loading(window, '', true);
        
        if (sucessoSSMA && sucessoHistograma && sucessoHistogramaAux && sucessoInfoFisicas && sucessoCurva) {
            FLUIGC.toast({
                title: 'Sucesso!',
                message: 'Todos os dados foram salvos com sucesso!',
                type: 'success'
            });
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

// Função para salvar dados da tabela SSMA
function salvarSSMA(dados, codColigada, codPrj, idPrj, mes, ano, competencia, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado SSMA para salvar');
        return true;
    }
    
    try {
        dados.forEach(function(item) {
            var c1 = DatasetFactory.createConstraint('OPERACAO', 'incluir', null, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint('TIPO', 'SSMA', null, ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST);
            var c4 = DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST);
            var c5 = DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST);
            var c6 = DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST);
            var c7 = DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST);
            var c8 = DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST);
            var c9 = DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST);
            var c10 = DatasetFactory.createConstraint('META', item.META.toString(), null, ConstraintType.MUST);
            var c11 = DatasetFactory.createConstraint('RESULTADO', item.RESULTADO.toString(), null, ConstraintType.MUST);
            var c12 = DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST);
            
            var constraints = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];
            var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
            
            console.log('SSMA salvo:', item.NOME_CATEGORIA);
        });
        
        console.log('Todos os dados SSMA foram salvos');
        return true;
        
    } catch (error) {
        console.error('Erro ao salvar SSMA:', error);
        return false;
    }
}

// Função para salvar dados do Histograma
function salvarHistograma(dados, codColigada, codPrj, idPrj, mes, ano, competencia, usuario) {
    var resultado = {
        sucesso: false,
        mensagem: "",
        detalhes: {
            sucessos: 0,
            erros: 0,
            mensagensErro: []
        }
    };

    if (dados.length === 0) {
        console.log('Nenhum dado Histograma para salvar');
        resultado.sucesso = true;
        resultado.mensagem = "Nenhum dado para salvar";
        return resultado;
    }
    
    try {
        var sucessos = 0;
        var erros = 0;
        var mensagensErro = [];

        console.log("  - Iniciando salvamento de Histograma (" + dados.length + " registros)");

        dados.forEach(function(item, index) {
            try {
                console.log("      - Processando registro " + (index + 1) + " (Categoria: " + item.NOME_CATEGORIA + ")");

                // Monta as constraints
                var c1 = DatasetFactory.createConstraint('OPERACAO', 'incluir', null, ConstraintType.MUST);
                var c2 = DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA', null, ConstraintType.MUST);
                var c3 = DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST);
                var c4 = DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST);
                var c5 = DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST);
                var c6 = DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST);
                var c7 = DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST);
                var c8 = DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST);
                var c9 = DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST);
                var c10 = DatasetFactory.createConstraint('MAO_DE_OBRA_INDIRETA', item.MAO_DE_OBRA_INDIRETA.toString(), null, ConstraintType.MUST);
                var c11 = DatasetFactory.createConstraint('MAO_DE_OBRA_DIRETA', item.MAO_DE_OBRA_DIRETA.toString(), null, ConstraintType.MUST);
                var c12 = DatasetFactory.createConstraint('EQUIPAMENTOS', item.EQUIPAMENTOS.toString(), null, ConstraintType.MUST);
                var c13 = DatasetFactory.createConstraint('VEICULOS', item.VEICULOS.toString(), null, ConstraintType.MUST);
                var c14 = DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST);
                
                var constraints = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14];

                // Chama o dataset
                console.log("      - Chamando dataset para inserir...");
                var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
                
                // Se o dataset vier null/undefined => ERRO
                if (!dataset || !dataset.values) {
                    erros++;
                    var msg = "Falha ao salvar Histograma (Categoria: " + item.NOME_CATEGORIA + "): dataset nulo/vazio";
                    mensagensErro.push(msg);
                    console.error("      ✗ " + msg);
                    return; // Pula para próximo registro
                }

                // Se o dataset devolveu STATUS=ERRO, exibe o erro real do SQL
                if (dataset.values.length > 0 && dataset.values[0].STATUS === "ERRO") {
                    erros++;
                    var msg = "Histograma (Categoria: " + item.NOME_CATEGORIA + "): " + dataset.values[0].MENSAGEM;
                    mensagensErro.push(msg);
                    console.error("      ✗ " + msg);
                    return; // Pula para próximo registro
                }

                // Se chegou aqui: consideramos sucesso
                sucessos++;
                console.log("      ✓ Histograma (Categoria: " + item.NOME_CATEGORIA + ") salvo com sucesso");

            } catch (e) {
                erros++;
                var msg = "Exceção ao salvar Histograma (Categoria: " + item.NOME_CATEGORIA + "): " + (e.message || e);
                mensagensErro.push(msg);
                console.error("      ✗ EXCEÇÃO: " + msg);
            }
        });

        console.log("  - Processamento de Histograma concluído:");
        console.log("    Sucessos:", sucessos);
        console.log("    Erros:", erros);

        // Preenche os detalhes
        resultado.detalhes.sucessos = sucessos;
        resultado.detalhes.erros = erros;
        resultado.detalhes.mensagensErro = mensagensErro;

        // Monta o resultado final
        if (erros === 0) {
            resultado.sucesso = true;
            resultado.mensagem = sucessos + " registro(s) de Histograma salvos com sucesso!";
        } else {
            resultado.sucesso = false;
            resultado.mensagem = sucessos + " registro(s) salvos, " + erros + " erro(s) encontrado(s) no Histograma.\n\nDetalhes:\n" + mensagensErro.join("\n");
        }

        console.log("  ✓ Resultado final Histograma:", resultado.mensagem);
        
        return resultado;

    } catch (e) {
        resultado.sucesso = false;
        resultado.mensagem = "Erro crítico ao salvar Histograma: " + (e.message || e);
        console.error("  ✗ EXCEÇÃO em salvarHistograma:", e);
        return resultado;
    }
}

// Função para salvar dados do Histograma Auxiliar
function salvarHistogramaAuxiliar(dados, codColigada, codPrj, idPrj, mes, ano, competencia, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Histograma Auxiliar para salvar');
        return true;
    }
    
    try {
        dados.forEach(function(item) {
            var c1 = DatasetFactory.createConstraint('OPERACAO', 'incluir', null, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA_AUXILIAR', null, ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST);
            var c4 = DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST);
            var c5 = DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST);
            var c6 = DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST);
            var c7 = DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST);
            var c8 = DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST);
            var c9 = DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST);
            var c10 = DatasetFactory.createConstraint('VALOR_CATEGORIA', item.VALOR_CATEGORIA.toString(), null, ConstraintType.MUST);
            var c11 = DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST);
            
            var constraints = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11];
            var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
            
            console.log('Histograma Auxiliar salvo:', item.NOME_CATEGORIA);
        });
        
        console.log('Todos os dados Histograma Auxiliar foram salvos');
        return true;
        
    } catch (error) {
        console.error('Erro ao salvar Histograma Auxiliar:', error);
        return false;
    }
}

// Função para salvar dados das Informações Físicas
function salvarInformacoesFisicas(dados, codColigada, codPrj, idPrj, mes, ano, competencia, usuario) {
    if (dados.length === 0) {
        console.log('Nenhum dado Informações Físicas para salvar');
        return true;
    }
    
    try {
        dados.forEach(function(item) {
            var c1 = DatasetFactory.createConstraint('OPERACAO', 'incluir', null, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint('TIPO', 'INFORMACOES_FISICAS', null, ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST);
            var c4 = DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST);
            var c5 = DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST);
            var c6 = DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST);
            var c7 = DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST);
            var c8 = DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST);
            var c9 = DatasetFactory.createConstraint('NOME_CATEGORIA', item.NOME_CATEGORIA, null, ConstraintType.MUST);
            var c10 = DatasetFactory.createConstraint('INICIO', item.INICIO || '', null, ConstraintType.MUST);
            var c11 = DatasetFactory.createConstraint('TERMINO', item.TERMINO || '', null, ConstraintType.MUST);
            var c12 = DatasetFactory.createConstraint('AV_FISICO', item.AV_FISICO.toString(), null, ConstraintType.MUST);
            var c13 = DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST);
            
            var constraints = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13];
            var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
            
            console.log('Informações Físicas salvas:', item.NOME_CATEGORIA);
        });
        
        console.log('Todos os dados Informações Físicas foram salvos');
        return true;
        
    } catch (error) {
        console.error('Erro ao salvar Informações Físicas:', error);
        return false;
    }
}

// Função para salvar dados da Curva de Avanço
// Função para salvar dados da Curva de Avanço
function salvarCurvaAvanco(dados, codColigada, codPrj, idPrj, mes, ano, competencia, usuario) {
    var resultado = {
        sucesso: false,
        mensagem: "",
        detalhes: {
            sucessos: 0,
            erros: 0,
            mensagensErro: []
        }
    };

    if (dados.length === 0) {
        console.log('Nenhum dado Curva de Avanço para salvar');
        resultado.sucesso = true;
        resultado.mensagem = "Nenhum dado para salvar";
        return resultado;
    }
    
    try {
        var sucessos = 0;
        var erros = 0;
        var mensagensErro = [];

        console.log("  - Iniciando salvamento de Curva de Avanço (" + dados.length + " registros)");

        dados.forEach(function(item, index) {
            try {
                console.log("      - Processando registro " + (index + 1) + " (Período: " + item.PERIODO + ")");

                // Monta as constraints
                var c1 = DatasetFactory.createConstraint('OPERACAO', 'incluir', null, ConstraintType.MUST);
                var c2 = DatasetFactory.createConstraint('TIPO', 'CURVA_AVANCO', null, ConstraintType.MUST);
                var c3 = DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST);
                var c4 = DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST);
                var c5 = DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST);
                var c6 = DatasetFactory.createConstraint('MES', mes.toString(), null, ConstraintType.MUST);
                var c7 = DatasetFactory.createConstraint('ANO', ano.toString(), null, ConstraintType.MUST);
                var c8 = DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST);
                var c9 = DatasetFactory.createConstraint('PERIODO', item.PERIODO, null, ConstraintType.MUST);
                var c10 = DatasetFactory.createConstraint('PREV_ACC', item.PREV_ACC.toString(), null, ConstraintType.MUST);
                var c11 = DatasetFactory.createConstraint('REPLAN_ACC', item.REPLAN_ACC.toString(), null, ConstraintType.MUST);
                var c12 = DatasetFactory.createConstraint('REAL_ACC', item.REAL_ACC.toString(), null, ConstraintType.MUST);
                var c13 = DatasetFactory.createConstraint('PREV_LB_SEM', item.PREV_LB_SEM.toString(), null, ConstraintType.MUST);
                var c14 = DatasetFactory.createConstraint('REPLAN_SEM', item.REPLAN_SEM.toString(), null, ConstraintType.MUST);
                var c15 = DatasetFactory.createConstraint('REAL_SEM', item.REAL_SEM.toString(), null, ConstraintType.MUST);
                var c16 = DatasetFactory.createConstraint('SEMANA', item.SEMANA, null, ConstraintType.MUST);
                var c17 = DatasetFactory.createConstraint('USUARIO', usuario, null, ConstraintType.MUST);
                
                var constraints = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17];

                // Chama o dataset
                console.log("      - Chamando dataset para inserir...");
                var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
                
                // Se o dataset vier null/undefined => ERRO
                if (!dataset || !dataset.values) {
                    erros++;
                    var msg = "Falha ao salvar Curva de Avanço (Período: " + item.PERIODO + "): dataset nulo/vazio";
                    mensagensErro.push(msg);
                    console.error("      ✗ " + msg);
                    return; // Pula para próximo registro
                }

                // Se o dataset devolveu STATUS=ERRO, exibe o erro real do SQL
                if (dataset.values.length > 0 && dataset.values[0].STATUS === "ERRO") {
                    erros++;
                    var msg = "Curva de Avanço (Período: " + item.PERIODO + "): " + dataset.values[0].MENSAGEM;
                    mensagensErro.push(msg);
                    console.error("      ✗ " + msg);
                    return; // Pula para próximo registro
                }

                // Se chegou aqui: consideramos sucesso
                sucessos++;
                console.log("      ✓ Curva de Avanço (Período: " + item.PERIODO + ") salva com sucesso");

            } catch (e) {
                erros++;
                var msg = "Exceção ao salvar Curva de Avanço (Período: " + item.PERIODO + "): " + (e.message || e);
                mensagensErro.push(msg);
                console.error("      ✗ EXCEÇÃO: " + msg);
            }
        });

        console.log("  - Processamento de Curva de Avanço concluído:");
        console.log("    Sucessos:", sucessos);
        console.log("    Erros:", erros);

        // Preenche os detalhes
        resultado.detalhes.sucessos = sucessos;
        resultado.detalhes.erros = erros;
        resultado.detalhes.mensagensErro = mensagensErro;

        // Monta o resultado final
        if (erros === 0) {
            resultado.sucesso = true;
            resultado.mensagem = sucessos + " registro(s) de Curva de Avanço salvos com sucesso!";
        } else {
            resultado.sucesso = false;
            resultado.mensagem = sucessos + " registro(s) salvos, " + erros + " erro(s) encontrado(s) na Curva de Avanço.\n\nDetalhes:\n" + mensagensErro.join("\n");
        }

        console.log("  ✓ Resultado final Curva de Avanço:", resultado.mensagem);
        
        return resultado;

    } catch (e) {
        resultado.sucesso = false;
        resultado.mensagem = "Erro crítico ao salvar Curva de Avanço: " + (e.message || e);
        console.error("  ✗ EXCEÇÃO em salvarCurvaAvanco:", e);
        return resultado;
    }
}