export class Entidade{
    id: string;
    vida: number;

    constructor(id:string, vida: number){
        this.id = id;
        this.vida = vida;
    }

    get getVida(): number{
        return this.vida;
    }

    perdeVida(dano: number){
        this.vida -= dano;
    }
}