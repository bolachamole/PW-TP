import type { Jogador } from "../entities/Jogador.js";
import type { SistemaDeCombate } from "../engine/SistemaDeCombate.js";

export class CombateAcoes {
    private acoesContainer: HTMLDivElement | null = null;
    private mensagemContainer: HTMLDivElement | null = null;

    public construir(pai: HTMLElement): void {
        this.acoesContainer = document.createElement('div');
        this.acoesContainer.className = 'combate-acoes';
        pai.appendChild(this.acoesContainer);

        this.mensagemContainer = document.createElement('div');
        this.mensagemContainer.className = 'combate-mensagem';
        pai.appendChild(this.mensagemContainer);
    }

    public pintar(jogador: Jogador, motor: SistemaDeCombate): void {
        if (!this.acoesContainer) return;

        // Injeta os botões de acordo com o estado do turno e mana
        this.acoesContainer.innerHTML = `
            <div class="combate-turno-info">${motor.turno === 'jogador' ? `Turno do Jogador (Passos: ${motor.passosRestantes})` : 'Turno dos Inimigos...'}</div>
            <div class="combate-habilidades">
                ${jogador.habilidades.map((h, i) => `
                    <button class="hab-btn ${h.custoMP > jogador.mp ? 'sem-mp' : ''}" data-hab="${i}">
                        ${['A','S','D','F','G'][i]}: ${h.nome} (${h.custoMP}MP)
                    </button>
                `).join('')}
            </div>
            <div class="combate-botoes">
                <button id="btn-usar-pocao" ${jogador.pocoes <= 0 || !jogador.vivo ? 'disabled' : ''}>Usar Poção (E)</button>
                <button id="btn-encerrar-turno" ${motor.turno === 'inimigos' || !jogador.vivo ? 'disabled' : ''}>Encerrar Turno (R)</button>
            </div>
        `;

        // Re-acopla os event listeners aos botões recém-desenhados
        this.acoesContainer.querySelectorAll('.hab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-hab')!);
                motor.usarHabilidade(idx);
            });
        });

        this.acoesContainer.querySelector('#btn-usar-pocao')?.addEventListener('click', () => motor.usarPocao());
        this.acoesContainer.querySelector('#btn-encerrar-turno')?.addEventListener('click', () => motor.encerrarTurnoJogador());

        // Processa o alerta de texto (Dano causado, Fuga, Sem Mana, etc.)
        if (this.mensagemContainer) {
            this.mensagemContainer.innerText = motor.mensagem;
            this.mensagemContainer.style.display = motor.mensagem ? 'block' : 'none';
        }
    }
}