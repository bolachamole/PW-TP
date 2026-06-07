import { Jogador } from "../entities/Jogador.js";
import type { NoGrafo } from "./GeradorDeGrafos.js";
import type { Estado } from "./Estado.js";
import { MenuInicialState } from "./states/MenuInicialState.js";
import { MundoState } from "./states/MundoState.js";
import { CombateState } from "./states/CombateState.js";
import { LojaState } from "./states/LojaState.js";
import { EventoState } from "./states/EventoState.js";
import { DerrotaState } from "./states/DerrotaState.js";
import { VitoriaState } from "./states/VitoriaState.js";
import { Vitoria } from "../ui/Vitoria.js";
import { BALANCAMENTO } from "../constants.js";

export class Jogo {
    public app: HTMLElement;
    public jogador: Jogador;
    public volume: number;
    private tela_vitoria: Vitoria;

    // Registrador central de estados (mantém dados internos como o Grafo preservados)
    public estados = {
        menuInicial: new MenuInicialState(),
        mundo: new MundoState(),
        combate: new CombateState(),
        loja: new LojaState(),
        evento: new EventoState(),
        derrota: new DerrotaState(),
        vitoria: new VitoriaState()
    };

    private estadoAtual: Estado | null = null;

    constructor() {
        this.app = document.getElementById("app")!;
        this.jogador = new Jogador();
        this.volume = 0.5;
        this.tela_vitoria = new Vitoria();
    }

    /**
     * Desativa o estado anterior e injeta o novo contexto de execução
     */
    public transicionarPara(novoEstado: Estado, ...args: any[]): void {
        if (this.estadoAtual) {
            this.estadoAtual.sair();
        }
        this.estadoAtual = novoEstado;
        console.log(`[DEBUG] Transição de estado ativa para: ${novoEstado.constructor.name}`);
        this.estadoAtual.entrar(this, this.app, ...args);
    }

    executando(): void {
        if (!this.estadoAtual) {
            this.transicionarPara(this.estados.menuInicial);
        }
    }

    iniciarPartida(): void {
        localStorage.removeItem(BALANCAMENTO.JOGADOR.STORAGE_KEY);
        localStorage.removeItem(BALANCAMENTO.MUNDO.STORAGE_KEY);
        this.jogador = new Jogador();

        // Reseta o estado específico da expedição do grafo para uma run totalmente limpa
        this.estados.mundo.profundidadeAtual = 4;
        this.estados.mundo.tamanhoCamadaAtual = 4;
        this.estados.mundo.grafoAtual = {};
        this.estados.mundo.noAtualId = null;
        this.estados.mundo.mapaAtual = 0;

        this.estados.mundo.gerarNovoMapa(this);
        this.transicionarPara(this.estados.mundo);
    }

    iniciarMenu(): void {
        this.transicionarPara(this.estados.menuInicial);
    }

    iniciarMundo(): void {
        this.estados.mundo.gerarNovoMapa(this);
        this.transicionarPara(this.estados.mundo);
    }

    entrarNoNo(no: NoGrafo): void {
        this.estados.mundo.entrarNoNo(this, this.app, no);
    }

    vitoriaCombate(): void {
        const mundo = this.estados.mundo;
        if (mundo.noAtualId) {
            const noBoss = mundo.grafoAtual[mundo.noAtualId];
            if (noBoss?.tipo === 'Boss') {
                
                console.log("[DEBUG] Boss derrotado! Gerando novo mapa mais difícil...");
                
                this.transicionarPara(this.estados.vitoria);
                this.tela_vitoria.abrir(this.app);
                
                return;

            }
        }

        this.jogador.aplicarCuraPosCombate();
        this.voltarParaMundo();
    }

    avancarProximoMapa(): void {
        console.log("[DEBUG] Gerando próximo mapa...");
        const mundo = this.estados.mundo;

        mundo.mapaAtual++;
        this.jogador.resetarParaNovoMapa();
        this.jogador.salvar();
        
        mundo.profundidadeAtual = Math.min(10, mundo.profundidadeAtual + 1);
        mundo.tamanhoCamadaAtual = Math.min(6, mundo.tamanhoCamadaAtual + 1);
        mundo.gerarNovoMapa(this);
        
        this.transicionarPara(mundo);
    }

    derrota(): void {
        this.transicionarPara(this.estados.derrota);
    }

    voltarParaMundo(): void {
        this.estados.mundo.voltarParaMundo(this, this.app);
    }

    getNoAtualId(): string | null {
        return this.estados.mundo.noAtualId;
    }

    /**
     * Reseta completamente o localStorage para um Novo Jogo do zero.
     */
    novoJogoPartida(): void {
        console.log("[DEBUG] Limpando registros do localStorage para Novo Jogo...");

        // 1. Apaga fisicamente as chaves do navegador
        localStorage.removeItem(BALANCAMENTO.JOGADOR.STORAGE_KEY);

        // 3. Re-instancia um jogador totalmente limpo com atributos iniciais de balanceamento
        import("../entities/Jogador.js").then(({ Jogador }) => {
            this.jogador = new Jogador();

            // 4. Inicializa o grafo e inicia a expedição
            this.estados.mundo.mapaAtual = 1;
            this.estados.mundo.profundidadeAtual = 4;
            this.estados.mundo.tamanhoCamadaAtual = 4;
            this.estados.mundo.grafoAtual = {};
            this.estados.mundo.noAtualId = null;

            this.estados.mundo.gerarNovoMapa(this);
            this.transicionarPara(this.estados.mundo);
        });
    }

    /**
     * Carrega os dados persistidos e continua a expedição.
     */
    continuarPartida(): void {
        console.log("[DEBUG] Continuando jogo: Sincronizando dados salvos do Herói...");

        // Recarrega os atributos e grimório que estão guardados no save
        this.jogador.carregar();
        this.estados.mundo.carregar();
        
        this.transicionarPara(this.estados.mundo);
    }
}

export const jogo = new Jogo();
