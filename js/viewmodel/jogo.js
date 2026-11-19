/*
  js/viewmodel/jogo.js — o "maestro" do ViewModel.
  Guarda em que cena estamos, qual fala está na caixa de diálogo e se há um painel aberto.
  Cada cena (nos arquivos cenas-*.js) é registrada aqui com:
    grupo   → "Abertura", "Menu" ou "Bloco 1" (usado no menu do protótipo)
    nome    → nome legível
    entrar  → o que acontece ao chegar na cena (ex.: começar falas)  [opcional]
    montar  → devolve a DESCRIÇÃO da tela: o que vai em cada camada.
  A descrição é como escolher as "variantes" de um componente no Figma:
  a View recebe essa descrição e só desenha. Ela nunca decide regra.
*/
window.PA = window.PA || {};

PA.jogo = (function () {
  const cenas = {};          /* todas as cenas registradas, na ordem do roteiro */
  let cenaId = null;
  let params = {};           /* variáveis da cena atual (ex.: qual botão está selecionado) */
  let dialogo = null;        /* { linhas, i, aoFim, id } */
  let pausado = false;
  let contadorFalas = 0;
  const ouvintes = [];
  let agendado = false;

  /* Avisa a View que algo mudou (junta vários avisos seguidos em um só desenho) */
  function notificar() {
    if (agendado) return;
    agendado = true;
    queueMicrotask(() => { agendado = false; ouvintes.forEach(f => f()); });
  }

  const jogo = {
    registrar(id, def) { cenas[id] = Object.assign({ id }, def); },
    listarCenas() { return Object.values(cenas); },
    existe(id) { return !!cenas[id]; },
    cenaAtual() { return cenaId; },
    parametros() { return params; },
    aoMudar(f) { ouvintes.push(f); },

    /* Vai para outra cena */
    ir(id, p = {}) {
      if (!cenas[id]) { console.warn("Cena desconhecida:", id); return; }
      cenaId = id;
      params = Object.assign({}, p);
      dialogo = null;
      pausado = false;
      const c = cenas[id];
      if (c.entrar) c.entrar(PA.modelo.estado, params);
      notificar();
    },

    /* Muda variáveis da cena atual e redesenha */
    atualizar(p) { if (p) Object.assign(params, p); notificar(); },

    /* Coloca uma sequência de falas na caixa de diálogo.
       aoFim é chamado depois que a última fala é dispensada. */
    falar(linhas, aoFim) {
      dialogo = { linhas: [].concat(linhas), i: 0, aoFim, id: ++contadorFalas };
      notificar();
    },

    /* Chamado pela View quando a última página da fala atual termina */
    avancarFala() {
      if (!dialogo) return;
      dialogo.i++;
      if (dialogo.i >= dialogo.linhas.length) {
        const fim = dialogo.aoFim;
        dialogo = null;
        if (fim) fim();
      }
      notificar();
    },

    temFala() { return !!dialogo; },

    pausar() { pausado = true; notificar(); },
    continuar() { pausado = false; notificar(); },

    /* Monta a descrição completa da tela atual (cena + diálogo + pausa) */
    descricao() {
      const c = cenas[cenaId];
      if (!c) return {};
      const d = c.montar(PA.modelo.estado, params) || {};
      d.cenaId = cenaId;
      d.grupo = c.grupo;
      if (dialogo) {
        const linha = dialogo.linhas[dialogo.i];
        d.dialogo = Object.assign({ chave: dialogo.id + "-" + dialogo.i }, linha);
      }
      if (pausado) d.painel = jogo.painelPausa();
      return d;
    },

    /* Monta outra cena sem ir até ela (para reaproveitar um visual) */
    montarCena(id) { return cenas[id].montar(PA.modelo.estado, params) || {}; },

    painelPausa() {
      const R = PA.roteiro.pausa;
      return {
        tipo: "simples", titulo: R.titulo, x: 460, y: 220, w: 520, h: 300,
        acoes: [
          { id: "pausa-continuar", rotulo: R.continuar, classe: "branco", acao: jogo.continuar },
          { id: "pausa-menu", rotulo: R.menu, acao: () => { PA.modelo.reiniciar(); jogo.ir("inicio"); } }
        ]
      };
    }
  };

  return jogo;
})();
