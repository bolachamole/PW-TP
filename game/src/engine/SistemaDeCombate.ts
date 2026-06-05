import { jogo } from "./Jogo.js";
import type { Entidade } from "../entities/Entidade.js";
import { LARGURA_CAMPO, ALTURA_CAMPO, distanciaEntre } from "./GeradorDeCampo.js";
import { calcularOuroBaseCombate } from "./Balancamento.js";
import { MotorIA } from "./MotorIA.js";

export type Turno = 'jogador' | 'inimigos';

export class SistemaDeCombate {
    public inimigos: Entidade[] = [];
    public turno: Turno = 'jogador';
    public passosRestantes: number = 10;
    public acaoRealizada: boolean = false;
    public turnoContador: number = 0;
    public mensagem: string = '';

    // Estado de seleção de alvo
    public selecionandoAlvo: boolean = false;
    public alvosVisiveis: Entidade[] = [];
    public indiceAlvoSelecionado: number = 0;
    private indiceHabilidadeAlvo: number = -1;

    // Ponteiros de comunicação com a Interface Gráfica (UI)
    private onAtualizarVisor: () => void = () => {};
    private onEncerrarVisor: () => void = () => {};

    public iniciar(inimigos: Entidade[], onAtualizar: () => void, onEncerrar: () => void): void {
        this.inimigos = inimigos;
        this.turno = 'jogador';
        this.passosRestantes = 10;
        this.acaoRealizada = false;
        this.turnoContador = 0;
        this.mensagem = 'A batalha começou!';
        this.selecionandoAlvo = false;

        this.onAtualizarVisor = onAtualizar;
        this.onEncerrarVisor = onEncerrar;

        this.posicionarEntidadesIniciais();
    }

