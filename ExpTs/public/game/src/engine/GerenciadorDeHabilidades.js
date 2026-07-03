import { COMPENDIO_HABILIDADES } from "../entities/Habilidades.js";
export class GerenciadorDeHabilidades {
    habilidadeTemporaria = null;
    /**
     * Sincroniza e reconstrói o array ativo de habilidades injetando a lista permanente + temporária
     */
    atualizarListaAtiva(_habilidadesAtuais, nomesSalvos) {
        const novaLista = [];
        // Reconstrói as permanentes a partir do modelo centralizado
        for (const nome of nomesSalvos) {
            const modelo = Object.values(COMPENDIO_HABILIDADES).find(h => h.nome === nome);
            if (modelo)
                novaLista.push({ ...modelo });
        }
        // Re-acopla o bônus temporário se ele existir
        if (this.habilidadeTemporaria) {
            novaLista.push({ ...this.habilidadeTemporaria });
        }
        return novaLista;
    }
    /**
     * Insere uma nova técnica permanente na árvore, validando duplicatas
     */
    registrarAprendizado(listaAtiva, novaHab) {
        const jaConhece = listaAtiva.some(h => h.nome === novaHab.nome);
        if (jaConhece)
            return false;
        listaAtiva.push({ ...novaHab });
        console.log(`[Grimório] Nova técnica dominada: ${novaHab.nome}`);
        return true;
    }
    /**
     * Aplica ou substitui a habilidade temporária comprada na base
     */
    mutarHabilidadeTemporaria(listaAtiva, novaHab) {
        let filtrada = listaAtiva;
        // Remove a temporária antiga se ela existir no array ativo
        if (this.habilidadeTemporaria) {
            filtrada = listaAtiva.filter(h => h.nome !== this.habilidadeTemporaria.nome);
        }
        this.habilidadeTemporaria = novaHab;
        // Injeta a nova se não for nula
        if (novaHab) {
            filtrada.push({ ...novaHab });
            console.log(`[Grimório] Técnica temporária acoplada: ${novaHab.nome}`);
        }
        return filtrada;
    }
}
