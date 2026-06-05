import { jogo } from "../engine/Jogo.js";
import { Entidade } from "../entities/Entidade.js";
import { LARGURA_CAMPO, ALTURA_CAMPO, distanciaEntre } from "../engine/GeradorDeCampo.js";
import { spriteEnemy, SPRITES } from "./sprites.js";
import { calcularOuroBaseCombate } from "../engine/Balancamento.js";

type Turno = 'jogador' | 'inimigos';

export class Combate {
    private elementoDOM: HTMLDivElement | null = null;
    private listenerTeclado: ((e: KeyboardEvent) => void) | null = null;
    private turno: Turno = 'jogador';
    private passosRestantes: number = 10;
    private acaoRealizada: boolean = false;
    private inimigos: Entidade[] = [];
    private mensagem: string = '';
    private turnoContador: number = 0;

    abrir(containerPai: HTMLElement, inimigos: Entidade[]): void {
        if (document.getElementById('tela-combate')) return;

        this.inimigos = inimigos;
        this.turno = 'jogador';
        this.passosRestantes = 10;
        this.acaoRealizada = false;
        this.turnoContador = 0;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-combate';
        this.elementoDOM.className = 'tela-combate';
        containerPai.appendChild(this.elementoDOM);

        this.posicionarEntidades();
        this.renderizar();
        this.adicionarListeners();
    }

    private posicionarEntidades(): void {
        jogo.jogador.x = 1;
        jogo.jogador.y = Math.floor(ALTURA_CAMPO / 2);

        const posicoesOcupadas = new Set<string>();
        posicoesOcupadas.add(`${jogo.jogador.x},${jogo.jogador.y}`);

        for (const inimigo of this.inimigos) {
            let x: number, y: number, chave: string;
            do {
                x = LARGURA_CAMPO - 2 - Math.floor(Math.random() * 2);
                y = Math.floor(Math.random() * ALTURA_CAMPO);
                chave = `${x},${y}`;
            } while (posicoesOcupadas.has(chave));
            posicoesOcupadas.add(chave);
            inimigo.x = x;
            inimigo.y = y;
        }
    }

