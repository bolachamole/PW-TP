import { corte, urso } from "../../constants.js";
import { Entidade } from "../Entidade.js";
const habilidades = [
    { nome: "Garra", descricao: "Golpe de garra", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: corte },
    { nome: "Esmagar", descricao: "Ataque pesado", custoMP: 5, cura: 0, alcance: 2, tipo: 'ataque', som: urso }
];
export function criarUrso(nivel) {
    const e = new Entidade("Urso", 80 + nivel * 15, 20, 18 + nivel * 4, 5, habilidades);
    return e;
}
