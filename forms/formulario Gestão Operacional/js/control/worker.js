var server;

self.onmessage = async function(e){

    if(e.data.function=="verificaErros"){

        verificaErros(e)

    }
  
}

function formatNumber(num){

    var num = num?.toString()
  
    if(num?.includes(","||".")){
  
      num=num.replaceAll(",",".")
      num=num.replace(/\.(?=.*\.)/g,"")
      num = Number(num)
  
    }
  
    if(isNaN(num)){
  
        return 0;
    
    }
    else{
  
        return num;
  
    }
  
}



async function verificaErros(e){

    var element = e.data.element
    var seq = e.data.index
  
    var ret = new Object();
  
    ret["VER"]=false;
    var array = new Array();
    ret["MSG"]=null;
    ret["NUM"]=0
    ret["DATA"]=element;
    ret["FUNCTION"]="verificaErros"
    ret["INDEX"]=seq

    if(element.CODORDEM=="" || element.CODORDEM==null || element.CODORDEM==undefined){
        array.push("Ordem de produção inválida")
        ret.VER=true;
    }
    if(element.PRODUTODELP=="" || element.PRODUTODELP==null || element.PRODUTODELP==undefined){
        array.push("Produto delp inválido")
        ret.VER=true;
    }
    if((element.NOTAFISCAL=="" || element.NOTAFISCAL==null || element.NOTAFISCAL==undefined) || isNaN(element.NOTAFISCAL)){
        array.push("Nota fiscal inválida")
        ret.VER=true;
    }
    if(element.QUANTIDADE=="" || element.QUANTIDADE==null || element.QUANTIDADE==undefined){
        array.push("Quantidade inválida")
        ret.VER=true;
    }
    if(isNaN(element.RENF) && element.RENF!=null && element.RENF!="" && element.RENF!=undefined){
        array.push("RENF inválida")
        ret.VER=true;
    }
  
    if(!(await verificaSaldo(e.data.coligada,e.data.filial,element.CODORDEM))){
  
      array.push("A Ordem de Produção não foi concluída ou ainda não subiu saldo")
      ret.VER=true;
  
    }
  
    if(element["PRODUTODELP"]?.search("01.020")){
  
      array.push("O produto não é do tipo 01.020")
      ret.VER=true;
  
    }
  
    if(!(await produtoPossuiSaldo(e.data.coligada,e.data.filial,element.PRODUTODELP))){
  
      array.push("O produto não possui saldo no local de estoque 20")
      ret.VER=true;
      
    }
  
    if(!(await produtoPossuiSaldoTotal(e.data.coligada,e.data.filial,element.PRODUTODELP,e.data.totalProduto))){
  
      array.push("O produto não possui saldo no local de estoque 20 considerando a quantidade total")
      ret.VER=true;
      
    }
  
    if(!(await produtoBateNF(e.data.coligada,e.data.filial,element.PRODUTODELP,element.NOTAFISCAL))){
  
      array.push("O produto informado não bate com o produto da nota fiscal")
      ret.VER=true;
      
    }
  
    if(Number(formatNumber(element.QUANTIDADE))<=0){
  
      array.push("Quantidade informada deve ser maior que 0")
      ret.VER=true;
      
    }
  
    ret.MSG=array;
  
    postMessage(ret);

}


async function verificaSaldo(coligada,filial,codordem){

    var codcoligada=coligada
    var codfilial=filial

    var a1 = new Object({campo:"CODORDEM",valor:codordem})
    var a2 = new Object({campo:"CODCOLIGADA",valor:codcoligada})
    var a3 = new Object({campo:"CODFILIAL",valor:codfilial})
    
    var nome = "dsSaldoOP"

    var constraints = new Array(a1,a2,a3)

    var dataset = await consultaDataset(nome,constraints)
  
    var row = dataset.values
  
    if(row.length>0){

      if(Number(row[0]["QTDEPLANEJADA"])>Number(row[0]["QTDEEFETIVADA"]) || Number(row[0]["STATUS"])!=5){
  
        return false;
  
      }
      else{
  
        return true;
  
      }
    
    }
    else{
  
      return false;
  
    }
  
}
  
