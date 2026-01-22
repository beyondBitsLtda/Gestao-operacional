// =========================================================================
// FUNÇÃO PRINCIPAL - CARREGAR ÚLTIMA INTEGRAÇÃO
// =========================================================================
function carregarUltimaIntegracao(tipo, codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('=== INICIANDO CARREGAMENTO DA ÚLTIMA INTEGRAÇÃO ===');

        // Buscar dados do projeto do zoom (hidden fields)
        var codColigada = getCampo('CODCOLIGADA');
        var codPrj = getCampo('CODPRJ');
        var idPrj = getCampo('IDPRJ');
        
        // Buscar competência atual (exemplo: pode ser ajustado para vir de um campo ou cálculo)
        var competencia = buscarCompetenciaAtual(); // Função auxiliar para obter competência (ex: 'MM/YYYY')
        var partes = competencia.split('/');
        var mes = parseInt(partes[0]);
        var ano = parseInt(partes[1]);
        
        // Validar dados obrigatórios
        if (!codColigada || !codPrj || !idPrj) {
            console.error('Dados do projeto não encontrados');
            FLUIGC.toast({ title: 'Erro', message: 'Selecione um projeto válido.', type: 'danger' });
            return false;
        }
        
        console.log('Projeto:', codPrj, 'Competência:', competencia);
        
        // Carregar dados de cada tabela (chama as funções de consulta e população)
        carregarDadosSSMA(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria);
        carregarDadosHistograma(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria);
        carregarDadosHistogramaAuxiliar(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria);
        carregarDadosInformacoesFisicas(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria);
        carregarDadosCurvaAvanco(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria);
        
        console.log('=== CARREGAMENTO CONCLUÍDO ===');
        
        FLUIGC.toast({
            title: 'Sucesso!',
            message: 'Dados da última integração carregados com sucesso!',
            type: 'success'
        });
        
        return true;
        
    } catch (error) {
        console.error('Erro ao carregar última integração:', error);
        FLUIGC.toast({
            title: 'Erro',
            message: 'Erro ao carregar dados: ' + error.message,
            type: 'danger'
        });
        return false;
    }
}

// =========================================================================
// CARREGAR DADOS SSMA (Consulta dataset e popula tabela ssma-table)
// =========================================================================
function carregarDadosSSMA(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    console.log('\n→ Iniciando carregamento de dados SSMA...');

    const tabela = document.getElementById('ssma-table');
    if (!tabela) {
        console.warn('Tabela ssma-table não encontrada');
        return;
    }

    try {
        const constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', 'SSMA', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST),
        ];

        // Filtro opcional por categoria
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log(`→ Filtrando por categoria: ${nomeCategoria}`);
        }

        console.log('→ Consultando dataset SSMA...');

        const dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);

        if (!dataset?.values?.length) {
            console.log('  ⚠ Nenhum registro SSMA encontrado para os filtros informados');
            return;
        }

        console.log(`  ✓ ${dataset.values.length} registro(s) encontrado(s)`);

        const linhas = tabela.querySelectorAll('tbody tr');

        dataset.values.forEach(registro => {
            const nomeCategoriaRegistro = registro.NOME_CATEGORIA?.trim();
            const meta = registro.META;
            const resultado = registro.RESULTADO;

            // Procura a linha correspondente na tabela pelo label (ex: "Zero Acidente")
            for (const linha of linhas) {
                const label = linha.querySelector('.ssma-label');
                if (label && label.textContent.trim() === nomeCategoriaRegistro) {
                    const inputs = linha.querySelectorAll('.ssma-input');
                    if (inputs.length >= 2) {
                        inputs[0].value = formatarValor(meta);
                        inputs[1].value = formatarValor(resultado);
                        console.log(`  → Preenchido: ${nomeCategoriaRegistro}`);
                    }
                    break;
                }
            }
        });

        console.log('✓ Tabela SSMA populada com sucesso');

    } catch (error) {
        console.error('✗ Erro ao carregar dados SSMA:', error);
        FLUIGC.toast({ title: 'Erro', message: 'Erro ao consultar SSMA: ' + error.message, type: 'danger' });
    }
}

