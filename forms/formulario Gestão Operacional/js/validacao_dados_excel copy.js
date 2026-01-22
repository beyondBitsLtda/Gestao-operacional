

/**############################################################################################################
 * Arquivo validacao_dados_excel.js
 * - Responsável por aplicar todas as regras de negócio na planilha importada.
 * - Realiza validações de campos obrigatórios, formatos e consistência dos dados.
 * - Implementa máscaras e ajustes necessários para padronização (ex.: IDs, valores monetários).
 * - Trata erros e inconsistências, gerando indicadores para feedback ao usuário.
 *
 * Reuso / Observações:
 * - Certifique-se de que os nomes das colunas e estrutura da planilha estão conforme esperado.
 * - Ajuste as regras de negócio conforme requisitos do sistema (ex.: limites, tipos de dados).
 * * - Pode incluir funções auxiliares para normalização e conversão de valores.
 * - Integra-se com componentes visuais (ex.: badges de erro) e APIs para validação externa.
 * - Modularize regras complexas para facilitar manutenção e testes.
############################################################################################################*/





/**
 * Função isNulo(valor)
 * - Verifica se o valor informado é nulo ou inválido.
 * - Considera como nulo: string vazia (""), undefined, null ou texto "NULL".
 * - Retorna true se for nulo; caso contrário, retorna false.
 *
 * Reuso / Observações:
 * - Útil para validações antes de processar dados.
 * - Pode ser expandida para incluir outros casos (ex.: espaços em branco).
 * - Se quiser padronizar, normalize valor para maiúsculas antes da comparação.
 */


function isNulo(valor){

  if(valor=="" || valor==undefined || valor==null || valor=="NULL")
    return true;
  else
    return false;

}

/**
 * Função isValidMaskId(id)
 * - Formata a competência garantindo o preenchimento de zeros à esquerda.
 * - Verifica se o comprimento do ID original é compatível com o limite estabelecido.
 * - Retorna um valor booleano indicando a validade do campo para a máscara XX/XXXXX.
 * - Prepara a variável 'competencia' para uso posterior em validações de escopo.
 * * Reuso / Observações:
 * - Garante que IDs de 1 ou 2 dígitos recebam o padding correto (Ex: "1" vira "001").
 * - O limite rígido de validação é de até 3 caracteres antes da aplicação da máscara final.
 * - Ajuste o retorno booleano caso a regra de negócio exija formatos maiores que 999.
 * - Esta função é uma etapa de pré-processamento; a barra "/" deve ser inserida na saída final.
 * - Certifique-se de que o parâmetro 'id' possa ser convertido para string com segurança.
 */


function validando_mascara_comp(competencia) { // &nome original &isValidMaskId 
  // Expressão regular: 
  // ^ (início) 
  // \d{2} (exatamente 2 dígitos)
  // \/ (uma barra)
  // \d{5} (exatamente 4 dígitos)
  // $ (fim)
  const regex = /^\d{2}\/\d{4}$/;
  
  return regex.test(competencia);
}

// Exemplos de teste:
console.log(validando_mascara_comp("12/12345")); // true [&PROVISÓRIO - RETIRAR APÓS TESTES]
console.log(validando_mascara_comp("1/12345"));  // false [&PROVISÓRIO - RETIRAR APÓS TESTES]
console.log(validando_mascara_comp("AA/12345")); // false [&PROVISÓRIO - RETIRAR APÓS TESTES]



/**
 * Função formatarMoedaPadrao(num)
 * - Converte valores numéricos para o formato de moeda brasileiro (BRL).
 * - Realiza o tratamento preventivo de erros para entradas que não sejam números ou sejam NaN.
 * - Aplica a regionalização 'pt-BR' para garantir o uso de vírgula como separador decimal.
 * - Define a exibição fixa de 4 casas decimais para precisão em cálculos de impostos.
 * * Reuso / Observações:
 * - Se o valor de entrada for inválido, a função retorna automaticamente "R$ 0,0000".
 * - Utiliza a API nativa Intl.NumberFormat através do método .toLocaleString().
 * - Ideal para colunas de 'Impostos' e 'Custos' que exigem maior detalhamento decimal.
 * - Caso queira reduzir para 2 casas decimais, altere 'minimumFractionDigits' e 'maximumFractionDigits' para 2.
 */

function formatarMoedaPadrao(num) {

  if (typeof num !== 'number' || isNaN(num)) {
    num = 0;
  }

  return num.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4 
  });

}


