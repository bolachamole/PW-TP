import type { Estado } from "../Estado.js";
import { Jogo } from "../Jogo.js";
import { MenuPrincipal } from "../../ui/MenuPrincipal.js";

export class MenuInicialState implements Estado {
    private ui = new MenuPrincipal();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.abrir(app);
    }

    sair(): void {
    }
}