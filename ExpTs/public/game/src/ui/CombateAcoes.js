export class CombateAcoes {
    acoesContainer = null;
    construir(pai) {
        this.acoesContainer = document.createElement('div');
        this.acoesContainer.className = 'combate-acoes';
        pai.appendChild(this.acoesContainer);
    }
    pintar(jogador, motor) {
        if (!this.acoesContainer)
            return;
        if (motor.selecionandoAlvo) {
            const alvo = motor.alvosVisiveis[motor.indiceAlvoSelecionado];
            this.acoesContainer.innerHTML = `
                <div class="combate-turno-info">SELECIONANDO ALVO</div>
                <div class="combate-alvo-info">
                    ${alvo ? `<span class="combate-alvo-nome">${alvo.nome}</span>` : ''}
                    <span class="combate-alvo-hp">HP: ${alvo?.hp ?? 0}/${alvo?.hpMax ?? 0}</span>
                </div>
                <div class="combate-botoes">
                    <button id="btn-confirmar-alvo">Confirmar (R)</button>
                    <button id="btn-cancelar-alvo">Cancelar (E)</button>
                </div>
            `;
            this.acoesContainer.querySelector('#btn-confirmar-alvo')?.addEventListener('click', () => motor.confirmarAlvo());
            this.acoesContainer.querySelector('#btn-cancelar-alvo')?.addEventListener('click', () => motor.cancelarSelecaoAlvo());
        }
        else {
            // Injeta os botões de acordo com o estado do turno e mana
            this.acoesContainer.innerHTML = `
                <div class="combate-turno-info">${motor.turno === 'jogador' ? `Turno do Jogador (Passos: ${motor.passosRestantes})` : 'Turno dos Inimigos...'}</div>
                <div class="combate-habilidades">
                    ${jogador.habilidades.map((h, i) => `
                        <button class="hab-btn ${h.custoMP > jogador.mp ? 'sem-mp' : ''}" data-hab="${i}">
                            ${['A', 'S', 'D', 'F', 'G'][i]}: ${h.nome} (${h.custoMP}MP)
                        </button>
                    `).join('')}
                </div>
                <div class="combate-botoes">
                    <button id="btn-usar-pocao" ${jogador.pocoes <= 0 || !jogador.vivo ? 'disabled' : ''}>Usar Poção (E)</button>
                    <button id="btn-encerrar-turno" ${motor.turno === 'inimigos' || !jogador.vivo ? 'disabled' : ''}>Encerrar Turno (R)</button>
                </div>
            `;
            // Re-acopla os event listeners aos botões recém-desenhados
            this.acoesContainer.querySelectorAll('.hab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-hab'));
                    motor.usarHabilidade(idx);
                });
            });
            this.acoesContainer.querySelector('#btn-usar-pocao')?.addEventListener('click', () => motor.usarPocao());
            this.acoesContainer.querySelector('#btn-encerrar-turno')?.addEventListener('click', () => motor.encerrarTurnoJogador());
        }
    }
}
