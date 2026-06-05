import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Loja } from "../../ui/Loja.js";

export class LojaState implements Estado {
    private ui = new Loja();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.abrir(app);
    }

    sair(): void {
        this.ui.fechar();
    }
}