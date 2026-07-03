export class GeradorDeGrafos {
    gerarMapa(profundidade, tamanhoMaxCamada) {
        const grafo = {};
        const camadas = [];
        if (profundidade < 3) {
            profundidade = 3;
        }
        for (let p = 0; p < profundidade; p++) {
            camadas[p] = [];
            if (p === 0) {
                const noBase = {
                    id: `no_0_0`,
                    tipo: 'Base',
                    status: 'disponivel',
                    camada: 0,
                    posicaoVertical: 0,
                    proximos: []
                };
                grafo[noBase.id] = noBase;
                camadas[p].push(noBase);
            }
            else if (p === profundidade - 1) {
                const noBoss = {
                    id: `no_${p}_0`,
                    tipo: 'Boss',
                    status: 'bloqueado',
                    camada: p,
                    posicaoVertical: 0,
                    proximos: []
                };
                grafo[noBoss.id] = noBoss;
                camadas[p].push(noBoss);
            }
            else {
                const qtdNos = Math.floor(Math.random() * (tamanhoMaxCamada - 1)) + 2;
                for (let i = 0; i < qtdNos; i++) {
                    const no = {
                        id: `no_${p}_${i}`,
                        tipo: this.sortearTipoNo(),
                        status: 'bloqueado',
                        camada: p,
                        posicaoVertical: i - (qtdNos - 1) / 2,
                        proximos: []
                    };
                    grafo[no.id] = no;
                    camadas[p].push(no);
                }
            }
        }
        for (let c = 0; c < profundidade - 1; c++) {
            const camadaAtual = camadas[c];
            const proximaCamada = camadas[c + 1];
            for (let i = 0; i < camadaAtual.length; i++) {
                const noAtual = camadaAtual[i];
                if (c === profundidade - 2) {
                    noAtual.proximos.push(proximaCamada[0].id);
                    continue;
                }
                const passoBase = Math.floor((i / camadaAtual.length) * proximaCamada.length);
                noAtual.proximos.push(proximaCamada[passoBase].id);
                if (Math.random() > 0.4 && passoBase + 1 < proximaCamada.length) {
                    noAtual.proximos.push(proximaCamada[passoBase + 1].id);
                }
            }
            for (let j = 0; j < proximaCamada.length; j++) {
                const noProx = proximaCamada[j];
                const temConexao = camadaAtual.some(no => no.proximos.includes(noProx.id));
                if (!temConexao) {
                    const noAnteriorMaisPerto = camadaAtual[Math.min(j, camadaAtual.length - 1)];
                    noAnteriorMaisPerto.proximos.push(noProx.id);
                }
            }
        }
        return grafo;
    }
    sortearTipoNo() {
        const r = Math.random();
        if (r < 0.6)
            return 'Combate';
        if (r < 0.85)
            return 'Evento';
        return 'Loja';
    }
}
