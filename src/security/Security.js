module.exports = {
    async geraCodigoVerificador(size){

        //Cria um n�mero aleat�rio do tamanho definido em size.
        let randomized = Math.ceil(Math.random() * Math.pow(10,size));
        
        return randomized;
    }
}