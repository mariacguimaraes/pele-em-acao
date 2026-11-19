/*
  js/viewmodel/cenas-bloco1.js — as cenas do BLOCO 1 ("Conhecer o paciente e avaliar a pele").
  Fluxo: intro → Braden (pistas + ficha) → gabarito/devolutiva → inspeção → dígito-pressão → pele negra → volta à priorização.
  As regras (corrigir, pontuar, decidir o resultado) ficam em js/model/regras-bloco1.js.
*/
(function () {
  const J = PA.jogo, M = PA.modelo, RB = PA.regrasBloco1, CN = PA.cenarios;
  const T = () => PA.roteiro.bloco1;   /* textos do bloco */

  /* HUD comum do bloco: título + pausa + (opcional) informações */
  const hudBloco = (titulo, info, extra = {}) => Object.assign({ titulo, pausar: true, info }, extra);

  /* ---------- Cena 1 · Introdução ---------- */
  J.registrar("b1-intro", {
    grupo: "Bloco 1", nome: "Cena 1 · Introdução",
    entrar() {
      RB.reiniciarBloco();
      J.falar(T().intro, () => J.ir("b1-braden"));
    },
    montar() {
      const d = CN.leito();
      d.hud = hudBloco(T().titulo);
      return d;
    }
  });

  /* ---------- Cena 1 · Escala de Braden ---------- */
  const PISTAS_BRADEN = [
    [720, 200, 90, 90], [720, 450, 130, 80], [720, 640, 150, 150],
    [620, 330, 90, 140], [1285, 365, 190, 90], [810, 470, 70, 70]
  ];

  J.registrar("b1-braden", {
    grupo: "Bloco 1", nome: "Cena 1 · Escala de Braden",
    montar(e, p) {
      const b = e.bloco1, F = T().ficha;
      const d = CN.leito();
      d.hotspots = T().pistas.map((pista, i) => {
        const [x, y, w, h] = PISTAS_BRADEN[i];
        return {
          id: "braden-pista-" + i, x, y, w, h, rotulo: pista.rotulo, visto: b.pistasVistas.includes(i),
          acao: () => { if (!b.pistasVistas.includes(i)) b.pistasVistas.push(i); J.falar([pista.fala]); }
        };
      });
      d.hud = hudBloco(T().titulo, T().infoBraden);
      if (p.ficha) {
        d.hud.ficha = {
          titulo: F.titulo,
          selecione: F.selecione,
          itens: T().braden.map((it, i) => ({ id: "braden-" + i, rotulo: `${i + 1}. ${it.item}`, opcoes: it.opcoes, valor: b.braden[i] })),
          aoMudar: (i, v) => { b.braden[i] = v; J.atualizar(); },
          status: F.preenchidos(RB.quantosPreenchidos(), T().braden.length),
          minimizar: { id: "ficha-minimizar", rotulo: F.minimizar, acao: () => J.atualizar({ ficha: false, foco: "ficha-aba" }) },
          enviar: { id: "ficha-enviar", rotulo: F.enviar, desativado: !RB.fichaCompleta(), acao: () => J.ir("b1-gabarito") }
        };
      } else {
        d.hud.aba = { id: "ficha-aba", rotulo: F.aba, acao: () => J.atualizar({ ficha: true, foco: "braden-0" }) };
      }
      return d;
    }
  });

  /* ---------- Cena 1.1 · Gabarito e devolutiva ---------- */
  J.registrar("b1-gabarito", {
    grupo: "Bloco 1", nome: "Cena 1.1 · Gabarito e devolutiva",
    entrar(e, p) {
      p.fase = "intro";
      J.falar(T().envio, () => {
        const r = RB.enviarBraden();
        J.atualizar({ fase: "comparar", resultado: r });
        const erros = e.bloco1.bradenErros;
        const devolutiva = r.erros ? T().feedbackErro.filter((_, i) => erros[i]) : [T().feedbackAcerto];
        J.falar(devolutiva, () => {
          J.atualizar({ fase: "fechamento" });
          J.falar(T().fechamento, () => J.ir("b1-inspecao"));
        });
      });
    },
    montar(e, p) {
      const d = CN.leito();
      d.hud = hudBloco(T().titulo);
      if (p.fase === "comparar" && p.resultado) {
        const G = T().gabarito, b = e.bloco1;
        d.painel = {
          tipo: "gabarito", x: 160, y: 40, w: 1120, h: 440, semVeu: true,
          titulo: G.titulo,
          resumo: G.resumo(p.resultado.acertos, p.resultado.erros, p.resultado.pontosPerdidos),
          colunas: [G.suaColuna(RB.somaJogador()), G.gabaritoColuna(RB.somaGabarito())],
          linhas: T().braden.map((it, i) => ({
            item: `${i + 1}. ${it.item}`,
            seu: it.opcoes[Number(b.braden[i]) - 1] || "—",
            certo: it.opcoes[it.gabarito - 1],
            errou: b.bradenErros[i],
            marca: b.bradenErros[i] ? G.marcaErro : G.marcaCerto
          }))
        };
      }
      return d;
    }
  });

  /* ---------- Cena 2 · Inspeção das proeminências ósseas ---------- */
  const PONTOS_INSPECAO = { a: [660, 230, 80, 80], a2: [780, 230, 80, 80], b: [680, 740, 70, 70], b2: [760, 740, 70, 70], c: [720, 470, 160, 70] };

  J.registrar("b1-inspecao", {
    grupo: "Bloco 1", nome: "Cena 2 · Inspeção da pele",
    montar(e) {
      const I = T().inspecao, vistos = e.bloco1.inspecaoVistos;
      const d = CN.leito();
      d.hotspots = Object.entries(PONTOS_INSPECAO).map(([k, [x, y, w, h]]) => ({
        id: "inspecao-" + k, x, y, w, h, rotulo: I.pontos[k].rotulo, visto: vistos.includes(k),
        acao: () => { if (!vistos.includes(k)) vistos.push(k); J.falar([I.pontos[k].fala]); }
      }));
      d.hud = hudBloco(I.titulo, I.info);
      if (vistos.includes("c")) d.hud.dock = [{ id: "ferramenta-digito", icone: "☝", rotulo: I.ferramenta, acao: () => J.ir("b1-digito") }];
      return d;
    }
  });

  /* ---------- Cena 2 · Dígito-pressão ---------- */
  J.registrar("b1-digito", {
    grupo: "Bloco 1", nome: "Cena 2 · Dígito-pressão",
    entrar(e, p) {
      const D = T().digito, s = M.CONFIG.segundosDigito;
      if (e.bloco1.resultadoDigito) { p.resultado = e.bloco1.resultadoDigito; p.fase = "pele-negra"; return; }
      J.falar([D.instrucao(s)]);
    },
    montar(e, p) {
      const D = T().digito, s = M.CONFIG.segundosDigito;
      const d = CN.sacro();
      if (p.resultado) {
        d.objetos.push({ asset: p.resultado === "branqueia" ? "obj-sacro-branqueia" : "obj-sacro-lp1", x: 620, y: 230, w: 200, h: 200 });
      }
      d.hud = hudBloco(D.titulo, D.instrucao(s).texto);
      d.digito = {
        id: "digito", x: 660, y: 280, w: 120, h: 240, centroX: 720, centroY: 330,
        asset: "obj-mao-luva", rotulo: D.rotuloBotao(s), segundos: s,
        desativado: !!p.resultado,
        aoSoltar: seg => {
          const r = RB.avaliarDigito(seg);
          if (r === "curto") return J.falar([D.soltouCedo(s)]);
          J.atualizar({ resultado: r });
          const falas = (r === "branqueia" ? D.branqueia : D.naoBranqueia).concat(D.humanizacao);
          J.falar(falas, () => J.atualizar({ fase: "pele-negra", foco: "ver-pele-negra" }));
        }
      };
      if (p.fase === "pele-negra") {
        d.escolhas = [{ id: "ver-pele-negra", rotulo: D.verPeleNegra, x: 880, y: 300, w: 380, h: 68, classe: "destaque", acao: () => J.ir("b1-pele-negra") }];
      }
      return d;
    }
  });

  /* ---------- Cena 2 · Avaliação na pele negra ---------- */
  J.registrar("b1-pele-negra", {
    grupo: "Bloco 1", nome: "Cena 2 · Avaliação na pele negra",
    montar(e) {
      const P = T().peleNegra;
      const d = CN.sacro();
      if (e.bloco1.resultadoDigito) d.objetos.push({ asset: e.bloco1.resultadoDigito === "branqueia" ? "obj-sacro-branqueia" : "obj-sacro-lp1", x: 620, y: 230, w: 200, h: 200 });
      d.hud = hudBloco(T().digito.titulo);
      d.painel = {
        tipo: "simples", x: 120, y: 60, w: 1200, h: 690, titulo: P.titulo,
        imagem: { asset: "ilu-pele-negra-comparativo", w: 460, h: 420 },
        paragrafos: P.paragrafos, referencia: P.referencia,
        acoes: [{ id: "pele-negra-ciente", rotulo: P.ciente, classe: "destaque", acao: () => { M.marcarFeito("b1"); J.ir("priorizacao"); } }]
      };
      return d;
    }
  });
})();
