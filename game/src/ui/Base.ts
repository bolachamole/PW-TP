import { jogo } from "../engine/Jogo";

export class Base {
  
    private elementoDOM: HTMLDivElement | null = null;

    public iniciarPartida(containerPai: HTMLElement): void {

        if (document.getElementById('base-forte')) return;

        this.elementoDOM = document.createElement('div');
        this.elementoDOM.id = 'base-forte';
        this.elementoDOM.className = 'base-forte';

        containerPai.appendChild(this.elementoDOM);

        this.conteudoBase();

    }

    public conteudoBase(): void {
        
        if (!this.elementoDOM) return;

        this.elementoDOM.innerHTML = `
            <h1>Caves of Memory</h1>
            <button id="btn-menu-inicial">Menu inicial</button>
            <button id="btn-gerar-grafo">Gerar grafo</button>
        `;

        this.configurarEventos();

    }

    private configurarEventos(): void {

        if (!this.elementoDOM) return;

        const btnMenuInicial = this.elementoDOM.querySelector('#btn-menu-inicial');
        const btnGerarGrafo = this.elementoDOM.querySelector('#btn-gerar-grafo');
        
        btnMenuInicial?.addEventListener('click', () => {
        
            console.log("[DEBUG] Botão do Menu inicial clicado! Destruindo a base...");
            
            this.fechar();
            
            jogo.iniciarMenu();

        });
    
        btnGerarGrafo?.addEventListener('click', () => {
        
            console.log("[DEBUG] Gerando um grafo!");

            //this.elementoDOM!.innerHTML = '';
            
        });

    }

    private fechar(): void {
    
        if (this.elementoDOM) {
            
            this.elementoDOM.remove();         
            this.elementoDOM = null; 

            console.log("[DEBUG] Base deletado com sucesso do DOM.");
        
        }
    
    }

}