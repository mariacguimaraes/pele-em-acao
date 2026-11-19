/*
  js/view/tela-view.js — desenha a tela inteira a partir da DESCRIÇÃO que o ViewModel entrega.
  Cada parte da descrição vai para uma camada:
    cenario            → camada 1
    objetos, hotspots, digito → camada 2
    hud (título, pausa, info, ficha, dock...) → camada 3
    escolhas, painel, diálogo → camada 4
  Enquanto há fala na caixa, as camadas de baixo ficam "inert" (não recebem clique nem foco),
  então o teclado vai direto para o "Continuar".
*/
window.PA = window.PA || {};

PA.telaView = (function () {
  const J = PA.jogo, AV = PA.assetsView, CAM = PA.palco.camadas;
  const px = n => n + "px";

  /* Posiciona um elemento com as coordenadas do Figma */
  function pos(el, o) {
    if (o.x != null) el.style.left = px(o.x);
    if (o.y != null) el.style.top = px(o.y);
    if (o.w != null) el.style.width = px(o.w);
    if (o.h != null) el.style.height = px(o.h);
    return el;
  }

  function botao({ id, rotulo, rotuloAria, classe = "", selecionado, desativado, feito, acao }, posicao) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = ["btn", classe, selecionado && "sel", feito && "feito"].filter(Boolean).join(" ");
    b.innerHTML = rotulo;
    if (id) b.dataset.id = id;
    if (rotuloAria) b.setAttribute("aria-label", rotuloAria);
    if (selecionado) b.setAttribute("aria-pressed", "true");
    b.disabled = !!desativado;
    if (acao) b.addEventListener("click", acao);
    if (posicao) pos(b, posicao);
    return b;
  }

  /* ---------- Camada 1 e 2 ---------- */
  function desenharAssets(camada, lista = []) {
    lista.forEach(o => {
      if (o.veu) {
        const v = document.createElement("div");
        v.className = "asset";
        v.setAttribute("aria-hidden", "true");
        v.append(Object.assign(document.createElement("div"), { className: "ph" }));
        v.firstChild.dataset.forma = "veu";
        camada.append(pos(v, o));
      } else camada.append(AV.criar(o.asset, o, { decorativo: o.decorativo }));
    });
  }

  function desenharHotspots(camada, lista = []) {
    lista.forEach(h => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hotspot " + (h.visto ? "visto" : "pulsar");
      b.dataset.id = h.id;
      b.setAttribute("aria-label", h.rotulo + (h.visto ? " (visto)" : ""));
      b.addEventListener("click", h.acao);
      camada.append(pos(b, h));
    });
  }

  /* Dígito-pressão: segurar o clique (ou a barra de espaço) pelo tempo pedido */
  function desenharDigito(camada, d) {
    if (!d) return;
    const anel = document.createElement("div");
    anel.className = "anel";
    anel.style.left = px(d.centroX);
    anel.style.top = px(d.centroY);
    const rot = document.createElement("div");
    rot.className = "anel-rotulo";
    rot.style.left = px(d.centroX);
    rot.style.top = px(d.centroY + 92);
    rot.hidden = true;

    const b = document.createElement("button");
    b.type = "button";
    b.className = "digito";
    b.dataset.id = d.id;
    b.disabled = d.desativado;
    b.setAttribute("aria-label", d.rotulo);
    b.setAttribute("role", "button");
    b.append(AV.criar(d.asset, { x: 0, y: 0, w: d.w, h: d.h }, { decorativo: true }));
    pos(b, d);

    const barra = document.createElement("div");
    barra.setAttribute("role", "progressbar");
    barra.setAttribute("aria-label", "Tempo pressionando");
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", String(d.segundos));
    barra.className = "so-leitor";

    let inicio = null, quadro = null;
    const pintar = s => {
      anel.style.background = s > 0 ? `conic-gradient(var(--cor-acao) ${(s / d.segundos) * 360}deg, rgb(255 255 255 / .5) 0)` : "none";
      rot.hidden = s <= 0;
      rot.textContent = `${Math.min(s, d.segundos).toFixed(1)} s / ${d.segundos} s`;
      barra.setAttribute("aria-valuenow", s.toFixed(0));
    };
    const passo = () => {
      const s = (performance.now() - inicio) / 1000;
      pintar(s);
      if (s >= d.segundos) terminar();
    };
    const comecar = () => { if (inicio != null || b.disabled) return; inicio = performance.now(); quadro = setInterval(passo, 50); };
    const terminar = () => {
      if (inicio == null) return;
      clearInterval(quadro);
      const s = (performance.now() - inicio) / 1000;
      inicio = null;
      pintar(0);
      d.aoSoltar(s);
    };
    b.addEventListener("pointerdown", e => { e.preventDefault(); b.setPointerCapture?.(e.pointerId); comecar(); });
    b.addEventListener("pointerup", terminar);
    b.addEventListener("pointercancel", terminar);
    b.addEventListener("lostpointercapture", terminar);
    b.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); comecar(); } });
    b.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); terminar(); } });
    b.addEventListener("click", e => e.preventDefault());
    b.addEventListener("blur", terminar);

    camada.append(b, anel, rot, barra);
  }

  /* ---------- Camada 3 · HUD ---------- */
  function desenharHud(camada, hud) {
    if (!hud) return;
    const R = PA.roteiro;
    if (hud.titulo) {
      const t = document.createElement("h1");
      t.className = "hud-titulo";
      t.style.margin = "0";
      t.innerHTML = hud.titulo + (hud.subtitulo ? `<small>${hud.subtitulo}</small>` : "");
      camada.append(t);
    }
    if (hud.pausar) {
      const b = botao({ id: "hud-pausar", rotulo: "❚❚", rotuloAria: R.pausa.botao, acao: J.pausar });
      b.className = "hud-icone";
      camada.append(b);
    } else if (hud.voltar) {
      const b = botao({ id: "hud-voltar", rotulo: "↩", rotuloAria: R.leito.voltar, acao: hud.voltar });
      b.className = "hud-icone";
      camada.append(b);
    }
    if (hud.contador) {
      const c = document.createElement("div");
      c.className = "hud-contador";
      c.setAttribute("role", "status");
      c.textContent = hud.contador;
      camada.append(c);
    }
    if (hud.direita) camada.append(botao(Object.assign({ classe: "branco" }, hud.direita), { x: 1069, y: 57, w: 300, h: 50 }));
    if (hud.info) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hud-info";
      b.dataset.id = "hud-info";
      b.innerHTML = `<span aria-hidden="true">i</span>${R.ui.info}`;
      b.addEventListener("click", () => J.falar([PA.fala(hud.info)]));
      camada.append(b);
    }
    if (hud.aba) {
      const b = botao(hud.aba);
      b.className = "hud-aba";
      b.setAttribute("aria-expanded", "false");
      camada.append(b);
    }
    if (hud.ficha) camada.append(ficha(hud.ficha));
    if (hud.dock) {
      const dock = document.createElement("nav");
      dock.className = "hud-dock";
      dock.setAttribute("aria-label", "Ferramentas");
      hud.dock.forEach(i => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.id = i.id;
        b.className = i.ativo ? "ativo" : "";
        b.disabled = !!i.desativado;
        b.innerHTML = `<span class="ic" aria-hidden="true">${i.icone}</span>${i.rotulo}`;
        b.addEventListener("click", i.acao);
        dock.append(b);
      });
      camada.append(dock);
    }
  }

  function ficha(f) {
    const el = document.createElement("section");
    el.className = "hud-ficha";
    el.setAttribute("aria-label", f.titulo);
    const h = document.createElement("h2");
    h.textContent = f.titulo;
    const itens = document.createElement("div");
    itens.className = "itens";
    f.itens.forEach((it, i) => {
      const lab = document.createElement("label");
      lab.textContent = it.rotulo;
      const sel = document.createElement("select");
      sel.dataset.id = it.id;
      sel.innerHTML = `<option value="">${f.selecione}</option>` +
        it.opcoes.map((o, j) => `<option value="${j + 1}"${String(it.valor) === String(j + 1) ? " selected" : ""}>${o}</option>`).join("");
      sel.addEventListener("change", () => f.aoMudar(i, sel.value));
      lab.append(sel);
      itens.append(lab);
    });
    const rod = document.createElement("div");
    rod.className = "rodape";
    const st = document.createElement("span");
    st.setAttribute("role", "status");
    st.textContent = f.status;
    rod.append(st, botao(Object.assign({ classe: "branco estatico" }, f.minimizar)), botao(Object.assign({ classe: "destaque estatico" }, f.enviar)));
    el.append(h, itens, rod);
    return el;
  }

  /* ---------- Camada 4 · escolhas e painéis ---------- */
  function desenharEscolhas(camada, lista = []) {
    lista.forEach(e => {
      if (e.tipo === "card") return camada.append(card(e));
      camada.append(botao(e, e));
    });
  }

  function card(e) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card-caso" + (e.selecionado ? " sel" : "");
    b.dataset.id = e.id;
    if (e.desativado) b.setAttribute("aria-disabled", "true");
    if (e.selecionado) b.setAttribute("aria-pressed", "true");
    b.append(AV.criar(e.card.asset, null, { decorativo: true }));
    b.insertAdjacentHTML("beforeend", `<b>${e.card.nome}</b><span>${e.card.descricao}</span><span class="estado">${e.card.estado}</span>`);
    if (e.card.bloqueado) b.insertAdjacentHTML("beforeend", `<span class="cadeado" aria-hidden="true">🔒</span>`);
    if (e.acao) b.addEventListener("click", e.acao);
    return pos(b, e);
  }

  function desenharPainel(camada, p) {
    if (!p) return;
    if (!p.semVeu) {
      const v = document.createElement("div");
      v.className = "painel-veu";
      camada.append(v);
    }
    const el = document.createElement("section");
    el.className = "painel";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", p.titulo);
    pos(el, p);

    if (p.tipo === "gabarito") {
      el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px"><h2>${p.titulo}</h2><span role="status"><b>${p.resumo}</b></span></div>
        <table class="gabarito"><thead><tr><th scope="col">${p.colunas[0]}</th><th scope="col">${p.colunas[1]}</th></tr></thead><tbody>
        ${p.linhas.map(l => `<tr><td class="${l.errou ? "erro" : "certo"}"><span class="marca" aria-label="${l.errou ? "errado" : "certo"}">${l.marca}</span>${l.item}<br><b>${l.seu}</b></td><td>${l.item}<br><b>${l.certo}</b></td></tr>`).join("")}
        </tbody></table>`;
      camada.append(el);
      return;
    }

    const h = document.createElement("h2");
    h.textContent = p.titulo;
    const corpo = document.createElement("div");
    corpo.style.cssText = "display:grid;gap:12px;align-content:start";
    corpo.append(h);
    (p.paragrafos || []).forEach(t => corpo.insertAdjacentHTML("beforeend", `<p>${t}</p>`));
    if (p.referencia) corpo.insertAdjacentHTML("beforeend", `<p class="ref">${p.referencia}</p>`);
    const acoes = document.createElement("div");
    acoes.className = "acoes";
    (p.acoes || []).forEach(a => acoes.append(botao(Object.assign({}, a, { classe: (a.classe || "") + " estatico" }))));
    corpo.append(acoes);

    if (p.imagem) {
      el.style.gridTemplateColumns = `${p.imagem.w}px 1fr`;
      el.style.columnGap = "28px";
      const img = AV.criar(p.imagem.asset, null);
      img.style.position = "relative";
      img.style.height = px(p.imagem.h);
      el.append(img, corpo);
    } else el.append(corpo);
    camada.append(el);
  }

  /* ---------- Desenho completo ---------- */
  function desenhar() {
    const d = J.descricao();
    const ativo = document.activeElement;
    const focoAntes = ativo && PA.palco.elemento.contains(ativo) ? ativo.dataset.id : null;

    Object.values(CAM).forEach(c => { c.replaceChildren(); c.inert = false; });

    desenharAssets(CAM.cenario, d.cenario);
    desenharAssets(CAM.objetos, d.objetos);
    desenharHotspots(CAM.objetos, d.hotspots);
    desenharDigito(CAM.objetos, d.digito);
    desenharHud(CAM.hud, d.hud);

    /* Camada 4: escolhas e painel ficam num grupo; a caixa de diálogo vem por cima */
    const grupo = document.createElement("div");
    grupo.className = "camada";
    grupo.style.position = "absolute";
    desenharEscolhas(grupo, d.escolhas);
    desenharPainel(grupo, d.painel);
    CAM.dialogo.append(grupo);
    const continuar = PA.dialogoView.desenhar(CAM.dialogo, d.dialogo);

    /* Com fala aberta (e sem pausa), o resto da tela espera */
    const pausado = d.painel && d.painel.acoes && d.painel.acoes.some(a => a.id === "pausa-continuar");
    if (continuar && !pausado) {
      CAM.cenario.inert = CAM.objetos.inert = CAM.hud.inert = true;
      if (!d.escolhasDuranteFala) grupo.inert = true;
    }
    if (pausado) {
      CAM.cenario.inert = CAM.objetos.inert = CAM.hud.inert = true;
      CAM.dialogo.querySelector(".dialogo")?.setAttribute("inert", "");
      CAM.dialogo.querySelector(".dialogo-avatar")?.setAttribute("inert", "");
    }

    /* Foco: (1) pedido pela cena, (2) Continuar da fala, (3) o mesmo elemento de antes, (4) o primeiro disponível */
    const params = J.parametros();
    const achar = id => id && PA.palco.elemento.querySelector(`[data-id="${CSS.escape(id)}"]:not(:disabled)`);
    let alvo = null;
    if (pausado) alvo = achar("pausa-continuar");
    else if (continuar) alvo = continuar;
    else if (params.foco && achar(params.foco)) { alvo = achar(params.foco); delete params.foco; }
    else if (focoAntes) alvo = achar(focoAntes);
    const focoPerdido = focoAntes || document.activeElement === document.body || !document.activeElement;
    if (!alvo && focoPerdido) {
      /* Prefere as escolhas da cena (camada 4); depois o resto */
      const livres = sel => [...PA.palco.elemento.querySelectorAll(sel)].find(el => !el.closest("[inert]"));
      alvo = livres("#camada-dialogo button:not(:disabled)") || livres("button:not(:disabled), select");
    }
    if (alvo) alvo.focus({ preventScroll: true });

    PA.telaView.depoisDeDesenhar.forEach(f => f(d));
  }

  return { desenhar, depoisDeDesenhar: [] };
})();
