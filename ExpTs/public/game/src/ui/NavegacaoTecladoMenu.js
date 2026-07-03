export class NavegacaoTecladoMenu {
    static navegacaoAtiva;
    indiceSelecionado = 0;
    elementos = [];
    listener;
    aoVoltar;
    aoEsquerda;
    aoDireita;
    constructor(elementos, aoVoltar, aoEsquerda, aoDireita) {
        this.elementos = elementos;
        this.aoVoltar = aoVoltar;
        this.aoEsquerda = aoEsquerda;
        this.aoDireita = aoDireita;
    }
    iniciar() {
        NavegacaoTecladoMenu.navegacaoAtiva?.destruir();
        NavegacaoTecladoMenu.navegacaoAtiva = this;
        this.indiceSelecionado = 0;
        this.atualizarSelecao();
        this.listener = (evento) => {
            switch (evento.key) {
                case "ArrowUp":
                    this.subir();
                    break;
                case "ArrowDown":
                    this.descer();
                    break;
                case "ArrowLeft":
                    this.aoEsquerda?.();
                    break;
                case "ArrowRight":
                    this.aoDireita?.();
                    break;
                case "r":
                case "R":
                    this.confirmar();
                    break;
                case "e":
                case "E":
                    this.aoVoltar?.();
                    break;
            }
        };
        window.addEventListener("keyup", this.listener);
    }
    destruir() {
        if (this.listener) {
            window.removeEventListener("keyup", this.listener);
            this.listener = undefined;
        }
        if (NavegacaoTecladoMenu.navegacaoAtiva === this) {
            NavegacaoTecladoMenu.navegacaoAtiva = undefined;
        }
    }
    obterIndiceSelecionado() {
        return this.indiceSelecionado;
    }
    obterElementoSelecionado() {
        return this.elementos[this.indiceSelecionado];
    }
    definirIndice(indice) {
        if (indice < 0 || indice >= this.elementos.length)
            return;
        this.indiceSelecionado = indice;
        this.atualizarSelecao();
    }
    subir() {
        this.indiceSelecionado--;
        if (this.indiceSelecionado < 0) {
            this.indiceSelecionado = this.elementos.length - 1;
        }
        this.atualizarSelecao();
    }
    descer() {
        this.indiceSelecionado++;
        if (this.indiceSelecionado >= this.elementos.length) {
            this.indiceSelecionado = 0;
        }
        this.atualizarSelecao();
    }
    confirmar() {
        this.elementos[this.indiceSelecionado]?.click();
    }
    atualizarSelecao() {
        this.elementos.forEach((elemento, indice) => {
            if (indice === this.indiceSelecionado) {
                elemento.classList.add("menu-selecionado");
            }
            else {
                elemento.classList.remove("menu-selecionado");
            }
        });
    }
}
