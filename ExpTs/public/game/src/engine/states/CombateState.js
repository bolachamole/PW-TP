import { Combate } from "../../ui/Combate.js";
export class CombateState {
    ui = new Combate();
    entrar(_jogo, app, inimigos) {
        this.ui.abrir(app, inimigos);
    }
    sair() {
        this.ui.fechar();
    }
}
