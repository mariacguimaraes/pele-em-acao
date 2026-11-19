/*
  js/view/dialogo-view.js — o componente "Caixa de diálogo".
  A caixa tem SEMPRE o mesmo tamanho e a mesma posição (definidos em css/tokens.css).
  Se o texto não cabe, ele é dividido em páginas: o botão "Continuar" mostra a próxima página
  e, na última, passa para a próxima fala. A caixa nunca cresce e não empurra nada.
  O avatar de quem fala faz parte deste componente (fica na camada 4, na frente da caixa).
*/
window.PA = window.PA || {};

PA.dialogoView = (function () {
  const R = () => PA.roteiro;
  let chaveAtual = null;   /* qual fala está na caixa */
  let paginas = [];
  let pagina = 0;

  /* Conta se um pedaço de HTML terminou com um <b> aberto */
  const negritoAberto = html => (html.match(/<b>/g) || []).length > (html.match(/<\/b>/g) || []).length;
  const fechar = html => html + (negritoAberto(html) ? "</b>" : "");

  /* Divide o texto em páginas que cabem na área de texto (altura fixa). */
  function paginar(html, alvo) {
    const palavras = html.split(/(\s+)/).filter(p => p !== "");
    const resultado = [];
    let atual = "";
    for (const p of palavras) {
      const tentativa = atual + p;
      alvo.innerHTML = fechar(tentativa);
      if (alvo.scrollHeight > alvo.clientHeight + 1 && atual.trim()) {
        resultado.push(fechar(atual.trimEnd()));
        atual = (negritoAberto(atual) ? "<b>" : "") + p.trimStart();
      } else {
        atual = tentativa;
      }
    }
    if (atual.trim()) resultado.push(fechar(atual.trim()));
    return resultado.length ? resultado : [""];
  }

  function desenhar(camada, fala) {
    if (!fala) { chaveAtual = null; return null; }
    const falante = R().falantes[fala.quem] || R().falantes.narrador;
    const frag = document.createDocumentFragment();

    const caixa = document.createElement("section");
    caixa.className = "dialogo";
    caixa.setAttribute("aria-label", "Diálogo");
    if (fala.tom) caixa.dataset.tom = fala.tom;

    const quem = document.createElement("p");
    quem.className = "quem";
    quem.textContent = falante.nome;
    if (fala.tom) {
      const tom = document.createElement("span");
      tom.className = "tom";
      tom.textContent = R().ui.tons[fala.tom] || "";
      quem.append(tom);
    }

    const texto = document.createElement("p");
    texto.className = "texto";
    texto.setAttribute("aria-live", "polite");

    const num = document.createElement("span");
    num.className = "pagina";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn branco continuar";
    btn.dataset.id = "dialogo-continuar";
    btn.textContent = R().ui.continuar + " ›";

    caixa.append(quem, texto, num, btn);

    if (falante.avatar) frag.append(PA.assetsView.criar(falante.avatar, null, { decorativo: true }));
    if (falante.avatar) frag.lastChild.className = "asset dialogo-avatar";
    frag.append(caixa);
    camada.append(frag);

    /* Paginação: só recalcula quando a fala muda */
    if (fala.chave !== chaveAtual) {
      chaveAtual = fala.chave;
      paginas = paginar(fala.texto, texto);
      pagina = 0;
    }
    const mostrar = () => {
      texto.innerHTML = paginas[pagina];
      num.textContent = paginas.length > 1 ? R().ui.pagina(pagina + 1, paginas.length) : "";
    };
    mostrar();

    btn.addEventListener("click", () => {
      if (pagina < paginas.length - 1) { pagina++; mostrar(); btn.focus(); }
      else PA.jogo.avancarFala();
    });
    return btn;
  }

  return { desenhar, paginasAtuais: () => paginas.length };
})();
