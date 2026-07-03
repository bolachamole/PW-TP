import { Derrota } from "../../ui/Derrota.js";
export class DerrotaState {
    ui = new Derrota();
    entrar(_jogo, app) {
        this.ui.abrir(app);
    }
    sair() {
        this.ui.fechar();
    }
}
