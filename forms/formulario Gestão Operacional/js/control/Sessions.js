var ws;

consts = {
  status: null,
  type: null,
  session: null,
};

function getSocket(){
  return ws;
}
 
function LockSession(state){
  console.log(FLUIGC.switcher.getState('#LOCKSESSION'),state)

  if(state){
    Swal.fire({
      title: 'Confirma fechar sessão',
      text: 'Todos os outros usuários serão desconectados',
      icon: 'question',
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      cancelButtonColor: '#d33',

    }).then(function(result){

      if(result.isConfirmed){
        ws.lockSession()
      }
      else{
        FLUIGC.switcher.setFalse('#LOCKSESSION')
      }
    
    })
  }
  else{
    ws.openSession()
  }

}

function TornarAdministrador(login){
  Swal.fire({
    title: 'Confirma tornar usuário um administrador',
    icon: 'question',
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    cancelButtonColor: '#d33',

  }).then(function(result){

    if(result.isConfirmed){
      ws.setCreator(login)
    }
  
  })
}


function DesconectarUsuario(login){
  Swal.fire({
    title: 'Confirma desconectar usuário',
    icon: 'question',
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    cancelButtonColor: '#d33',

  }).then(function(result){

    if(result.isConfirmed){
      ws.deleteClient(login)
    }
  
  })

}

function AbreBarraLateral(obj){
  if( $("#containerRightBar").is(":visible")){
    $("#containerRightBar").hide()
  }
  else{
    ws.returnClients()
    $("#containerRightBar").show()
  }

}

class Client {

  constructor() {
    this.login = window.parent.WCMAPI.userLogin;
    this.name = window.parent.WCMAPI.user;
    this.clients = 0;
    this.admin = '';
    this.spectate = 'false';
  }

  getKey() {
    let numOS = $("#CODPRJ").val();
    return "FORMULARIOMODELO;;;"+numOS
  }

  hasKey(){
    let numOS = $("#CODPRJ").val();
    if(numOS=="" || numOS==undefined || numOS==null){
      return false;
    }else{
      return false;
    }
  }

  async init() {
    await new Promise((resolve,reject) => {
      try {

        if(parent.window.WCMAPI.serverURL.search('5031')!=-1){
          this.socket = new WebSocket("ws://delp5031:8081");
        }
        else{
          this.socket = new WebSocket("ws://delp5013:8081");
        }

        this.socket.addEventListener("error", (event) => {
          console.error(event);
          		// EXIBE ALERTA
          loading.hide()
          Swal.fire({
            
            title: 'Erro na comunicação com o servidor',
            text: 'A página será recarregada em seguida',
            icon: 'error',
            allowEscapeKey: true,
            allowOutsideClick: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',

          }).then(function(result){

            window.location.reload()
          
          })

        });

        this.socket.addEventListener("message", (event) => {
          //console.log(event.data)
          let data = this.JsonParse(event.data);
          this.ResolveServer(data);
        });

        this.socket.addEventListener("close", (event) => {
          console.error(event);
          loading.hide()
          Swal.fire({
            
            title: 'Seu usuário foi desconectado da sessão',
            text: 'A página será recarregada em seguida',
            icon: 'error',
            allowEscapeKey: true,
            allowOutsideClick: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',

          }).then(function(result){

            window.location.reload()
          
          })
        });

        this.socket.addEventListener("open", (event) => {
          this.socket.send(
            JSON.stringify({
              action: "returnConst",
            })
          );
          this.autenticate()

        });

        resolve(true);

      } catch (error) {
        console.error(error);
      }
    });
  }

  close(){
    this.socket.close()
  }

  autenticate(){
    this.socket.send(
      JSON.stringify({
        "action": "autenticate",
        "login": this.login,
        "name": this.name,
        "spectate": this.spectate
      })
    );
  }

