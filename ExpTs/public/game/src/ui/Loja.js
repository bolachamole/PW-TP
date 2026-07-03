import { jogo } from "../engine/Jogo.js";
const ITENS = [
    { nome: "Poção de Vida", descricao: "Ganha 2 poções", preco: 20, tipo: 'pocao' },
    { nome: "Amuleto da Vida", descricao: "+20 HP máximo", preco: 30, tipo: 'hp' },
    { nome: "Cristal de Mana", descricao: "+15 MP máximo", preco: 25, tipo: 'mp' },
    { nome: "Punhal Afiado", descricao: "+5 de ataque", preco: 40, tipo: 'atk' },
    { nome: "Escudo Reforçado", descricao: "+3 de defesa", preco: 35, tipo: 'def' },
];
export class Loja {
    elementoDOM = null;
    listenerTeclado = null;
    indiceSelecionado = 0;
    mensagem = '';
    abrir(containerPai) {
        if (document.getElementById('tela-loja'))
            return;
        this.indiceSelecionado = 0;
        this.mensagem = '';
        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'tela-loja';
        this.elementoDOM.className = 'tela-loja';
        containerPai.appendChild(this.elementoDOM);
        this.renderizar();
    }
    renderizar() {
        if (!this.elementoDOM)
            return;
        let html = `<h1>Loja de Power-Ups</h1>
            <div class="loja-xp">XP: ${jogo.jogador.xp} | Nível: ${jogo.jogador.nivel}</div>
            <div class="loja-itens">`;
        for (let i = 0; i < ITENS.length; i++) {
            const item = ITENS[i];
            const selecionado = i === this.indiceSelecionado ? 'selecionado' : '';
            const podeComprar = jogo.jogador.xp >= item.preco;
            html += `<div class="loja-item ${selecionado} ${podeComprar ? '' : 'caro'}" data-idx="${i}">
                <div class="loja-item-nome">${item.nome}</div>
                <div class="loja-item-desc">${item.descricao}</div>
                <div class="loja-item-preco">${item.preco} XP</div>
            </div>`;
        }
        html += `</div>
            <div class="loja-status">${jogo.jogador.nome} - HP: ${jogo.jogador.hp}/${jogo.jogador.hpMax} | ATK: ${jogo.jogador.atk} | DEF: ${jogo.jogador.defesa} | Poções: ${jogo.jogador.pocoes}</div>
            <div class="loja-acoes">
                <span>Setas: Navegar | R: Comprar | E: Sair</span>
            </div>`;
        if (this.mensagem) {
            html += `<div class="loja-mensagem">${this.mensagem}</div>`;
        }
        this.elementoDOM.innerHTML = html;
        this.adicionarListeners();
    }
    adicionarListeners() {
        this.removerListeners();
        this.listenerTeclado = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.indiceSelecionado = Math.max(0, this.indiceSelecionado - 1);
                    this.renderizar();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.indiceSelecionado = Math.min(ITENS.length - 1, this.indiceSelecionado + 1);
                    this.renderizar();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.comprarItem();
                    break;
                case 'e':
                case 'E':
                    e.preventDefault();
                    this.sair();
                    break;
            }
        };
        window.addEventListener('keydown', this.listenerTeclado);
        this.elementoDOM?.querySelectorAll('.loja-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.getAttribute('data-idx'));
                if (!isNaN(idx)) {
                    this.indiceSelecionado = idx;
                    this.comprarItem();
                }
            });
        });
    }
    comprarItem() {
        const item = ITENS[this.indiceSelecionado];
        if (!item)
            return;
        if (jogo.jogador.xp < item.preco) {
            this.mensagem = "XP insuficiente!";
            this.renderizar();
            return;
        }
        jogo.jogador.xp -= item.preco;
        switch (item.tipo) {
            case 'pocao':
                jogo.jogador.pocoes += 2;
                this.mensagem = `Comprou ${item.nome}! Agora tem ${jogo.jogador.pocoes} poções.`;
                break;
            case 'hp':
                jogo.jogador.hpMax += 20;
                jogo.jogador.hp += 20;
                this.mensagem = `HP máximo aumentado para ${jogo.jogador.hpMax}!`;
                break;
            case 'mp':
                jogo.jogador.mpMax += 15;
                jogo.jogador.mp += 15;
                this.mensagem = `MP máximo aumentado para ${jogo.jogador.mpMax}!`;
                break;
            case 'atk':
                jogo.jogador.atk += 5;
                this.mensagem = `Ataque aumentado para ${jogo.jogador.atk}!`;
                break;
            case 'def':
                jogo.jogador.defesa += 3;
                this.mensagem = `Defesa aumentada para ${jogo.jogador.defesa}!`;
                break;
        }
        this.renderizar();
    }
    sair() {
        this.removerListeners();
        this.fechar();
        jogo.voltarParaMundo();
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
