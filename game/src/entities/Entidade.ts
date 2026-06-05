import { magia2 } from "../constants.js";

export interface Habilidade {
    nome: string;
    descricao: string;
    custoMP: number;
    cura: number;
    alcance: number;
    tipo: 'ataque' | 'cura' | 'defesa' | 'ataquearea';
    som: HTMLAudioElement | null;
    multiplicador?: number;
}

export class Entidade {
    nome: string;
    hp: number;
    hpMax: number;
    mp: number;
    mpMax: number;
    atk: number;
    defesa: number;
    nivel: number;
    x: number;
    y: number;
    vivo: boolean;
    habilidades: Habilidade[];
    defesaBonus: number;
    multiplicadorOuro: number = 1.0;

    constructor(nome: string, hp: number, mp: number, atk: number, defesa: number, habilidades: Habilidade[]) {
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

    receberDano(dano: number): void {
        const danoFinal = Math.max(1, dano - this.defesa - this.defesaBonus);
        this.hp = Math.max(0, this.hp - danoFinal);
        if (this.hp <= 0) {
            this.vivo = false;
        }
    }

    curar(quantidade: number): void {
        this.hp = Math.min(this.hpMax, this.hp + quantidade);
        magia2.play().catch(() => {});
    }

    usarHabilidade(habilidade: Habilidade): boolean {
        if (this.mp < habilidade.custoMP) return false;
        if (habilidade.som) habilidade.som.play().catch(() => {});
        this.mp -= habilidade.custoMP;
        return true;
    }

    resetarDefesaBonus(): void {
        this.defesaBonus = 0;
    }

    tocarSomAtaque(): void {
        const ataque = this.habilidades.find(h => h.tipo === 'ataque' || h.tipo === 'ataquearea');
        ataque?.som?.play().catch(() => {});
    }
}
