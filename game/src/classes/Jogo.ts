class Jogo{
    app: Element;

    constructor(){
        this.app = document.getElementById("app")!;
    }

    jogando(){
        const botaoPausa = document.createElement("button");
        const pausa = document.createTextNode("⏸️");
        botaoPausa.appendChild(pausa);
        botaoPausa.addEventListener("click", ()=>{
            const telaPausa = document.createElement("div");
            telaPausa.id = "pausa";
            telaPausa.innerHTML = "<h1>Pausa</h1><button class=grande id='voltar'>Voltar ao jogo.</button>";
            this.app.appendChild(telaPausa);
            const botao = document.getElementById("voltar")!;
            botao.addEventListener("click", ()=>{telaPausa.remove()});
        });
        this.app.appendChild(botaoPausa);
    }

    gameover(){
        if(this.app != null){
            this.app.innerHTML = "<h1>Fim</h1><button class=grande id='sair'>Voltar ao início.</button>";
            const botao = document.getElementById("sair")!;
            botao.addEventListener("click", ()=>{
                this.jogando();
            });
        }
    }
}

export const jogo = new Jogo();