// =========================================================================
// CARREGAR DADOS HISTOGRAMA (Consulta dataset e popula hist-table)
// =========================================================================
function carregarDadosHistograma(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('\n→ Carregando Histograma...');
        
        var constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST)
        ];
        
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log('→ Filtrando por categoria:', nomeCategoria);
        }
        
        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        
        if (!dataset || !dataset.values || dataset.values.length === 0) {
            console.log('  ⚠ Nenhum dado Histograma encontrado');
            return;
        }

        
        console.log('  ✓ Encontrados', dataset.values.length, 'registros Histograma');
        
        var tabela = document.getElementById('hist-table');
        if (!tabela) return;
        
        var linhas = tabela.querySelectorAll('tbody tr');
        
        dataset.values.forEach(function(registro) {
            var nomeCategoriaRegistro = registro.NOME_CATEGORIA?.trim();
            var maoIndireta = registro.MAO_DE_OBRA_INDIRETA || '0';
            var maoDireta = registro.MAO_DE_OBRA_DIRETA || '0';
            var equipamentos = registro.EQUIPAMENTOS || '0';
            var veiculos = registro.VEICULOS || '0';

            linhas.forEach(function(linha) {
                var label = linha.querySelector('.hist-rowhead');
                if (label && label.textContent.trim() === nomeCategoriaRegistro) {
                    var inputs = linha.querySelectorAll('.hist-input');
                    if (inputs.length >= 4) {
                        inputs[0].value = formatarValor(maoIndireta);
                        inputs[1].value = formatarValor(maoDireta);
                        inputs[2].value = formatarValor(equipamentos);
                        inputs[3].value = formatarValor(veiculos);
                    }
                }
            });
        });
        
        console.log('  ✓ Histograma populado');
        
    } catch (error) {
        console.error('  ✗ Erro ao carregar Histograma:', error);
        FLUIGC.toast({ title: 'Erro', message: 'Erro ao consultar Histograma: ' + error.message, type: 'danger' });
    }
}

// =========================================================================
// CARREGAR DADOS HISTOGRAMA AUXILIAR (Consulta dataset e popula hh-table)
// =========================================================================
function carregarDadosHistogramaAuxiliar(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('\n→ Carregando Histograma Auxiliar...');
        
        var constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', 'HISTOGRAMA_AUXILIAR', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST)
        ];
        
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log('→ Filtrando por categoria:', nomeCategoria);
        }
        
        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        
        if (!dataset || !dataset.values || dataset.values.length === 0) {
            console.log('  ⚠ Nenhum dado Histograma Auxiliar encontrado');
            return;
        }
        
        console.log('  ✓ Encontrados', dataset.values.length, 'registros Histograma Auxiliar');
        
        var tabela = document.getElementById('hh-table');
        if (!tabela) return;
        
        dataset.values.forEach(function(registro) {
            var nomeCategoriaRegistro = registro.NOME_CATEGORIA?.trim();
            var valorCategoria = registro.VALOR_CATEGORIA;

            var labels = tabela.querySelectorAll('.hh-label');
            var values = tabela.querySelectorAll('.excel-input');
            
            for (var i = 0; i < labels.length; i++) {
                if (labels[i].textContent.trim() === nomeCategoriaRegistro) {
                    if (values[i]) {
                        values[i].value = formatarNumero(valorCategoria);
                    }
                    break;
                }
            }
        });
        
        console.log('  ✓ Histograma Auxiliar populado');
        
    } catch (error) {
        console.error('  ✗ Erro ao carregar Histograma Auxiliar:', error);
        FLUIGC.toast({ title: 'Erro', message: 'Erro ao consultar Histograma Auxiliar: ' + error.message, type: 'danger' });
    }
}

// =========================================================================
// CARREGAR DADOS INFORMAÇÕES FÍSICAS (Consulta dataset e popula fisico-table)
// =========================================================================
function carregarDadosInformacoesFisicas(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('\n→ Carregando Informações Físicas...');
        
        var constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', 'INFORMACOES_FISICAS', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST)
        ];
        
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log('→ Filtrando por categoria:', nomeCategoria);
        }
        
        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        
        if (!dataset || !dataset.values || dataset.values.length === 0) {
            console.log('  ⚠ Nenhum dado Informações Físicas encontrado');
            return;
        }
        
        console.log('  ✓ Encontrados', dataset.values.length, 'registros Informações Físicas');
        
        var tabela = document.getElementById('fisico-table');
        if (!tabela) return;
        
        var linhas = tabela.querySelectorAll('tbody tr');
        
        dataset.values.forEach(function(registro) {
            var nomeCategoriaRegistro = registro.NOME_CATEGORIA?.trim();
            var inicio = registro.INICIO;
            var termino = registro.TERMINO;
            var avFisico = registro.AV_FISICO;

            linhas.forEach(function(linha) {
                var label = linha.querySelector('.fisico-rowhead');
                if (label && label.textContent.trim() === nomeCategoriaRegistro) {
                    var inputs = linha.querySelectorAll('.excel-input');
                    if (inputs.length >= 3) {
                        inputs[0].value = formatarDataBR(inicio);
                        inputs[1].value = formatarDataBR(termino);
                        inputs[2].value = formatarValor(avFisico);
                    }
                }
            });
        });
        
        console.log('  ✓ Informações Físicas populadas');
        
    } catch (error) {
        console.error('  ✗ Erro ao carregar Informações Físicas:', error);
        FLUIGC.toast({ title: 'Erro', message: 'Erro ao consultar Informações Físicas: ' + error.message, type: 'danger' });
    }
}