async function produtoPossuiSaldo(coligada,filial,produto){

    var codcoligada=coligada
    var codfilial=filial

    var a1 = new Object({campo:"CODIGOPRD",valor:produto})
    var a2 = new Object({campo:"CODCOLIGADA",valor:codcoligada})
    var a3 = new Object({campo:"CODFILIAL",valor:codfilial})

    var constraints = new Array(a1,a2,a3)

    var nome = "dsSaldoProdutoTerceiro"

    var dataset = await consultaDataset(nome,constraints)

    //console.log(dataset)

    var row = dataset.values

    if(row.length>0){

        if(Number(row[0]["SALDO"])>0){

            return true;
    
        }
        else{
    
            return false;
    
        }
    }
    else{

        return false;
        
    }


}

async function produtoPossuiSaldoTotal(coligada,filial,produto,total){

    var codcoligada=coligada
    var codfilial=filial


    var a1 = new Object({campo:"CODIGOPRD",valor:produto})
    var a2 = new Object({campo:"CODCOLIGADA",valor:codcoligada})
    var a3 = new Object({campo:"CODFILIAL",valor:codfilial})

    var constraints = new Array(a1,a2,a3)

    var nome = "dsSaldoProdutoTerceiro"

    var dataset = await consultaDataset(nome,constraints)

    //console.log(dataset)

    var row = dataset.values

    if(row.length>0){

        if(Number(row[0]["SALDO"])>=Number(total)){

        return true;

        }
        else{

        return false;

        }

    }
    else{

        return false;
        
    }


}

async function produtoBateNF(coligada,filial,produto,notafiscal){

    var codcoligada=coligada
    var codfilial=filial

    var a1 = new Object({campo:"CODIGOPRD",valor:produto})
    var a2 = new Object({campo:"NOTAFISCAL",valor:notafiscal})
    var a3 = new Object({campo:"CODCOLIGADA",valor:codcoligada})
    var a4 = new Object({campo:"CODFILIAL",valor:codfilial})
    var a5 = new Object({campo:"MODELO",valor:"PRODUTO"})

    var constraints = new Array(a1,a2,a3,a4,a5)

    var nome = "dsVerificaNotaFiscal"

    var dataset = await consultaDataset(nome,constraints)

    //console.log(dataset)

    var row = dataset.values

    if(row.length>0){

        return true;

    }
    else{

        return false;
        
    }

}

async function clienteBateNFeOP(coligada,filial,notafiscal,codordem,renf){

    var codcoligada=coligada
    var codfilial=filial

    var a1 = new Object({campo:"CODORDEM",valor:codordem})
    var a2 = new Object({campo:"NOTAFISCAL",valor:notafiscal})
    var a3 = new Object({campo:"CODCOLIGADA",valor:codcoligada})
    var a4 = new Object({campo:"CODFILIAL",valor:codfilial})
    var a5 = new Object({campo:"RENF",valor:renf})
    var a6 = new Object({campo:"MODELO",valor:"CLIENTE"})

    var constraints = new Array(a1,a2,a3,a4,a5,a6)

    var nome = "dsVerificaNotaFiscal"

    var dataset = await consultaDataset(nome,constraints)

    var row = dataset.values

    if(row.length>0){

        return true;

    }
    else{

        return false;
        
    }


}


async function consultaDataset(name,filters){

    var filter = ""

    for(var i=0;i<filters.length;i++){

        if(filter==""){

            filter+="&filterFields="+filters[i].campo+","+filters[i].valor

        }
        else{

            filter+=","+filters[i].campo+","+filters[i].valor

        }

    }

    var url = '/api/public/ecm/dataset/search?datasetId='+name+filter

    const response = await fetch(url);
    const dataset = await response.json();

    //console.log(dataset)

    return {values:dataset.content,length:dataset.content.length}

}