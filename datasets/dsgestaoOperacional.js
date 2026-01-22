// CONSULTAS PARA O PROCESSO IMPORTAÇÃO DE PLANILHA DE CONTRATO
function createDataset(fields, constraints, sortFields) {
	console.log("teste dsgestaoOperacional");

	log.info("dsgestaoOperacional")
	
	var dsNewDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDSRM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
   
    var myQuery = "";
	var competencia = "";
	var chave = "";
	var materiais = ""; 
	var servicos = "";
	var custosCom = "";
	var segGarantia = "";
	var multa = "";
	var comImpostos = "";
	var impostos = "";
	var semImpostos = "";
    var idprj = "";
    var tipo = "";
    var operacao = "";
    var opcao = "";
    var tipoPlanilha = "";
    var chave = "";
    var codColigada = "";
    var codFilial = "";
    var codPrj = "";
    var codtrf = "";
    var idtrf = "";
    var descricao = "";
    var projecao = "";
    var porcentagem = "";
    var data = "";
    var saldo = "";
    var despesa = "";
    var contrato = "";
    var realizado = "";
    var principal = "";
    var valorSC = "";
    var valorOS = "";
    var totalNF = "";
    var valorNF = "";
    var valorUnitario = "";
    var valorComImposto = "";
    var valorSemImposto = "";
    var codcpg = "";
    var descpg = "";
    var projetado = "";
    var projetadoTotal = "";
    var orcadoBase = "";
    var usuario = "";
    var processo = "";
    var editado = "";
    var quantidade = "";
    var descricaoCompleta = "";
    var nome = "";
    var nomeGrupo = "";
    var unidade = "";
    var revisao = "";
    var justificativa = "";
	var competencia = "";
	var mes = "";

	var ano = "";
	var meta = "";
	var resultado = "";
	var nomeCategoria = "";
	var maoObraIndireta = "";
	var maoObraDireta = "";
	var equipamentos = "";
	var veiculos = "";
	var valorCategoria = "";
	var inicio = "";
	var termino = "";
	var avFisico = "";
	var periodo = "";
	var prevAcc = "";
	var replanAcc = "";
	var realAcc = "";
	var prevLbSem = "";
	var replanSem = "";
	var realSem = "";
	var semana = "";
    
    if (constraints != null) {

        for (var i = 0; i < constraints.length; i++) {

			
			if(constraints[i].fieldName == "COMPETENCIA"){
				competencia = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "CHAVE"){
						chave = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "MATERIAIS"){
						materiais = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "SERVICOS"){
						servicos = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "CUSTOSCOM"){
						custosCom = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "SEGGARANTIA"){
						segGarantia = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "MULTA"){
						multa = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "COMIMPOSTOS"){
						comImpostos = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "IMPOSTOS"){
						impostos = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "SEMIMPOSTOS"){
						semImpostos = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "USUARIOATUAL"){
						usuario = constraints[i].initialValue;
					}
					else if(constraints[i].fieldName == "PROCESSO"){
						processo = constraints[i].initialValue;
					}
        	
        	if(constraints[i].fieldName == "OPERACAO"){
        		
        		operacao = constraints[i].initialValue;
        	
        	}    
        	else if(constraints[i].fieldName == "TIPO"){
        		
        		tipo = constraints[i].initialValue;
        	
        	} 
        	else if(constraints[i].fieldName == "OPCAO"){
        		
        		opcao = constraints[i].initialValue;
        	
        	} 
        	else if(constraints[i].fieldName == "CHAVE"){
        		
        		chave = constraints[i].initialValue;
        	
        	} 
        	else if(constraints[i].fieldName == "IDPRJ"){
        		
        		idprj = constraints[i].initialValue;
        	
        	}    
        	else if(constraints[i].fieldName == "TIPOPLANILHA"){
        		
        		tipoPlanilha = constraints[i].initialValue;
        	
        	} 
    		else if(constraints[i].fieldName == "CODCOLIGADA"){
        		
        		codColigada = constraints[i].initialValue;
        	
        	} 
			else if(constraints[i].fieldName == "CODFILIAL"){
        		
        		codFilial = constraints[i].initialValue;
        	
        	} 
			else if(constraints[i].fieldName == "CODPRJ"){
        		
				codPrj = constraints[i].initialValue;
        	
        	} 
			else if(constraints[i].fieldName == "CODTRF"){
        		
				codtrf = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "IDTRF"){
        		
				idtrf = constraints[i].initialValue;
        	
				if(isNulo(idtrf))
					idtrf = "NULL";
				
        	}
			else if(constraints[i].fieldName == "DESCRICAO"){
        		
				descricao = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "DESCPG"){
			        		
				descpg = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "CODCPG"){
				
				codcpg = constraints[i].initialValue;
			
			}
			else if(constraints[i].fieldName == "NOME"){
        		
				nome = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "NOMEGRUPO"){
        		
				nomeGrupo = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "PRINCIPAL"){
        		
				principal = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "PROJECAO"){
        		
				projecao = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REVISAO"){
        		
				revisao = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "JUSTIFICATIVA"){
        		
				justificativa = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "VALORUNITARIO"){
        		
				valorUnitario = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "VALORCOMIMPOSTO"){
			        		
				valorComImposto = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "VALORSEMIMPOSTO"){
				
				valorSemImposto = constraints[i].initialValue;
			
			}
			else if(constraints[i].fieldName == "PORCENTAGEM"){
        		
				porcentagem = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "QUANTIDADE"){
        		
				quantidade = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "DATA"){
        		
				if(isNulo(constraints[i].initialValue))
					data = "NULL";
				else
					data = "'"+constraints[i].initialValue+"'"
        	
        	}
			else if(constraints[i].fieldName == "SALDO"){
        		
				saldo = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "DESPESA"){
        		
				despesa = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "CONTRATO"){
        		
				contrato = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REALIZADO"){
				
				realizado = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REALIZADO_SC"){
	
				valorSC = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REALIZADO_OC"){
				
				valorOC = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REALIZADO_TOTAL"){
				
				totalNF = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "REALIZADO_NF"){
	
				valorNF = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "PROJETADO"){
				
				projetado = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "PROJETADO_TOTAL"){
				
				projetadoTotal = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "ORCADO_BASE"){
							
				orcadoBase = constraints[i].initialValue;
        	
        	}
			else if(constraints[i].fieldName == "USUARIO"){
				
				usuario = constraints[i].initialValue;
			
			}
			else if(constraints[i].fieldName == "PROCESSO"){
				
				processo = constraints[i].initialValue;
			
			}
			else if(constraints[i].fieldName == "EDITADO"){
				
				editado = constraints[i].initialValue;
			
			}
			else if(constraints[i].fieldName == "UNIDADE"){
				
				unidade = constraints[i].initialValue;
			
			}
			
			else if (constraints[i].fieldName == "DESCRICAO_COMPLETA") {
				var term = (constraints[i].initialValue || "").trim();

				if (term) {
					// Escapa aspas simples para não quebrar o SQL: O'Neil -> O''Neil
					var safe = term.replace(/'/g, "''");

					// Usa concatenação com + para maior compatibilidade com SQL Server
					// e somente adiciona o AND quando houver termo
					descricaoCompleta =
						" AND (MPRJ.CODPRJ + ' - ' + UPPER(MPRJ.DESCRICAO)) LIKE '%" + safe + "%' ";
				} else {
					// Se não houver termo, não injeta nada na cláusula WHERE
					descricaoCompleta = "";
				}
			}


			else if(constraints[i].fieldName == "MES"){
			mes = constraints[i].initialValue;

			}
			else if(constraints[i].fieldName == "ANO"){
				ano = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "META"){
				meta = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "RESULTADO"){
				resultado = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "NOME_CATEGORIA"){
				nomeCategoria = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "MAO_DE_OBRA_INDIRETA"){
				maoObraIndireta = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "MAO_DE_OBRA_DIRETA"){
				maoObraDireta = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "EQUIPAMENTOS"){
				equipamentos = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "VEICULOS"){
				veiculos = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "VALOR_CATEGORIA"){
				valorCategoria = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "INICIO"){
				inicio = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "TERMINO"){
				termino = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "AV_FISICO"){
				avFisico = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "PERIODO"){
				periodo = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "PREV_ACC"){
				prevAcc = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "REPLAN_ACC"){
				replanAcc = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "REAL_ACC"){
				realAcc = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "PREV_LB_SEM"){
				prevLbSem = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "REPLAN_SEM"){
				replanSem = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "REAL_SEM"){
				realSem = constraints[i].initialValue;
			}
			else if(constraints[i].fieldName == "SEMANA"){
				semana = constraints[i].initialValue;
			}
        }        
    }  
      
    log.info("operacao: "+operacao+", tipo: "+tipo);
    
    if(operacao == "consultar"){

    	if(tipo=="EmailsGrupo"){
    		
    		myQuery = "SELECT "+
						"	U.EMAIL, U.LOGIN  "+
						"FROM "+
						"	FLUIG.DBO.FDN_GROUPUSERROLE G "+
						"	INNER JOIN FLUIG.DBO.FDN_USERTENANT U ON U.LOGIN=G.LOGIN "+
						"WHERE "+
						"	GROUP_CODE='Contratos'"
    		
    	}
    	
    	
    	
    	if(tipo=="CentroCustoInativo"){
    		
    		myQuery = 	"SELECT "+
						"	CODCCUSTO "+
						"FROM   "+
						"	GCCUSTO (NOLOCK) "+
						"WHERE   "+
						"	CODCCUSTO='"+codPrj+"' AND ATIVO='F'"
	
    	}
    	
    	
    	if(tipo=="Projetos"){
    	
    		myQuery = " SELECT  "+
						"	MPRJ.CODCOLIGADA,   "+
						"	MPRJ.CODFILIAL,   "+
						"	MPRJ.IDPRJ,   "+
						"	MPRJ.CODCCUSTO,   "+
						"	UPPER(MPRJ.DESCRICAO) AS DESCRICAO_PRJ,   "+
						"	MPRJ.CODPRJ AS CODPRJ,   "+
						"	MPRJ.CODPRJ + ' - ' + UPPER(MPRJ.DESCRICAO) DESCRICAO_COMPLETA,   "+
						"	FORMAT((SELECT MIN(DTINICIO) FROM MPERIODO WHERE IDPRJ = MPRJ.IDPRJ), 'dd/MM/yyyy') DATAINICIO,   "+
						"	FORMAT((SELECT MAX(DTFIM) FROM MPERIODO WHERE IDPRJ = MPRJ.IDPRJ), 'dd/MM/yyyy') DATAFIM,   "+
						"	COALESCE((SELECT PPESSOA.NOME FROM PPESSOA (NOLOCK) INNER JOIN GCCUSTO (NOLOCK) ON PPESSOA.CODIGO = GCCUSTO.RESPONSAVEL AND GCCUSTO.CODCCUSTO = MPRJ.CODPRJ), '') USUARIORESPONSAVEL,  "+ 
						"	COALESCE((SELECT PPESSOA.EMAIL FROM PPESSOA (NOLOCK) INNER JOIN GCCUSTO (NOLOCK) ON PPESSOA.CODIGO = GCCUSTO.RESPONSAVEL AND GCCUSTO.CODCCUSTO = MPRJ.CODPRJ), '') EMAILRESPONSAVEL,   "+
						"	COALESCE((SELECT PPESSOA.CODUSUARIO FROM PPESSOA (NOLOCK) INNER JOIN GCCUSTO (NOLOCK) ON PPESSOA.CODIGO = GCCUSTO.RESPONSAVEL AND GCCUSTO.CODCCUSTO = MPRJ.CODPRJ), '') USUARIOFLUIG,  "+
						"	MPRJ.REVISAO "+
						" FROM   "+
						"	MPRJ (NOLOCK)      "+
						"	LEFT JOIN CCUSTOCOMPL (NOLOCK) ON CCUSTOCOMPL.CODCOLIGADA = MPRJ.CODCOLIGADA AND CCUSTOCOMPL.CODCCUSTO = MPRJ.CODCCUSTO  "+
						" WHERE   "+
						"	MPRJ.POSICAO IN (1,4)   "+
						"	AND MPRJ.CODPRJ LIKE '3.%' "+
						//"	AND CCUSTOCOMPL.CLASSIFCCUSTO <> '004'  "+
						descricaoCompleta +
						" GROUP BY   "+
						"	MPRJ.CODCOLIGADA,   "+
						"	MPRJ.CODFILIAL,   "+
						"	MPRJ.IDPRJ,  "+
						"	MPRJ.CODCCUSTO,   "+
						"	MPRJ.CODPRJ,   "+
						"	MPRJ.DESCRICAO,       "+
						"	MPRJ.REVISAO "+
						" ORDER BY  "+
						"	MPRJ.DESCRICAO "
	
    	}


		
			
					if (tipo === "SSMA") {
					var myQuerySelect =
						"SELECT " +
						"META = " + meta + ", " +
						"RESULTADO = " + resultado + ", " +
						"RECMODIFIEDBY, " +
						"RECMODIFIEDON, " +
						"EFETIVADO, " +
						"COLIGADA, " +
						"CODPRJ, " +
						"IDPRJ, " +
						"MES, " +
						"ANO, " +
						"COMPETENCIA, " +
						"NOME_CATEGORIA " +
						"FROM FLUIG.DBO.Z_DELP_SSMA " +
						"WHERE EFETIVADO = 0 " +
						"AND COLIGADA = " + codColigada + " " +
						"AND CODPRJ = '" + codPrj + "' " +
						"AND IDPRJ = " + idprj + " " +
						"AND MES = " + mes + " " +
						"AND ANO = " + ano + " " +
						"AND COMPETENCIA = '" + competencia + "' " +  // mantém o filtro de competência
						filtroCategoria + " " +                         // adiciona o filtro dinâmico
						"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

					log.info("SQL SELECT SSMA => " + myQuerySelect);
					}



			
		
					if (tipo === "INFORMACOES_FISICAS") {
					var inicioSQL = (inicio && inicio !== '') ? "'" + inicio + "'" : "NULL";
					var terminoSQL = (termino && termino !== '') ? "'" + termino + "'" : "NULL";

					var myQuerySelect =
						"SELECT " +
						"INICIO, " +
						"TERMINO, " + 
						"AV_FISICO, " +
						"RECMODIFIEDBY, " +
						"RECMODIFIEDON, " +
						"EFETIVADO, " +
						"COLIGADA, CODPRJ, IDPRJ, MES, ANO, COMPETENCIA, NOME_CATEGORIA " +
						"FROM FLUIG.DBO.Z_DELP_INFORMACOES_FISICAS_FINANCEIRAS " +
						"WHERE EFETIVADO = 0 " +
						"AND COLIGADA = " + codColigada + " " +
						"AND CODPRJ = '" + codPrj + "' " +
						"AND IDPRJ = " + idprj + " " +
						"AND MES = " + mes + " " +
						"AND ANO = " + ano + " " +
						"AND COMPETENCIA = '" + competencia + "' " +  // mantém filtro de competência
						filtroCategoria + " " +                         // adiciona filtro dinâmico
						"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

					log.info("SQL SELECT INFORMACOES_FISICAS => " + myQuerySelect);
					}




				if (tipo === "HISTOGRAMA") {
				var myQuerySelect =
					"SELECT " +
					"MAO_DE_OBRA_INDIRETA, " +
					"MAO_DE_OBRA_DIRETA, " +
					"EQUIPAMENTOS, " +
					"VEICULOS, " +
					"RECMODIFIEDBY, " +
					"RECMODIFIEDON, " +
					"EFETIVADO, " +
					"COLIGADA, CODPRJ, IDPRJ, MES, ANO, COMPETENCIA, NOME_CATEGORIA " +
					"FROM FLUIG.DBO.Z_DELP_HISTOGRAMA " +
					"WHERE EFETIVADO = 0 " +
					"AND COLIGADA = " + codColigada + " " +
					"AND CODPRJ = '" + codPrj + "' " +
					"AND IDPRJ = " + idprj + " " +
					"AND MES = " + mes + " " +
					"AND ANO = " + ano + " " +
					"AND COMPETENCIA = '" + competencia + "' " +  // mantém filtro de competência
					filtroCategoria + " " +                         // adiciona filtro dinâmico
					"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

				log.info("SQL SELECT HISTOGRAMA => " + myQuerySelect);
				}



				
					
				if (tipo === "HISTOGRAMA_AUXILIAR") {
				var myQuerySelect =
					"SELECT " +
					"VALOR_CATEGORIA, " +
					"RECMODIFIEDBY, " +
					"RECMODIFIEDON, " +
					"EFETIVADO, " +
					"COLIGADA, CODPRJ, IDPRJ, MES, ANO, COMPETENCIA, NOME_CATEGORIA " +
					"FROM FLUIG.DBO.Z_DELP_HISTOGRAMA_AUXILIAR " +
					"WHERE EFETIVADO = 0 " +
					"AND COLIGADA = " + codColigada + " " +
					"AND CODPRJ = '" + codPrj + "' " +
					"AND IDPRJ = " + idprj + " " +
					"AND MES = " + mes + " " +
					"AND ANO = " + ano + " " +
					"AND COMPETENCIA = '" + competencia + "' " +  // mantém filtro de competência
					filtroCategoria + " " +                         // adiciona filtro dinâmico
					"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

				log.info("SQL SELECT HISTOGRAMA_AUXILIAR => " + myQuerySelect);
				}



					
					
					if (tipo === "CURVA_AVANCO") {
					var myQuerySelect =
						"SELECT " +
						"PREV_ACC, " +
						"REPLAN_ACC, " +
						"REAL_ACC, " +
						"PREV_LB_SEM, " +
						"REPLAN_SEM, " +
						"REAL_SEM, " +
						"RECMODIFIEDBY, " +
						"RECMODIFIEDON, " +
						"EFETIVADO, " +
						"COLIGADA, CODPRJ, IDPRJ, MES, ANO, COMPETENCIA, PERIODO, SEMANA " +
						"FROM FLUIG.DBO.DELP_Z_CURVA_DE_AVANCO " +
						"WHERE EFETIVADO = 0 " +
						"AND COLIGADA = " + codColigada + " " +
						"AND CODPRJ = '" + codPrj + "' " +
						"AND IDPRJ = " + idprj + " " +
						"AND MES = " + mes + " " +
						"AND ANO = " + ano + " " +
						"AND COMPETENCIA = '" + competencia + "' " +  // mantém filtro de competência
						filtroCategoria + " " +                         // adiciona o filtro dinâmico
						"AND PERIODO = '" + periodo + "' " +
						"AND SEMANA = '" + semana + "'";

					log.info("SQL SELECT CURVA_AVANCO => " + myQuerySelect);
					}

    	
    }



    if(operacao=="atualizar"){

	
				if (tipo == "SSMA") {
					var myQuery =
						"UPDATE FLUIG.DBO.Z_DELP_SSMA SET " +
						"META = " + meta + ", " +
						"RESULTADO = " + resultado + ", " +
						"RECMODIFIEDBY = '" + usuario + "', " +
						"RECMODIFIEDON = GETDATE() " +
						"WHERE EFETIVADO = 0 " +
						"AND COLIGADA = " + codColigada + " " +
						"AND CODPRJ = '" + codPrj + "' " +
						"AND IDPRJ = " + idprj + " " +
						"AND MES = " + mes + " " +
						"AND ANO = " + ano + " " +
						"AND COMPETENCIA = '" + competencia + "' " +
						"AND CHAVE = '" + chave + "' " +
						"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

					log.info("SQL UPDATE SSMA => " + myQuery);
				}

				
				
					if (tipo == "HISTOGRAMA") {
						var myQuery =
							"UPDATE FLUIG.DBO.Z_DELP_HISTOGRAMA SET " +
							"MAO_DE_OBRA_INDIRETA = " + maoObraIndireta + ", " +
							"MAO_DE_OBRA_DIRETA = " + maoObraDireta + ", " +
							"EQUIPAMENTOS = " + equipamentos + ", " +
							"VEICULOS = " + veiculos + ", " +
							"RECMODIFIEDBY = '" + usuario + "', " +
							"RECMODIFIEDON = GETDATE() " +
							"WHERE EFETIVADO = 0 " +
							"AND COLIGADA = " + codColigada + " " +
							"AND CODPRJ = '" + codPrj + "' " +
							"AND IDPRJ = " + idprj + " " +
							"AND MES = " + mes + " " +
							"AND ANO = " + ano + " " +
							"AND COMPETENCIA = '" + competencia + "' " +
							"AND CHAVE = '" + chave + "' " +
							"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

						log.info("SQL UPDATE HISTOGRAMA => " + myQuery);
					}


					
					// ===== UPDATE APENAS QUANDO EFETIVADO = 0 =====
					if (tipo == "HISTOGRAMA_AUXILIAR") {
						var myQuery =
							"UPDATE FLUIG.DBO.Z_DELP_HISTOGRAMA_AUXILIAR SET " +
							"VALOR_CATEGORIA = " + valorCategoria + ", " +
							"RECMODIFIEDBY = '" + usuario + "', " +
							"RECMODIFIEDON = GETDATE() " +
							"WHERE EFETIVADO = 0 " +
							"AND COLIGADA = " + codColigada + " " +
							"AND CODPRJ = '" + codPrj + "' " +
							"AND IDPRJ = " + idprj + " " +
							"AND MES = " + mes + " " +
							"AND ANO = " + ano + " " +
							"AND COMPETENCIA = '" + competencia + "' " +
							"AND CHAVE = '" + chave + "' " +
							"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

						log.info("SQL UPDATE HISTOGRAMA_AUXILIAR => " + myQuery);
					}


					
					if (tipo == "INFORMACOES_FISICAS") {
						var inicioSQL = (inicio && inicio !== '') ? "'" + inicio + "'" : "NULL";
						var terminoSQL = (termino && termino !== '') ? "'" + termino + "'" : "NULL";

						var myQuery =
							"UPDATE FLUIG.DBO.Z_DELP_INFORMACOES_FISICAS_FINANCEIRAS SET " +
							"INICIO = " + inicioSQL + ", " +
							"TERMINO = " + terminoSQL + ", " +
							"AV_FISICO = " + avFisico + ", " +
							"RECMODIFIEDBY = '" + usuario + "', " +
							"RECMODIFIEDON = GETDATE() " +
							"WHERE EFETIVADO = 0 " +
							"AND COLIGADA = " + codColigada + " " +
							"AND CODPRJ = '" + codPrj + "' " +
							"AND IDPRJ = " + idprj + " " +
							"AND MES = " + mes + " " +
							"AND ANO = " + ano + " " +
							"AND COMPETENCIA = '" + competencia + "' " +
							"AND CHAVE = '" + chave + "' " +
							"AND NOME_CATEGORIA = '" + nomeCategoria + "'";

						log.info("SQL UPDATE INFORMACOES_FISICAS => " + myQuery);
					}


					
					if (tipo == "CURVA_AVANCO") {
						var myQuery =
							"UPDATE FLUIG.DBO.DELP_Z_CURVA_DE_AVANCO SET " +
							"PREV_ACC = " + prevAcc + ", " +
							"REPLAN_ACC = " + replanAcc + ", " +
							"REAL_ACC = " + realAcc + ", " +
							"PREV_LB_SEM = " + prevLbSem + ", " +
							"REPLAN_SEM = " + replanSem + ", " +
							"REAL_SEM = " + realSem + ", " +
							"RECMODIFIEDBY = '" + usuario + "', " +
							"RECMODIFIEDON = GETDATE() " +
							"WHERE EFETIVADO = 0 " +
							"AND COLIGADA = " + codColigada + " " +
							"AND CODPRJ = '" + codPrj + "' " +
							"AND IDPRJ = " + idprj + " " +
							"AND MES = " + mes + " " +
							"AND ANO = " + ano + " " +
							"AND COMPETENCIA = '" + competencia + "' " +
							"AND CHAVE = '" + chave + "' " +
							"AND PERIODO = '" + periodo + "' " +
							"AND SEMANA = '" + semana + "'";

						log.info("SQL UPDATE CURVA_AVANCO => " + myQuery);
					}

	}
    
    if(operacao=="incluir"){
    
    // ===== INSERIR DADOS NA TABELA ZMDSSMA =====
    if(tipo=="SSMA"){
            myQuery = "INSERT INTO FLUIG.DBO.Z_DELP_SSMA (" +
                    "COLIGADA, CODPRJ, IDPRJ, MES, ANO, EFETIVADO, " +
                    "RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, " +
                    "COMPETENCIA, CHAVE, NOME_CATEGORIA, META, RESULTADO" +
                    ") VALUES(" +
                    codColigada + "," +
                    "'" + codPrj + "'," +
                    idprj + "," +
                    mes + "," +
                    ano + "," +
                    "0," +
                    "'" + usuario + "'," +
                    "GETDATE()," +
                    "'" + usuario + "'," +
                    "GETDATE()," +
                    "'" + competencia + "'," +
					"'" + chave + "'," +
                    "'" + nomeCategoria + "'," +
                    meta + "," +
                    resultado +
                    ")";
            
            log.info("SQL SSMA => " + myQuery);     
}

    
    // ===== INSERIR DADOS NA TABELA ZMDHISTOGRAMA =====
    if(tipo=="HISTOGRAMA"){
        
            myQuery = "INSERT INTO FLUIG.DBO.Z_DELP_HISTOGRAMA" + "(" +
                      "COLIGADA, CODPRJ, IDPRJ, MES, ANO, EFETIVADO, " +
                      "RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, " +
                      "COMPETENCIA, CHAVE, NOME_CATEGORIA, " +
                      "MAO_DE_OBRA_INDIRETA, MAO_DE_OBRA_DIRETA, EQUIPAMENTOS, VEICULOS" +
                      ") VALUES(" +
                      codColigada + "," +
                      "'" + codPrj + "'," +
                      idprj + "," +
                      mes + "," +
                      ano + "," +
                      "0," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + competencia + "'," +
					  "'" + chave + "'," +
                      "'" + nomeCategoria + "'," +
                      maoObraIndireta + "," +
                      maoObraDireta + "," +
                      equipamentos + "," +
                      veiculos +
                      ")";
    
            log.info("SQL HISTOGRAMA => " + myQuery);
    }
    
    // ===== INSERIR DADOS NA TABELA ZMDHISTOGRAMA_AUXILIAR =====
    if(tipo=="HISTOGRAMA_AUXILIAR"){

            myQuery = "INSERT INTO FLUIG.DBO.Z_DELP_HISTOGRAMA_AUXILIAR (" +
                      "COLIGADA, CODPRJ, IDPRJ, MES, ANO, EFETIVADO, " +
                      "RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, " +
                      "COMPETENCIA, CHAVE, NOME_CATEGORIA, VALOR_CATEGORIA" +
                      ") VALUES(" +
                      codColigada + "," +
                      "'" + codPrj + "'," +
                      idprj + "," +
                      mes + "," +
                      ano + "," +
                      "0," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + competencia + "'," +
					  "'" + chave + "'," +
                      "'" + nomeCategoria + "'," +
                      valorCategoria +
                      ")";
            
            log.info("SQL HISTOGRAMA_AUXILIAR => " + myQuery);
            
    }
    
    // ===== INSERIR DADOS NA TABELA ZMDINFORMACOES_FISICAS_FINANCEIRAS =====
    if(tipo=="INFORMACOES_FISICAS"){
        
            var inicioSQL = (inicio && inicio !== '') ? "'" + inicio + "'" : "NULL";
            var terminoSQL = (termino && termino !== '') ? "'" + termino + "'" : "NULL";
            
            myQuery = "INSERT INTO FLUIG.DBO.Z_DELP_INFORMACOES_FISICAS_FINANCEIRAS (" +
                      "COLIGADA, CODPRJ, IDPRJ, MES, ANO, EFETIVADO, " +
                      "RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, " +
                      "COMPETENCIA, CHAVE, NOME_CATEGORIA, INICIO, TERMINO, AV_FISICO" +
                      ") VALUES(" +
                      codColigada + "," +
                      "'" + codPrj + "'," +
                      idprj + "," +
                      mes + "," +
                      ano + "," +
                      "0," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + competencia + "'," +
					  "'" + chave + "'," +
                      "'" + nomeCategoria + "'," +
                      inicioSQL + "," +
                      terminoSQL + "," +
                      avFisico +
                      ")";
            
            log.info("SQL INFORMACOES_FISICAS => " + myQuery);
            
    }
    
    // ===== INSERIR DADOS NA TABELA ZMDCURVA_DE_AVANCO =====
    if(tipo=="CURVA_AVANCO"){
       
            myQuery = "INSERT INTO FLUIG.DBO.DELP_Z_CURVA_DE_AVANCO (" +
                      "COLIGADA, CODPRJ, IDPRJ, MES, ANO, EFETIVADO, " +
                      "RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, " +
                      "COMPETENCIA, CHAVE, PERIODO, PREV_ACC, REPLAN_ACC, REAL_ACC, " +
                      "PREV_LB_SEM, REPLAN_SEM, REAL_SEM, SEMANA" +
                      ") VALUES(" +
                      codColigada + "," +
                      "'" + codPrj + "'," +
                      idprj + "," +
                      mes + "," +
                      ano + "," +
                      "0," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + usuario + "'," +
                      "GETDATE()," +
                      "'" + competencia + "'," +
					  "'" + chave + "'," +
                      "'" + periodo + "'," +
                      prevAcc + "," +
                      replanAcc + "," +
                      realAcc + "," +
                      prevLbSem + "," +
                      replanSem + "," +
                      realSem + "," +
                      "'" + semana + "'" +
                      ")";
    }


    
	}
			
				if (operacao == "atualizar") {
			if (tipo == "SalvarProcesso") {

				var tables = [
					"FLUIG.DBO.Z_DELP_SSMA",
					"FLUIG.DBO.Z_DELP_INFORMACOES_FISICAS_FINANCEIRAS",
					"FLUIG.DBO.Z_DELP_HISTOGRAMA_AUXILIAR",
					"FLUIG.DBO.Z_DELP_HISTOGRAMA",
					"FLUIG.DBO.DELP_Z_CURVA_DE_AVANCO"
				];

				// 1. Tratamento de Variáveis vindas do afterProcessCreate
				// A variável 'processo' vem da constraint PROCESSO
				// A variável 'chav
				// e' vem da constraint CHAVE
				// A variável 'usuario' vem da constraint USUARIO
				
				var pProcesso = (processo == null || processo == undefined) ? "NULL" : "'" + processo + "'";
				var pChave    = (chave == null || chave == undefined) ? "" : chave;
				
				// Verifica se temos o dado mínimo para o WHERE (A Chave)
				if (pChave === "") {
					throw "ERRO: A CHAVE identificadora não foi informada. Query cancelada.";
				}

				var usuarioSafe = (usuario + "").replace(/'/g, "''"); // Proteção simples contra SQL Injection no nome

				var parts = [];
				for (var i = 0; i < tables.length; i++) {
					var t = tables[i];
					
					// 2. Construção da Query usando a CHAVE
					// Substituímos o WHERE IDPRJ/CODCOLIGADA pelo WHERE CHAVE
					
					var updateSql =
						"UPDATE " + t +
						" SET PROCESSO = " + pProcesso +
						", RECMODIFIEDON = GETDATE()" +
						", RECMODIFIEDBY = '" + usuarioSafe + "'" +
						" WHERE CHAVE = '" + pChave + "'" +   // <--- Aqui está a alteração principal
						" AND PROCESSO IS NULL"; // Mantivemos para garantir que só atualize se ainda não tiver processo
					
					parts.push(updateSql);
				}

				// Junta todos os updates
				myQuery = parts.join(";\n") + ";";

				log.info("dsgestaoOperacional - SQL gerado (Por Chave):\n" + myQuery);
				
				// Aqui você executaria o myQuery no banco...
			}
		}

    
    if(operacao=="procedure"){

    	if(tipo=="Integracao"){
    		
    		myQuery = "{CALL SP_GESTAO_OPERACIONAL_INTEGRACAO("+processo+","+idprj+")}"
						    		  
    	}
    	
    	if(tipo=="ConsultaGeral"){
    		
    		myQuery = "{CALL SP_CRM_CONSULTA_FLUXO_CAIXA("+codColigada+","+tipoPlanilha+","+idprj+")}"
						    		
    	}
    	
    }
    
   log.info("dsgestaoOperacional, myQuery: " + myQuery);
    
     try {
    	
    	 if(operacao=="delete"){
    	        
         	log.info("vou atualizar...");
         	
         	var conn = ds.getConnection();
            var stmt = conn.createStatement();
            var rs
         	
         	log.info("vou executar com execute");
         	
 	        rs = stmt.execute(myQuery);

         }

		  if(operacao=="atualizar"){
    	        
         	log.info("vou atualizar...");
         	
         	var conn = ds.getConnection();
            var stmt = conn.createStatement();
            var rs
         	
         	log.info("vou executar com execute");
         	
 	        rs = stmt.execute(myQuery);

         }
    	 
    	 
    	if(operacao=="consultar"){
    		
    		var conn = ds.getConnection();
            var stmt = conn.createStatement();
            var rs = stmt.executeQuery(myQuery);
            
            var columnCount = rs.getMetaData().getColumnCount();
            
            while (rs.next()) {
            	
                if (!created) {
                	
                    for (var i = 1; i <= columnCount; i++) {
                    	
                    	dsNewDataset.addColumn(rs.getMetaData().getColumnName(i));
                    	
                    }
                    
                    created = true;
                    
                }
                
                var Arr = new Array();
                
                for (var i = 1; i <= columnCount; i++) {
                	
                    var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                    
                    if (null != obj) {
                    	
                        Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                        
                    } else {
                    	
                        Arr[i - 1] = "null";
                        
                    }
                    
                }
                
                dsNewDataset.addRow(Arr);
                
            }
    		
    	}
    	
    	if(operacao=="incluir"){
    		
        	log.info("vou incluir...");

        	var conn = ds.getConnection();
            var stmt = conn.createStatement();
            var rs
        	
        	var myQuer
			yP = myQuery
        	
	        rs = stmt.execute(myQuery);
	    
	    	 if (stmt != null) {
	         	
	             stmt.close();
	             
	         }
	         
	         if (conn != null) {
	         	
	             conn.close();
	             
	         }
        
        }
    	
    	if(operacao=="procedure"){
    		
			log.info("vou executar a procedure ...");

            var conn = ds.getConnection();
            var stmt = conn.prepareCall(myQuery);
            
            var hasResults = stmt.execute();

            while (hasResults || stmt.getUpdateCount() != -1) {
                if (hasResults) {
                    rs = stmt.getResultSet();
                    var columnCount = rs.getMetaData().getColumnCount();

                    if (!created) {
                        for (var i = 1; i <= columnCount; i++) {
                        	dsNewDataset.addColumn(rs.getMetaData().getColumnName(i));
                        }
                        created = true;
                    }

                    while (rs.next()) {
                        var Arr = new Array();
                        for (var i = 1; i <= columnCount; i++) {
                            var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                            if (null != obj) {
                                Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                            } else {
                                Arr[i - 1] = "null";
                            }
                        }
                        dsNewDataset.addRow(Arr);
                    }
                } else {
                    if (stmt.getUpdateCount() == -1) {
                        break;
                    }
                }
                hasResults = stmt.getMoreResults();
            }

    	}
    	
    } catch (e) {
        
    	log.error("ERRO==============> " + e.message);
    
    } finally {
    	
        if (stmt != null) {
        	
            stmt.close();
            
        }
        
        if (conn != null) {
        	
            conn.close();
            
        }
        
    }
    
    return dsNewDataset;
	
}

function isNulo(valor){
	
	if(valor=="" || valor==undefined || valor==null){
	
		return true;
	
	}else{
	
		return false;
	
	}
	
}