import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Base } from "../../ui/Base.js";

export class BaseState implements Estado {
    private ui = new Base();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.iniciarPartida(app);
    }

    sair(): void {
    }
}