    private renderizar(): void {
        if (!this.elementoDOM) return;

        const hpPercent = Math.max(0, (jogo.jogador.hp / jogo.jogador.hpMax) * 100);
        const mpPercent = Math.max(0, (jogo.jogador.mp / jogo.jogador.mpMax) * 100);

        let html = `<div class="combate-hud">
            <div class="combate-hud-jogador">
                <div class="combate-nome">${jogo.jogador.nome} (Nv.${jogo.jogador.nivel})</div>
                <div class="barra-container">
                    <div class="barra-rotulo">HP</div>
                    <div class="barra-fundo"><div class="barra-preenchimento hp" style="width:${hpPercent}%"></div></div>
                    <span class="barra-texto">${jogo.jogador.hp}/${jogo.jogador.hpMax}</span>
                </div>
                <div class="barra-container">
                    <div class="barra-rotulo">MP</div>
                    <div class="barra-fundo"><div class="barra-preenchimento mp" style="width:${mpPercent}%"></div></div>
                    <span class="barra-texto">${jogo.jogador.mp}/${jogo.jogador.mpMax}</span>
                </div>
                <div class="combate-pocoes">Poções: ${jogo.jogador.pocoes}</div>
            </div>
            <div class="combate-inimigos-hud">
                ${this.inimigos.filter(e => e.vivo).map(e => `
                    <div class="combate-hud-inimigo">
                        <span>${e.nome}</span>
                        <div class="barra-container">
                            <div class="barra-fundo pequeno"><div class="barra-preenchimento hp" style="width:${(e.hp / e.hpMax) * 100}%"></div></div>
                            <span>${e.hp}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;

        html += `<div class="combate-campo" style="--largura: ${LARGURA_CAMPO}; --altura: ${ALTURA_CAMPO};">`;

        for (let y = 0; y < ALTURA_CAMPO; y++) {
            for (let x = 0; x < LARGURA_CAMPO; x++) {
                let conteudo = '';
                let classe = 'combate-cell';

                if (x === jogo.jogador.x && y === jogo.jogador.y) {
                    conteudo = `<img src="${SPRITES.player}" class="sprite-personagem" alt="Jogador">`;
                    classe += ' jogador';
                }

                const inimigoAqui = this.inimigos.find(e => e.vivo && e.x === x && e.y === y);
                if (inimigoAqui) {
                    conteudo = `<img src="${spriteEnemy(inimigoAqui.nome)}" class="sprite-inimigo" alt="${inimigoAqui.nome}">`;
                    classe += ' inimigo';
                }

                if (this.turno === 'jogador' && this.passosRestantes > 0) {
                    const dist = distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x, y });
                    if (dist <= this.passosRestantes && dist > 0 && !conteudo) {
                        classe += ' movevel';
                    }
                }

                html += `<div class="${classe}" data-x="${x}" data-y="${y}">${conteudo}</div>`;
            }
        }

        html += '</div>';

        html += `<div class="combate-acoes">
            <div class="combate-turno-info">${this.turno === 'jogador' ? `Turno do Jogador (Passos: ${this.passosRestantes})` : 'Turno dos Inimigos...'}</div>
            <div class="combate-habilidades">
                ${jogo.jogador.habilidades.map((h, i) => `
                    <button class="hab-btn ${h.custoMP > jogo.jogador.mp ? 'sem-mp' : ''}" data-hab="${i}">
                        ${['A','S','D','F','G'][i]}: ${h.nome} (${h.custoMP}MP)
                    </button>
                `).join('')}
            </div>
            <div class="combate-botoes">
                <button id="btn-usar-pocao" ${jogo.jogador.pocoes <= 0 || !jogo.jogador.vivo ? 'disabled' : ''}>Usar Poção (E)</button>
                <button id="btn-encerrar-turno" ${this.turno === 'inimigos' || !jogo.jogador.vivo ? 'disabled' : ''}>Encerrar Turno (R)</button>
            </div>
        </div>`;

        if (this.mensagem) {
            html += `<div class="combate-mensagem">${this.mensagem}</div>`;
        }

        this.elementoDOM.innerHTML = html;

        this.adicionarEventosBotoes();
    }

    private adicionarListeners(): void {
        this.removerListeners();

        this.listenerTeclado = (e: KeyboardEvent) => {
            if (this.turno !== 'jogador' || !jogo.jogador.vivo) return;

            switch (e.key) {
                case 'ArrowUp': e.preventDefault(); this.moverJogador(0, -1); break;
                case 'ArrowDown': e.preventDefault(); this.moverJogador(0, 1); break;
                case 'ArrowLeft': e.preventDefault(); this.moverJogador(-1, 0); break;
                case 'ArrowRight': e.preventDefault(); this.moverJogador(1, 0); break;
                case 'a': case 'A': this.usarHabilidade(0); break;
                case 's': case 'S': this.usarHabilidade(1); break;
                case 'd': case 'D': this.usarHabilidade(2); break;
                case 'f': case 'F': this.usarHabilidade(3); break;
                case 'g': case 'G': this.usarHabilidade(4); break;
                case 'e': case 'E': this.usarPocao(); break;
                case 'r': case 'R': this.encerrarTurnoJogador(); break;
            }
        };

        window.addEventListener('keydown', this.listenerTeclado);
    }

    private adicionarEventosBotoes(): void {
        if (!this.elementoDOM) return;

        this.elementoDOM.querySelectorAll('.hab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-hab')!);
                this.usarHabilidade(idx);
            });
        });

        this.elementoDOM.querySelector('#btn-usar-pocao')?.addEventListener('click', () => this.usarPocao());
        this.elementoDOM.querySelector('#btn-encerrar-turno')?.addEventListener('click', () => this.encerrarTurnoJogador());

        this.elementoDOM.querySelectorAll('.movevel').forEach(cell => {
            cell.addEventListener('click', () => {
                const x = parseInt(cell.getAttribute('data-x')!);
                const y = parseInt(cell.getAttribute('data-y')!);
                const dist = distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x, y });
                if (dist <= this.passosRestantes) {
                    jogo.jogador.x = x;
                    jogo.jogador.y = y;
                    this.passosRestantes -= dist;
                    this.renderizar();
                }
            });
        });
    }

    private moverJogador(dx: number, dy: number): void {
        if (this.passosRestantes <= 0) return;

        const novoX = jogo.jogador.x + dx;
        const novoY = jogo.jogador.y + dy;

        if (novoX < 0 || novoX >= LARGURA_CAMPO || novoY < 0 || novoY >= ALTURA_CAMPO) return;

        const inimigoAqui = this.inimigos.find(e => e.vivo && e.x === novoX && e.y === novoY);
        if (inimigoAqui) return;

        jogo.jogador.x = novoX;
        jogo.jogador.y = novoY;
        this.passosRestantes--;
        this.renderizar();
    }

    private usarHabilidade(idx: number): void {
        if (this.acaoRealizada) {
            this.mensagem = "Você já realizou uma ação neste turno! Pressione R para encerrar.";
            this.renderizar();
            return;
        }

        const hab = jogo.jogador.habilidades[idx];
        if (!hab) return;

        if (jogo.jogador.mp < hab.custoMP) {
            this.mensagem = "MP insuficiente!";
            this.renderizar();
            return;
        }

        if (hab.tipo === 'cura') {
            jogo.jogador.usarHabilidade(hab);
            const cura = Math.floor(jogo.jogador.hpMax * hab.cura);
            jogo.jogador.curar(cura);
            this.mensagem = `${hab.nome}! Recuperou ${cura} HP.`;
            this.acaoRealizada = true;
            this.renderizar();
            return;
        }

        if (hab.tipo === 'defesa') {
            jogo.jogador.usarHabilidade(hab);
            jogo.jogador.defesaBonus = jogo.jogador.defesa;
            this.mensagem = `${hab.nome}! Defesa dobrada por este turno.`;
            this.acaoRealizada = true;
            this.renderizar();
            return;
        }

        if (hab.tipo === 'ataque' || hab.tipo === 'ataquearea') {
            const inimigosVivos = this.inimigos.filter(e => e.vivo);
            if (inimigosVivos.length === 0) return;

            jogo.jogador.usarHabilidade(hab);

            if (hab.tipo === 'ataquearea') {
                for (const ini of inimigosVivos) {
                    const dano = Math.floor((jogo.jogador.atk * 1.5));
                    ini.receberDano(dano);
                }
                this.mensagem = `${hab.nome}! Causou dano em todos os inimigos!`;
            } else {
                const alvoMaisPerto = inimigosVivos.reduce((a, b) =>
                    distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x: a.x, y: a.y }) <
                    distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x: b.x, y: b.y }) ? a : b
                );
                const mult = hab.nome === "Golpe Forte" ? 2 : 1;
                const dano = Math.floor((jogo.jogador.atk * mult));
                alvoMaisPerto.receberDano(dano);
                if (!alvoMaisPerto.vivo) {
                    this.mensagem = `${hab.nome}! ${alvoMaisPerto.nome} derrotado!`;
                } else {
                    this.mensagem = `${hab.nome}! Causou ${dano} de dano em ${alvoMaisPerto.nome}.`;
                }
            }

            this.acaoRealizada = true;
            this.verificarFimCombate();
            this.renderizar();
            return;
        }

        this.mensagem = "Habilidade não implementada.";
        this.renderizar();
    }

    private usarPocao(): void {
        if (this.acaoRealizada) {
            this.mensagem = "Você já realizou uma ação neste turno!";
            this.renderizar();
            return;
        }
        if (jogo.jogador.usarPocao()) {
            this.mensagem = "Usou poção! Recuperou 40% da vida.";
            this.acaoRealizada = true;
            this.renderizar();
        } else {
            this.mensagem = "Sem poções!";
            this.renderizar();
        }
    }

    private encerrarTurnoJogador(): void {
        if (this.turno === 'inimigos') return;
        if (this.acaoRealizada || this.passosRestantes < 10) {
            this.iniciarTurnoInimigos();
        } else {
            this.mensagem = "Realize uma ação ou mova-se antes de encerrar o turno!";
            this.renderizar();
        }
    }

    private iniciarTurnoInimigos(): void {
        this.turno = 'inimigos';
        jogo.jogador.resetarDefesaBonus();
        this.renderizar();

        setTimeout(() => {
            for (const inimigo of this.inimigos.filter(e => e.vivo)) {
                this.moverInimigoAteJogador(inimigo);
                this.atacarInimigo(inimigo);
            }

            this.turno = 'jogador';
            this.passosRestantes = 10;
            this.acaoRealizada = false;
            this.turnoContador++;

            this.verificarFimCombate();
            this.renderizar();
        }, 500);
    }

    private moverInimigoAteJogador(inimigo: Entidade): void {
        if (!inimigo.vivo) return;

        const dx = Math.sign(jogo.jogador.x - inimigo.x);
        const dy = Math.sign(jogo.jogador.y - inimigo.y);

        const dist = distanciaEntre({ x: inimigo.x, y: inimigo.y }, { x: jogo.jogador.x, y: jogo.jogador.y });

        if (dist > 2) {
            const moveX = Math.random() > 0.3;
            if (moveX) {
                const novoX = inimigo.x + dx;
                if (novoX >= 0 && novoX < LARGURA_CAMPO) inimigo.x = novoX;
            } else {
                const novoY = inimigo.y + dy;
                if (novoY >= 0 && novoY < ALTURA_CAMPO) inimigo.y = novoY;
            }
        }
    }

    private atacarInimigo(inimigo: Entidade): void {
        if (!inimigo.vivo) return;

        const dist = distanciaEntre({ x: inimigo.x, y: inimigo.y }, { x: jogo.jogador.x, y: jogo.jogador.y });

        if (dist <= 1) {
            const dano = Math.floor(inimigo.atk);
            jogo.jogador.receberDano(dano);
            this.mensagem = `${inimigo.nome} atacou! Causou ${dano} de dano.`;
        }
    }

    private verificarFimCombate(): void {
        const inimigosVivos = this.inimigos.filter(e => e.vivo);
        
        // Vitória do Jogador
        if (inimigosVivos.length === 0) {
            this.removerListeners();

            // 1. Processamento de XP clássico
            const xpGanho = this.inimigos.length * 15 + this.turnoContador * 5;
            jogo.jogador.ganharXP(xpGanho);

            // 2. SISTEMA DE RECOMPENSA EM OURO (REFATORADO)
            // Agora consome a fórmula dinâmica e os valores do arquivo Balancamento.ts
            const ouroBaseGlobal = calcularOuroBaseCombate(jogo.jogador.mapaAtual);
            let totalOuroGanho = 0;

            // Varre todos os inimigos que participaram do combate e soma os despojos
            for (const inimigo of this.inimigos) {
                const multiplicadorMonstro = (inimigo as any).multiplicadorOuro ?? 1.0;
                totalOuroGanho += Math.floor(ouroBaseGlobal * multiplicadorMonstro);
            }

            // Injeta o ouro final na carteira persistente do jogador
            jogo.jogador.ganharOuro(totalOuroGanho);
            console.log(`[DEBUG] Combate vencido! Ouro total recebido: ${totalOuroGanho} 💰`);

            // 3. Transição de tela
            this.fechar();
            jogo.vitoriaCombate();
            return;
        }

        // Derrota do Jogador
        if (!jogo.jogador.vivo) {
            this.removerListeners();
            this.fechar();
            jogo.derrota();
            return;
        }
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
