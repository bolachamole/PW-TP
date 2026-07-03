import { jogo } from "../engine/Jogo.js";
import { SistemaDeCombate } from "../engine/SistemaDeCombate.js";
// Importação dos novos sub-componentes visuais
import { CombateHUD } from "./CombateHUD.js";
import { CombateGrelha } from "./CombateGrelha.js";
import { CombateAcoes } from "./CombateAcoes.js";
export class Combate {
    elementoDOM = null;
    listenerTeclado = null;
    // Motor de Regras
    motor = new SistemaDeCombate();
    // Sub-componentes da Interface
    hud = new CombateHUD();
    grelha = new CombateGrelha();
    acoes = new CombateAcoes();
    abrir(containerPai, inimigos) {
        if (document.getElementById('tela-combate'))
            return;
        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-combate';
        this.elementoDOM.className = 'tela-combate';
        containerPai.appendChild(this.elementoDOM);
        // O Motor inicia e avisa a classe mãe para re-pintar os filhos
        this.motor.iniciar(inimigos, () => this.atualizarVisor(), () => this.fechar());
        // Cada componente constrói a sua própria Div estática
        this.hud.construir(this.elementoDOM);
        this.grelha.construir(this.elementoDOM, this.motor); // A grelha precisa do motor para enviar cliques
        this.acoes.construir(this.elementoDOM); // As ações precisam do motor para usar habilidades
        this.atualizarVisor();
        this.adicionarListenersTeclado();
    }
    atualizarVisor() {
        if (!this.elementoDOM)
            return;
        // Cada componente sabe exatamente como desenhar os seus próprios dados
        this.hud.pintar(jogo.jogador, this.motor.inimigos, this.motor);
        this.grelha.pintar(jogo.jogador, this.motor);
        this.acoes.pintar(jogo.jogador, this.motor);
    }
    adicionarListenersTeclado() {
        this.removerListeners();
        this.listenerTeclado = (e) => {
            if (this.motor.turno !== 'jogador' || !jogo.jogador.vivo)
                return;
            // Atalhos durante a seleção de alvo
            if (this.motor.selecionandoAlvo) {
                switch (e.key) {
                    case 'Tab':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.motor.alvoAnterior();
                        }
                        else {
                            this.motor.proximoAlvo();
                        }
                        break;
                    case 'r':
                    case 'R':
                        e.preventDefault();
                        this.motor.confirmarAlvo();
                        break;
                    case 'e':
                    case 'E':
                        e.preventDefault();
                        this.motor.cancelarSelecaoAlvo();
                        break;
                    case 'a':
                    case 'A':
                        this.motor.usarHabilidade(0);
                        break;
                    case 's':
                    case 'S':
                        this.motor.usarHabilidade(1);
                        break;
                    case 'd':
                    case 'D':
                        this.motor.usarHabilidade(2);
                        break;
                    case 'f':
                    case 'F':
                        this.motor.usarHabilidade(3);
                        break;
                    case 'g':
                    case 'G':
                        this.motor.usarHabilidade(4);
                        break;
                }
                return;
            }
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.motor.tentarMoverJogador(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.motor.tentarMoverJogador(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.motor.tentarMoverJogador(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.motor.tentarMoverJogador(1, 0);
                    break;
                case 'a':
                case 'A':
                    this.motor.usarHabilidade(0);
                    break;
                case 's':
                case 'S':
                    this.motor.usarHabilidade(1);
                    break;
                case 'd':
                case 'D':
                    this.motor.usarHabilidade(2);
                    break;
                case 'f':
                case 'F':
                    this.motor.usarHabilidade(3);
                    break;
                case 'g':
                case 'G':
                    this.motor.usarHabilidade(4);
                    break;
                case 'e':
                case 'E':
                    this.motor.usarPocao();
                    break;
                case 'r':
                case 'R':
                    this.motor.encerrarTurnoJogador();
                    break;
            }
        };
        window.addEventListener('keydown', this.listenerTeclado);
    }
    removerListeners() {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
    }
    fechar() {
        this.removerListeners();
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}
