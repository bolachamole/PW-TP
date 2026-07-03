import { Evento } from "../../ui/Evento.js";
export class EventoState {
    ui = new Evento();
    entrar(_jogo, app) {
        this.ui.abrir(app);
    }
    sair() {
        this.ui.fechar();
    }
}
