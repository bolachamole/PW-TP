import { MenuPrincipal } from "../ui/MenuPrincipal.js";
import { Base } from "../ui/Base.js";
import { Mundo } from "../ui/Mundo.js";
import { Combate } from "../ui/Combate.js";
import { Loja } from "../ui/Loja.js";
import { Evento } from "../ui/Evento.js";
import { Derrota } from "../ui/Derrota.js";
import { Vitoria } from "../ui/Vitoria.js";
import { GeradorDeGrafos, type NoGrafo } from "./GeradorDeGrafos.js";
import { Jogador } from "../entities/Jogador.js";
import { sortearInimigos, criarBoss } from "../entities/Inimigos.js";
import { espada1, magia1, vitoria } from "../constants.js";

type EstadoJogo = 'MenuInicial' | 'Base' | 'Mundo' | 'Combate' | 'Loja' | 'Evento' | 'Derrota' | 'Vitoria' | 'Pause';

class Jogo {
    app: HTMLElement;
    jogador: Jogador;

    private menuPrincipal: MenuPrincipal = new MenuPrincipal();
    private base: Base = new Base();
    private mundo: Mundo = new Mundo();
    private combate: Combate = new Combate();
    private loja: Loja = new Loja();
    private evento: Evento = new Evento();
    private telaDerrota: Derrota = new Derrota();
    private telaVitoria: Vitoria = new Vitoria();
    private geradorDeGrafos: GeradorDeGrafos = new GeradorDeGrafos();

    private estadoAtual: EstadoJogo = 'MenuInicial';
    private grafoAtual: Record<string, NoGrafo> = {};
    private profundidadeAtual: number = 4;
    private noAtualId: string | null = null;

    constructor() {
        this.app = document.getElementById("app")!;
        this.jogador = new Jogador();
    }

    private mudarEstado(novoEstado: EstadoJogo): void {
        this.estadoAtual = novoEstado;
        console.log(`[DEBUG] Estado alterado para ${novoEstado}`);
    }

    executando(): void {
        
        if (this.estadoAtual === 'MenuInicial') {
        
            this.menuPrincipal.abrir(this.app);
        
        }

        if (this.estadoAtual === 'Base') {
        
            this.base.iniciarPartida(this.app);
        
        }

    }

    iniciarPartida(): void {
        this.jogador.mapaAtual = 0;
        this.profundidadeAtual = 4;
        this.mudarEstado('Base');
        this.executando();
    }

    iniciarMenu(): void {
        this.mudarEstado('MenuInicial');
        this.executando();
    }

    iniciarMundo(): void {
        this.grafoAtual = this.geradorDeGrafos.gerarMapa(this.profundidadeAtual, 4);
        this.desbloquearProximosNos('no_0_0');
        this.noAtualId = 'no_0_0';
        this.mudarEstado('Mundo');
        this.mundo.abrir(this.app, this.grafoAtual, this.noAtualId);
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

    entrarNoNo(no: NoGrafo): void {

        this.noAtualId = no.id;
        this.desbloquearProximosNos(no.id);
        this.jogador.resetarParaNovoMapa();

        switch (no.tipo) {
            case 'Combate': {
                this.mudarEstado('Combate');
                const quantidade = 2 + Math.floor(this.jogador.mapaAtual * 0.5);
                const inimigos = sortearInimigos(quantidade, this.jogador.mapaAtual + 1);
                espada1.play().catch(() => {});
                this.combate.abrir(this.app, inimigos);
                break;
            }
            case 'Boss': {
                this.mudarEstado('Combate');
                const boss = criarBoss(this.jogador.mapaAtual + 1);
                const aliados = sortearInimigos(1, this.jogador.mapaAtual + 1);
                magia1.play().catch(() => {});
                this.combate.abrir(this.app, [boss, ...aliados]);
                break;
            }
            case 'Loja': {
                this.mudarEstado('Loja');
                this.loja.abrir(this.app);
                break;
            }
            case 'Evento': {
                this.mudarEstado('Evento');
                this.evento.abrir(this.app);
                break;
            }
            default: {
                this.voltarParaMundo();
            }
        }
    }

    vitoriaCombate(): void {
        vitoria.play().catch(() => {});

        if (this.noAtualId) {
            const noBoss = this.grafoAtual[this.noAtualId];
            if (noBoss?.tipo === 'Boss') {
                console.log("[DEBUG] Boss derrotado! Retornando ao Hamlet com os despojos.");

                this.jogador.aplicarHabilidadeTemporaria(null); 
                this.jogador.salvar();

                this.mudarEstado('Base');
                this.base.iniciarPartida(this.app);
                return;
            }
        }

        this.jogador.aplicarCuraPosCombate();
        this.voltarParaMundo();
    }

    getNoAtualId(): string | null {
        return this.noAtualId;
    }

    derrota(): void {
        this.mudarEstado('Derrota');
        this.telaDerrota.abrir(this.app);
    }

    voltarParaMundo(): void {
        if (this.estadoAtual === 'Vitoria') return;

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
                    this.jogador.mapaAtual++;
                    this.profundidadeAtual = Math.min(8, this.profundidadeAtual + 1);
                    this.iniciarMundo();
                    return;
                }
            }
        }

        this.mudarEstado('Mundo');
        this.mundo.abrir(this.app, this.grafoAtual, this.noAtualId);}
}

export const jogo = new Jogo();
