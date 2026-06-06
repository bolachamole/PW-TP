import { Jogador } from "../entities/Jogador.js";
import type { NoGrafo } from "./GeradorDeGrafos.js";
import type { Estado } from "./Estado.js";

// Importação das instâncias dos estados decompostos
import { MenuInicialState } from "./states/MenuInicialState.js";
import { MundoState } from "./states/MundoState.js";
import { CombateState } from "./states/CombateState.js";
import { LojaState } from "./states/LojaState.js";
import { EventoState } from "./states/EventoState.js";
import { DerrotaState } from "./states/DerrotaState.js";
import { VitoriaState } from "./states/VitoriaState.js";
import { Vitoria } from "../ui/Vitoria.js";

export class Jogo {
    public app: HTMLElement;
    public jogador: Jogador;
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
        this.tela_vitoria = new Vitoria();
    }

    /**
     * Motor da FSM: Desativa o estado anterior e injeta o novo contexto de execução
     */
    public transicionarPara(novoEstado: Estado, ...args: any[]): void {
        if (this.estadoAtual) {
            this.estadoAtual.sair();
        }
        this.estadoAtual = novoEstado;
        console.log(`[FSM DEBUG] Transição de estado ativa para: ${novoEstado.constructor.name}`);
        this.estadoAtual.entrar(this, this.app, ...args);
    }

    // --- MÉTODOS DE COMPATIBILIDADE DE API (Evita quebras nas telas de UI) ---

    executando(): void {
        if (!this.estadoAtual) {
            this.transicionarPara(this.estados.menuInicial);
        }
    }

    iniciarPartida(): void {
        localStorage.removeItem('caves_of_memory_save');
        this.jogador = new Jogador();
        this.jogador.mapaAtual = 0;

        // Reseta o estado específico da expedição do grafo para uma run totalmente limpa
        this.estados.mundo.profundidadeAtual = 4;
        this.estados.mundo.tamanhoCamadaAtual = 4;
        this.estados.mundo.grafoAtual = {};
        this.estados.mundo.noAtualId = null;

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

        this.jogador.mapaAtual++;
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
     * Reseta completamente a memória do jogo (Herói) para um Novo Jogo do zero.
     */
    novoJogoPartida(): void {
        console.log("[FSM] Limpando registros do localStorage para Novo Jogo...");

        // 1. Apaga fisicamente as chaves do navegador
        localStorage.removeItem('caves_of_memory_save');
        localStorage.removeItem('caves_of_nodes_progresso');

        // 3. Re-instancia um jogador totalmente limpo com atributos iniciais de balanceamento
        import("../entities/Jogador.js").then(({ Jogador }) => {
            this.jogador = new Jogador();

            // 4. Inicializa o grafo e inicia a expedição
            this.jogador.mapaAtual = 0;
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
        console.log("[FSM] Continuando jogo: Sincronizando dados salvos do Herói...");

        // Recarrega os atributos e grimório que estão guardados no save
        this.jogador.carregar();

        // Garante que o estado modular do mapa de nós seja resetado para a nova run, preservando o nível do herói
        this.estados.mundo.profundidadeAtual = 4;
        this.estados.mundo.tamanhoCamadaAtual = 4;
        this.estados.mundo.grafoAtual = {};
        this.estados.mundo.noAtualId = null;

        this.estados.mundo.gerarNovoMapa(this);
        this.transicionarPara(this.estados.mundo);
    }
}

export const jogo = new Jogo();