    private posicionarEntidadesIniciais(): void {
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

    public tentarMoverJogador(dx: number, dy: number): void {
        if (this.turno !== 'jogador' || !jogo.jogador.vivo || this.passosRestantes <= 0) return;

        const novoX = jogo.jogador.x + dx;
        const novoY = jogo.jogador.y + dy;

        if (novoX < 0 || novoX >= LARGURA_CAMPO || novoY < 0 || novoY >= ALTURA_CAMPO) return;

        const inimigoAqui = this.inimigos.find(e => e.vivo && e.x === novoX && e.y === novoY);
        if (inimigoAqui) return;

        jogo.jogador.x = novoX;
        jogo.jogador.y = novoY;
        this.passosRestantes--;
        this.onAtualizarVisor();
    }

    public tentarMoverJogadorParaGrelha(x: number, y: number): void {
        const dist = distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x, y });
        if (dist <= this.passosRestantes && dist > 0) {
            jogo.jogador.x = x;
            jogo.jogador.y = y;
            this.passosRestantes -= dist;
            this.onAtualizarVisor();
        }
    }

    // =========================================================================
    // SISTEMA DE SELEÇÃO DE ALVO
    // =========================================================================

    public usarHabilidade(idx: number): void {
        if (this.turno !== 'jogador' || !jogo.jogador.vivo) return;

        if (this.selecionandoAlvo) {
            if (idx === this.indiceHabilidadeAlvo) {
                this.confirmarAlvo();
            }
            return;
        }

        if (this.acaoRealizada) {
            this.mensagem = "Já realizastes uma ação neste turno! Pressiona R para encerrar.";
            this.onAtualizarVisor();
            return;
        }

        const hab = jogo.jogador.habilidades[idx];
        if (!hab) return;

        if (jogo.jogador.mp < hab.custoMP) {
            this.mensagem = "MP insuficiente!";
            this.onAtualizarVisor();
            return;
        }

        // Habilidades autodirigidas executam imediatamente
        if (hab.tipo === 'cura' || hab.tipo === 'defesa') {
            this.executarHabilidade(idx);
            return;
        }

        // Habilidades de ataque entram em modo de seleção de alvo
        const teclaHab = ['A', 'S', 'D', 'F', 'G'][idx] ?? '?';
        this.alvosVisiveis = this.inimigos.filter(e => e.vivo &&
            distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x: e.x, y: e.y }) <= hab.alcance
        );

        if (this.alvosVisiveis.length === 0) {
            this.mensagem = "Nenhum inimigo ao alcance!";
            this.onAtualizarVisor();
            return;
        }

        this.selecionandoAlvo = true;
        this.indiceHabilidadeAlvo = idx;
        this.indiceAlvoSelecionado = 0;
        this.mensagem = `Alvo: ${this.alvosVisiveis[0].nome} | Tab: ciclar | R/${teclaHab}: confirmar | E: cancelar`;
        this.onAtualizarVisor();
    }

    public proximoAlvo(): void {
        if (!this.selecionandoAlvo || this.alvosVisiveis.length === 0) return;
        this.indiceAlvoSelecionado = (this.indiceAlvoSelecionado + 1) % this.alvosVisiveis.length;
        this.mensagem = `Alvo: ${this.alvosVisiveis[this.indiceAlvoSelecionado].nome}`;
        this.onAtualizarVisor();
    }

    public alvoAnterior(): void {
        if (!this.selecionandoAlvo || this.alvosVisiveis.length === 0) return;
        this.indiceAlvoSelecionado = (this.indiceAlvoSelecionado - 1 + this.alvosVisiveis.length) % this.alvosVisiveis.length;
        this.mensagem = `Alvo: ${this.alvosVisiveis[this.indiceAlvoSelecionado].nome}`;
        this.onAtualizarVisor();
    }

    public confirmarAlvo(): void {
        if (!this.selecionandoAlvo) return;
        this.selecionandoAlvo = false;
        this.executarHabilidade(this.indiceHabilidadeAlvo);
    }

    public cancelarSelecaoAlvo(): void {
        if (!this.selecionandoAlvo) return;
        this.selecionandoAlvo = false;
        this.indiceHabilidadeAlvo = -1;
        this.alvosVisiveis = [];
        this.mensagem = "Ação cancelada.";
        this.onAtualizarVisor();
    }

    // =========================================================================
    // EXECUÇÃO DE HABILIDADES
    // =========================================================================

    private executarHabilidade(idx: number): void {
        const hab = jogo.jogador.habilidades[idx];
        if (!hab) return;

        // Consome MP
        jogo.jogador.mp -= hab.custoMP;

        if (hab.tipo === 'cura') {
            const cura = Math.floor(jogo.jogador.hpMax * hab.cura);
            jogo.jogador.curar(cura);
            this.mensagem = `${hab.nome}! Recuperou ${cura} HP.`;
            this.finalizarAcao();
            return;
        }

        if (hab.tipo === 'defesa') {
            jogo.jogador.defesaBonus = jogo.jogador.defesa;
            this.mensagem = `${hab.nome}! Defesa dobrada neste turno.`;
            this.finalizarAcao();
            return;
        }

        if (hab.tipo === 'ataquearea') {
            const alvos = this.inimigos.filter(e => e.vivo &&
                distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x: e.x, y: e.y }) <= hab.alcance
            );
            for (const ini of alvos) {
                const dano = Math.floor((jogo.jogador.atk * 1.5));
                ini.receberDano(dano);
            }
            hab.som?.play()
            this.mensagem = `${hab.nome}! Causou dano em todos os inimigos ao alcance!`;
            this.finalizarAcao();
            return;
        }

        if (hab.tipo === 'ataque') {
            const alvo = this.alvosVisiveis[this.indiceAlvoSelecionado]
                ?? this.inimigos.filter(e => e.vivo
                    && distanciaEntre({ x: jogo.jogador.x, y: jogo.jogador.y }, { x: e.x, y: e.y }) <= hab.alcance
                )[0];
            if (!alvo) return;

            const mult = hab.nome === "Golpe Forte" ? 2 : 1;
            const dano = Math.floor((jogo.jogador.atk * mult));
            hab.som?.play()
            alvo.receberDano(dano);

            if (!alvo.vivo) {
                this.mensagem = `${hab.nome}! ${alvo.nome} derrotado!`;
            } else {
                this.mensagem = `${hab.nome}! Causou ${dano} de dano a ${alvo.nome}.`;
            }
            this.finalizarAcao();
            return;
        }
    }

    public usarPocao(): void {
        if (this.acaoRealizada) {
            this.mensagem = "Já realizaste uma ação neste turno!";
            this.onAtualizarVisor();
            return;
        }
        if (jogo.jogador.usarPocao()) {
            this.mensagem = "Usou poção! Recuperou vida.";
            this.finalizarAcao();
        } else {
            this.mensagem = "Sem poções!";
            this.onAtualizarVisor();
        }
    }

    private finalizarAcao(): void {
        this.acaoRealizada = true;
        this.alvosVisiveis = [];
        this.verificarFimCombate();
        this.onAtualizarVisor();
    }

    public encerrarTurnoJogador(): void {
        if (this.turno === 'inimigos') return;

        if (this.selecionandoAlvo) {
            this.cancelarSelecaoAlvo();
            return;
        }

        if (this.acaoRealizada || this.passosRestantes < 10) {
            this.iniciarTurnoInimigos();
        } else {
            this.mensagem = "Realiza uma ação ou move-te antes de encerrar o turno!";
            this.onAtualizarVisor();
        }
    }

    private iniciarTurnoInimigos(): void {
        this.turno = 'inimigos';
        jogo.jogador.defesaBonus = 0;
        this.onAtualizarVisor();

        setTimeout(() => {

            // Delegação absoluta para o novo módulo de Inteligência Artificial
            MotorIA.processarTurno(this.inimigos, jogo.jogador, (msg) => {
                // Guarda o registo do ataque para o ecrã desenhar
                this.mensagem = msg;
            });

            this.turno = 'jogador';
            this.passosRestantes = 10;
            this.acaoRealizada = false;
            this.turnoContador++;

            this.verificarFimCombate();
            this.onAtualizarVisor();

        }, 500);
    }

    private verificarFimCombate(): void {
        const inimigosVivos = this.inimigos.filter(e => e.vivo);

        if (inimigosVivos.length === 0) {
            const xpGanho = this.inimigos.length * 15 + this.turnoContador * 5;
            jogo.jogador.ganharXP(xpGanho);

            const ouroBaseGlobal = calcularOuroBaseCombate(jogo.jogador.mapaAtual);
            let totalOuroGanho = 0;
            for (const inimigo of this.inimigos) {
                const multiplicadorMonstro = (inimigo as any).multiplicadorOuro ?? 1.0;
                totalOuroGanho += Math.floor(ouroBaseGlobal * multiplicadorMonstro);
            }

            jogo.jogador.ganharOuro(totalOuroGanho);
            console.log(`[Motor] Combate vencido! Ouro total recebido: ${totalOuroGanho}`);

            this.onEncerrarVisor();
            jogo.vitoriaCombate();
            return;
        }

        if (!jogo.jogador.vivo) {
            this.onEncerrarVisor();
            jogo.derrota();
            return;
        }
    }
}
