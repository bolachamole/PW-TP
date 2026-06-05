import { jogo } from "../engine/Jogo.js";

export class Vitoria {
    private elementoDOM: HTMLDivElement | null = null;
    private listenerTeclado: ((e: KeyboardEvent) => void) | null = null;

    abrir(containerPai: HTMLElement): void {
        if (document.getElementById('tela-vitoria')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-vitoria';
        this.elementoDOM.className = 'tela-vitoria';
        containerPai.appendChild(this.elementoDOM);

        this.renderizar();
    }

    private renderizar(): void {
        if (!this.elementoDOM) return;

        this.elementoDOM.innerHTML = `
            <div class="vitoria-card">
                <h1>&#x1F3C6; Vit&oacute;ria!</h1>
                <p>John Ancestoor triunfou sobre o Guardi&atilde;o do Abismo!</p>
                <p>Mapas conclu&iacute;dos: <strong>${jogo.jogador.mapaAtual}</strong></p>
                <p>N&iacute;vel final: <strong>${jogo.jogador.nivel}</strong></p>
                <p>XP total: <strong>${jogo.jogador.xp}</strong></p>
                <button id="btn-vitoria-menu">Voltar ao Menu (R)</button>
            </div>
        `;

        this.listenerTeclado = (e: KeyboardEvent) => {
            if (e.repeat) return;
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.voltarAoMenu();
            }
        };
        window.addEventListener('keyup', this.listenerTeclado);

        const btn = this.elementoDOM.querySelector<HTMLButtonElement>('#btn-vitoria-menu');
        btn?.addEventListener('click', () => this.voltarAoMenu());
    }

    private voltarAoMenu(): void {
        this.fechar();
        setTimeout(() => jogo.iniciarMenu(), 0);
    }

    fechar(): void {
        if (this.listenerTeclado) {
            window.removeEventListener('keyup', this.listenerTeclado);
            this.listenerTeclado = null;
        }
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}
