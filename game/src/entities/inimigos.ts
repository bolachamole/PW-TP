import { Entidade, type Habilidade } from "./Entidade.js";
import { criarLargato } from "./enemies/Largato.js";
import { criarLobo } from "./enemies/Lobo.js";
import { criarUrso } from "./enemies/Urso.js";
import { criarLouvaDeus } from "./enemies/LouvaDeus.js";
import { criarAranha } from "./enemies/Aranha.js";
import { criarPassaro } from "./enemies/Passaro.js";
import { criarVinha } from "./enemies/Vinha.js";

type CriadorDeInimigo = (nivel: number) => Entidade;

interface InimigoDef {
    nome: string;
    criar: CriadorDeInimigo;
    nivelMin: number;
}

const INIMIGOS: InimigoDef[] = [
    { nome: "Largato", criar: criarLargato, nivelMin: 1 },
    { nome: "Lobo", criar: criarLobo, nivelMin: 1 },
    { nome: "Vinha Viva", criar: criarVinha, nivelMin: 2 },
    { nome: "Aranha", criar: criarAranha, nivelMin: 2 },
    { nome: "Pássaro", criar: criarPassaro, nivelMin: 3 },
    { nome: "Louva Deus", criar: criarLouvaDeus, nivelMin: 3 },
    { nome: "Urso", criar: criarUrso, nivelMin: 4 },
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
        { nome: "Garras Negras", descricao: "Ataque sombrio", custoMP: 0, danoBase: 0, cura: 0, alcance: 3, tipo: 'ataque' },
        { nome: "Explosão", descricao: "Ataque em área", custoMP: 8, danoBase: 0, cura: 0, alcance: 5, tipo: 'ataquearea' },
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
