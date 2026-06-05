import { jogo } from "../engine/Jogo.js";
import type { Entidade } from "../entities/Entidade.js";
import { SistemaDeCombate } from "../engine/SistemaDeCombate.js";

// Importação dos novos sub-componentes visuais
import { CombateHUD } from "./CombateHUD.js";
import { CombateGrelha } from "./CombateGrelha.js";
import { CombateAcoes } from "./CombateAcoes.js";

export class Combate {
    private elementoDOM: HTMLDivElement | null = null;
    private listenerTeclado: ((e: KeyboardEvent) => void) | null = null;
    
    // Motor de Regras
    private motor = new SistemaDeCombate();

    // Sub-componentes da Interface
    private hud = new CombateHUD();
    private grelha = new CombateGrelha();
    private acoes = new CombateAcoes();

    public abrir(containerPai: HTMLElement, inimigos: Entidade[]): void {
        if (document.getElementById('tela-combate')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-combate';
        this.elementoDOM.className = 'tela-combate';
        containerPai.appendChild(this.elementoDOM);

        // O Motor inicia e avisa a classe mãe para re-pintar os filhos
        this.motor.iniciar(
            inimigos,
            () => this.atualizarVisor(), 
            () => this.fechar()
        );

        // Cada componente constrói a sua própria Div estática
        this.hud.construir(this.elementoDOM);
        this.grelha.construir(this.elementoDOM, this.motor); // A grelha precisa do motor para enviar cliques
        this.acoes.construir(this.elementoDOM);  // As ações precisam do motor para usar habilidades

        this.atualizarVisor();
        this.adicionarListenersTeclado();
    }

    private atualizarVisor(): void {
        if (!this.elementoDOM) return;

        // Cada componente sabe exatamente como desenhar os seus próprios dados
        this.hud.pintar(jogo.jogador, this.motor.inimigos);
        this.grelha.pintar(jogo.jogador, this.motor);
        this.acoes.pintar(jogo.jogador, this.motor);
    }

    private adicionarListenersTeclado(): void {
        this.removerListeners();
        this.listenerTeclado = (e: KeyboardEvent) => {
            if (this.motor.turno !== 'jogador' || !jogo.jogador.vivo) return;

            switch (e.key) {
                case 'ArrowUp': e.preventDefault(); this.motor.tentarMoverJogador(0, -1); break;
                case 'ArrowDown': e.preventDefault(); this.motor.tentarMoverJogador(0, 1); break;
                case 'ArrowLeft': e.preventDefault(); this.motor.tentarMoverJogador(-1, 0); break;
                case 'ArrowRight': e.preventDefault(); this.motor.tentarMoverJogador(1, 0); break;
                case 'a': case 'A': this.motor.usarHabilidade(0); break;
                case 's': case 'S': this.motor.usarHabilidade(1); break;
                case 'd': case 'D': this.motor.usarHabilidade(2); break;
                case 'f': case 'F': this.motor.usarHabilidade(3); break;
                case 'g': case 'G': this.motor.usarHabilidade(4); break;
                case 'e': case 'E': this.motor.usarPocao(); break;
                case 'r': case 'R': this.motor.encerrarTurnoJogador(); break;
            }
        };
        window.addEventListener('keydown', this.listenerTeclado);
    }

    private removerListeners(): void {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
    }

    public fechar(): void {
        this.removerListeners();
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}