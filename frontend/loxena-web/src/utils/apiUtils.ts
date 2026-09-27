export async function tratarErro(resposta: Response, mensagemPadrao: string) {
    if (!resposta.ok) {
        const erroData = await resposta.json().catch(() => null);
        
        if (erroData && erroData.detail) throw new Error(erroData.detail);
        if (erroData && erroData.title) throw new Error(erroData.title);
        
        throw new Error(mensagemPadrao);
    }
}