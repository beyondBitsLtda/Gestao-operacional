function createDataset(fields, constraints, sortFields) {

	var dsNewDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDSRM";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
             
    log.info("DATASET dsCancelamentoDeOP - INICIADO");
    
    var myQuery = "";
    var operacao = "";
    var tipo = "";
	var codOrdem = "";
    var codOrdemProc  = "";

    
    if (constraints != null) {
    	
        for (var i = 0; i < constraints.length; i++) {
			// log.info("Constraint: " + constraints[i].fieldName + " = " + constraints[i].initialValue); // Log para debug de constraints
        	
			if(constraints[i].fieldName == "NUMPROCESSO"){
        		numProcess = constraints[i].initialValue;
			}

        	if(constraints[i].fieldName == "OPERACAO"){
        		operacao = constraints[i].initialValue;
			}

			if(constraints[i].fieldName == "TIPO"){
				tipo = constraints[i].initialValue;
			}
			
            if (constraints[i].fieldName == "CODORDEM") {
                var valorCst = constraints[i].initialValue;
                
                if (valorCst != "" && valorCst != null && valorCst != "undefined" && valorCst != "null") {
                    
                    // Verifica se é a lista de OPs já selecionadas (contém aspas ou o separador #)
                    if (valorCst.indexOf("#") > -1 || valorCst.indexOf("'") > -1) {
                        var listaFormatada = valorCst.split("#").join(",");
                        codOrdem = " AND I.CODORDEM IN (" + listaFormatada + ")";
                    } 
                    else {
                        codOrdem = " AND I.CODORDEM LIKE '%" + valorCst + "%'";
                    }
                }
            }

            if (constraints[i].fieldName == "CODORDEMPROC") {

                var valorCst = constraints[i].initialValue;

                if (valorCst != "" && valorCst != null && valorCst != "undefined" && valorCst != "null") {

                    // Remove qualquer aspa simples que venha da constraint antes de processar
                    valorCst = String(valorCst).replace(/'/g, ""); 
                    
                    // Verifica se é uma lista separada por # (agora sem se preocupar com aspas)
                    if (valorCst.indexOf("#") > -1) {
                        // Troca o # por virgula para mandar para o SQL
                        codOrdemProc = valorCst.split("#").join(",");
                    } 
                    else {
                        codOrdemProc = valorCst;
                    }
                }
            }
		}

    }  

	
	log.info("DATASET dsCancelamentoDeOP - Operacao: " + operacao + ", Tipo: " + tipo + ",  Ordem: " + codOrdem );

    if(operacao=="consultar"){
    		
                    var myQuery = " SELECT TOP 500 " +
                                " I.CODCOLIGADA, " +
                                " I.CODORDEM, " +
                                " KO.DSCORDEM, " +
                                " I.STATUS AS STATUS_ITEM, " +
                                " (SELECT TOP 1 STATUS FROM KATVORDEM WHERE CODCOLIGADA = I.CODCOLIGADA AND CODFILIAL = I.CODFILIAL AND CODORDEM = I.CODORDEM) AS STATUS_ATIVIDADE, " +
                                " ISNULL((SELECT TOP 1 '1' FROM KATVORDEMMP WHERE CODCOLIGADA = I.CODCOLIGADA AND CODFILIAL = I.CODFILIAL AND CODORDEM = I.CODORDEM AND EFETIVADO = 1), '0') AS EFETIVADO, " +
                                " KO.STATUS AS STATUS_OP, " +
                                " KL.NUMEXEC, " +
                                " CASE WHEN ZD.CODORDEM IS NOT NULL THEN '1' ELSE '0' END AS TEM_PLANO_CORTE " +
                                " FROM KITEMORDEM I " +
                                " INNER JOIN KORDEM KO ON I.CODCOLIGADA = KO.CODCOLIGADA AND I.CODFILIAL = KO.CODFILIAL AND I.CODORDEM = KO.CODORDEM " +
                                " INNER JOIN KORDEMCOMPL KL ON KL.CODCOLIGADA = I.CODCOLIGADA AND KL.CODFILIAL = I.CODFILIAL AND KL.CODORDEM = I.CODORDEM " +
                                " LEFT JOIN FLUIG.DBO.Z_DELP_NECESSIDADEPAPC ZD ON I.CODCOLIGADA = ZD.CODCOLIGADA AND I.CODFILIAL = ZD.CODFILIAL AND I.CODORDEM = ZD.CODORDEM " + 
                                " WHERE 1=1 " +
                                " AND I.RECMODIFIEDON >= '2022-01-01' " + 
                                codOrdem;
    	
	}

	if(operacao=="procedure"){
		
		if(tipo=="cancelaop"){
			
			myQuery="{call dbo.SP_CRM_CANCELAOP('"+codOrdemProc+"')}"
			
		}
		
	}

    
	log.info("DATASET dsCancelamentoDeOP - Query final: " + myQuery);
    			    
    try {
    	
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
		var rs;

		if(operacao=="consultar"){

			rs = stmt.executeQuery(myQuery);
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

		if(operacao=="procedure"){
      
         	log.info("vou executar a procedure ...");

            if (stmt != null) {
             
                stmt.close();
                
            }
            
            if (conn != null) {
             
                conn.close();
                
            }
            
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
        
    	log.error("DATASET dsCancelamentoDeOP - ERRO NA EXECUÇÃO DA QUERY: " + e.message);
        log.error("DATASET dsCancelamentoDeOP - Query que causou o erro: " + myQuery);
    
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

	if(valor=="" || valor==null || valor==undefined || valor=="null")
		return true;
	else
		return false;

}