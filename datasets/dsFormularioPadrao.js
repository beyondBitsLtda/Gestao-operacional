// CONSULTAS PARA O PROCESSO IMPORTAÇÃO DE PLANILHA DE CONTRATO
function createDataset(fields, constraints, sortFields) {

	log.info("dsImportacaoPlanilhaContrato")
	
	var dsNewDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDSRM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
   
    var myQuery = "";
	var competencia = "";
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
    
    if (constraints != null) {

        for (var i = 0; i < constraints.length; i++) {

			
			if(constraints[i].fieldName == "COMPETENCIA"){
				competencia = constraints[i].initialValue;
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
			else if(constraints[i].fieldName == "DESCRICAO_COMPLETA"){
	    		
        		descricaoCompleta = " AND CONCAT(MPRJ.CODPRJ , ' - ' , UPPER(MPRJ.DESCRICAO)) LIKE '%"+constraints[i].initialValue+"%' ";
        	
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
    	
    	if(tipo=="ProjetosLegados"){
    		
    		myQuery = "SELECT "+
			  		  "		OS "+
					  "	FROM  "+
					  "		FLUIG.DBO.ML001255 "+
					  " WHERE "+
					  "		OS='"+codPrj+"' "
    		
    	}
    	
    	if(tipo=="TemIntegracao"){
    		
    		myQuery = "SELECT * FROM ZMDMTAREFA WHERE IDPRJ="+idprj+" ";
    		
    	}
    	
		if(tipo=="TarefasObrigatorias"){
		    		
    		myQuery =   "SELECT "+
						"	FC.CODTRF "+
						" FROM  "+
						"	FLAN F "+
						"	INNER JOIN FLANCOMPL FC ON F.CODCOLIGADA=FC.CODCOLIGADA AND F.IDLAN=FC.IDLAN "+
						" WHERE  "+
						"	F.CODCCUSTO='"+codPrj+"'  "+
						"	AND F.PAGREC=1  "+
						"	AND F.STATUSLAN<>2  "+
						"	AND F.CODTDO NOT IN ('030','075') "+
						"	AND FC.CODTRF IS NOT NULL "
		    			
		}

    	if(tipo=="ProjetoAntigo"){
    		
    		myQuery =   "SELECT "+
						"		F.*  "+
						"	FROM  "+
						"		FLAN F "+
						"	WHERE  "+
						"		F.CODCCUSTO='"+codPrj+"'  "+
						"		AND F.PAGREC=1  "+
						"		AND F.STATUSLAN<>2  "+
						"		AND F.CODTDO NOT IN ('030','075') "+
						"		AND NOT EXISTS(SELECT * FROM ZMDMTAREFA WHERE CODCOLIGADA=F.CODCOLIGADA AND CODPRJ=F.CODCCUSTO) "
						    		
    	}
    	
    	if(tipo=="CentroCustoInativo"){
    		
    		myQuery = 	"SELECT "+
						"	CODCCUSTO "+
						"FROM   "+
						"	GCCUSTO (NOLOCK) "+
						"WHERE   "+
						"	CODCCUSTO='"+codPrj+"' AND ATIVO='F'"
	
    	}

    	if(tipo=="PagamentoTarefa"){
    		
    		myQuery =   "SELECT "+
						"	M.CODCPG, T.NOME, CONCAT(M.CODCPG,' - ',T.NOME) PAGAMENTO "+
						" FROM  "+
						"   MTAREFA M "+
						"	INNER JOIN TCPG T ON T.CODCOLIGADA=M.CODCOLIGADA AND T.CODCPG=M.CODCPG "+
						" WHERE  "+
						"    M.IDPRJ="+idprj+" AND M.IDCENARIO=0 AND M.TIPOPLANILHA=1 AND M.CODTRF='"+codtrf+"'"	
    		
    	}
    	
    	if(tipo=="Tarefa"){
    		
    		myQuery = " SELECT " +
    				  "		* " +
    				  "	FROM " +
    				  "		MTAREFA " +
    				  "	WHERE " +
    				  "		IDPRJ="+idprj+" AND IDCENARIO=0 AND TIPOPLANILHA=1 AND CODTRF='"+codtrf+"'"
    		
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

    	if(tipo=="EventosProjeto"){
    		
    		myQuery = "SELECT * FROM MTAREFA WHERE IDPRJ="+idprj+" AND SERVICO=1 AND IDCENARIO=1"
    		
    	}
    	
    	if(tipo=="Pagamentos"){
    		
    		myQuery = "SELECT CODCPG,NOME, CONCAT(CODCPG,' - ',NOME) PAGAMENTO FROM TCPG WHERE INATIVO=0 AND CODCOLIGADA=1"
    		
    	}
    	
    }
    
    if(operacao=="atualizar"){
    	
    	if(tipo=="BaixarAcessos"){
    		
    		myQuery = "UPDATE FLUIG.DBO.Z_CRM_ACESSOS_FLUXO_CAIXA SET SAIDA=GETDATE() WHERE SAIDA IS NULL AND ATUALIZACAO < DATEADD(MINUTE, -3, GETDATE()) "
    		
    	}

    
    }
    
    if(operacao=="incluir"){
    	
    	
    	if(tipo=="ImportacaoContrato"){
    		
    		myQuery = "INSERT INTO FLUIG.DBO.Z_CRM_IMPORTACAO_CONTRATO (ID,CODCOLIGADA,IDPRJ,CODPRJ," +
    			"	CODTRF,IDTRF,NOME,CODCPG,DESCPG,QUANTIDADE,NOMEGRUPO," +
				"	CODUND,VALORCOMIMPOSTO,VALORSEMIMPOSTO,VALORUNITARIO," +
				"	REVISAO,JUSTIFICATIVA,RECCREATEDBY,RECCREATEDON,RECMODIFIEDBY,RECMODIFIEDON) "+
				" 	VALUES((SELECT ISNULL(MAX(ID),0)+1 FROM FLUIG.DBO.Z_CRM_IMPORTACAO_CONTRATO),"+codColigada+","+idprj+",'"+codPrj+"',"+  
				"	'"+codtrf+"',"+idtrf+",'"+nome+"','"+codcpg+"','"+descpg+"',"+quantidade+",'"+nomeGrupo+"',"+
				"	'"+unidade+"',"+valorComImposto+","+valorSemImposto+","+valorUnitario+","+
				"	'"+revisao+"','"+justificativa+"','"+usuario+"',GETDATE(),'"+usuario+"',GETDATE())"
			
    	}

    	
    }
    
	
			if (operacao == "atualizar") {

				if (tipo == "SalvarProcesso") {

					const tables = [
						"FLUIG.DBO.Z_DELP_SSMA",
						"FLUIG.DBO.Z_DELP_INFORMACOES_FISICAS_FINANCEIRAS",
						"FLUIG.DBO.Z_DELP_HISTOGRAMA_AUXILIAR",
						"FLUIG.DBO.Z_DELP_HISTOGRAMA",
						"FLUIG.DBO.DELP_Z_CURVA_DE_AVANCO"
					];

					const updates = tables.map(t =>
						"UPDATE " + t +
						" SET PROCESSO = " + processo +
						", RECMODIFIEDON = GETDATE()" +
						", RECMODIFIEDBY = '" + usuario + "'" +
						" WHERE IDPRJ = " + idprj +
						" AND CODCOLIGADA = " + codColigada +
						" AND PROCESSO IS NULL"
					).join(";\n");

					myQuery = updates; // Caso queira transactional, posso colocar BEGIN/COMMIT
				}
			}


    
    if(operacao=="procedure"){

    	if(tipo=="Integracao"){
    		
    		myQuery = "{CALL FLUIG.DBO.SP_CRM_FLUXO_CAIXA("+opcao+","+processo+","+idprj+")}"
						    		  
    	}
    	
    	if(tipo=="ConsultaGeral"){
    		
    		myQuery = "{CALL SP_CRM_CONSULTA_FLUXO_CAIXA("+codColigada+","+tipoPlanilha+","+idprj+")}"
						    		
    	}
    	
    }
    
    log.info("tipo: "+tipo+", operacao: "+operacao); 
	
    log.info("dsImportacaoPlanilhaContrato, myQuery: " + myQuery);
    
     try {

		if(operacao=="excluir"){
    
			
   	 if(tipo=="ImportacaoProjecao"){
        
        console.log("EXCLUSÃO: Deletando projeção de custos do projeto: "+codPrj);
        
        myQuery = "DELETE FROM FLUIG.DBO.Z_DELP_PROJECAO_CUSTOS WHERE CODPRJ = '" + codPrj + "'"; 
        
        log.info("SQL DELETE => " + myQuery);
        
        try {
            var conn = ds.getConnection();
            var stmt = conn.createStatement();
            var linhasAfetadas = stmt.executeUpdate(myQuery);
            
            log.info("DELETE executado com sucesso. Linhas afetadas: " + linhasAfetadas);
            
            dsNewDataset.addColumn("STATUS");
            dsNewDataset.addColumn("MENSAGEM");
            dsNewDataset.addColumn("LINHAS_AFETADAS");
            dsNewDataset.addRow(["OK", "Registros deletados com sucesso", linhasAfetadas.toString()]);
            
        } catch (e) {
            log.error("ERRO ao executar DELETE: " + e.message);
            
            dsNewDataset.addColumn("STATUS");
            dsNewDataset.addColumn("MENSAGEM");
            dsNewDataset.addRow(["ERRO", e.message]);
            
        } finally {
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        
        return dsNewDataset;
    }
}
    	
    	 if(operacao=="atualizar"){

			if(tipo=="ImportacaoProjecao"){
				console.log("DELETE PROJECAO DE CUSTOS DO PROJETO: "+codPrj);
			
				myQuery =
				"DELETE FROM FLUIG.DBO.Z_DELP_PROJECAO_CUSTOS " +
				"WHERE CODPRJ = '" + codPrj + "'"; 

				log.info("SQL DELETE => " + myQuery);
				
				try {
					// Executa o DELETE
					var conn = ds.getConnection();
					var stmt = conn.createStatement();
					var linhasAfetadas = stmt.executeUpdate(myQuery);
					
					log.info("DELETE executado com sucesso. Linhas afetadas: " + linhasAfetadas);
					
					// Retorna feedback de sucesso
					dsNewDataset.addColumn("STATUS");
					dsNewDataset.addColumn("MENSAGEM");
					dsNewDataset.addColumn("LINHAS_AFETADAS");
					dsNewDataset.addRow(["OK", "Registros deletados com sucesso", linhasAfetadas.toString()]);
					
				} catch (e) {
					log.error("ERRO ao executar DELETE: " + e.message);
					
					// Retorna erro
					dsNewDataset.addColumn("STATUS");
					dsNewDataset.addColumn("MENSAGEM");
					dsNewDataset.addRow(["ERRO", e.message]);
					
				} finally {
					if (stmt != null) stmt.close();
					if (conn != null) conn.close();
				}
				
				return dsNewDataset;
			}
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

				if (tipo == "ImportacaoProjecao") {

               myQuery =
				"INSERT INTO FLUIG.DBO.Z_DELP_PROJECAO_CUSTOS " +
				"(" +
				"IDPRJ, CODPRJ, COMPETENCIA, " +
				"MATERIAIS, SERVICOS, CUSTOS_COM, SEG_GARANTIA, MULTA, " +
				"COM_IMPOSTOS, IMPOSTOS, SEM_IMPOSTOS, " +
				"RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON" +
				") VALUES (" +
				"'" + idprj + "', " +
				"'" + codPrj + "', " +
				"'" + competencia + "', " +
				materiais + ", " +
				servicos + ", " +
				custosCom + ", " +
				segGarantia + ", " +
				multa + ", " +
				comImpostos + ", " +
				impostos + ", " +
				semImpostos + ", " +
				"'" + usuario + "', " +
				"GETDATE(), " +
				"'" + usuario + "', " +
				"GETDATE()" +
				")";
				log.info("SQL FINAL => " + myQuery);
				

                log.info("dsFormularioPadrao (ImportacaoProjecao), SQL => " + myQuery);

                conn = ds.getConnection();
                stmt = conn.createStatement();

                // execute() / executeUpdate() — tanto faz aqui; executeUpdate é mais semântico
                stmt.executeUpdate(myQuery);

                // Retorno padronizado de sucesso pro front
                dsNewDataset.addColumn("STATUS");
                dsNewDataset.addColumn("MENSAGEM");
                dsNewDataset.addRow(["OK", "Registro inserido com sucesso"]);

                return dsNewDataset;
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