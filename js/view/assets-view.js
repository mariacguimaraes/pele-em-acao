/*
  js/view/assets-view.js — desenha um asset a partir do manifesto.
  Tenta carregar o arquivo final; se ele ainda não existir, mostra o placeholder
  (retângulo, círculo, pessoa ou texto) com as cores dos tokens.
  Assim, basta salvar o arquivo com o nome certo em assets/img/ para a troca acontecer.
*/
window.PA = window.PA || {};

PA.assetsView = (function () {
  /* Lembra quais arquivos existem ou não, para não tentar de novo a cada redesenho */
  const situacao = {};   /* id → "ok" | "falta" */

  function placeholder(id, info) {
    const ph = document.createElement("div");
    ph.className = "ph";
    ph.dataset.forma = info ? info.placeholder.forma : "retangulo";
    ph.textContent = info ? info.placeholder.rotulo : id;
    return ph;
  }

  return {
    situacao,

    /* Cria o elemento. "pos" é {x,y,w,h} em px do Figma; sem pos, ocupa o pai inteiro. */
    criar(id, pos, opcoes = {}) {
      const info = PA.assets[id];
      const el = document.createElement("div");
      el.className = "asset";
      el.dataset.asset = id;
      if (pos) Object.assign(el.style, { left: pos.x + "px", top: pos.y + "px", width: pos.w + "px", height: pos.h + "px" });
      if (!info) console.warn("Asset fora do manifesto:", id);

      /* Acessibilidade: decorativo (aria-hidden) ou com descrição (role=img + alt) */
      if (opcoes.decorativo) el.setAttribute("aria-hidden", "true");
      else if (info) { el.setAttribute("role", "img"); el.setAttribute("aria-label", info.alt); }

      const mostrarPlaceholder = () => { el.replaceChildren(placeholder(id, info)); };

      if (!info || situacao[id] === "falta") { mostrarPlaceholder(); return el; }

      const img = new Image();
      img.alt = "";                     /* a descrição já está no aria-label do contêiner */
      img.decoding = "async";
      img.onload = () => { situacao[id] = "ok"; };
      img.onerror = () => { situacao[id] = "falta"; mostrarPlaceholder(); };
      img.src = info.arquivo;
      if (situacao[id] === "ok") el.append(img);
      else { mostrarPlaceholder(); img.onload = () => { situacao[id] = "ok"; el.replaceChildren(img); }; }
      return el;
    }
  };
})();
