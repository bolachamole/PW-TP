import { mordida } from "../../constants.js";
import { Entidade } from "../Entidade.js";
const habilidades = [
    { nome: "Mordida", descricao: "Mordida rápida", custoMP: 0, cura: 0, alcance: 1, tipo: 'ataque', som: mordida }
];
export function criarCamaleao(nivel) {
    const e = new Entidade("Camaleão", 20 + nivel * 8, 10, 8 + nivel * 2, 2, habilidades);
    return e;
}
