import { Loja } from "../../ui/Loja.js";
export class LojaState {
    ui = new Loja();
    entrar(_jogo, app) {
        this.ui.abrir(app);
    }
    sair() {
        this.ui.fechar();
    }
}
