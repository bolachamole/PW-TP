import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Vitoria } from "../../ui/Vitoria.js";

export class VitoriaState implements Estado {
    private ui = new Vitoria();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.abrir(app);
    }

    sair(): void {
        this.ui.fechar();
    }
}