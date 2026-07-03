import { Vitoria } from "../../ui/Vitoria.js";
export class VitoriaState {
    ui = new Vitoria();
    entrar(_jogo, app) {
        this.ui.abrir(app);
    }
    sair() {
        this.ui.fechar();
    }
}
