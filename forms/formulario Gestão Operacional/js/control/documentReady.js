// Cria um overlay de "loading" do FLUIG

var loading = FLUIGC.loading(window);


// Quando o DOM estiver pronto, executa async

$(document).ready(async function(){

	var atv = $("#ATIVIDADE").val();

	var numProcesso = $("#NUMPROCESSO").val();
	var idprj = $("#IDPRJ").val();
	var codColigada = $("#CODCOLIGADA").val();
	var codFilial = $("#CODFILIAL").val();
	var usuario = $("#USUARIOATUAL").val();
	$("#CHAVE").val(gerarChaveUnica());
	console.log("Chave única definida no input CHAVE: "+$("#CHAVE").val());
	console.log("Atividade: "+atv+", Processo: "+numProcesso+", IdPrj: "+idprj+", CodColigada: "+codColigada+", CodFilial: "+codFilial+", Usuario: "+usuario);
	

// Atraso de 500ms para inicializações assíncronas/depender de renderização

    setTimeout(async function(){
		console.log("DOM pronto");

		/*$('.dropdown-trigger').dropdown({closeOnClick:false,coverTrigger:false});
		$('.tabs').tabs();
		$('.modal').modal();
		//$('.collapsible').collapsible();

		FLUIGC.rightbar({content: '',fixed:true});
		$("#containerRightBar").hide();

		FLUIGC.switcher.init('#LOCKSESSION');
		FLUIGC.switcher.setTrue('#LOCKSESSION');

		FLUIGC.switcher.onChange('#LOCKSESSION', function(event, state){
			LockSession(state);
		});

		FLUIGC.switcher.disable("#LOCKSESSION");*/

		// Instancia e inicializa um cliente (provável wrapper de WebService/WS)
		ws = new Client(); /* provisorio */
		await ws.init(); /* provisorio */
		
	},500)
	
});


//SCRIPT PARA BLOQUEAR USO DO INSPECIONAR PARA USUÀRIOS QUE NÂO SÂO ADMIN
/**
* Retorna as roles do usuário logado atualmente
* @param cod O código do usuário
* @returns O nome do usuário logado que está cadastrado no Fluig
*/


function retornaArrayRole(){

	var array = new Array();
// Fallback para userCode do Fluig se o input não estiver presente/preenchido
 	var usuario = $("#CODUSUARIOATUAL").val();
	if(usuario==null || usuario == "" || usuario == undefined){

		usuario = window.parent.window.WCMAPI.userCode
		console.log(window.parent.window.WCMAPI.userCode)
	}
	//console.log(usuario)
	var c1 = DatasetFactory.createConstraint("CODIGO", usuario, usuario, ConstraintType.MUST);
	var constraints = new Array(c1);
	var dataset = DatasetFactory.getDataset("dsRoleUsuario", null, constraints, null);

	var row = dataset.values
	var count = row.length

	for (var i = 0; i < count; i++) {
		
		var rep = row[i]
		
		array.push(rep["ROLE_CODE"])
		
	}

	return array;

}
window.parent.window.addEventListener("contextmenu", function(e) {
	//console.log("Tentou inspecionar")
	var roles = retornaArrayRole()
	if(!roles.includes("admin")){
		e.preventDefault();
		return false;
	}
});

window.addEventListener("contextmenu", function(e) {
	//console.log("Tentou inspecionar")
	var roles = retornaArrayRole()
	if(!roles.includes("admin")){
		e.preventDefault();
		return false;
	}
});


window.parent.window.addEventListener('keydown', function(event){

	//console.log("Tentou inspecionar")

	event = event || window.event;
	var code = (event.key==null || event.key==undefined || event.key=="" ) ? event.which : event.key;
	if (
		(event.ctrlKey &&
		(code === 'u' || code === 'U' || code === 's' || code === 'S')) || code==='F12' 
	) {

		var roles = retornaArrayRole()
		if(!roles.includes("admin")){

			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
			return false;

		}
	}
	

});

window.addEventListener('keydown', function(event){

	//console.log("Tentou inspecionar")

	event = event || window.event;
	var code = (event.key==null || event.key==undefined || event.key=="" ) ? event.which : event.key;
	if (
		(event.ctrlKey &&
		(code === 'u' || code === 'U' || code === 's' || code === 'S')) || code==='F12' 
	) {

		var roles = retornaArrayRole()
		if(!roles.includes("admin")){

			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
			return false;

		}
	}
	

});

if(window.parent.window.attachEvent!=undefined) {
	window.parent.window.attachEvent("oncontextmenu", function(e) {
		//console.log("Tentou inspecionar")
		var roles = retornaArrayRole()
		if(!roles.includes("admin")){
			e = e || window.event;
			e.returnValue = false;
			return false;
		}
	});

	window.attachEvent("oncontextmenu", function(e) {
		//console.log("Tentou inspecionar")
		var roles = retornaArrayRole()
		if(!roles.includes("admin")){
			e = e || window.event;
			e.returnValue = false;
			return false;
		}
	});

	window.parent.window.attachEvent('onkeydown', function(event){

		//console.log("Tentou inspecionar")
		event = event || window.event;
		var code = (event.key==null || event.key==undefined || event.key=="" ) ? event.which : event.key;
		if (
			(event.ctrlKey &&
			(code === 'u' || code === 'U' || code === 's' || code === 'S')) || code==='F12' //83 = S, 85 = U
		) {
			var roles = retornaArrayRole()
			if(!roles.includes("admin")){
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
				return false;
			}
		}

	});


	window.attachEvent('onkeydown', function(event){

		//console.log("Tentou inspecionar")
		event = event || window.event;
		var code = (event.key==null || event.key==undefined || event.key=="" ) ? event.which : event.key;
		if (
			(event.ctrlKey &&
			(code === 'u' || code === 'U' || code === 's' || code === 'S')) || code==='F12' //83 = S, 85 = U
		) {
			var roles = retornaArrayRole()
			if(!roles.includes("admin")){
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
				return false;
			}
		}

	});
}
