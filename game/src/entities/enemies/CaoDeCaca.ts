import { corte, uivo } from "../../constants.js";
import { Entidade, type Habilidade } from "../Entidade.js";

const habilidades: Habilidade[] = [
    { nome: "Mordida", descricao: "Mordida forte", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: corte },
    { nome: "Uivo", descricao: "Aumenta o ataque", custoMP: 3, cura: 0, alcance: 0, tipo: 'defesa', som: uivo }
];

export function criarCaoDeCaca(nivel: number): Entidade {
    const e = new Entidade("Cão de caça", 40 + nivel * 10, 15, 12 + nivel * 3, 3, habilidades);
    return e;
}
