import { Entidade, type Habilidade } from "./Entidade.js";

const HABILIDADES_INICIAIS: Habilidade[] = [
    {
        nome: "Ataque Básico",
        descricao: "Ataque simples com a espada",
        custoMP: 0,
        danoBase: 0,
        cura: 0,
        alcance: 2,
        tipo: 'ataque'
    },
    {
        nome: "Golpe Forte",
        descricao: "Ataque poderoso que causa 2x dano",
        custoMP: 5,
        danoBase: 0,
        cura: 0,
        alcance: 2,
        tipo: 'ataque'
    },
    {
        nome: "Postura Defensiva",
        descricao: "Dobra a defesa por um turno",
        custoMP: 3,
        danoBase: 0,
        cura: 0,
        alcance: 0,
        tipo: 'defesa'
    },
    {
        nome: "Cura",
        descricao: "Recupera 30% da vida máxima",
        custoMP: 8,
        danoBase: 0,
        cura: 0.3,
        alcance: 0,
        tipo: 'cura'
    },
    {
        nome: "Rajada",
        descricao: "Ataque em área que causa 1.5x dano em todos",
        custoMP: 10,
        danoBase: 0,
        cura: 0,
        alcance: 3,
        tipo: 'ataquearea'
    }
];

export class Jogador extends Entidade {
    xp: number;
    xpParaProximoNivel: number;
    pocoes: number;
    mapaAtual: number;

    constructor() {
        super("John Ancestoor", 100, 50, 15, 5, HABILIDADES_INICIAIS);
        this.xp = 0;
        this.xpParaProximoNivel = 50;
        this.pocoes = 3;
        this.mapaAtual = 0;
    }

    ganharXP(quantidade: number): boolean {
        this.xp += quantidade;
        if (this.xp >= this.xpParaProximoNivel) {
            this.subirDeNivel();
            return true;
        }
        return false;
    }

    private subirDeNivel(): void {
        this.xp -= this.xpParaProximoNivel;
        this.nivel++;
        this.xpParaProximoNivel = Math.floor(this.xpParaProximoNivel * 1.5);
        this.hpMax += 20;
        this.hp = this.hpMax;
        this.mpMax += 10;
        this.mp = this.mpMax;
        this.atk += 3;
        this.defesa += 1;
        console.log(`[DEBUG] Jogador subiu para o nível ${this.nivel}!`);
    }

    usarPocao(): boolean {
        if (this.pocoes <= 0) return false;
        this.pocoes--;
        this.curar(Math.floor(this.hpMax * 0.4));
        return true;
    }

    resetarParaNovoMapa(): void {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }
}
