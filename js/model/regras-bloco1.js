/*
  js/model/regras-bloco1.js — as REGRAS do Bloco 1, sem nada de tela.
  - corrigir a Escala de Braden e aplicar as penalidades;
  - decidir o resultado da dígito-pressão (depende da ordem escolhida na priorização).
*/
window.PA = window.PA || {};

PA.regrasBloco1 = (function () {
  const M = PA.modelo;
  const itens = () => PA.roteiro.bloco1.braden;

  return {
    /* Volta o bloco ao começo (usado ao entrar no Bloco 1) */
    reiniciarBloco() {
      const b = M.estado.bloco1;
      if (b.bradenEnviada) return;          /* não apaga uma avaliação já enviada */
      b.pistasVistas = [];
      b.braden = itens().map(() => "");
      b.inspecaoVistos = [];
      b.resultadoDigito = null;
    },

    fichaCompleta() { return M.estado.bloco1.braden.every(v => v !== ""); },
    quantosPreenchidos() { return M.estado.bloco1.braden.filter(v => v !== "").length; },

    /* Soma dos pontos da escala */
    somaJogador() { return M.estado.bloco1.braden.reduce((s, v) => s + Number(v || 0), 0); },
    somaGabarito() { return itens().reduce((s, i) => s + i.gabarito, 0); },

    /* Corrige a ficha. A penalidade só é aplicada uma vez, no primeiro envio. */
    enviarBraden() {
      const b = M.estado.bloco1;
      if (!b.bradenEnviada) {
        b.bradenErros = itens().map((it, i) => Number(b.braden[i]) !== it.gabarito);
        const n = b.bradenErros.filter(Boolean).length;
        M.penalizar("b1", M.CONFIG.penalidadeBraden * n);
        if (n) M.estado.selos.aguia = false;
        b.bradenEnviada = true;
      }
      const erros = b.bradenErros.filter(Boolean).length;
      return { erros, acertos: itens().length - erros, pontosPerdidos: erros * M.CONFIG.penalidadeBraden };
    },

    /* Para testes: preenche a ficha com um exemplo que tem 2 erros */
    preencherExemplo() {
      const b = M.estado.bloco1;
      if (b.bradenEnviada) return;
      b.braden = itens().map(it => String(it.gabarito));
      b.braden[0] = "2";
      b.braden[4] = "3";
    },

    /*
      Dígito-pressão. Recebe quantos segundos o jogador segurou.
      Resultado:
        "curto"          → soltou antes do tempo (perde o selo Mão Leve)
        "branqueia"      → Bloco 1 foi a 1ª prioridade: hiperemia reativa
        "nao-branqueia"  → Bloco 1 não foi a 1ª: LP estágio 1 (evento crítico)
    */
    avaliarDigito(segundos) {
      const e = M.estado;
      e.bloco1.tentativasDigito++;
      if (segundos < M.CONFIG.segundosDigito) { e.selos.mao = false; return "curto"; }
      const r = e.ordem[0] === "b1" ? "branqueia" : "nao-branqueia";
      if (r === "nao-branqueia") e.critico = true;
      e.bloco1.resultadoDigito = r;
      return r;
    }
  };
})();
