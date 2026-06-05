const BASE = '/sprites/';

export const SPRITES = {
    player: `${BASE}PraetorianPrime.png`,
    largato: `${BASE}80px-Salthopper.png`,
    lobo: `${BASE}Dog_cherub.png`,
    urso: `${BASE}80px-Bear.png`,
    louvaDeus: `${BASE}80px-Horned_chameleon.png`,
    aranha: `${BASE}80px-Greater_voider.png`,
    passaro: `${BASE}80px-DreamTortoise.png`,
    vinha: `${BASE}80px-Qudzu.png`,
    boss: `${BASE}StarEyeEsper.png`,
    base: `${BASE}PraetorianPrime.png`,
    combate: `${BASE}80px-Salthopper.png`,
    loja: `${BASE}80px-DreamTortoise.png`,
    evento: `${BASE}80px-White_esh.png`,
    bossNode: `${BASE}StarEyeEsper.png`,
} as const;

export function spriteEnemy(nome: string): string {
    const map: Record<string, string> = {
        'Largato': SPRITES.largato,
        'Lobo': SPRITES.lobo,
        'Urso': SPRITES.urso,
        'Louva Deus': SPRITES.louvaDeus,
        'Aranha': SPRITES.aranha,
        'Pássaro': SPRITES.passaro,
        'Vinha Viva': SPRITES.vinha,
        'Guardião do Abismo': SPRITES.boss,
    };
    return map[nome] || SPRITES.lobo;
}

export function spriteNode(tipo: string): string {
    const map: Record<string, string> = {
        'Base': SPRITES.base,
        'Combate': SPRITES.combate,
        'Loja': SPRITES.loja,
        'Evento': SPRITES.evento,
        'Boss': SPRITES.bossNode,
    };
    return map[tipo] || SPRITES.evento;
}