// =========================================================================
// CARREGAR DADOS CURVA DE AVANÇO (Consulta dataset e popula curve-table)
// =========================================================================
function carregarDadosCurvaAvanco(codColigada, codPrj, idPrj, mes, ano, competencia, nomeCategoria) {
    try {
        console.log('\n→ Carregando Curva de Avanço...');
        
        var constraints = [
            DatasetFactory.createConstraint('OPERACAO', 'consultar', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('TIPO', 'CURVA_AVANCO', null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODCOLIGADA', codColigada, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('CODPRJ', codPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('IDPRJ', idPrj, null, ConstraintType.MUST),
            DatasetFactory.createConstraint('MES', String(mes), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('ANO', String(ano), null, ConstraintType.MUST),
            DatasetFactory.createConstraint('COMPETENCIA', competencia, null, ConstraintType.MUST)
        ];
        
        if (nomeCategoria) {
            constraints.push(DatasetFactory.createConstraint('NOME_CATEGORIA', nomeCategoria, null, ConstraintType.MUST));
            console.log('→ Filtrando por categoria:', nomeCategoria);
        }
       
        var dataset = DatasetFactory.getDataset('dsgestaoOperacional', null, constraints, null);
        
        if (!dataset || !dataset.values || dataset.values.length === 0) {
            console.log('  ⚠ Nenhum dado Curva de Avanço encontrado');
            return;
        }
        
        console.log('  ✓ Encontrados', dataset.values.length, 'registros Curva de Avanço');
        
        var tabela = document.getElementById('curve-table');
        if (!tabela) return;
        
        var tbody = tabela.querySelector('tbody');
        tbody.innerHTML = ''; // Limpa tabela antes de popular
        
        dataset.values.forEach(function(registro, index) {
            var periodo = registro.PERIODO || '';
            var prevAcc = registro.PREV_ACC;
            var replanAcc = registro.REPLAN_ACC;
            var realAcc = registro.REAL_ACC;
            var prevLbSem = registro.PREV_LB_SEM;
            var replanSem = registro.REPLAN_SEM;
            var realSem = registro.REAL_SEM;
            var anoReg = registro.ANO || '';
            var semana = registro.SEMANA || '';

            var tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td class="curve-rowhead">${periodo}</td>
                <td><input class="curve-input" value="${formatarValor(prevAcc)}"></td>
                <td><input class="curve-input" value="${formatarValor(replanAcc)}"></td>
                <td><input class="curve-input" value="${formatarValor(realAcc)}"></td>
                <td><input class="curve-input" value="${formatarValor(prevLbSem)}"></td>
                <td><input class="curve-input" value="${formatarValor(replanSem)}"></td>
                <td><input class="curve-input" value="${formatarValor(realSem)}"></td>
                <td>
                    <input 
                        class="curve-input-ano" 
                        type="text"
                        list="years-list" 
                        value="${anoReg}"
                        maxlength="4"
                        placeholder="YYYY"
                    >
                </td>
                <td><input class="curve-input" value="${semana}"></td>
            `;
            
            tbody.appendChild(tr);
        });
        
        console.log('  ✓ Curva de Avanço populada');
        
    } catch (error) {
        console.error('  ✗ Erro ao carregar Curva de Avanço:', error);
        FLUIGC.toast({ title: 'Erro', message: 'Erro ao consultar Curva de Avanço: ' + error.message, type: 'danger' });
    }
}

// =========================================================================
// FUNÇÕES AUXILIARES DE FORMATAÇÃO
// =========================================================================
function formatarValor(valor) {
    if (!valor || valor === 'null' || valor === 'undefined') return '';
    
    // Se já tem %, retorna como está
    if (String(valor).includes('%')) return valor;
    
    // Se é número, formata com 2 casas decimais e vírgula
    var num = parseFloat(valor);
    if (!isNaN(num)) {
        return num.toFixed(2).replace('.', ',') + (String(valor).includes('%') ? '%' : '');
    }
    
    return valor;
}

function formatarNumero(valor) {
    if (!valor || valor === 'null' || valor === 'undefined') return '';
    
    var num = parseFloat(valor);
    if (!isNaN(num)) {
        return num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    
    return valor;
}

function formatarDataBR(data) {
    if (!data || data === 'null' || data === 'undefined') return '';
    
    // Se já está em DD/MM/YYYY, retorna
    if (data.includes('/')) return data;
    
    // Converte YYYY-MM-DD para DD/MM/YYYY
    if (data.includes('-')) {
        var partes = data.split('-');
        if (partes.length === 3) {
            return partes[2] + '/' + partes[1] + '/' + partes[0];
        }
    }
    
    return data;
}

// =========================================================================
// FUNÇÃO AUXILIAR: BUSCAR COMPETÊNCIA ATUAL (exemplo, ajuste se necessário)
// =========================================================================
function buscarCompetenciaAtual() {
    // Pode vir de um campo no form ou cálculo baseado na data atual
    var dataAtual = new Date();
    var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    var ano = dataAtual.getFullYear();
    return mes + '/' + ano; // Ex: '01/2026'
}

// =========================================================================
// FUNÇÃO PARA CHAMAR AO INICIAR O FORMULÁRIO
// =========================================================================
function iniciarComDados() {
    // Primeiro faz o processo normal de iniciar (se existir função iniciar())
    if (typeof iniciar === 'function') {
        iniciar();
    }
    
    // Depois carrega os dados da última integração (após 500ms para DOM carregar)
    setTimeout(function() {
        carregarUltimaIntegracao();
    }, 500);
}