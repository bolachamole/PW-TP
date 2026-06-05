import { SPRITES } from "../constants.js";

export function spriteEnemy(nome: string): string {
    const map: Record<string, string> = {
        'Camaleão': SPRITES.camaleao,
        'Cão de caça': SPRITES.cao,
        'Urso': SPRITES.urso,
        'Formiga': SPRITES.formiga,
        'Aranha': SPRITES.aranha,
        'Pássaro': SPRITES.passaro,
        'Vinha Viva': SPRITES.vinha,
        'Mercenário': SPRITES.mercenario,
        'Guardião do Abismo': SPRITES.boss,
    };
    return map[nome] || SPRITES.cao;
}

export function spriteNode(tipo: string): string {
    const map: Record<string, string> = {
        'Base': SPRITES.base,
        'Combate': SPRITES.combate,
        'Loja': SPRITES.loja,
        'Evento': SPRITES.evento,
        'Boss': SPRITES.boss,
    };
    return map[tipo] || SPRITES.evento;
}
