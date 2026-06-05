import { Entidade, type Habilidade } from "./Entidade.js";
import { BALANCAMENTO } from "../engine/Balancamento.js";
import { criarCamaleao } from "./enemies/Camaleao.js";
import { criarCaoDeCaca } from "./enemies/CaoDeCaca.js";
import { criarUrso } from "./enemies/Urso.js";
import { criarLouvaDeus } from "./enemies/LouvaDeus.js";
import { criarAranha } from "./enemies/Aranha.js";
import { criarPassaro } from "./enemies/Passaro.js";
import { criarVinha } from "./enemies/Vinha.js";
import { criarMercenario } from "./enemies/Mercenario.js";
import { explosao1, explosao2, magia1 } from "../constants.js";

type CriadorDeInimigo = (nivel: number) => Entidade;

interface InimigoDef {
    criar: CriadorDeInimigo;
    nivelMin: number;
    multOuro: number;
}

const INIMIGOS: InimigoDef[] = [
    { criar: criarCamaleao, nivelMin: 1, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_CAMALEAO },
    { criar: criarCaoDeCaca, nivelMin: 1, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_CAODECACA },
    { criar: criarVinha, nivelMin: 2, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_VINHA },
    { criar: criarAranha, nivelMin: 2, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_ARANHA },
    { criar: criarPassaro, nivelMin: 3, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_PASSARO },
    { criar: criarLouvaDeus, nivelMin: 3, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_LOUVADEUS },
    { criar: criarMercenario, nivelMin: 3, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_MERCENARIO },
    { criar: criarUrso, nivelMin: 4, multOuro: BALANCAMENTO.MONSTROS.MULT_OURO_URSO },
];

export function sortearInimigos(quantidade: number, nivel: number): Entidade[] {
    const disponiveis = INIMIGOS.filter(i => i.nivelMin <= Math.ceil(nivel / 2));
    const inimigos: Entidade[] = [];

    for (let i = 0; i < quantidade; i++) {
        const def = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        const monstro = def.criar(nivel);
        
        (monstro as any).multiplicadorOuro = def.multOuro;
        inimigos.push(monstro);
    }

    return inimigos;
}

export function criarBoss(nivel: number): Entidade {
    const habilidadesBoss: Habilidade[] = [
        { nome: "Garras Negras", descricao: "Ataque sombrio", custoMP: 0, alcance: 1, tipo: 'ataque', som: explosao1, cura: 0 },
        { nome: "Purpurina Venenosa", descricao: "Ataque sombrio", custoMP: 3, alcance: 3, tipo: 'ataque', som: magia1, cura: 0 },
        { nome: "Explosão", descricao: "Ataque em área", custoMP: 8, alcance: 5, tipo: 'ataquearea', som: explosao2, cura: 0 },
    ];

    const boss = new Entidade(
        "Guardião do Abismo",
        BALANCAMENTO.BOSS.HP_BASE + nivel * BALANCAMENTO.BOSS.HP_ESCALA,
        30,
        BALANCAMENTO.BOSS.ATK_BASE + nivel * BALANCAMENTO.BOSS.ATK_ESCALA,
        BALANCAMENTO.BOSS.DEF_BASE + nivel * BALANCAMENTO.BOSS.DEF_ESCALA,
        habilidadesBoss
    );

    (boss as any).multiplicadorOuro = BALANCAMENTO.MONSTROS.MULT_OURO_BOSS;

    return boss;
}