  disconnectSession(){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "disconnectSession"
      })
    );
  }

  initSession() {
    try {
      this.socket.send(
        JSON.stringify({
          "key": this.getKey(),
          "action": "initSession",
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  notifySession(title,message) {
    this.socket.send(
      JSON.stringify({
        "type": consts.type.action,
        "title": title,
        "message": message,
        "status": consts.status.ok,
        "action": "notifySession",
      })
    );
  }

  execScript(message){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.action,
        "title": "execScript",
        "message": message.toString(),
        "status": consts.status.ok,
        "action": "execScript",
      })
    );
  }

  returnSessions() {
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "returnSessions",
      })
    );
  }

  setCreator(login) {
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "setCreator",
        "login" : login
      })
    );
  }

  returnClients() {
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "returnClients",
      })
    );
  }

  lockSession(){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "lockSession",
      })
    );
  }

  openSession(){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "openSession",
      })
    );
  }

  deleteClient(login){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "deleteClient",
        "targetLogin": login,
      })
    );
  }

  closeSession(){
    this.socket.send(
      JSON.stringify({
        "type": consts.type.info,
        "status": consts.status.ok,
        "action": "closeSession",
      })
    );
  }


  ResolveServer(data) {

    try{
      let message = data?.body?.message;
      let action = message?.action;

      switch (action) {
        case "returnConst":
          this.assignConsts(message.content);
          //console.log("Processado", data);
          break;
        case "await":
          //console.log("Processando...", data,message.content);
          break;
        case "error":
          console.error("Erro do socket", data,message.content);
          if(message.critical){
            loading.hide()
            Swal.fire({
              
              title: 'Erro na comunicação com o servidor',
              text: message.content+',a página será recarregada em seguida',
              icon: 'error',
              allowEscapeKey: true,
              allowOutsideClick: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',

            }).then(function(result){

              window.location.reload()
              
            })
          }else{
            Toast.fire({
              icon: "error",
              title: message.content,
            });
          }
          break;
        case "notifySession":
              this.resolveNotify(message)
              break;
        case "execScript":
              this.resolveExecScript(message)
              break;
        case 'initSession':
              this.resolveInitSession(data)
              break;
        case 'autenticate':
              loading.hide()
              $("#PANEL1").show()
              break;
        case 'returnClients':
              this.ResolveReturnClients(data)
              break;
        case 'addClient':
              this.ResolveNewClient(data)
              break;
        case 'newCreator':
              this.ResolveNewCreator(data)
              break;
        case 'deleteClient':
              this.ResolveDeleteClient(data)
              break;
        case 'lockSession':
              this.ResolveLockSession(data)
              break;
        case 'openSession':
              this.ResolveOpenSession(data)
              break;
        default:
          //console.log("Processado - " + action, data,message.content);
      }
    }
    catch(e){
      console.log(e)
    }
  }

  ResolveDeleteClient(data){
    console.log(data)
    let message = data?.body?.message
    let content = message?.content
    let client = message?.client?.login
    this.clients = Number(content)
    Swal.fire({
      title: 'Usuário desconectado',
       html: `<div class="user-notification"><div class="img-thumbnail pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right fs-border-light-gray">
      <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${client}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
    </div> ${client} </div>`,
      target: '#custom-target',
      customClass: {
        container: 'position-absolute'
      },icon:'error',
      toast: true,
      position: 'bottom-start',
      timer: 5000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInRight'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight'
      }
    })
    this.returnClients()
  }

  ResolveNewCreator(data){
    console.log(data)
    let message = data?.body?.message
    let content = message?.content
    let creator = message?.client
    this.clients = Number(content)
    this.creator=creator?.login
    if(this.creator==this.login && !this.spectate){
      Swal.fire({
        title: 'Você se tornou administrador da sessão',
        target: '#custom-target',
        customClass: {
          container: 'position-absolute'
        },icon:'info',
        toast: true,
        position: 'center',
        timer: 5000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInRight'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutRight'
        }
      })
    }else{
      Swal.fire({
        title: 'Novo administrador',
        html: `<div class="user-notification"><div class="img-thumbnail pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right fs-border-light-gray">
        <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${this.creator}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
      </div> ${this.creator} </div>`,
        target: '#custom-target',
        customClass: {
          container: 'position-absolute'
        },icon:'info',
        toast: true,
        position: 'bottom-start',
        timer: 5000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInRight'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutRight'
        }
      })
    }
    this.returnClients()

  }

  ResolveNewClient(data){
    console.log(data)
    let message = data?.body?.message
    let content = message?.content
    let client = message?.client?.login
    this.clients = Number(content)
    Swal.fire({
      title: 'Novo Usuário conectado',
       html: `<div class="user-notification"><div class="img-thumbnail pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right fs-border-light-gray">
      <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${client}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
    </div> ${client} </div>`,
      target: '#custom-target',
      customClass: {
        container: 'position-absolute'
      },icon:'info',
      toast: true,
      position: 'bottom-start',
      timer: 5000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInRight'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight'
      }
    })
    this.returnClients()
  }

  ResolveOpenSession(data){
    Swal.fire({
      title: 'Sessão aberta para outros usuários',
       html: `<div class="user-notification"><div class="img-thumbnail pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right fs-border-light-gray">
      <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${this.creator}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
    </div> ${this.creator} </div>`,
      target: '#custom-target',
      customClass: {
        container: 'position-absolute'
      },icon:'success',
      toast: true,
      position: 'bottom-start',
      timer: 5000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInRight'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight'
      }
    })

    FLUIGC.switcher.destroy('#LOCKSESSION');

    FLUIGC.switcher.init('#LOCKSESSION');
  
    FLUIGC.switcher.setFalse('#LOCKSESSION')

    FLUIGC.switcher.onChange('#LOCKSESSION', function(event, state){
      LockSession(state)
    });

  }

  ResolveLockSession(data){
    Swal.fire({
      title: 'Sessão fechada para outros usuários',
       html: `<div class="user-notification"><div class="img-thumbnail pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right fs-border-light-gray">
      <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${this.creator}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
    </div> ${this.creator} </div>`,
      target: '#custom-target',
      customClass: {
        container: 'position-absolute'
      },icon:'error',
      toast: true,
      position: 'bottom-start',
      timer: 5000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInRight'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight'
      }
    })

    FLUIGC.switcher.destroy('#LOCKSESSION');

    FLUIGC.switcher.init('#LOCKSESSION');
  
    FLUIGC.switcher.setTrue('#LOCKSESSION')

    FLUIGC.switcher.onChange('#LOCKSESSION', function(event, state){
      LockSession(state)
    });
  

  }

  resolveInitSession(data){
    let title = data?.body?.title;
    let message = data?.body?.message;
    let content = message?.content;

    if(title=="Sucesso"){
      //loading.show();
      ws.lockSession();
      this.creator=message.creator;
      this.returnClients();
    }else{
      loading.hide()
      Swal.fire({
        
        title: 'Não foi possível conectar à sessão',
        icon: 'error',
        allowEscapeKey: true,
        allowOutsideClick: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok',

      }).then(function(result){

        window.location.reload()

      })
    }
  }

  ResolveReturnClients(data){
    console.log(data)
    let message = data?.body?.message
    let content = message?.content
    this.clients=content.length;

    $("#divRightBar").empty()

    let html = "<div class='list-user-side'>"

    for(let i=0;i<this.clients;i++){

      let client = content[i]

      html += ` <div class="node card" user="${client.login}">
        <div class="media">
          <div class="pull-left fs-no-padding fs-overflow-hidden fs-no-top-right-radius fs-no-bottom-right-radius fs-no-border-right">
            <img class="fluig-style-guide thumb-profile thumb-profile-sm" src="/social/api/rest/social/image/profile/${client.login}/X_SMALL_PICTURE" data-image-size="X_SMALL_PICTURE" data-update-image-profile="rafael.granja">
          </div>
          <div class="media-body">
            <h4 class="media-heading">${client.login==this.creator && !client.spectate ? 'Adiministrador' : 'Usuário' } 
            <button class="span-options dropdown-toggle"  data-toggle="dropdown"><i class="flaticon flaticon-drag-n-drop icon-md" aria-hidden="true"></i></button>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#" onclick="TornarAdministrador('${client.login}')">Tornar administrador</a></li>
                <li class="divider"></li>
                <li><a href="#"  onclick="DesconectarUsuario('${client.login}')">Desconectar Usuário</a></li>
            </ul>
            </h4>
            <p>${client.login}</p>
          </div>
        </div>
      </div> `
      
    }

    html+="</div>"

    $("#divRightBar").append(html)

  }

  resolveNotify(message){
    Toast.fire({
      icon: "info",
      title: message.content,
    });
  }

  resolveExecScript(message){
    try{
      let a = new AsyncFunction(message.content)
      a();
    }
    catch(e){
      console.log(e)
    }
  }

  assignConsts(object) {
    for (let a in object) {
      consts[a] = object[a];
    }
  }

  JsonParse(string) {

    return JSON.parse(string)

  }
}


addEventListener("beforeunload", (event) => {
  ws.disconnectSession()
});