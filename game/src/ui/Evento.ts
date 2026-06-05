import { jogo } from "../engine/Jogo.js";

type EventoAleatorio = {
    titulo: string;
    descricao: string;
    efeito: () => string;
};

const EVENTOS: EventoAleatorio[] = [
    {
        titulo: "Baú Escondido",
        descricao: "Você encontra um baú escondido entre as ruínas!",
        efeito: () => {
            const xp = 10 + Math.floor(Math.random() * 20);
            jogo.jogador.ganharXP(xp);
            return `Ganhou ${xp} XP!`;
        }
    },
    {
        titulo: "Fonte da Juventude",
        descricao: "Uma fonte mágica brilha diante de você.",
        efeito: () => {
            jogo.jogador.curar(Math.floor(jogo.jogador.hpMax * 0.5));
            return `Recuperou 50% da vida! (${jogo.jogador.hp}/${jogo.jogador.hpMax})`;
        }
    },
    {
        titulo: "Armadilha!",
        descricao: "Uma armadilha antiga é acionada!",
        efeito: () => {
            const dano = 5 + Math.floor(Math.random() * 15);
            jogo.jogador.receberDano(dano);
            if (!jogo.jogador.vivo) {
                return `Sofreu ${dano} de dano e morreu!`;
            }
            return `Sofreu ${dano} de dano! (${jogo.jogador.hp}/${jogo.jogador.hpMax})`;
        }
    },
    {
        titulo: "Mestre Ancião",
        descricao: "Um ancião oferece ensinamentos em troca de XP.",
        efeito: () => {
            if (jogo.jogador.xp >= 15) {
                jogo.jogador.xp -= 15;
                jogo.jogador.atk += 2;
                jogo.jogador.defesa += 1;
                return "Pagou 15 XP. Ataque +2, Defesa +1!";
            }
            return "Não tem XP suficiente (precisa de 15).";
        }
    },
    {
        titulo: "Poção Esquecida",
        descricao: "Você encontra uma poção empoeirada no chão.",
        efeito: () => {
            jogo.jogador.pocoes += 1;
            return "Ganhou 1 poção!";
        }
    },
];

export class Evento {
    private elementoDOM: HTMLDivElement | null = null;
    private listenerTeclado: ((e: KeyboardEvent) => void) | null = null;
    private resultado: string = '';
    private finalizado: boolean = false;

    abrir(containerPai: HTMLElement): void {
        if (document.getElementById('tela-evento')) return;

        this.resultado = '';
        this.finalizado = false;

        const evento = EVENTOS[Math.floor(Math.random() * EVENTOS.length)];

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-evento';
        this.elementoDOM.className = 'tela-evento';
        containerPai.appendChild(this.elementoDOM);

        this.renderizar(evento);
    }

    private renderizar(evento: EventoAleatorio): void {
        if (!this.elementoDOM) return;

        const html = `<div class="evento-card">
            <h1>${evento.titulo}</h1>
            <p>${evento.descricao}</p>
            ${!this.finalizado ? `<button id="btn-evento-ok" class="evento-btn">Continuar (R)</button>` : ''}
            ${this.resultado ? `<p class="evento-resultado">${this.resultado}</p>` : ''}
            ${this.finalizado ? `<p class="evento-sair">Pressione R para sair</p>` : ''}
        </div>`;

        this.elementoDOM.innerHTML = html;
        this.adicionarListeners(evento);
    }

    private adicionarListeners(evento: EventoAleatorio): void {
        this.removerListeners();

        this.listenerTeclado = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                if (!this.finalizado) {
                    this.resultado = evento.efeito();
                    this.finalizado = true;
                    this.renderizar(evento);

                    if (!jogo.jogador.vivo) {
                        setTimeout(() => {
                            this.fechar();
                            jogo.derrota();
                        }, 1500);
                    }
                } else {
                    this.fechar();
                    jogo.voltarParaMundo();
                }
            }
        };

        window.addEventListener('keydown', this.listenerTeclado);
    }

    private removerListeners(): void {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
    }

    fechar(): void {
        this.removerListeners();
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}
