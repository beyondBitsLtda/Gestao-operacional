function displayFields(form,customHTML){ 
	
	log.info("entrei no displayFields");
	var atv = getValue("WKNumState");
	form.setValue("ATIVIDADE", atv);
	
	var usuario = fluigAPI.getUserService().getCurrent().getLogin();
	form.setValue("USUARIOATUAL",usuario);
	var email = fluigAPI.getUserService().getCurrent().getEmail();
	
	log.info("atv: "+atv+", usuario: "+usuario+", email: "+email);
		
	if(atv=="0" || atv=="4"){
		
		log.info("entrei no if");
		
		form.setValue("EMAIL_SOLICITANTE",email);
		form.setValue("SOLICITANTE",usuario);
		
	}
	
    if( form.getFormMode() == "VIEW" ) {
		 
    	form.setShowDisabledFields(true);
    	
    }
		
}