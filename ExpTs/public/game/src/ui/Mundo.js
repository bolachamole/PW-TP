import { SPRITES } from "../constants.js";
import { jogo } from "../engine/Jogo.js";
import { spriteNode } from "./Sprites.js";
export class Mundo {
    elementoDOM = null;
    noSelecionado = null;
    indiceLista = 0;
    inputBloqueado = true;
    listenerTeclado = null;
    abrir(containerPai, grafo, noAtualId) {
        if (document.getElementById('tela-mundo'))
            return;
        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-mundo';
        this.elementoDOM.className = 'tela-mundo';
        containerPai.appendChild(this.elementoDOM);
        if (noAtualId && grafo[noAtualId]) {
            this.noSelecionado = noAtualId;
        }
        else {
            const noBase = Object.values(grafo).find(n => n.tipo === 'Base');
            if (noBase)
                this.noSelecionado = noBase.id;
        }
        this.indiceLista = 0;
        // Ativa o bloqueio temporário
        this.inputBloqueado = true;
        this.renderizar(grafo);
        // Consome qualquer pressionamento residual ou cliques fantasmas do R
        setTimeout(() => {
            this.inputBloqueado = false;
        }, 150);
    }
    renderizar(grafo) {
        if (!this.elementoDOM)
            return;
        const nos = Object.values(grafo);
        const profundidade = Math.max(...nos.map(n => n.camada)) + 1;
        const idNoAtual = jogo.getNoAtualId();
        const nosBase = Object.values(grafo).filter(n => n.status === 'disponivel' && n.tipo !== 'Base');
        const listaNos = idNoAtual
            ? (grafo[idNoAtual]?.proximos ?? [])
                .map(id => grafo[id])
                .filter((n) => !!n && n.status === 'disponivel' && n.tipo !== 'Base')
            : nosBase;
        if (this.indiceLista >= listaNos.length) {
            this.indiceLista = Math.max(0, listaNos.length - 1);
        }
        if (listaNos.length > 0 && listaNos[this.indiceLista]) {
            this.noSelecionado = listaNos[this.indiceLista].id;
        }
        let html = `<div class="mundo-info">
            <span>Mapa ${jogo.estados.mundo.mapaAtual}</span>
            <span>Vida: ${jogo.jogador.hp}/${jogo.jogador.hpMax}</span>
            <span>Nível: ${jogo.jogador.nivel}</span>
        </div>`;
        html += `<div class="mundo-grafo" style="--profundidade: ${profundidade};">`;
        const nodePositions = new Map();
        for (const no of nos) {
            const totalNaCamada = nos.filter(n => n.camada === no.camada).length;
            const indicesNaCamada = nos.filter(n => n.camada === no.camada)
                .sort((a, b) => a.posicaoVertical - b.posicaoVertical)
                .map(n => n.id);
            const index = indicesNaCamada.indexOf(no.id);
            const marginV = 10;
            const usableH = 100 - 2 * marginV;
            const spacingV = usableH / (totalNaCamada + 1);
            const top = marginV + spacingV * (index + 1);
            const marginH = 8;
            const usableW = 100 - 2 * marginH;
            const left = marginH + (no.camada / Math.max(profundidade - 1, 1)) * usableW;
            nodePositions.set(no.id, { top, left });
        }
        for (const no of nos) {
            if (no.proximos.length > 0) {
                const origem = nodePositions.get(no.id);
                for (const proximoId of no.proximos) {
                    const destino = nodePositions.get(proximoId);
                    if (!destino)
                        continue;
                    html += `<svg class="mundo-conexao" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">
                        <line x1="${origem.left}%" y1="${origem.top}%" x2="${destino.left}%" y2="${destino.top}%"
                            stroke="#8b7355" stroke-width="2" />
                    </svg>`;
                }
            }
        }
        for (const no of nos) {
            const pos = nodePositions.get(no.id);
            const selecionado = this.noSelecionado === no.id ? 'selecionado' : '';
            const statusClasse = no.status;
            const atual = idNoAtual === no.id ? 'atual' : '';
            let iconeHtml = '';
            let overlayHtml = '';
            if (idNoAtual === no.id) {
                iconeHtml = `<img src="${SPRITES.player}" class="sprite-no" alt="Jogador">`;
            }
            else {
                iconeHtml = this.iconePorTipo(no.tipo);
            }
            if (no.status === 'visitado') {
                overlayHtml = '<div class="mundo-no-x">✗</div>';
            }
            else if (no.status === 'bloqueado') {
                overlayHtml = '<div class="mundo-no-cadeado">🔒</div>';
            }
            html += `<div class="mundo-no ${selecionado} ${statusClasse} ${atual}"
                style="position:absolute;top:${pos.top}%;left:${pos.left}%;"
                data-id="${no.id}">
                <div class="mundo-no-icone">${iconeHtml}</div>
                <div class="mundo-no-tipo">${no.tipo}</div>
                ${overlayHtml}
            </div>`;
        }
        html += '</div>';
        html += `<div class="mundo-lista-panel">
            <div class="mundo-lista-titulo">Nós disponíveis</div>
            <div class="mundo-lista-itens">`;
        for (let i = 0; i < listaNos.length; i++) {
            const n = listaNos[i];
            const ativo = i === this.indiceLista ? 'ativo' : '';
            html += `<div class="mundo-lista-item ${ativo}" data-idx="${i}">
                <span class="mundo-lista-icone">${this.iconePorTipo(n.tipo)}</span>
                <span class="mundo-lista-nome">${n.tipo}</span>
            </div>`;
        }
        if (listaNos.length === 0) {
            html += `<div class="mundo-lista-vazio">Nenhum nó disponível</div>`;
        }
        html += `</div></div>`;
        if (listaNos.length > 0 && listaNos[this.indiceLista]) {
            const n = listaNos[this.indiceLista];
            html += `<div class="mundo-acoes">
                <p>${n.tipo}</p>
                <p>Pressione R para entrar</p>
            </div>`;
        }
        else {
            html += `<div class="mundo-acoes">
                <p>Use as setas para navegar</p>
            </div>`;
        }
        this.elementoDOM.innerHTML = html;
        this.adicionarListeners(grafo, listaNos);
    }
    iconePorTipo(tipo) {
        return `<img src="${spriteNode(tipo)}" class="sprite-no" alt="${tipo}">`;
    }
    adicionarListeners(grafo, listaNos) {
        this.removerListeners();
        this.listenerTeclado = (e) => {
            if (this.inputBloqueado)
                return;
            switch (e.key) {
                case 'ArrowUp': {
                    e.preventDefault();
                    if (listaNos.length === 0)
                        return;
                    this.indiceLista = (this.indiceLista - 1 + listaNos.length) % listaNos.length;
                    this.renderizar(grafo);
                    break;
                }
                case 'ArrowDown': {
                    e.preventDefault();
                    if (listaNos.length === 0)
                        return;
                    this.indiceLista = (this.indiceLista + 1) % listaNos.length;
                    this.renderizar(grafo);
                    break;
                }
                case 'ArrowLeft':
                case 'ArrowRight': {
                    e.preventDefault();
                    break;
                }
                case 'r':
                case 'R': {
                    e.preventDefault();
                    if (listaNos.length > 0 && listaNos[this.indiceLista]) {
                        const no = listaNos[this.indiceLista];
                        if (no.status === 'disponivel' && no.tipo !== 'Base') {
                            this.entrarNoNo(no);
                        }
                    }
                    break;
                }
            }
        };
        window.addEventListener('keydown', this.listenerTeclado);
    }
    entrarNoNo(no) {
        no.status = 'visitado';
        this.fechar();
        jogo.entrarNoNo(no);
    }
    removerListeners() {
        if (this.listenerTeclado) {
            window.removeEventListener('keydown', this.listenerTeclado);
            this.listenerTeclado = null;
        }
    }
    fechar() {
        this.removerListeners();
        if (this.elementoDOM) {
            this.elementoDOM.remove();
            this.elementoDOM = null;
        }
    }
}
