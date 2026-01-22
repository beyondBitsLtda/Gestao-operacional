function gerarChaveUnica() {

  const timestamp = Date.now().toString(36); 
  const aleatorio = Math.random().toString(36).substring(2, 10); 
  const chave = `${timestamp}-${aleatorio}`;
  console.log("Chave única gerada:", chave);

  return chave;

}
