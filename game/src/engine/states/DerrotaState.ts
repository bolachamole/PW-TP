import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Derrota } from "../../ui/Derrota.js";

export class DerrotaState implements Estado {
    private ui = new Derrota();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.abrir(app);
    }

    sair(): void {
        this.ui.fechar();
    }
}