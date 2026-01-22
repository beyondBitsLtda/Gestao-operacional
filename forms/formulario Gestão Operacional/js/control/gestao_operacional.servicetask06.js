/**
 * ServiceTask 6 - Backend Fluig (Rhino)
 * Valida dados do formulário (sem DOM/jQuery) usando hAPI.getCardValue
 *
 * Notificações:
 *  - log.info com contexto
 *  - grava ERRO_INTEGRACAO com o resumo
 *  - throw para abortar a task
 */
function servicetask6(attempt, message) {
    var erros = [];

    // IDs existem no seu HTML (hidden inputs). :contentReference[oaicite:1]{index=1}
    var numProcesso = safeGet("NUMPROCESSO", "N/D");
    var chave = safeGet("CHAVE", "N/D");

    log.info("=== [VALIDACAO INICIAL] Processo: " + numProcesso + " | Chave: " + chave + " ===");

    // ------------------------------------------------------------------
    // 1) Validar PROJETO
    // Campos existem no HTML como hidden. :contentReference[oaicite:2]{index=2}
    // ------------------------------------------------------------------
    var codColigada = safeGet("CODCOLIGADA", "");
    var codPrj = safeGet("CODPRJ", "");
    var idPrj = safeGet("IDPRJ", "");

    if (isEmpty(codColigada) || isEmpty(codPrj) || isEmpty(idPrj)) {
        erros.push("Projeto não selecionado ou inválido. (CODCOLIGADA/CODPRJ/IDPRJ)");
        log.info("[ERRO] Projeto inválido: CODCOLIGADA=" + codColigada + " CODPRJ=" + codPrj + " IDPRJ=" + idPrj);
    }

    // ------------------------------------------------------------------
    // 2) Validar “alguma seção preenchida”
    // No seu HTML NÃO há pai-filho; então validamos por presença de conteúdo
    // em campos chave de cada seção. :contentReference[oaicite:3]{index=3}
    // ------------------------------------------------------------------
    var ssmaPreenchido = anyFilled([
        "zeroAcidente", "zeroAcidenteResultado",
        "nroPOC", "nroPOCResultado",
        "ifsMeta", "ifsResultado",
        "ipsMeta", "ipsResultado",
        "nInformes", "nInformesResultado",
        "diasSemAcidentesMeta", "diasSemAcidentesResultado",
        "iplMeta", "iplResultado"
    ]);

    // Acompanhamento físico (campos do fisico-table). :contentReference[oaicite:4]{index=4}
    var fisicoPreenchido = anyFilled([
        "previstoLB", "previstoLBTermino", "previstoLBPercentual",
        "Tendencia", "TendenciaTermino", "TendenciaPercentual",
        "realizadoLB", "realizadoLBTermino", "realizadoLBPercentual",
        "desvioLB", "desvioLBTermino", "desvioLBPercentual"
    ]);

    // Histograma (atenção: alguns nomes repetem em outras seções no seu HTML). :contentReference[oaicite:5]{index=5}
    var histogramaPreenchido = anyFilled([
        "previstoLBDireta", "previstoLBEquipamentos", "previstoLBVeiculos",
        "realLB", "realLBDireta", "realLBEquipamentos", "realLBVeiculos",
        "desvioLBDireta", "desvioLBEquipamentos", "desvioLBVeiculos"
    ]);

    // Curva (campos da curva). :contentReference[oaicite:6]{index=6}
    var curvaPreenchida = anyFilled([
        "curveprevacc", "curverepplanacc", "curverealacc",
        "curveprevlbsem", "curvereplansem", "curverealsem",
        "curveANO", "curvesemana",
        "curveprevblock", "curverepplanblock", "curverealblock",
        "curveANO2", "curvesemana2"
    ]);

    if (!(ssmaPreenchido || fisicoPreenchido || histogramaPreenchido || curvaPreenchida)) {
        erros.push("Nenhuma seção está preenchida: SSMA, Histograma, Físico ou Curva.");
        log.info("[ERRO] Nenhuma seção com campos preenchidos.");
    }

    // ------------------------------------------------------------------
    // 3) Validar erros globais (se o front gravar no card)
    // Se você ainda não grava isso, pode ignorar sem problemas.
    // ------------------------------------------------------------------
    var validationErrorsJson = safeGet("VALIDATION_ERRORS_JSON", "");
    if (!isEmpty(validationErrorsJson)) {
        var qtd = countJsonKeys(validationErrorsJson);
        if (qtd > 0) {
            erros.push("Existem " + qtd + " erro(s) de validação nos dados importados.");
            log.info("[ERRO] VALIDATION_ERRORS_JSON contém " + qtd + " erro(s).");
        }
    }

    // ------------------------------------------------------------------
    // 4) Validar SSMA (campos reais do HTML)
    // - No front você validava #VALOR! e vazio.
    // ------------------------------------------------------------------
    // Mapeamento: [label, metaField, resultadoField]
    var ssmaCampos = [
        ["Zero Acidente", "zeroAcidente", "zeroAcidenteResultado"],
        ["Nº POC", "nroPOC", "nroPOCResultado"],
        ["IFS", "ifsMeta", "ifsResultado"],
        ["IPS", "ipsMeta", "ipsResultado"],
        ["Nº Informes \"A\"", "nInformes", "nInformesResultado"],
        ["Dias Sem Acidentes", "diasSemAcidentesMeta", "diasSemAcidentesResultado"],
        ["IPL", "iplMeta", "iplResultado"]
    ];

    // Só valida SSMA se houver “sinal” de preenchimento
    if (ssmaPreenchido) {
        for (var i = 0; i < ssmaCampos.length; i++) {
            var label = ssmaCampos[i][0];
            var metaField = ssmaCampos[i][1];
            var resField = ssmaCampos[i][2];

            var meta = safeGet(metaField, "");
            var res = safeGet(resField, "");

            if (isInvalidValue(meta)) {
                erros.push("SSMA → Campo META inválido na categoria: " + label);
            }
            if (isInvalidValue(res)) {
                erros.push("SSMA → Campo RESULTADO inválido na categoria: " + label);
            }
        }
    }

   

    // ------------------------------------------------------------------
    // RESULTADO + NOTIFICAÇÕES
    // ------------------------------------------------------------------
    if (erros.length > 0) {
        log.info("=== [VALIDACAO] ERROS ENCONTRADOS (" + erros.length + ") ===");
        for (var e = 0; e < erros.length; e++) {
            log.info(" - " + erros[e]);
        }

        // Grava para exibir em outras etapas/avisos
        try {
            hAPI.setCardValue("ERRO_INTEGRACAO", erros.join(" | "));
            hAPI.setCardValue("AVISO_INTEGRACAO", "VALIDACAO FALHOU - veja ERRO_INTEGRACAO");
        } catch (ex) {
            log.info("[WARN] Falha ao setar ERRO_INTEGRACAO/AVISO_INTEGRACAO: " + ex);
        }

        // Aborta a Service Task
        throw "[VALIDACAO] " + erros.join(" | ");
    }

    // Limpa avisos se passou
    try {
        hAPI.setCardValue("ERRO_INTEGRACAO", "");
        hAPI.setCardValue("AVISO_INTEGRACAO", "");
    } catch (ex2) {
        log.info("[WARN] Falha ao limpar ERRO_INTEGRACAO/AVISO_INTEGRACAO: " + ex2);
    }

    log.info("=== [VALIDACAO] Nenhum erro encontrado. ===");
    return true;

    // -----------------------
    // Helpers internos
    // -----------------------
    function validarCurvaGrupo(titulo, fields) {
        for (var i = 0; i < fields.length; i++) {
            var f = fields[i];
            var v = safeGet(f, "");
            if (isInvalidValue(v)) {
                erros.push(titulo + " → Valor inválido no campo: " + f);
            }
        }
    }
}

/* =========================
 * Helpers (Rhino-safe)
 * ========================= */

function safeGet(field, defaultValue) {
    try {
        var v = hAPI.getCardValue(field);
        if (v === null || v === undefined || v === "") return defaultValue;
        return String(v);
    } catch (e) {
        return defaultValue;
    }
}

function isEmpty(v) {
    return (v === null || v === undefined || String(v).trim() === "" || String(v).toLowerCase() === "null");
}

function isInvalidValue(v) {
    if (isEmpty(v)) return true;
    var s = String(v).trim();
    return (s === "" || s === "#VALOR!" || s === "#VALUE!");
}

function anyFilled(fields) {
    for (var i = 0; i < fields.length; i++) {
        var v = safeGet(fields[i], "");
        if (!isEmpty(v) && !isInvalidValue(v)) return true;
    }
    return false;
}

function countJsonKeys(jsonText) {
    try {
        var obj = JSON.parse(String(jsonText));
        if (obj === null || obj === undefined) return 0;

        if (Object.prototype.toString.call(obj) === "[object Array]") {
            return obj.length;
        }
        var keys = Object.keys(obj);
        return keys ? keys.length : 0;
    } catch (e) {
        return isEmpty(jsonText) ? 0 : 1;
    }
}