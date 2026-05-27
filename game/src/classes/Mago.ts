import { magia } from "../constants.js";
import { Entidade } from "./Entidade.js";

class Mago extends Entidade{
    mana: number;

    constructor(id:string, vida: number, mana: number){
        super(id, vida);
        this.mana = mana;
    }

    ataque1(inimigo: Entidade){
        magia.play();
        inimigo.perdeVida(15);
    }

    ataque2(inimigo: Entidade){
        magia.play();
        inimigo.perdeVida(30);
    }
}

export const heroi2 = new Mago("mago", 18, 100);