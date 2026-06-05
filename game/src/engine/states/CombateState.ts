import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Combate } from "../../ui/Combate.js";
import { Entidade } from "../../entities/Entidade.js";

export class CombateState implements Estado {
    private ui = new Combate();

    entrar(_jogo: Jogo, app: HTMLElement, inimigos: Entidade[]): void {
        this.ui.abrir(app, inimigos);
    }

    sair(): void {
        this.ui.fechar();
    }
}