import { distanciaEntre, LARGURA_CAMPO, ALTURA_CAMPO } from "./GeradorDeCampo.js";
import type { Entidade } from "../entities/Entidade.js";

export class MotorIA {
    /**
     * Orquestra o turno de todas as entidades hostis.
     */
    public static processarTurno(inimigos: Entidade[], alvo: Entidade, onAcaoRealizada: (msg: string) => void): void {
        for (const inimigo of inimigos.filter(e => e.vivo)) {
            
            // --- COMPORTAMENTOS DISTINTOS (Requisito Funcionalidades Adicionais) ---

            // Comportamento 1: O Mercenário foge se estiver a morrer
            if (inimigo.nome === 'Mercenário' && (inimigo.hp / inimigo.hpMax) < 0.3) {
                this.moverFugindo(inimigo, alvo, inimigos);
                onAcaoRealizada(`${inimigo.nome} está a recuar em pânico!`);
                continue;
            }

            // Comportamento 2: A Aranha não se move, mas ataca com teias à distância
            if (inimigo.nome === 'Aranha') {
                this.atacarDistancia(inimigo, alvo, 4, onAcaoRealizada);
                continue;
            }

            // --- COMPORTAMENTO PADRÃO (Avançar e Atacar Corpo-a-Corpo) ---
            this.moverParaAlvo(inimigo, alvo, inimigos);
            this.atacarCorpoACorpo(inimigo, alvo, onAcaoRealizada);
        }
    }

    private static moverParaAlvo(inimigo: Entidade, alvo: Entidade, todosInimigos: Entidade[]): void {
        const dx = Math.sign(alvo.x - inimigo.x);
        const dy = Math.sign(alvo.y - inimigo.y);
        const dist = distanciaEntre({ x: inimigo.x, y: inimigo.y }, { x: alvo.x, y: alvo.y });

        // Só se move se não estiver colado ao jogador
        if (dist > 1) { 
            const moveX = Math.random() > 0.5;
            let novoX = inimigo.x;
            let novoY = inimigo.y;

            if (moveX && dx !== 0) novoX += dx;
            else if (dy !== 0) novoY += dy;
            else novoX += dx; // fallback

            // Validação 1: Impede a entidade de sair da grelha
            if (novoX < 0 || novoX >= LARGURA_CAMPO) novoX = inimigo.x;
            if (novoY < 0 || novoY >= ALTURA_CAMPO) novoY = inimigo.y;

            // Validação 2: Impede que os monstros se sobreponham uns aos outros ou ao jogador
            const posicaoOcupada = todosInimigos.some(e => e.vivo && e !== inimigo && e.x === novoX && e.y === novoY) 
                                   || (alvo.x === novoX && alvo.y === novoY);
            
            if (!posicaoOcupada) {
                inimigo.x = novoX;
                inimigo.y = novoY;
            }
        }
    }

    private static moverFugindo(inimigo: Entidade, alvo: Entidade, _todosInimigos: Entidade[]): void {
        // Lógica de fuga inverte o sinal do vetor de direção
        const dx = Math.sign(inimigo.x - alvo.x); 
        const dy = Math.sign(inimigo.y - alvo.y);
        
        let novoX = inimigo.x + dx;
        let novoY = inimigo.y + dy;

        // Mantém dentro dos limites
        if (novoX < 0) novoX = 0;
        if (novoX >= LARGURA_CAMPO) novoX = LARGURA_CAMPO - 1;
        if (novoY < 0) novoY = 0;
        if (novoY >= ALTURA_CAMPO) novoY = ALTURA_CAMPO - 1;

        inimigo.x = novoX;
        inimigo.y = novoY;
    }

    private static atacarCorpoACorpo(inimigo: Entidade, alvo: Entidade, onAcaoRealizada: (msg: string) => void): void {
        const dist = distanciaEntre({ x: inimigo.x, y: inimigo.y }, { x: alvo.x, y: alvo.y });
        
        if (dist <= 1) {
            const dano = Math.floor(inimigo.atk);
            alvo.receberDano(dano);
            onAcaoRealizada(`${inimigo.nome} atacou implacavelmente! Causou ${dano} de dano.`);
        }
    }

    private static atacarDistancia(inimigo: Entidade, alvo: Entidade, alcance: number, onAcaoRealizada: (msg: string) => void): void {
        const dist = distanciaEntre({ x: inimigo.x, y: inimigo.y }, { x: alvo.x, y: alvo.y });
        
        if (dist <= alcance) {
            const dano = Math.floor(inimigo.atk * 0.7); // Ataques à distância causam menos dano (balanceamento)
            alvo.receberDano(dano);
            onAcaoRealizada(`${inimigo.nome} disparou à distância! Causou ${dano} de dano.`);
        }
    }
}