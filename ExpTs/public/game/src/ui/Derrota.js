import { jogo } from "../engine/Jogo.js";
export class Derrota {
    elementoDOM = null;
    listenerTeclado = null;
    abrir(containerPai) {
        this.enviarScore();
        if (document.getElementById('tela-derrota'))
            return;
        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-derrota';
        this.elementoDOM.className = 'tela-derrota';
        containerPai.appendChild(this.elementoDOM);
        this.processarPenalidadesMorte();
        this.renderizar();
    }
    async enviarScore() {
        const score = this.calcularScore();
        try {
            await fetch("/api/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score }),
            });
        }
        catch (e) {
            console.warn("[Score] Falha ao enviar score:", e);
        }
    }
    calcularScore() {
        const jogador = jogo.jogador;
        const mundo = jogo.estados.mundo;
        return mundo.mapaAtual + jogador.xp + jogador.kills * 10 + jogador.bossKills * 20;
    }
    processarPenalidadesMorte() {
        const jogador = jogo.jogador;
        // 2. Penalidade de XP: Perde 20% do XP atual acumulado no nível
        const xpPerdido = Math.floor(jogador.xp * 0.20);
        jogador.xp = Math.max(0, jogador.xp - xpPerdido);
        // 3. Limpa a habilidade temporária que foi perdida na morte
        jogador.aplicarHabilidadeTemporaria(null);
        // Armazena temporariamente os valores perdidos para exibição na UI
        this.xpPerdidoInfo = xpPerdido;
    }
    renderizar() {
        if (!this.elementoDOM)
            return;
        const xpPerdido = this.xpPerdidoInfo ?? 0;
        this.elementoDOM.innerHTML = `
            <div class="derrota-card">
                <h1>💀 VOCÊ CAIU</h1>
                <p>John Ancestoor foi superado pelas profundezas...</p>
                
                <div class="derrota-stats">
                    <p>Mapas Concluídos: <strong>${jogo.estados.mundo.mapaAtual}</strong></p>
                    <p>Nível Preservado: <strong>${jogo.jogador.nivel}</strong></p>
                    <p>XP Atual: <strong>${jogo.jogador.xp}/${jogo.jogador.xpParaProximoNivel}</strong></p>
                    
                    <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
                    
                    <p style="color: #ffaa4d; margin: 5px 0;">XP Perdido: <strong>-${xpPerdido}</strong> ✨</p>
                    
                    <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
                    
                </div>
                
                <p class="ajuda-texto">O progresso do seu her&oacute;i foi preservado. Prepare-se para descer novamente.</p>
                <button id="btn-derrota-recomecar">Recomeçar (R)</button>
            </div>
        `;
        this.listenerTeclado = (e) => {
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
    recomecarPartida() {
        this.fechar();
        jogo.iniciarPartida();
    }
    fechar() {
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
