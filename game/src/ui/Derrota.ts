import { jogo } from "../engine/Jogo.js";

export class Derrota {
    private elementoDOM: HTMLDivElement | null = null;
    private listenerTeclado: ((e: KeyboardEvent) => void) | null = null;

    abrir(containerPai: HTMLElement): void {
        if (document.getElementById('tela-derrota')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-derrota';
        this.elementoDOM.className = 'tela-derrota';
        containerPai.appendChild(this.elementoDOM);

        // Processa as penalidades de morte (Ouro e XP) antes de exibir a tela
        this.processarPenalidadesMorte();
        this.renderizar();
    }

    private processarPenalidadesMorte(): void {
        const jogador = jogo.jogador;
        
        // 1. Penalidade de Ouro: Perde 40% do ouro acumulado
        const ouroPerdido = Math.floor(jogador.ouro * 0.40);
        jogador.gastarOuro(ouroPerdido);
        
        // 2. Penalidade de XP: Perde 20% do XP atual acumulado no nível
        const xpPerdido = Math.floor(jogador.xp * 0.20);
        jogador.xp = Math.max(0, jogador.xp - xpPerdido);
        
        // 3. Limpa a habilidade temporária que foi perdida na morte
        jogador.aplicarHabilidadeTemporaria(null);
        
        // Armazena temporariamente os valores perdidos para exibição na UI
        (this as any).ouroPerdidoInfo = ouroPerdido;
        (this as any).xpPerdidoInfo = xpPerdido;
    }

    private renderizar(): void {
        if (!this.elementoDOM) return;

        const ouroPerdido = (this as any).ouroPerdidoInfo ?? 0;
        const xpPerdido = (this as any).xpPerdidoInfo ?? 0;

        this.elementoDOM.innerHTML = `
            <div class="derrota-card">
                <h1>💀 VOCÊ CAIU</h1>
                <p>John Ancestoor foi superado pelas profundezas...</p>
                
                <div class="derrota-stats">
                    <p>Mapas Concluídos: <strong>${jogo.jogador.mapaAtual}</strong></p>
                    <p>Nível Preservado: <strong>${jogo.jogador.nivel}</strong></p>
                    <p>XP Atual: <strong>${jogo.jogador.xp}/${jogo.jogador.xpParaProximoNivel}</strong></p>
                    
                    <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
                    
                    <p style="color: #ff4d4d; margin: 5px 0;">Ouro Perdido: <strong>-${ouroPerdido}</strong> 💰</p>
                    <p style="color: #ffaa4d; margin: 5px 0;">XP Perdido: <strong>-${xpPerdido}</strong> ✨</p>
                    
                    <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
                    
                    <p style="color: #ffd700;">Ouro Restante: <strong>${jogo.jogador.ouro}</strong> 💰</p>
                </div>
                
                <p class="ajuda-texto">O progresso do seu her&oacute;i foi preservado. Prepare-se para descer novamente.</p>
                <button id="btn-derrota-recomecar">Recomeçar (R)</button>
            </div>
        `;

        this.listenerTeclado = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.recomecarPartida();
            }
        };

        window.addEventListener('keydown', this.listenerTeclado);

        this.elementoDOM.querySelector('#btn-derrota-recomecar')?.addEventListener('click', () => {
            this.recomecarPartida();
        });
    }

    private recomecarPartida(): void {
        this.fechar();
        jogo.iniciarPartida();
    }

    fechar(): void {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}