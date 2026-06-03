export class MenuConfigura {

    public abrir(container: HTMLElement, quandoVoltar: () => void): void {
    
        container.innerHTML = `
            <h2>Configurações</h2>
            <div class="audio-control">
                <label for="slider-volume">Volume Global:</label>
                <input type="range" id="slider-volume" min="0" max="1" step="0.1" value="0.5">
            </div>
            <button id="btn-voltar-menu" style="margin-top: 30px;">Voltar</button>
        `;

        const btnVoltar = container.querySelector('#btn-voltar-menu');
    
        btnVoltar?.addEventListener('click', () => {
        
            console.log("[DEBUG] Voltando para o menu principal...");
        
            quandoVoltar(); 

        });

        const slider = container.querySelector('#slider-volume') as HTMLInputElement;
        slider?.addEventListener('input', () => {

            console.log(`[DEBUG] Volume alterado para: ${slider.value}`);

        });

    }

}