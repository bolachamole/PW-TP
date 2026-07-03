import { NavegacaoTecladoMenu } from "../ui/NavegacaoTecladoMenu.js";
import { somGlobal } from "../constants.js";
import { jogo } from "../engine/Jogo.js";
export class MenuConfigura {
    navegacao;
    abrir(container, quandoVoltar) {
        container.innerHTML = `
            <h2>Configurações</h2>

            <div class="audio-control">
                <label for="slider-volume">Volume Global:</label>

                <input
                    type="range"
                    id="slider-volume"
                    min="0"
                    max="1"
                    step="0.1"
                    value="${jogo.volume}"
                >
            </div>

            <button
                id="btn-voltar-menu"
                style="margin-top: 30px;"
            >
                Voltar
            </button>
        `;
        const btnVoltar = container.querySelector("#btn-voltar-menu");
        const slider = container.querySelector("#slider-volume");
        if (!btnVoltar || !slider) {
            return;
        }
        btnVoltar.addEventListener("click", () => {
            console.log("[DEBUG] Voltando para o menu principal...");
            this.navegacao?.destruir();
            quandoVoltar();
        });
        slider.addEventListener("input", () => {
            somGlobal.forEach(som => som.volume = parseFloat(slider.value));
            jogo.volume = parseFloat(slider.value);
            console.log(`[DEBUG] Volume alterado para: ${slider.value}`);
            const dados = { "global": slider.value };
            localStorage.setItem("volume", JSON.stringify(dados));
        });
        this.navegacao?.destruir();
        this.navegacao = new NavegacaoTecladoMenu([
            slider,
            btnVoltar
        ], () => btnVoltar.click(), () => {
            if (this.navegacao?.obterIndiceSelecionado() !== 0) {
                return;
            }
            slider.value = Math.max(0, Number(slider.value) - 0.1).toString();
            slider.dispatchEvent(new Event("input"));
        }, () => {
            if (this.navegacao?.obterIndiceSelecionado() !== 0) {
                return;
            }
            slider.value = Math.min(1, Number(slider.value) + 0.1).toString();
            slider.dispatchEvent(new Event("input"));
        });
        this.navegacao.iniciar();
    }
}
