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
                <h1>🏆 Vitória!</h1>
                <p>John Ancestoor triunfou sobre o Guardião do Abismo!</p>
                <p>Mapas concluídos: ${jogo.jogador.mapaAtual}</p>
                <p>Nível final: ${jogo.jogador.nivel}</p>
                <p>XP total: ${jogo.jogador.xp}</p>
                <button id="btn-vitoria-menu">Menu Principal (R)</button>
            </div>
        `;

        this.listenerTeclado = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.fechar();
                jogo.iniciarMenu();
            }
        };

        window.addEventListener('keydown', this.listenerTeclado);

        this.elementoDOM.querySelector('#btn-vitoria-menu')?.addEventListener('click', () => {
            this.fechar();
            jogo.iniciarMenu();
        });
    }

    fechar(): void {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}
