import { MenuPrincipal } from "../../ui/MenuPrincipal.js";
export class MenuInicialState {
    ui = new MenuPrincipal();
    entrar(_jogo, app) {
        this.ui.abrir(app);
    }
    sair() {
    }
}
