import { espada2 } from "../../constants.js";
import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Facão", descricao: "Ataque direto", custoMP: 0, cura: 0, alcance: 2, tipo: 'ataque', som: espada2 },
    { nome: "Esconde", descricao: "Entra em sua carapaça", custoMP: 4, cura: 0.2, alcance: 1, tipo: 'defesa', som: null }
];

export function criarMercenario(nivel: number): Entidade {
    const e = new Entidade("Mercenário", 40 + nivel * 10, 30, 10 + nivel * 2, 6, habilidades);
    return e;
}
