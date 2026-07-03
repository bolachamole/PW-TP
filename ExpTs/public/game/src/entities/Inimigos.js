import { Entidade } from "./Entidade.js";
import { criarCamaleao } from "./enemies/Camaleao.js";
import { criarCaoDeCaca } from "./enemies/CaoDeCaca.js";
import { criarUrso } from "./enemies/Urso.js";
import { criarLouvaDeus } from "./enemies/LouvaDeus.js";
import { criarAranha } from "./enemies/Aranha.js";
import { criarPassaro } from "./enemies/Passaro.js";
import { criarVinha } from "./enemies/Vinha.js";
import { criarMercenario } from "./enemies/Mercenario.js";
import { explosao1, explosao2, magia1, BALANCAMENTO } from "../constants.js";
const INIMIGOS = [
    { criar: criarCamaleao, nivelMin: 1 },
    { criar: criarCaoDeCaca, nivelMin: 1 },
    { criar: criarVinha, nivelMin: 2 },
    { criar: criarAranha, nivelMin: 2 },
    { criar: criarPassaro, nivelMin: 3 },
    { criar: criarLouvaDeus, nivelMin: 3 },
    { criar: criarMercenario, nivelMin: 3 },
    { criar: criarUrso, nivelMin: 4 },
];
export function sortearInimigos(quantidade, nivel) {
    const disponiveis = INIMIGOS.filter(i => i.nivelMin <= nivel);
    const inimigos = [];
    for (let i = 0; i < quantidade; i++) {
        const def = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        const monstro = def.criar(nivel);
        inimigos.push(monstro);
    }
    return inimigos;
}
export function criarBoss(nivel) {
    const habilidadesBoss = [
        { nome: "Garras Negras", descricao: "Ataque sombrio", custoMP: 0, alcance: 1, tipo: 'ataque', som: explosao1, cura: 0 },
        { nome: "Purpurina Venenosa", descricao: "Ataque sombrio", custoMP: 3, alcance: 3, tipo: 'ataque', som: magia1, cura: 0 },
        { nome: "Explosão", descricao: "Ataque em área", custoMP: 8, alcance: 5, tipo: 'ataquearea', som: explosao2, cura: 0 },
    ];
    const boss = new Entidade("Guardião do Abismo", BALANCAMENTO.BOSS.HP_BASE + nivel * BALANCAMENTO.BOSS.HP_ESCALA, 30, BALANCAMENTO.BOSS.ATK_BASE + nivel * BALANCAMENTO.BOSS.ATK_ESCALA, BALANCAMENTO.BOSS.DEF_BASE + nivel * BALANCAMENTO.BOSS.DEF_ESCALA, habilidadesBoss);
    return boss;
}
