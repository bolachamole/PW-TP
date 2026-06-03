import { Entidade, type Habilidade } from "./Entidade.js";
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
}

const INIMIGOS: InimigoDef[] = [
    { criar: criarCamaleao, nivelMin: 1 },
    { criar: criarCaoDeCaca, nivelMin: 1 },
    { criar: criarVinha, nivelMin: 2 },
    { criar: criarAranha, nivelMin: 2 },
    { criar: criarPassaro, nivelMin: 3 },
    { criar: criarLouvaDeus, nivelMin: 3 },
    { criar: criarMercenario, nivelMin: 3 },
    { criar: criarUrso, nivelMin: 4 },
];

export function sortearInimigos(quantidade: number, nivel: number): Entidade[] {
    const disponiveis = INIMIGOS.filter(i => i.nivelMin <= Math.ceil(nivel / 2));
    const inimigos: Entidade[] = [];

    for (let i = 0; i < quantidade; i++) {
        const def = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        inimigos.push(def.criar(nivel));
    }

    return inimigos;
}

export function criarBoss(nivel: number): Entidade {
    const habilidadesBoss: Habilidade[] = [
        { nome: "Garras Negras", descricao: "Ataque sombrio", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: explosao1 },
        { nome: "Purpurina Venenosa", descricao: "Ataque sombrio", custoMP: 3, cura: 0, alcance: 3, tipo: 'ataque', som: magia1 },
        { nome: "Explosão", descricao: "Ataque em área", custoMP: 8, cura: 0, alcance: 5, tipo: 'ataquearea', som: explosao2 },
    ];

    const boss = new Entidade(
        "Guardião do Abismo",
        150 + nivel * 30,
        30,
        20 + nivel * 5,
        6 + nivel,
        habilidadesBoss
    );
    return boss;
}
