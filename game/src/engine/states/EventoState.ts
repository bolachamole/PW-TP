import type { Estado } from "../Estado.js";
import type { Jogo } from "../Jogo.js";
import { Evento } from "../../ui/Evento.js";

export class EventoState implements Estado {
    private ui = new Evento();

    entrar(_jogo: Jogo, app: HTMLElement): void {
        this.ui.abrir(app);
    }

    sair(): void {
        this.ui.fechar();
    }
}