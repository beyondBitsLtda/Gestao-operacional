function setSelectedZoomItem(selectedItem){        
	
	if(selectedItem.inputId =="PROJETO"){
		
		if(centroCustoInativo(selectedItem["CODPRJ"])){

			$("#PROJETO>option").remove();
				
			FLUIGC.toast({
				title: 'Erro: ',
				message: "Esse projeto está com centro de custo inativo e não pode ser importado.",
				type: 'warning'
			});

		} else {

			$("#CODCOLIGADA").val(selectedItem["CODCOLIGADA"]);
			$("#CODFILIAL").val(selectedItem["CODFILIAL"]);
			$("#CODPRJ").val(selectedItem["CODPRJ"]);
			$("#IDPRJ").val(selectedItem["IDPRJ"]);
			$("#DESCPROJETO").val(selectedItem["DESCRICAO_PRJ"]);
			$("#REVISAO").val(selectedItem["REVISAO"]);

			ws.initSession();
		
		}
	
	}
	
}

function removedZoomItem(removedItem){

	if(removedItem.inputId == "PROJETO"){
	
		$("#CODCOLIGADA").val("");
		$("#CODFILIAL").val("");
		$("#CODPRJ").val("");
		$("#IDPRJ").val("");
		$("#DESCPROJETO").val("");
		$("#REVISAO").val("");

		ws.disconnectSession();
		ws.returnClients();

	}
	
}

function setZoomData(instance, value){ 
	
	window[instance].setValue(value); 
	
}