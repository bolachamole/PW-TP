export const LARGURA_CAMPO = 12;
export const ALTURA_CAMPO = 6;
export function distanciaEntre(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
