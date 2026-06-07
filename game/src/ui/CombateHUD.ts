import type { Jogador } from "../entities/Jogador.js";
import type { Entidade } from "../entities/Entidade.js";
import type { SistemaDeCombate } from "../engine/SistemaDeCombate.js";

export class CombateHUD {
    private container: HTMLDivElement | null = null;

    public construir(pai: HTMLElement): void {
        this.container = document.createElement('div');
        this.container.className = 'combate-hud';
        pai.appendChild(this.container);
    }

    public pintar(jogador: Jogador, inimigos: Entidade[], motor: SistemaDeCombate): void {
        if (!this.container) return;

        const hpPercent = Math.max(0, (jogador.hp / jogador.hpMax) * 100);
        const mpPercent = Math.max(0, (jogador.mp / jogador.mpMax) * 100);
        const xpPercent = Math.max(0, (jogador.xp / jogador.xpParaProximoNivel) * 100);

        this.container.innerHTML = `
            <div class="combate-hud-jogador">
                <div class="combate-nome">${jogador.nome} (Nv.${jogador.nivel})</div>
                <div class="barra-container">
                    <div class="barra-rotulo">HP</div>
                    <div class="barra-fundo"><div class="barra-preenchimento hp" style="width:${hpPercent}%"></div></div>
                    <span class="barra-texto">${jogador.hp}/${jogador.hpMax}</span>
                </div>
                <div class="barra-container">
                    <div class="barra-rotulo">MP</div>
                    <div class="barra-fundo"><div class="barra-preenchimento mp" style="width:${mpPercent}%"></div></div>
                    <span class="barra-texto">${jogador.mp}/${jogador.mpMax}</span>
                </div>
                <div class="barra-container">
                    <div class="barra-rotulo">XP</div>
                    <div class="barra-fundo"><div class="barra-preenchimento xp" style="width:${xpPercent}%"></div></div>
                    <span class="barra-texto">${jogador.xp}/${jogador.xpParaProximoNivel}</span>
                </div>
                <div class="combate-pocoes">Poções: ${jogador.pocoes}</div>
            </div>
            <div class="combate-mensagem">
            </div>
            <div class="combate-inimigos-hud">
                ${inimigos.filter(e => e.vivo).map(e => `
                    <div class="combate-hud-inimigo">
                        <span>${e.nome}</span>
                        <div class="barra-container">
                            <div class="barra-fundo pequeno"><div class="barra-preenchimento hp" style="width:${(e.hp / e.hpMax) * 100}%"></div></div>
                            <span>${e.hp}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Processa o alerta de texto (Dano causado, Fuga, Sem Mana, etc.)
        const mensagemContainer = document.getElementsByClassName('combate-mensagem')[0] as HTMLElement;

        if (mensagemContainer) {
            mensagemContainer.innerText = motor.mensagem;
            mensagemContainer.style.display = motor.mensagem ? 'block' : 'none';
        }
    }
}