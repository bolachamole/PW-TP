import { magia2 } from "../constants.js";
export class Entidade {
    nome;
    hp;
    hpMax;
    mp;
    mpMax;
    atk;
    defesa;
    nivel;
    x;
    y;
    vivo;
    habilidades;
    defesaBonus;
    constructor(nome, hp, mp, atk, defesa, habilidades) {
        this.nome = nome;
        this.hp = hp;
        this.hpMax = hp;
        this.mp = mp;
        this.mpMax = mp;
        this.atk = atk;
        this.defesa = defesa;
        this.nivel = 1;
        this.x = 0;
        this.y = 0;
        this.vivo = true;
        this.habilidades = habilidades;
        this.defesaBonus = 0;
    }
    receberDano(dano) {
        const danoFinal = Math.max(1, dano - this.defesa - this.defesaBonus);
        this.hp = Math.max(0, this.hp - danoFinal);
        if (this.hp <= 0) {
            this.vivo = false;
        }
    }
    curar(quantidade) {
        this.hp = Math.min(this.hpMax, this.hp + quantidade);
        magia2.play().catch(() => { });
    }
    usarHabilidade(habilidade) {
        if (this.mp < habilidade.custoMP)
            return false;
        if (habilidade.som)
            habilidade.som.play().catch(() => { });
        this.mp -= habilidade.custoMP;
        return true;
    }
    resetarDefesaBonus() {
        this.defesaBonus = 0;
    }
    tocarSomAtaque() {
        const ataque = this.habilidades.find(h => h.tipo === 'ataque' || h.tipo === 'ataquearea');
        ataque?.som?.play().catch(() => { });
    }
}
