/*
  js/view/menu-prototipo.js — o MENU DO PROTÓTIPO (camada 5). Ferramenta de teste, não faz parte do jogo.
  Como abrir:
    • encostar o cursor na borda esquerda da janela (faixa de 8px) — some quando o cursor sai do painel;
    • botão "Menu do protótipo" na barra inferior;
    • tecla M (Esc fecha e devolve o foco para onde estava).
  O que tem: pular para qualquer cena da Abertura, do Menu e do Bloco 1, reiniciar,
  ver o estado atual (variáveis do Model) e ligar/desligar os placeholders.
*/
window.PA = window.PA || {};

PA.menuPrototipo = (function () {
  const J = PA.jogo, M = PA.modelo, RB = PA.regrasBloco1;
  const painel = document.getElementById("proto-menu");
  const borda = document.getElementById("proto-borda");
  const barra = document.getElementById("proto-barra");
  let abertoPorHover = false;
  let focoAnterior = null;
  let preEstado = null;

  /* Prepara o Model para que a cena faça sentido quando acessada direto */
  function prepararPara(id) {
    const e = M.estado;
    if (["leito", "investigacao", "priorizacao"].includes(id) || id.startsWith("b1-")) e.caso = e.caso || "joao";
    if (id.startsWith("b1-") && !e.ordem.includes("b1")) M.registrarPrioridade("b1");
    if (["b1-gabarito", "b1-inspecao", "b1-digito", "b1-pele-negra"].includes(id) && !RB.fichaCompleta()) RB.preencherExemplo();
    if (id === "b1-gabarito") e.bloco1.bradenEnviada = false, e.bloco1.bradenErros = [];
    if (["b1-digito", "b1-pele-negra"].includes(id) && !e.bloco1.inspecaoVistos.includes("c")) e.bloco1.inspecaoVistos.push("c");
    if (id === "b1-digito") e.bloco1.resultadoDigito = null;
    if (id === "b1-pele-negra" && !e.bloco1.resultadoDigito) e.bloco1.resultadoDigito = e.ordem[0] === "b1" ? "branqueia" : "nao-branqueia";
  }

  function pular(id) {
    if (!J.existe(id)) return;
    prepararPara(id);
    J.ir(id, id === "b1-braden" ? { ficha: true } : {});
  }

  function setPlaceholders(ligado) {
    document.documentElement.classList.toggle("sem-placeholders", !ligado);
    const c = painel.querySelector("#proto-ph");
    if (c) c.checked = ligado;
  }

  /* ---------- Abrir e fechar ---------- */
  function abrir(porHover) {
    if (!painel.hidden) return;
    abertoPorHover = porHover;
    focoAnterior = document.activeElement;
    painel.hidden = false;
    atualizarEstado();
    barra.querySelector("#proto-abrir")?.setAttribute("aria-expanded", "true");
    if (!porHover) painel.querySelector("button")?.focus();
  }
  function fechar() {
    if (painel.hidden) return;
    painel.hidden = true;
    barra.querySelector("#proto-abrir")?.setAttribute("aria-expanded", "false");
    if (!abertoPorHover && focoAnterior && document.contains(focoAnterior)) focoAnterior.focus();
    abertoPorHover = false;
  }
  const alternar = () => (painel.hidden ? abrir(false) : fechar());

  borda.addEventListener("mouseenter", () => abrir(true));
  painel.addEventListener("mouseleave", () => { if (abertoPorHover) fechar(); });
  painel.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); fechar(); } });
  /* Se abriu pelo hover e o teclado entrou no painel, ele passa a ficar aberto até Esc */
  painel.addEventListener("focusin", () => { abertoPorHover = false; });
  document.addEventListener("keydown", e => {
    const t = e.target;
    const digitando = t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    if (digitando || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "m" || e.key === "M") { e.preventDefault(); alternar(); }
    else if (e.key === "Escape") fechar();
  });

  /* ---------- Conteúdo ---------- */
  function montar() {
    const grupos = {};
    J.listarCenas().forEach(c => (grupos[c.grupo] = grupos[c.grupo] || []).push(c));
    painel.innerHTML = `
      <h2>Menu do protótipo</h2>
      <p class="dica">Ferramenta de teste. Abre pela borda esquerda, pela barra inferior ou com a tecla M. Esc fecha.</p>
      ${Object.entries(grupos).map(([g, cs]) => `
        <h2>${g}</h2>
        <ul>${cs.map(c => `<li><button type="button" data-cena="${c.id}">${c.nome}</button></li>`).join("")}</ul>`).join("")}
      <h2>Controles</h2>
      <ul>
        <li><button type="button" id="proto-reiniciar">Reiniciar o jogo</button></li>
      </ul>
      <label><input type="checkbox" id="proto-ph" checked> Mostrar placeholders</label>
      <label><input type="checkbox" id="proto-b1"> Bloco 1 escolhido como 1ª prioridade</label>
      <p class="dica">Desmarcado = Bloco 1 escolhido depois de outro bloco (a dígito-pressão mostra LP estágio 1).</p>
      <h2>Estado atual (Model)</h2>
      <pre id="proto-estado" aria-live="off"></pre>`;
    preEstado = painel.querySelector("#proto-estado");
    painel.querySelectorAll("[data-cena]").forEach(b => b.addEventListener("click", () => { pular(b.dataset.cena); }));
    painel.querySelector("#proto-reiniciar").addEventListener("click", () => { M.reiniciar(); J.ir("inicio"); });
    painel.querySelector("#proto-ph").addEventListener("change", e => setPlaceholders(e.target.checked));
    painel.querySelector("#proto-b1").addEventListener("change", e => { M.definirBloco1Primeiro(e.target.checked); atualizarEstado(); });

    barra.innerHTML = `
      <div class="grupo"><b>Pele em Ação · protótipo</b><span class="so-largo">branch feat/reestrutura-abertura-menu-bloco1</span></div>
      <div class="grupo">
        <span id="proto-ias" role="status"></span>
        <button type="button" id="proto-abrir" aria-controls="proto-menu" aria-expanded="false">☰ Menu do protótipo (M)</button>
      </div>`;
    barra.querySelector("#proto-abrir").addEventListener("click", alternar);
  }

  function atualizarEstado() {
    const e = M.estado;
    const ias = document.getElementById("proto-ias");
    if (ias) ias.textContent = `IAS ${M.ias()} / ${M.CONFIG.totalMaximo} · Ordem: ${e.ordem.map(b => b.toUpperCase()).join(" → ") || "—"}`;
    if (painel.hidden || !preEstado) return;
    painel.querySelectorAll("[data-cena]").forEach(b => b.setAttribute("aria-current", String(b.dataset.cena === J.cenaAtual())));
    painel.querySelector("#proto-b1").checked = e.ordem[0] === "b1";
    preEstado.textContent = JSON.stringify({ cena: J.cenaAtual(), parametrosDaCena: J.parametros(), IAS: M.ias(), estado: e },
      (k, v) => (typeof v === "function" ? undefined : v), 2);
  }

  montar();
  PA.telaView.depoisDeDesenhar.push(atualizarEstado);

  return { pular, abrir, fechar, setPlaceholders };
})();
