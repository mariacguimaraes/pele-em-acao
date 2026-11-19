/*
  js/viewmodel/cenas-abertura-menu.js — as cenas da ABERTURA e do MENU.
  Abertura: tela inicial, "Sobre o jogo", falas de boas-vindas.
  Menu: seleção de caso, leito do Sr. João, investigação (opcional) e priorização.
  Cada cena diz o que aparece em cada camada; os textos vêm de js/data/.
  Posições em px do frame 1440×810 do Figma.
*/
(function () {
  const J = PA.jogo, M = PA.modelo, R = PA.roteiro, CN = PA.cenarios;

  /* ---------------- ABERTURA ---------------- */

  J.registrar("inicio", {
    grupo: "Abertura", nome: "Tela inicial",
    montar() {
      const base = CN.quartoAbertura();
      return {
        cenario: base.cenario,
        objetos: [{ asset: "ui-logo", x: 370, y: 190, w: 700, h: 150 }],
        escolhas: [
          { id: "iniciar", rotulo: R.inicio.iniciar, x: 590, y: 410, w: 260, h: 68, classe: "destaque", acao: () => J.ir("abertura-falas") },
          { id: "sobre", rotulo: R.inicio.sobre, x: 1180, y: 726, w: 220, h: 52, classe: "branco", acao: () => J.ir("sobre") }
        ]
      };
    }
  });

  J.registrar("sobre", {
    grupo: "Abertura", nome: "Sobre o jogo",
    montar() {
      const d = J.montarCena("inicio");
      d.painel = {
        tipo: "simples", titulo: R.sobre.titulo, x: 220, y: 90, w: 1000, h: 500,
        paragrafos: R.sobre.itens.map(([rot, txt]) => `<b>${rot}:</b> ${txt}`),
        acoes: [{ id: "sobre-fechar", rotulo: R.sobre.fechar, classe: "branco", acao: () => J.ir("inicio", { foco: "sobre" }) }]
      };
      return d;
    }
  });

  J.registrar("abertura-falas", {
    grupo: "Abertura", nome: "Boas-vindas (3 falas)",
    entrar() { J.falar(R.abertura.falas, () => J.ir("selecao")); },
    montar() {
      const base = CN.quartoAbertura();
      return {
        cenario: base.cenario,
        objetos: [{ asset: "ui-logo", x: 370, y: 190, w: 700, h: 150 }],
        escolhas: [{ id: "pular", rotulo: R.abertura.pular, x: 1180, y: 40, w: 220, h: 48, classe: "branco", acao: () => J.ir("selecao") }],
        escolhasDuranteFala: true   /* "Pular abertura" funciona mesmo com a fala aberta */
      };
    }
  });

  /* ---------------- MENU ---------------- */

  J.registrar("selecao", {
    grupo: "Menu", nome: "Seleção de caso",
    entrar(e, p) { if (!p.escolhido) J.falar([R.selecao.fala]); },
    montar(e, p) {
      const S = R.selecao;
      const cards = S.casos.map((c, i) => ({
        id: "caso-" + c.id, tipo: "card",
        x: 240 + i * 330, y: 150, w: 300, h: 330,
        card: {
          asset: c.bloqueado ? "ui-miniatura-caso-bloqueado" : "ui-miniatura-caso-joao",
          nome: c.nome, descricao: c.descricao, estado: c.estado, bloqueado: c.bloqueado
        },
        selecionado: !c.bloqueado && !!p.escolhido,
        desativado: c.bloqueado,
        acao: c.bloqueado ? null : () => J.atualizar({ escolhido: c.id, foco: "iniciar-atendimento" })
      }));
      return {
        cenario: CN.quartoAbertura().cenario,
        hud: { titulo: S.titulo },
        escolhas: [
          { id: "caso-anterior", rotulo: "‹", rotuloAria: S.anterior, x: 160, y: 287, w: 56, h: 56, desativado: true },
          ...cards,
          { id: "caso-proximo", rotulo: "›", rotuloAria: S.proximo, x: 1224, y: 287, w: 56, h: 56, desativado: true },
          ...(p.escolhido ? [{
            id: "iniciar-atendimento", rotulo: S.iniciar, x: 540, y: 520, w: 360, h: 68, classe: "destaque",
            acao: () => { M.estado.caso = p.escolhido; J.ir("leito"); }
          }] : [])
        ]
      };
    }
  });

  J.registrar("leito", {
    grupo: "Menu", nome: "Leito do Sr. João (4 falas)",
    entrar() { J.falar(R.leito.falas, () => J.ir("investigacao")); },
    montar() {
      const d = CN.leito();
      d.hud = { voltar: () => J.ir("selecao", { escolhido: "joao" }) };
      return d;
    }
  });

  /* Pistas opcionais: posição dos pontos no cenário */
  const PISTAS_LEITO = [
    { k: "bandeja", x: 1285, y: 365, w: 190, h: 90 },
    { k: "fralda", x: 720, y: 450, w: 130, h: 80 },
    { k: "regua", x: 720, y: 83, w: 300, h: 60 }
  ];

  J.registrar("investigacao", {
    grupo: "Menu", nome: "Investigação clínica (opcional)",
    montar(e) {
      const I = R.investigacao, vistos = e.investigacao.vistos;
      const d = CN.leito();
      d.hotspots = PISTAS_LEITO.map(p => ({
        id: "pista-" + p.k, x: p.x, y: p.y, w: p.w, h: p.h,
        rotulo: I.pistas[p.k].rotulo, visto: vistos.includes(p.k),
        acao: () => {
          if (!vistos.includes(p.k)) vistos.push(p.k);
          J.falar([{ quem: "narrador", texto: I.pistas[p.k].texto }]);
        }
      }));
      d.hud = {
        voltar: () => J.ir("leito"),
        contador: I.contador(vistos.length, PISTAS_LEITO.length),
        direita: { id: "encerrar", rotulo: I.encerrar, acao: () => J.ir("priorizacao") }
      };
      return d;
    }
  });

  /* Posições dos 4 botões (ordem embaralhada de propósito, como na main) */
  const POS_BLOCOS = { b3: [183, 200], b2: [732, 200], b4: [183, 360], b1: [732, 360] };

  function iniciarBloco(b) {
    M.registrarPrioridade(b);
    if (b === "b1") return J.ir("b1-intro");
    /* Blocos 2–4 ficam fora do escopo desta branch */
    M.marcarFeito(b);
    J.falar([R.priorizacao.foraDoEscopo(R.blocos[b])], () => J.ir("priorizacao"));
  }

  J.registrar("priorizacao", {
    grupo: "Menu", nome: "Priorização (menu de blocos)",
    entrar(e) {
      if (M.todosFeitos()) J.falar([R.priorizacao.todosFeitos], () => { M.reiniciar(); J.ir("inicio"); });
      else if (!e.ordem.length) J.falar([R.priorizacao.fala]);
    },
    montar(e, p) {
      const P = R.priorizacao;
      const d = CN.leito();
      d.objetos.push({ asset: null, veu: true, x: 0, y: 0, w: 1440, h: 810 });
      d.hud = { titulo: P.titulo, voltar: () => J.ir("investigacao") };
      d.escolhas = Object.entries(POS_BLOCOS).map(([b, [x, y]]) => ({
        id: "bloco-" + b, rotulo: R.blocos[b], x, y, w: 525, h: 138,
        classe: "branco", selecionado: p.sel === b, feito: e.feito[b], desativado: e.feito[b],
        acao: () => J.atualizar({ sel: b })
      }));
      d.escolhas.push({
        id: "escolher-prioridade", rotulo: P.escolher, x: 522, y: 530, w: 395, h: 64,
        classe: "destaque", desativado: !p.sel, acao: () => iniciarBloco(p.sel)
      });
      return d;
    }
  });
})();