function avancarIntegracao(){

  console.log("avancarIntegracao");

  if($("#imported-data-body tr").length>1){

    console.dir(validationErrors);
    console.dir(Object.keys(validationErrors).length)

    if(Object.keys(validationErrors).length > 0){

      FLUIGC.toast({
        title: 'Erro: ',
        message: "Não é possível avançar com erros encontrados na planilha importada",
        type: 'warning',
        timeout: 15000 
      });

    } else {

      loading.show();

      setTimeout(function(){

        carregarTableIntegracao();

        $("#selection-menu").hide();
        $(".info-painel").hide();
        $(".importar-planilha").hide();
        $(".table-importacao").hide();
        $(".table-integracao").show();
        $(".metodoPagamento").show();
        $(".rodape-integracao").show();
        $(".metodoPagamento").show();

        loading.hide();

      },500)

    }
    
  } else {

    FLUIGC.toast({
      title: 'Erro: ',
      message: "Não é possível avançar sem realizar a importação da planilha do contrato",
      type: 'warning',
      timeout: 15000 
    });

  }

}


function centroCustoInativo(codprj){

  console.log("centroCustoInativo, codprj: "+codprj);

  var ret = false;
  var constraints = new Array();

  constraints.push(DatasetFactory.createConstraint("CODPRJ",codprj,codprj,ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("OPERACAO","consultar","consultar",ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("TIPO","CentroCustoInativo","CentroCustoInativo",ConstraintType.MUST));

  var dataset = DatasetFactory.getDataset("dsImportacaoPlanilhaContrato",null,constraints,null);
  dataset = dataset.values;

  console.dir(dataset);

  if(dataset.length>0)
    ret = true;

  return ret;

}

function modalErros() {
    console.log("modalErros - Event Listener Iniciado");

    const tableHeader = document.getElementById('header-row');

    if (!tableHeader) return;

    // Remove event listeners antigos para evitar duplicidade (caso a função seja chamada mais de uma vez)
    const novoHeader = tableHeader.cloneNode(true);
    tableHeader.parentNode.replaceChild(novoHeader, tableHeader);

    novoHeader.addEventListener('click', (event) => {
        // Só continua se o clique foi dentro do badge ou no ícone dentro dele
        const badge = event.target.closest('.error-counter-badge');

        if (!badge) return; // Se não clicou no badge, sai da função

        event.stopPropagation();
        event.preventDefault();

        const columnName = badge.getAttribute('data-column-name');
        
        // Filtra os erros globais apenas para esta coluna
        // validationErrors é um objeto, então usamos Object.values para pegar a lista de erros
        const listaErros = Object.values(validationErrors).filter(erro => erro.coluna === columnName);

        if (listaErros.length > 0) {
            console.log(`Erros na coluna ${columnName}:`, listaErros);

            // Monta o conteúdo HTML do Modal dinamicamente
            let htmlConteudo = '<ul class="list-group">';
            
            listaErros.forEach(erro => {
                // Adiciona +1 na linha para ficar amigável ao usuário (Excel começa em 1)
                htmlConteudo += `
                    <li class="list-group-item">
                        <strong>Linha ${erro.linha + 1}:</strong> ${erro.mensagem}
                    </li>`;
            });
            
            htmlConteudo += '</ul>';

            // Abre o modal do Fluig
            FLUIGC.modal({
                title: `Erros encontrados em: ${columnName}`,
                content: htmlConteudo,
                id: 'modal-erros-detalhe',
                size: 'large',
                actions: [{
                    'label': 'Fechar',
                    'autoClose': true
                }]
            });

        } else {
            // Caso o badge esteja visível mas por algum motivo não achou erros no objeto
            FLUIGC.toast({
                title: 'Aviso',
                message: 'Não há detalhes de erros registrados para esta coluna.',
                type: 'info'
            });
        }
    });
}

/**
 * Função handleFileImport (COM VALIDAÇÕES)
 * 
 * OBJETIVO GERAL:
 * - Responsável por ler arquivos Excel (.xlsx, .xls), processar os dados, aplicar validações
 *   de negócio e renderizar o conteúdo em uma tabela HTML interativa.
 * - Implementa um sistema robusto de detecção de erros que destaca células inválidas
 *   sem interromper o processamento completo da planilha.
 * 
 * FLUXO PRINCIPAL:
 * 1. Recebe o arquivo através do evento de input file
 * 2. Lê o arquivo usando FileReader API
 * 3. Converte o Excel em array JSON usando a biblioteca XLSX
 * 4. Localiza automaticamente a linha de cabeçalho
 * 5. Valida cada célula individualmente (competência, campos numéricos, obrigatoriedade)
 * 6. Renderiza os dados na tabela HTML, formatando apenas células válidas
 * 7. Calcula e exibe totalizadores
 * 8. Gera feedback visual sobre erros encontrados
 * 
 * VALIDAÇÕES IMPLEMENTADAS:
 * - Máscara de competência (formato XX/XXXX - ex: 12/2024)
 * - Campos numéricos não podem conter letras
 * - Campos numéricos não podem estar vazios
 * - Campos numéricos não podem ser negativos
 * - Campos numéricos não podem conter caracteres especiais (exceto vírgula/ponto)
 * 
 * SISTEMA DE ERROS:
 * - Cada erro é registrado com identificador único: "linha_X_NomeCampo"
 * - Erros são armazenados no objeto global 'validationErrors'
 * - Células com erro mantêm valor original (sem formatação)
 * - Células válidas recebem formatação de moeda brasileira
 * 
 * DEPENDÊNCIAS:
 * - Biblioteca XLSX.js (leitura de arquivos Excel)
 * - Função validando_mascara_comp() (validação de formato de competência)
 * - Função formatarMoedaPadrao() (formatação BRL com 4 casas decimais)
 * - Função safeParseFloat() (conversão segura de strings para números)
 * 
 * ELEMENTOS HTML ESPERADOS:
 * - #import-feedback (área de mensagens de status)
 * - #imported-data-body (tbody da tabela de dados)
 * - #total-* (elementos para exibição de totalizadores)
 * 
 * @param {Event} event - Evento de mudança do input file contendo o arquivo Excel
 */
function handleFileImport(event) {
    // ========================================================================
    // ETAPA 1: PREPARAÇÃO INICIAL
    // ========================================================================
    
    // Extrai o arquivo do evento (primeiro arquivo selecionado)
    const file = event.target.files[0];

    // Se nenhum arquivo foi selecionado, interrompe a execução
    if (!file) return;

    // Limpa o objeto de erros de validações anteriores
    // Isso garante que erros de importações passadas não persistam
    validationErrors = {};

    // Referências aos elementos HTML que serão manipulados
    const feedbackArea = document.getElementById('import-feedback');
    const tableBody = document.getElementById('imported-data-body');

    // Exibe mensagem de processamento para dar feedback ao usuário
    feedbackArea.innerHTML = `<p class="alert alert-warning">Processando planilha, por favor aguarde...</p>`;
    
    // Exibe mensagem de carregamento na tabela enquanto processa
    tableBody.innerHTML = `<tr><td colspan="10" style="text-align: center;">Carregando dados...</td></tr>`;

    // ========================================================================
    // ETAPA 2: LEITURA DO ARQUIVO
    // ========================================================================
    
    // FileReader é uma API nativa do navegador que lê arquivos locais
    const reader = new FileReader();

    // Define o que acontece quando o arquivo é carregado com sucesso
    reader.onload = (e) => {
        try {
            // ================================================================
            // ETAPA 3: CONVERSÃO DO EXCEL PARA JSON
            // ================================================================
            
            // Converte o resultado da leitura em Uint8Array (formato binário)
            const data = new Uint8Array(e.target.result);
            
            // XLSX.read() parseia o arquivo Excel e cria um objeto workbook
            const workbook = XLSX.read(data, { type: 'array' });

            // Pega o nome da primeira aba da planilha
            const firstSheetName = workbook.SheetNames[0];
            
            // Acessa a primeira aba usando o nome
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Converte a aba em array de arrays (matriz)
            // header: 1 significa que não há cabeçalho pré-definido
            const dataAsArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // ================================================================
            // ETAPA 4: DEFINIÇÃO DAS COLUNAS ESPERADAS
            // ================================================================
            
            // Colunas que aparecerão na interface (UI)
            const uiColumns = [
                "Competência", "Materiais", "Serviços", "Custos Com.", 
                "Seg. Garantia", "Multa", "Com impostos", "Impostos", "Sem Impostos", "Total"
            ];

            // Colunas obrigatórias que devem existir no arquivo Excel
            // (Total não está aqui pois é calculado, não vem do arquivo)
            const requiredSourceColumns = [
                "Competência", "Materiais", "Serviços", "Custos Com.", 
                "Seg. Garantia", "Multa", "Com impostos", "Impostos", "Sem Impostos"
            ];

            // ================================================================
            // ETAPA 5: LOCALIZAÇÃO AUTOMÁTICA DO CABEÇALHO
            // ================================================================
            
            // Alguns arquivos Excel têm linhas vazias ou títulos antes do cabeçalho real
            // Esta busca identifica em qual linha está o cabeçalho verdadeiro
            let headerRowIndex = -1;
            
            // Limita a busca às primeiras 20 linhas (performance)
            for (let i = 0; i < Math.min(dataAsArray.length, 100); i++) {
                // Normaliza as células (remove espaços, converte para string)
                const row = dataAsArray[i].map(cell => typeof cell === 'string' ? cell.trim() : cell);
                
                // Converte tudo para minúsculas para comparação case-insensitive
                const lowercasedRow = row.map(c => typeof c === 'string' ? c.toLowerCase() : c);
                
                // Conta quantas colunas obrigatórias foram encontradas nesta linha
                const matches = requiredSourceColumns.filter(col => lowercasedRow.includes(col.toLowerCase())).length;

                // Se encontrou pelo menos 8 das 9 colunas obrigatórias, considera como cabeçalho
                if (matches >= 8) {
                    headerRowIndex = i;
                    break;
                }
            }

            // Se não encontrou cabeçalho, lança erro e interrompe o processamento
            if (headerRowIndex === -1) {
                throw new Error("Não foi possível localizar a linha de cabeçalho. Verifique se os nomes das colunas estão corretos.");
            }

            // ================================================================
            // ETAPA 6: SEPARAÇÃO DE CABEÇALHO E DADOS
            // ================================================================
            
            // Extrai a linha de cabeçalho e normaliza os valores
            const headerRow = dataAsArray[headerRowIndex].map(h => typeof h === 'string' ? h.trim() : h);
            
            // Pega todas as linhas após o cabeçalho (dados reais)
            const dataRows = dataAsArray.slice(headerRowIndex + 1);

            // ================================================================
            // ETAPA 7: CONVERSÃO PARA OBJETOS JSON
            // ================================================================
            
            // Transforma cada linha em um objeto { "Coluna": valor }
            let jsonData = dataRows.map(row => {
                const obj = {};
                // Para cada cabeçalho, associa o valor correspondente da linha
                headerRow.forEach((h, i) => { 
                    if (h) obj[h] = row[i]; 
                });
                return obj;
            }).filter(obj => {
                // Remove linhas completamente vazias
                if (Object.keys(obj).length === 0) return false;
                
                // Verifica se há pelo menos um valor válido na linha
                const temValorValido = Object.values(obj).some(val => 
                    val !== undefined && val !== null && String(val).trim() !== ''
                );
                return temValorValido;
            });

            // ================================================================
            // ETAPA 8: MAPEAMENTO DE COLUNAS (CASE-INSENSITIVE)
            // ================================================================
            
            // Cria um mapa para encontrar nomes de colunas independente de maiúsculas/minúsculas
            // Exemplo: "COMPETÊNCIA" -> "Competência" (nome real no arquivo)
            const keysFromFile = Object.keys(jsonData[0]);
            const keyMap = {};
            keysFromFile.forEach(k => {
                keyMap[k.toLowerCase().trim()] = k; 
            });

            // ================================================================
            // ETAPA 9: INICIALIZAÇÃO DE VARIÁVEIS DE CONTROLE
            // ================================================================
            
            // Limpa o corpo da tabela para inserir novos dados
            tableBody.innerHTML = '';
            
            // Variáveis para acumular os totalizadores de cada coluna
            let totalComImpostos = 0;
            let totalSemImpostos = 0;
            let totalImpostos = 0;
            let totalMateriais = 0;
            let totalServicos = 0;
            let totalCustosCom = 0;
            let totalSegGarantia = 0;
            let totalMulta = 0;
            let total = 0;

            // ================================================================
            // ETAPA 10: FUNÇÕES AUXILIARES
            // ================================================================
            
            /**
             * Converte valores diversos (string, number) para float de forma segura
             * Trata separadores brasileiros (vírgula) e remove símbolos de moeda
             * 
             * @param {*} val - Valor a ser convertido
             * @returns {number} - Número float ou 0 se inválido
             */
            const safeParseFloat = (val) => {
                // Se já é número, retorna direto
                if (typeof val === 'number') return val;
                
                // Se vazio/nulo, retorna 0
                if (!val) return 0;
                
                // Remove caracteres não numéricos (exceto . , -) e substitui vírgula por ponto
                let cleanStr = String(val).replace(/[^\d.,-]/g, '').replace(',', '.');
                let num = parseFloat(cleanStr);
                
                // Se conversão falhou, retorna 0
                return isNaN(num) ? 0 : num;
            };

            // ================================================================
            // ETAPA 11: FUNÇÕES DE VALIDAÇÃO
            // ================================================================
            
            /**
             * Valida o formato da competência (XX/XXXX)
             * 
             * @param {*} valor - Valor da competência a validar
             * @param {number} rowIndex - Índice da linha (para registro de erro)
             * @returns {boolean} - true se válido, false se inválido
             */
            function validarCompetencia(valor, rowIndex) {
                // Verifica se o campo está vazio
                if (!valor || valor === null || valor === undefined) {
                    registrarErro(rowIndex, 'Competência', 'Campo obrigatório não preenchido');
                    return false;
                }

                const valorStr = String(valor).trim();
                
                // Valida usando regex XX/XXXX (função externa)
                if (!validando_mascara_comp(valorStr)) {
                    registrarErro(rowIndex, 'Competência', `Formato inválido. Use XX/XXXX (ex: 12/2024). Valor encontrado: "${valorStr}"`);
                    return false;
                }

                return true;
            }

            /**
             * Valida campos numéricos (materiais, serviços, impostos, etc.)
             * Verifica: obrigatoriedade, presença de letras, caracteres especiais, negativos
             * 
             * @param {*} valor - Valor a validar
             * @param {string} nomeCampo - Nome da coluna (para mensagens de erro)
             * @param {number} rowIndex - Índice da linha (para registro de erro)
             * @returns {boolean} - true se válido, false se inválido
             */
            function validarCampoNumerico(valor, nomeCampo, rowIndex) {
                // VALIDAÇÃO 1: Campo vazio/nulo
                if (valor === null || valor === undefined || String(valor).trim() === '') {
                    console.log("Valor nulo encontrado em ", nomeCampo, " na linha ", rowIndex);
                    registrarErro(rowIndex, nomeCampo, 'Campo obrigatório não preenchido');
                    return false;
                }

                const valorStr = String(valor).trim();

                // Remove símbolo de moeda para análise do conteúdo
                const valorSemMoeda = valorStr.replace(/R\$/g, '');

                // VALIDAÇÃO 2: Não pode conter letras
                const contemLetras = /[a-zA-Z]/.test(valorSemMoeda);
                if (contemLetras) {
                    registrarErro(rowIndex, nomeCampo, `Contém caracteres inválidos (letras). Valor: "${valorStr}"`);
                    return false;
                }

                // VALIDAÇÃO 3: Não pode conter caracteres especiais (apenas números, ponto e vírgula são permitidos)
                const contemCaracteresEspeciais = /[^0-9.,]/.test(valorSemMoeda);
                if (contemCaracteresEspeciais) {
                    registrarErro(rowIndex, nomeCampo, `Contém caracteres especiais inválidos. Valor: "${valorStr}"`);
                    return false;
                }

                // Tenta converter para número
                const numeroConvertido = safeParseFloat(valorSemMoeda);

                // VALIDAÇÃO 4: Conversão deve resultar em número válido
                if (isNaN(numeroConvertido)) {
                    registrarErro(rowIndex, nomeCampo, `Valor inválido ou não numérico. Valor: "${valorStr}"`);
                    return false;
                }

                // VALIDAÇÃO 5: Não pode ser negativo
                if (numeroConvertido < 0) {
                    registrarErro(rowIndex, nomeCampo, `Valor negativo não permitido. Valor: ${numeroConvertido}`);
                    return false;
                }

                return true;
            }

            /**
             * Registra um erro no objeto global validationErrors
             * Cada erro tem uma chave única baseada em linha + coluna
             * 
             * @param {number} rowIndex - Índice da linha
             * @param {string} coluna - Nome da coluna
             * @param {string} mensagem - Descrição do erro
             */
            function registrarErro(rowIndex, coluna, mensagem) {
                // Cria identificador único: "linha_0_Competência"
                const chaveErro = `linha_${rowIndex}_${coluna}`;
                
                // Só registra se ainda não existe (evita duplicatas)
                if (!validationErrors[chaveErro]) {
                    validationErrors[chaveErro] = {
                        linha: rowIndex,
                        coluna: coluna,
                        mensagem: mensagem
                    };
                }
            }

            /**
             * Verifica se uma célula específica possui erro registrado
             * 
             * @param {number} rowIndex - Índice da linha
             * @param {string} nomeCampo - Nome da coluna
             * @returns {boolean} - true se há erro, false se válido
             */
            function celulaPossuiErro(rowIndex, nomeCampo) {
                const chaveErro = `linha_${rowIndex}_${nomeCampo}`;
                return validationErrors.hasOwnProperty(chaveErro);
            }

            // ================================================================
            // ETAPA 12: LOOP PRINCIPAL - VALIDAÇÃO E RENDERIZAÇÃO
            // ================================================================
            
            // Itera sobre cada linha de dados do JSON
            jsonData.forEach((row, rowIndex) => {
                // Cria elemento <tr> (linha da tabela HTML)
                const tr = document.createElement('tr');

                // ============================================================
                // SUB-ETAPA 12.1: MAPEAMENTO DE COLUNAS DO ARQUIVO
                // ============================================================
                
                // Busca os nomes reais das colunas no arquivo (podem ter variações)
                const keyComImposto = keyMap['com impostos'] || keyMap['valor com impostos'];
                const keySemImposto = keyMap['sem impostos'] || keyMap['valor sem impostos'];
                const keyImpostos = keyMap['impostos'];
                const keyCompetencia = keyMap['competência'] || keyMap['competencia'];
                const keyMateriais = keyMap['materiais'];
                const keyServicos = keyMap['serviços'] || keyMap['servicos'];
                const keyCustosCom = keyMap['custos com.'];
                const keySegGarantia = keyMap['seg. garantia'];
                const keyMulta = keyMap['multa'];

                // ============================================================
                // SUB-ETAPA 12.2: EXECUÇÃO DAS VALIDAÇÕES DA LINHA
                // ============================================================
                
                // Valida competência
                const competenciaValor = row[keyCompetencia];
                validarCompetencia(competenciaValor, rowIndex);

                // Valida todos os campos numéricos
                validarCampoNumerico(row[keyMateriais], 'Materiais', rowIndex);
                validarCampoNumerico(row[keyServicos], 'Serviços', rowIndex);
                validarCampoNumerico(row[keyCustosCom], 'Custos Com.', rowIndex);
                validarCampoNumerico(row[keySegGarantia], 'Seg. Garantia', rowIndex);
                validarCampoNumerico(row[keyMulta], 'Multa', rowIndex);
                validarCampoNumerico(row[keyComImposto], 'Com impostos', rowIndex);
                validarCampoNumerico(row[keyImpostos], 'Impostos', rowIndex);
                validarCampoNumerico(row[keySemImposto], 'Sem Impostos', rowIndex);
            
                // ============================================================
                // SUB-ETAPA 12.3: CONVERSÃO E TOTALIZAÇÃO
                // ============================================================
                
                // Converte todos os valores para número (mesmo que inválidos)
                const vComImposto = safeParseFloat(row[keyComImposto]);
                const vSemImposto = safeParseFloat(row[keySemImposto]);
                const vImpostos = safeParseFloat(row[keyImpostos]);
                const vMateriais = safeParseFloat(row[keyMateriais]);
                const vServicos = safeParseFloat(row[keyServicos]);
                const vCustosCom = safeParseFloat(row[keyCustosCom]);
                const vSegGarantia = safeParseFloat(row[keySegGarantia]);
                const vMulta = safeParseFloat(row[keyMulta]);
                
                // Calcula o total da linha (soma de todos os valores)
                const vTotalLinha = vMateriais + vServicos + vCustosCom + vSegGarantia + vMulta + vImpostos;
                
                // Acumula nos totalizadores gerais
                totalComImpostos += vComImposto;
                totalSemImpostos += vSemImposto;
                totalImpostos += vImpostos;
                totalMateriais += vMateriais;
                totalServicos += vServicos;
                totalCustosCom += vCustosCom;
                totalSegGarantia += vSegGarantia;
                totalMulta += vMulta;
                total += vTotalLinha;

                // ============================================================
                // SUB-ETAPA 12.4: RENDERIZAÇÃO DAS CÉLULAS
                // ============================================================
                
                // Para cada coluna da UI, cria uma célula <td>
                uiColumns.forEach(colName => {
                    const td = document.createElement('td');
                    let cellValue = '';

                    // Se for coluna Total, usa o valor calculado; senão, busca no arquivo
                    if (colName === 'Total') {
                        cellValue = vTotalLinha;
                    } else {
                        const fileKey = keyMap[colName.toLowerCase()];
                        cellValue = row[fileKey];
                    }

                    // Verifica se ESTA CÉLULA ESPECÍFICA tem erro
                    const temErroNestaCelula = celulaPossuiErro(rowIndex, colName);

                    // Aplica formatação baseada no tipo de coluna
                    switch (colName) {
                        case "Total":
                        case "Com impostos":
                        case "Sem Impostos":
                        case "Impostos":
                        case "Multa":
                        case "Materiais":
                        case "Serviços":
                        case "Custos Com.":
                        case "Seg. Garantia":
                            try {
                                // Pega o valor numérico
                                const numVal = (colName === 'Total') ? cellValue : safeParseFloat(cellValue);
                                
                                // ★ LÓGICA CRÍTICA: SÓ FORMATA SE NÃO HOUVER ERRO
                                if (!temErroNestaCelula) {
                                    // Aplica formatação de moeda brasileira (R$ X.XXX,XXXX)
                                    cellValue = (typeof formatarMoedaPadrao !== 'undefined') 
                                        ? formatarMoedaPadrao(numVal) 
                                        : numVal.toFixed(2);
                                } else {
                                    // Mantém o valor ORIGINAL do arquivo se houver erro
                                    // Isso permite que o usuário veja exatamente o que está errado
                                    cellValue = row[keyMap[colName.toLowerCase()]] || cellValue;
                                }
                                
                            } catch (e) {
                                console.warn("Erro formatação", e);
                            }
                            break;
                    }

                    // Define o texto da célula (vazio se null/undefined)
                    td.textContent = (cellValue === null || cellValue === undefined) ? '' : cellValue;
                    
                    // Se há erro, adiciona classe CSS e tooltip com a mensagem
                    if (temErroNestaCelula) {
                        td.classList.add('cell-error'); // Permite estilizar com CSS vermelho
                        const erro = validationErrors[`linha_${rowIndex}_${colName}`];
                        td.title = erro.mensagem; // Tooltip ao passar o mouse
                    }

                    // Adiciona a célula na linha
                    tr.appendChild(td);
                });

                // Adiciona a linha completa na tabela
                tableBody.appendChild(tr);
            });

            // ================================================================
            // ETAPA 13: ATUALIZAÇÃO DOS TOTALIZADORES NA UI
            // ================================================================
            
            // Atualiza os elementos HTML com os totais calculados
            if (document.getElementById('total-com-impostos'))
                document.getElementById('total-com-impostos').textContent = formatarMoedaPadrao(totalComImpostos);

            if (document.getElementById('total-sem-impostos'))
                document.getElementById('total-sem-impostos').textContent = formatarMoedaPadrao(totalSemImpostos);

            if (document.getElementById('total-materiais'))
                document.getElementById('total-materiais').textContent = formatarMoedaPadrao(totalMateriais);

            if (document.getElementById('total-servicos'))
                document.getElementById('total-servicos').textContent = formatarMoedaPadrao(totalServicos);

            if (document.getElementById('total-custos'))
                document.getElementById('total-custos').textContent = formatarMoedaPadrao(totalCustosCom);

            if (document.getElementById('total-garantia'))
                document.getElementById('total-garantia').textContent = formatarMoedaPadrao(totalSegGarantia);
            
            if (document.getElementById('total-multa'))
                document.getElementById('total-multa').textContent = formatarMoedaPadrao(totalMulta);
          
            if (document.getElementById('total-impostos'))
                document.getElementById('total-impostos').textContent = formatarMoedaPadrao(totalImpostos);

            if (document.getElementById('total-geral'))
                document.getElementById('total-geral').textContent = formatarMoedaPadrao(total);

         // ================================================================
            // ETAPA 14: FEEDBACK FINAL AO USUÁRIO
            // ================================================================
            
            // 1. Atualiza os Badges Visuais (NOVO CÓDIGO AQUI)
            atualizarBadgesDeErro();

            // 2. Garante que o listener de clique nos badges esteja ativo
            modalErros(); 

            // Conta quantos erros foram encontrados
            const totalErros = Object.keys(validationErrors).length;
            
            if (totalErros > 0) {
                // Exibe alerta de aviso com contagem de erros
                feedbackArea.innerHTML = `
                    <p class="alert alert-warning">
                        <strong>⚠️ Atenção!</strong> Importação concluída com <strong>${totalErros} erro(s)</strong> encontrado(s). 
                        ${jsonData.length} linhas carregadas.
                        <br>
                        <small>💡 Células com erro estão destacadas em vermelho. Passe o mouse sobre elas para ver os detalhes.</small>
                    </p>
                `;
                
                // Loga os erros no console para debugging
                console.warn('Erros de validação encontrados:', validationErrors);
            } else {
                // Exibe mensagem de sucesso
                feedbackArea.innerHTML = `<p class="alert alert-success">✅ Importação concluída com sucesso! ${jsonData.length} linhas carregadas sem erros.</p>`;
            }

        } catch (error) {
            // ================================================================
            // TRATAMENTO DE ERROS CRÍTICOS
            // ================================================================
            
            // Captura erros fatais (arquivo corrompido, formato inválido, etc.)
            console.error(error);
            feedbackArea.innerHTML = `<p class="alert alert-danger"><strong>Erro ao processar o arquivo:</strong> ${error.message}</p>`;
            
        } finally {
            // ================================================================
            // LIMPEZA FINAL
            // ================================================================
            // ⭐ Chama a função do arquivo externo
            setupTableSorting('imported-data-body');
            
            const compBlock = document.querySelector('.field-with-btn');
            if (compBlock) {
            compBlock.style.display = 'inline-block';
            // Espera 1 frame pra UI terminar de renderizar e então aplica a posição original
            requestAnimationFrame(() => {
                aplicarPosicaoOriginalCompetencia();
            });
            }

            
            // Limpa o valor do input para permitir reimportação do mesmo arquivo
            event.target.value = '';
        }
    };

    // ========================================================================
    // ETAPA FINAL: INICIA A LEITURA DO ARQUIVO
    // ========================================================================
    
    // readAsArrayBuffer() lê o arquivo como buffer binário (ideal para Excel)
    // Quando terminar, dispara o evento reader.onload definido acima
    reader.readAsArrayBuffer(file);
}

function salvarDadosPlanilha() {
    console.log("salvarDadosPlanilha - Iniciando...");
    var idprj = $("#IDPRJ").val();
    var codprj = $("#CODPRJ").val();
    var usuario = $("#USUARIOATUAL").val();
    if (!usuario) {
    usuario = window.parent.WCMAPI.user;
    console.log(idprj, codprj, usuario);   
    }

    // Validação inicial
    if ($("#imported-data-body tr").length <= 0) { 
        FLUIGC.toast({
            title: 'Erro:',
            message: "Não há dados para salvar. Importe a planilha primeiro.",
            type: 'warning',
            timeout: 5000,
            
        }
    );
          return;
    }

    if (Object.keys(validationErrors).length > 0) {
        integrar = false;
        FLUIGC.toast({
            title: 'Erro:',
            message: "Não é possível salvar com erros na planilha. Corrija os erros primeiro.",
            type: 'warning',
            timeout: 5000
        });
        return;
    }

    loading.show();

    var linhas = $("#imported-data-body tr");
    var sucessos = 0;
    var erros = 0;

    linhas.each(function(index) {
        var linha = $(this);
        var colunas = linha.find("td");

        // Extrai os valores de cada coluna
       var competenciaRaw = $(colunas[0]).text();
        var competencia = normalizarCompetencia(competenciaRaw);

        if (!competencia) {
        integrar = false;
        erros++;
        console.error("Competência inválida na linha " + (index + 1) + ": " + competenciaRaw);
        return;
        }
        var materiais = limparValorMonetario($(colunas[1]).text().trim());
        var servicos = limparValorMonetario($(colunas[2]).text().trim());
        var custosCom = limparValorMonetario($(colunas[3]).text().trim());
        var segGarantia = limparValorMonetario($(colunas[4]).text().trim());
        var multa = limparValorMonetario($(colunas[5]).text().trim());
        var comImpostos = limparValorMonetario($(colunas[6]).text().trim());
        var impostos = limparValorMonetario($(colunas[7]).text().trim());
        var semImpostos = limparValorMonetario($(colunas[8]).text().trim());

        // Monta as constraints
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("OPERACAO", "incluir", "incluir", ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("TIPO", "ImportacaoProjecao", "ImportacaoProjecao", ConstraintType.MUST));

        // Outros dados
        constraints.push(DatasetFactory.createConstraint("IDPRJ", idprj, idprj, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("CODPRJ", codprj, codprj, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("USUARIO", usuario, usuario, ConstraintType.MUST));

        // Dados da planilha
        constraints.push(DatasetFactory.createConstraint("COMPETENCIA", competencia, competencia, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("MATERIAIS", materiais, materiais, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("SERVICOS", servicos, servicos, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("CUSTOSCOM", custosCom, custosCom, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("SEGGARANTIA", segGarantia, segGarantia, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("MULTA", multa, multa, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("COMIMPOSTOS", comImpostos, comImpostos, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("IMPOSTOS", impostos, impostos, ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("SEMIMPOSTOS", semImpostos, semImpostos, ConstraintType.MUST));
        

        console.log("Constraints para linha " + (index + 1) + ": ", constraints);

        try {
            // Chama o dataset 
            var dataset = DatasetFactory.getDataset("dsFormularioPadrao", null, constraints, null);

            // Se o dataset vier null/undefined => ERRO
            if (!dataset || !dataset.values) {
                erros++;
                integrar = false;
                console.error("Falha ao salvar linha " + (index + 1) + ": dataset nulo/vazio");
                return;
            }

            // Se o dataset devolveu STATUS=ERRO, exibe o erro real do SQL
            if (dataset.values.length > 0 && dataset.values[0].STATUS === "ERRO") {
                erros++;
                integrar = false;
                console.error("Falha ao salvar linha " + (index + 1) + ": " + dataset.values[0].MENSAGEM);
                return;
            }

            // Se chegou aqui: consideramos sucesso
            sucessos++;
            console.log("Linha " + (index + 1) + " salva/processada com sucesso.");
           

        } catch (e) {
            erros++;
            console.error("Exceção ao salvar linha " + (index + 1) + ": " + e.message);
        }
    });

    loading.hide();

    // Feedback final
    if (erros === 0) {
        integrar = true;
        FLUIGC.toast({
            title: 'Sucesso!',
            message: sucessos + " registro(s) salvos com sucesso!",
            type: 'success',
            timeout: 5000
        });
    } else {
        
        integrar = false;
        FLUIGC.toast({
            title: 'Atenção!',
            message: sucessos + " registro(s) salvos, " + erros + " erro(s) encontrado(s). Verifique o console/log para detalhes.",
            type: 'warning',
            timeout: 9000
        });
    }
}

function normalizarCompetencia(valor) {
  if (valor === null || valor === undefined) return null;

  let s = String(valor).trim();

  // Aceita "M/YYYY" e converte para "0M/YYYY"
  // Ex: "1/2024" -> "01/2024"
  const m1 = s.match(/^(\d{1,2})\/(\d{4})$/);
  if (m1) {
    const mes = m1[1].padStart(2, "0");
    const ano = m1[2];
    s = `${mes}/${ano}`;
  }

  // Valida formato final MM/YYYY e mês 01-12
  if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(s)) return null;

  // Garante exatamente 7 chars (evita espaço no final)
  return s.slice(0, 7);
}


/**
 * Remove formatação de moeda brasileira e retorna apenas o número
 */
function limparValorMonetario(valor) {
    if (!valor) return "0";
    
    // Remove "R$", espaços, pontos de milhar
    var limpo = valor.replace(/R\$/g, '')
                     .replace(/\s/g, '')
                     .replace(/\./g, '')
                     .replace(/,/g, '.'); // Substitui vírgula por ponto
    
    return limpo;
}


