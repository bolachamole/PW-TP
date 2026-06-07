import type { Jogador } from "../entities/Jogador.js";
import type { SistemaDeCombate } from "../engine/SistemaDeCombate.js";
import { LARGURA_CAMPO, ALTURA_CAMPO, distanciaEntre } from "../engine/GeradorDeCampo.js";
import { spriteEnemy } from "./Sprites.js";
import { SPRITES } from "../constants.js";

export class CombateGrelha {
    private container: HTMLDivElement | null = null;
    private celulas: HTMLDivElement[][] = [];

    /**
     * Aloca a matriz bidimensional no DOM apenas uma vez no início da batalha.
     */
    public construir(pai: HTMLElement, motor: SistemaDeCombate): void {
        this.container = document.createElement('div');
        this.container.className = 'combate-campo';
        this.container.style.setProperty('--largura', LARGURA_CAMPO.toString());
        this.container.style.setProperty('--altura', ALTURA_CAMPO.toString());

        this.celulas = [];
        for (let y = 0; y < ALTURA_CAMPO; y++) {
            this.celulas[y] = [];
            for (let x = 0; x < LARGURA_CAMPO; x++) {
                const cell = document.createElement('div');
                cell.className = 'combate-cell';

                // Delegação de eventos: O listener é anexado estaticamente à célula
                cell.addEventListener('click', () => {
                    if (motor.selecionandoAlvo) {
                        const alvoAqui = motor.alvosVisiveis.find(e => e.x === x && e.y === y);
                        if (alvoAqui) {
                            motor.indiceAlvoSelecionado = motor.alvosVisiveis.indexOf(alvoAqui);
                            motor.confirmarAlvo();
                        }
                        return;
                    }
                    motor.tentarMoverJogadorParaGrelha(x, y);
                });

                this.container.appendChild(cell);
                this.celulas[y][x] = cell;
            }
        }

        pai.appendChild(this.container);
    }

    public pintar(jogador: Jogador, motor: SistemaDeCombate): void {
        if (!this.container) return;

        // 1. Limpa o estado visual da grelha sem invocar a destruição da div
        for (let y = 0; y < ALTURA_CAMPO; y++) {
            for (let x = 0; x < LARGURA_CAMPO; x++) {
                this.celulas[y][x].className = 'combate-cell';
                this.celulas[y][x].innerHTML = '';
            }
        }

        // 2. Posiciona o Jogador
        if (jogador.vivo) {
            const cellJogador = this.celulas[jogador.y][jogador.x];
            cellJogador.classList.add('jogador');
            cellJogador.innerHTML = `<img src="${SPRITES.player}" class="sprite-personagem" alt="Jogador">`;
        }

        // 3. Posiciona os Inimigos
        for (const inimigo of motor.inimigos.filter(e => e.vivo)) {
            const cellInimigo = this.celulas[inimigo.y][inimigo.x];
            cellInimigo.classList.add('inimigo');
            cellInimigo.innerHTML = `<img src="${spriteEnemy(inimigo.nome)}" class="sprite-inimigo" alt="${inimigo.nome}">`;
        }

        // 4. Destaques de seleção de alvo
        if (motor.selecionandoAlvo) {
            for (const inimigo of motor.alvosVisiveis) {
                const cell = this.celulas[inimigo.y][inimigo.x];
                cell.classList.add('alvo-possivel');
            }

            const alvoSelecionado = motor.alvosVisiveis[motor.indiceAlvoSelecionado];
            if (alvoSelecionado) {
                const cell = this.celulas[alvoSelecionado.y][alvoSelecionado.x];
                cell.classList.add('alvo-selecionado');
            }
        }

        // 5. Calcula e desenha a área verde de movimento disponível
        if (motor.turno === 'jogador' && motor.passosRestantes > 0 && !motor.selecionandoAlvo) {
            for (let y = 0; y < ALTURA_CAMPO; y++) {
                for (let x = 0; x < LARGURA_CAMPO; x++) {
                    const dist = distanciaEntre({ x: jogador.x, y: jogador.y }, { x, y });
                    const cell = this.celulas[y][x];

                    if (dist <= motor.passosRestantes && dist > 0 && cell.innerHTML === '') {
                        cell.classList.add('movevel');
                    }
                }
            }
        }
    }
}
