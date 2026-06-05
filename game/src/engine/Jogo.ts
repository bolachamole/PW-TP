import { Jogador } from "../entities/Jogador.js";
import type { NoGrafo } from "./GeradorDeGrafos.js";
import type { Estado } from "./Estado.js";

// Importação das instâncias dos estados decompostos
import { MenuInicialState } from "./states/MenuInicialState.js";
import { BaseState } from "./states/BaseState.js";
import { MundoState } from "./states/MundoState.js";
import { CombateState } from "./states/CombateState.js";
import { LojaState } from "./states/LojaState.js";
import { EventoState } from "./states/EventoState.js";
import { DerrotaState } from "./states/DerrotaState.js";
import { VitoriaState } from "./states/VitoriaState.js";

export class Jogo {
    public app: HTMLElement;
    public jogador: Jogador;

    // Registrador central de estados (mantém dados internos como o Grafo preservados)
    public estados = {
        menuInicial: new MenuInicialState(),
        base: new BaseState(),
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
        this.jogador.mapaAtual = 0;
        
        // Reseta o estado específico da expedição do grafo para uma run totalmente limpa
        this.estados.mundo.profundidadeAtual = 4;
        this.estados.mundo.grafoAtual = {};
        this.estados.mundo.noAtualId = null;

        this.transicionarPara(this.estados.base);
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
                console.log("[DEBUG] Boss derrotado! Salvando despojos e retornando à base.");
                this.jogador.aplicarHabilidadeTemporaria(null); 
                this.jogador.salvar();
                this.transicionarPara(this.estados.vitoria);
                return;
            }
        }

        this.jogador.aplicarCuraPosCombate();
        this.voltarParaMundo();
    }

    retornarParaBase(): void {
        this.transicionarPara(this.estados.base);
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
     * Reseta completamente a memória do jogo (Herói e Acampamento) para um Novo Jogo do zero.
     */
    novoJogoPartida(): void {
        console.log("[FSM] Limpando registros do localStorage para Novo Jogo...");
        
        // 1. Apaga fisicamente as chaves do navegador
        localStorage.removeItem('caves_of_memory_save');
        localStorage.removeItem('caves_of_memory_progresso');

        // 2. Força o reinício dos atributos do Singleton de Progresso Global
        import("./ProgressoGlobal.js").then(({ progressoGlobal }) => {
            progressoGlobal.ouro = 0;
            progressoGlobal.nivelPredioCura = 0;
            progressoGlobal.nivelPredioTreinamento = 0;
            progressoGlobal.nivelPredioHabilidades = 0;
            progressoGlobal.habilidadeBonusProximaRun = null;
            progressoGlobal.salvar();
        });

        // 3. Re-instancia um jogador totalmente limpo com atributos iniciais de balanceamento
        import("../entities/Jogador.js").then(({ Jogador }) => {
            this.jogador = new Jogador();
            
            // 4. Inicializa o grafo e transiciona para a base
            this.jogador.mapaAtual = 0;
            this.estados.mundo.profundidadeAtual = 4;
            this.estados.mundo.grafoAtual = {};
            this.estados.mundo.noAtualId = null;

            this.transicionarPara(this.estados.base);
        });
    }

    /**
     * Carrega os dados persistidos e envia o herói de volta ao Acampamento para continuar a expedição.
     */
    continuarPartida(): void {
        console.log("[FSM] Continuando jogo: Sincronizando dados salvos do Herói...");
        
        // Recarrega os atributos e grimório que estão guardados no save
        this.jogador.carregar();
        
        // Garante que o estado modular do mapa de nós seja resetado para a nova run, preservando o nível do herói
        this.estados.mundo.profundidadeAtual = 4;
        this.estados.mundo.grafoAtual = {};
        this.estados.mundo.noAtualId = null;

        // Direciona o jogador diretamente para a Base fortificada
        this.transicionarPara(this.estados.base);
    }
}

export const jogo = new Jogo();