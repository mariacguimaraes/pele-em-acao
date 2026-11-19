/*
  js/main.js — liga tudo e dá a partida.
  1. A View passa a "ouvir" o ViewModel: sempre que algo muda, a tela é redesenhada.
  2. Espera as fontes carregarem (a paginação da caixa de diálogo mede o texto).
  3. Começa na tela inicial — ou na cena pedida no endereço, ex.: index.html?cena=b1-braden
     Outros atalhos de teste: ?placeholders=0 (desliga placeholders) · ?menu=1 (abre o menu do protótipo)
*/
(function () {
  PA.jogo.aoMudar(PA.telaView.desenhar);

  const q = new URLSearchParams(location.search);
  const comecar = () => {
    if (q.get("placeholders") === "0") PA.menuPrototipo.setPlaceholders(false);
    const cena = q.get("cena");
    if (cena && PA.jogo.existe(cena)) PA.menuPrototipo.pular(cena);
    else PA.jogo.ir("inicio");
    if (q.get("menu") === "1") PA.menuPrototipo.abrir(false);
  };

  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(comecar, comecar);
})();
