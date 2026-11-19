/*
  js/view/palco.js — faz o palco 1440×810 caber na janela.
  Calcula uma escala única (a menor entre largura e altura) e centraliza.
  É como "Scale" no Figma com a proporção travada: tudo cresce e encolhe junto,
  por isso nada se desalinha ao redimensionar.
*/
window.PA = window.PA || {};

PA.palco = (function () {
  const LARGURA = 1440, ALTURA = 810;
  const area = document.getElementById("area-palco");
  const palco = document.getElementById("palco");
  let escala = 1;

  function ajustar() {
    const w = area.clientWidth, h = area.clientHeight;
    escala = Math.min(w / LARGURA, h / ALTURA);
    const x = (w - LARGURA * escala) / 2;
    const y = (h - ALTURA * escala) / 2;
    palco.style.transform = `translate(${x}px, ${y}px) scale(${escala})`;
  }

  new ResizeObserver(ajustar).observe(area);
  ajustar();

  return {
    elemento: palco,
    camadas: {
      cenario: document.getElementById("camada-cenario"),
      objetos: document.getElementById("camada-objetos"),
      hud: document.getElementById("camada-hud"),
      dialogo: document.getElementById("camada-dialogo")
    },
    escala: () => escala
  };
})();
