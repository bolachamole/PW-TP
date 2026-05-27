import { espada } from "../constants.js";
import { Entidade } from "./Entidade.js";

class Cavaleiro extends Entidade{
    ataque1(inimigo: Entidade){
        espada.play();
        inimigo.perdeVida(20);
    }

    ataque2(inimigo: Entidade){
        espada.play();
        inimigo.perdeVida(15);
    }
}

export const heroi1 = new Cavaleiro("espada", 20);