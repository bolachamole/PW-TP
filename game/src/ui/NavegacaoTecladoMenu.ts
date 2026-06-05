export class NavegacaoTecladoMenu {
    private static navegacaoAtiva?: NavegacaoTecladoMenu;

    private indiceSelecionado = 0;
    private elementos: HTMLElement[] = [];
    private listener?: (evento: KeyboardEvent) => void;
    private aoVoltar?: () => void;
    private aoEsquerda?: () => void;
    private aoDireita?: () => void;

    constructor(
        elementos: HTMLElement[],
        aoVoltar?: () => void,
        aoEsquerda?: () => void,
        aoDireita?: () => void
    ) {
        this.elementos = elementos;
        this.aoVoltar = aoVoltar;
        this.aoEsquerda = aoEsquerda;
        this.aoDireita = aoDireita;
    }

    public iniciar(): void {
        NavegacaoTecladoMenu.navegacaoAtiva?.destruir();
        NavegacaoTecladoMenu.navegacaoAtiva = this;

        this.indiceSelecionado = 0;
        this.atualizarSelecao();

        this.listener = (evento: KeyboardEvent) => {
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

    public destruir(): void {
        if (this.listener) {
            window.removeEventListener("keyup", this.listener);
            this.listener = undefined;
        }
        if (NavegacaoTecladoMenu.navegacaoAtiva === this) {
            NavegacaoTecladoMenu.navegacaoAtiva = undefined;
        }
    }

    public obterIndiceSelecionado(): number {
        return this.indiceSelecionado;
    }

    public obterElementoSelecionado(): HTMLElement {
        return this.elementos[this.indiceSelecionado];
    }

    public definirIndice(indice: number): void {
        if (indice < 0 || indice >= this.elementos.length) return;
        this.indiceSelecionado = indice;
        this.atualizarSelecao();
    }

    private subir(): void {
        this.indiceSelecionado--;
        if (this.indiceSelecionado < 0) {
            this.indiceSelecionado = this.elementos.length - 1;
        }
        this.atualizarSelecao();
    }

    private descer(): void {
        this.indiceSelecionado++;
        if (this.indiceSelecionado >= this.elementos.length) {
            this.indiceSelecionado = 0;
        }
        this.atualizarSelecao();
    }

    private confirmar(): void {
        this.elementos[this.indiceSelecionado]?.click();
    }

    private atualizarSelecao(): void {
        this.elementos.forEach((elemento, indice) => {
            if (indice === this.indiceSelecionado) {
                elemento.classList.add("menu-selecionado");
            } else {
                elemento.classList.remove("menu-selecionado");
            }
        });
    }
}
