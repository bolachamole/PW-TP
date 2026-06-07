import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { GeradorDeGrafos, type NoGrafo } from "../GeradorDeGrafos.js";
import { Mundo as MundoUI } from "../../ui/Mundo.js";
import { sortearInimigos, criarBoss } from "../../entities/Inimigos.js";
import { BALANCAMENTO, espada1, magia1 } from "../../constants.js";

export class MundoState implements Estado {
    private mundoUI = new MundoUI();
    private geradorDeGrafos = new GeradorDeGrafos();
    private readonly STORAGE_KEY = BALANCAMENTO.MUNDO.STORAGE_KEY;

    public grafoAtual: Record<string, NoGrafo> = {};
    public profundidadeAtual: number = 4;
    public tamanhoCamadaAtual: number = 4;
    public noAtualId: string | null = null;

    entrar(jogo: Jogo, app: HTMLElement): void {
        if (Object.keys(this.grafoAtual).length === 0) {
            this.gerarNovoMapa(jogo);
        }
        this.mundoUI.abrir(app, this.grafoAtual, this.noAtualId);
    }

    sair(): void {
        this.mundoUI.fechar();
    }

    public gerarNovoMapa(_jogo: Jogo): void {
        this.grafoAtual = this.geradorDeGrafos.gerarMapa(this.profundidadeAtual, this.tamanhoCamadaAtual);
        this.noAtualId = 'no_0_0';
        this.desbloquearProximosNos('no_0_0');
    }

    private desbloquearProximosNos(idNo: string): void {
        const no = this.grafoAtual[idNo];
        if (!no) return;
        for (const proxId of no.proximos) {
            const prox = this.grafoAtual[proxId];
            if (prox) {
                prox.status = 'disponivel';
            }
        }
    }

    public entrarNoNo(jogo: Jogo, app: HTMLElement, no: NoGrafo): void {
        this.noAtualId = no.id;
        this.desbloquearProximosNos(no.id);
        jogo.jogador.resetarParaNovoMapa();

        switch (no.tipo) {
            case 'Combate': {
                const quantidade = 2 + Math.floor(jogo.jogador.mapaAtual * 0.5);
                const inimigos = sortearInimigos(quantidade, jogo.jogador.mapaAtual + 1);
                espada1.play().catch(() => {});
                jogo.transicionarPara(jogo.estados.combate, inimigos);
                break;
            }
            case 'Boss': {
                const boss = criarBoss(jogo.jogador.mapaAtual + 1);
                const aliados = sortearInimigos(1, jogo.jogador.mapaAtual + 1);
                magia1.play().catch(() => {});
                jogo.transicionarPara(jogo.estados.combate, [boss, ...aliados]);
                break;
            }
            case 'Loja': {
                jogo.transicionarPara(jogo.estados.loja);
                break;
            }
            case 'Evento': {
                jogo.transicionarPara(jogo.estados.evento);
                break;
            }
            default: {
                this.voltarParaMundo(jogo, app);
            }
        }
    }

    public voltarParaMundo(jogo: Jogo, _app: HTMLElement): void {
        const todosNaoBoss = Object.values(this.grafoAtual).filter(n => n.tipo !== 'Boss');
        const todosVisitados = todosNaoBoss.every(n => n.status === 'visitado' || n.status === 'bloqueado');

        if (todosVisitados) {
            const boss = Object.values(this.grafoAtual).find(n => n.tipo === 'Boss');
            if (boss) {
                boss.status = 'disponivel';
                if (this.noAtualId && this.grafoAtual[this.noAtualId]) {
                    const noAtual = this.grafoAtual[this.noAtualId];
                    if (!noAtual.proximos.includes(boss.id)) {
                        noAtual.proximos.push(boss.id);
                    }
                }
            }
        }

        if (this.noAtualId && this.grafoAtual[this.noAtualId]) {
            const noAtual = this.grafoAtual[this.noAtualId];
            const temDisponivel = noAtual.proximos.some(id => this.grafoAtual[id]?.status === 'disponivel');

            if (!temDisponivel && !todosVisitados) {
                const algumDisponivel = Object.values(this.grafoAtual).some(n => n.status === 'disponivel');
                if (!algumDisponivel) {
                    jogo.jogador.mapaAtual++;
                    this.profundidadeAtual = Math.min(8, this.profundidadeAtual + 1);
                    this.tamanhoCamadaAtual = Math.min(6, this.tamanhoCamadaAtual + 1);
                    this.gerarNovoMapa(jogo);
                }
            }
        }

        // Salva estado da expedição do grafo
        const dadosDoSave = {
            profundidadeAtual: this.profundidadeAtual,
            tamanhoCamadaAtual: this.tamanhoCamadaAtual,
            grafoAtual: this.grafoAtual,
            noAtualId: this.noAtualId
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dadosDoSave));
        console.log("[Save] Estado do mundo sincronizado.");

        jogo.transicionarPara(this);
    }

    public carregar(): void {
        const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
        if (!dadosSalvos) return;

        try {
            const dados = JSON.parse(dadosSalvos);
            this.profundidadeAtual = dados.profundidadeAtual;
            this.tamanhoCamadaAtual = dados.tamanhoCamadaAtual;
            this.grafoAtual = dados.grafoAtual as Record<string, NoGrafo>;
            this.noAtualId = dados.noAtualId;

            console.log("[Save] Grafo da expedição restaurado com sucesso.");
        } catch (e) {
            console.error("[ERRO] Falha crítica ao ler save do grafo.", e);
        }
    }
}
