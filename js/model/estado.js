/*
  js/model/estado.js — o MODEL: a "memória" do jogo e as regras gerais de pontuação.
  Aqui não existe HTML nem botão. Só dados (o estado) e funções que mudam esses dados.
  Pense no estado como as propriedades de um componente do Figma: a View só desenha
  o que estiver escrito aqui.
*/
window.PA = window.PA || {};

PA.modelo = (function () {
  /* Constantes de regra (fáceis de ajustar) */
  const CONFIG = {
    pontosPorBloco: 100,
    bonusPrioridade: 50,          /* começar pelo Bloco 1 */
    penalidadeBraden: 25,         /* por item errado na Escala de Braden */
    segundosDigito: 5,            /* roteiro "Corrigido" = 5 s · roteiro 2.0 = 3 s (pergunta em aberto) */
    totalMaximo: 450
  };

  function criarEstado() {
    return {
      caso: null,                         /* "joao" quando o caso é escolhido */
      ordem: [],                          /* ordem em que os blocos foram escolhidos, ex.: ["b1","b3"] */
      feito: { b1: false, b2: false, b3: false, b4: false },
      pontos: { prioridade: 0, b1: 100, b2: 100, b3: 100, b4: 100 },
      selos: { aguia: true, mao: true, mestre: true, esp: true, humaniza: true },
      critico: false,                     /* houve um evento crítico (ex.: LP estágio 1) */
      investigacao: { vistos: [] },       /* pistas opcionais do leito */
      bloco1: {
        pistasVistas: [],                 /* índices das 6 pistas da Braden já clicadas */
        braden: ["", "", "", "", "", ""], /* resposta do jogador em cada item */
        bradenEnviada: false,
        bradenErros: [],                  /* true/false por item, depois de enviar */
        inspecaoVistos: [],               /* pontos A, A2, B, B2, C */
        tentativasDigito: 0,
        resultadoDigito: null             /* "branqueia" | "nao-branqueia" */
      }
    };
  }

  const modelo = {
    CONFIG,
    estado: criarEstado(),

    reiniciar() { modelo.estado = criarEstado(); },

    /* Índice de Aproveitamento Simulado (IAS) */
    ias() {
      const p = modelo.estado.pontos;
      return p.prioridade + ["b1", "b2", "b3", "b4"].reduce((s, b) => s + Math.max(0, p[b]), 0);
    },

    penalizar(bloco, valor) {
      const p = modelo.estado.pontos;
      p[bloco] = Math.max(0, p[bloco] - valor);
    },

    /* Registra o bloco escolhido na priorização. Começar pelo Bloco 1 vale o bônus. */
    registrarPrioridade(bloco) {
      const e = modelo.estado;
      if (!e.ordem.includes(bloco)) e.ordem.push(bloco);
      if (e.ordem[0] === "b1") e.pontos.prioridade = CONFIG.bonusPrioridade;
    },

    marcarFeito(bloco) { modelo.estado.feito[bloco] = true; },

    todosFeitos() { return Object.values(modelo.estado.feito).every(Boolean); },

    /* Usado pelo menu do protótipo para testar os dois resultados da dígito-pressão */
    definirBloco1Primeiro(primeiro) {
      const e = modelo.estado;
      e.ordem = e.ordem.filter(b => b !== "b1");
      if (primeiro) e.ordem.unshift("b1");
      else {
        if (!e.ordem.length) { e.ordem.push("b2"); e.feito.b2 = true; }
        e.ordem.push("b1");
      }
      e.pontos.prioridade = e.ordem[0] === "b1" ? CONFIG.bonusPrioridade : 0;
    }
  };

  return modelo;
})();
