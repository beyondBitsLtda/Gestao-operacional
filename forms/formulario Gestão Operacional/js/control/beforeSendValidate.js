
var loading = FLUIGC.loading(window);

var beforeSendValidate = function (numState, nextState) {

    var atv = String(numState); // atividade atual

    try {

        // ================================================================
        // VALIDAÇÃO NA ATIVIDADE 0 OU 4
        // ================================================================
        if (atv === "0" || atv === "4") {

            var deveSalvar = (String(nextState) === "20");

            // Só valida e salva se for enviar para a atividade 9
            if (deveSalvar) {

                console.log("[beforeSendValidate] Iniciando validações para salvar...");

                // -----------------------------------------------------------
                // 1) Verificar se projeto foi selecionado
                // -----------------------------------------------------------
                var codColigada = $("#CODCOLIGADA").val();
                var codPrj = $("#CODPRJ").val();
                var idPrj = $("#IDPRJ").val();

                if (!codColigada || !codPrj || !idPrj) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Projeto não selecionado',
                        text: 'Selecione um projeto válido antes de avançar.',
                    });
                    return false;
                }

                // -----------------------------------------------------------
                // 2) Verificar se alguma seção foi aberta/ativada
                // -----------------------------------------------------------
                var algumaSecaoVisivel =
                    $("#ssmaContainer:visible").length > 0 ||
                    $("#block-histograma:visible").length > 0 ||
                    $("#block-acompanhamento:visible").length > 0 ||
                    $("#curve-block:visible").length > 0;

                if (!algumaSecaoVisivel) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Nada para salvar',
                        text: 'Abra e preencha ao menos uma seção (SSMA, Histograma, Físico ou Curva) antes de enviar.',
                    });
                    return false;
                }

                // -----------------------------------------------------------
                // 3) Verificar erros de validação existentes
                // -----------------------------------------------------------
                if (typeof validationErrors !== "undefined" &&
                    Object.keys(validationErrors).length > 0) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Erros de validação',
                        text: 'Existem inconsistências nos dados. Corrija antes de prosseguir.',
                    });

                    return false;
                }

                // -----------------------------------------------------------
                // 4) Chamar salvarDados() do integracaoDados.js
                // -----------------------------------------------------------
                console.log("[beforeSendValidate] Chamando salvarDados()...");

                try {
                    if (typeof salvarDados === "function") {
                        salvarDados();
                    } else {
                        throw new Error("Função salvarDados() não encontrada. Verifique se js/integracaoDados.js foi carregado.");
                    }
                } catch (callErr) {
                    console.error("Erro ao executar salvarDados():", callErr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Falha ao salvar',
                        text: 'Ocorreu um erro ao salvar os dados: ' + (callErr.message || callErr),
                    });
                    return false;
                }

                console.log("[beforeSendValidate] Dados salvos com sucesso! Prosseguindo no fluxo...");
                return true;
            }

            // Se não for salvar (não vai para atividade 9), libera
            return true;

        } // fim do IF atividade

        // Se estiver em outra atividade, libera normalmente
        return true;

    } catch (e) {

        console.error("Exceção no beforeSendValidate:", e);

        Swal.fire({
            icon: 'error',
            title: 'Erro inesperado',
            text: e.message || String(e),
        });

        return false;
    }
};
``
