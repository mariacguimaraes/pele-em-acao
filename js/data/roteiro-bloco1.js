/*
  js/data/roteiro-bloco1.js — os TEXTOS do Bloco 1 ("Conhecer o paciente e avaliar a pele").
  Falas, opções da Escala de Braden, gabarito e devolutivas. Nada de regra ou layout aqui.
  Origem: copiado de legado/js/game.js. Itens marcados com * no fim são propostas
  para fechar lacunas do roteiro (já existiam assim na main).
*/
window.PA = window.PA || {};
PA.roteiro = PA.roteiro || {};
(function () {
const C = PA.fala;
const N = texto => ({ quem: "narrador", texto });

PA.roteiro.bloco1 = {
  titulo: "Avaliação Diagnóstica",

  /* Cena 1 · introdução */
  intro: [
    C("Antes de qualquer intervenção, precisamos saber de quem estamos cuidando."),
    C("Vamos usar a <b>Escala de Braden</b> para medir o risco de desenvolvimento de uma <b>lesão por pressão</b> pelo Sr. João e examinar de perto as áreas em risco. Sua avaliação atenta pode evitar a ocorrência de uma lesão no futuro.")
  ],

  /* Cena 1 · pistas no leito (o texto aparece como narração) */
  pistas: [
    { rotulo: "Rosto", fala: N("Sr. João abre os olhos lentamente, murmura algo incompreensível e volta a dormir.") },
    { rotulo: "Fralda", fala: N("Fralda saturada; pele ao redor úmida.") },
    { rotulo: "Pernas", fala: N("Grade do leito elevada. Restrito ao leito por cirurgia de fêmur direito e dor intensa.") },
    { rotulo: "Braços", fala: N("Tenta se mexer levemente, mas exige ajuda total da equipe para mudar de posição.") },
    { rotulo: "Bandeja", fala: N("Prato com apenas algumas colheradas do purê. Aceitou menos de 50% do oferecido hoje.") },
    { rotulo: "Sacro / lençol", fala: N("Sr. João escorrega com frequência; a pele “arrasta” no lençol áspero ao ser reposicionado.") }
  ],
  infoBraden: "Clique nos pontos do leito para coletar as pistas e preencha a Ficha de Avaliação. O resultado aparece só ao enviar.",

  /* Ficha de avaliação · Escala de Braden. "gabarito" = número da opção correta (1, 2, 3...) */
  ficha: {
    titulo: "Ficha de avaliação · Escala de Braden",
    aba: "Ficha de avaliação Escala de Braden",
    selecione: "Selecione a opção",
    preenchidos: (n, t) => `${n}/${t} preenchidos`,
    minimizar: "Minimizar",
    enviar: "Enviar avaliação"
  },
  braden: [
    { item: "Percepção sensorial", opcoes: ["1 - Completamente limitado", "2 - Muito limitado", "3 - Levemente limitado", "4 - Nenhuma limitação"], gabarito: 3 },
    { item: "Umidade", opcoes: ["1 - Completamente molhada", "2 - Muito molhada", "3 - Ocasionalmente molhada", "4 - Raramente molhada"], gabarito: 2 },
    { item: "Atividade", opcoes: ["1 - Acamado", "2 - Confinado à cadeira", "3 - Anda ocasionalmente", "4 - Anda frequentemente"], gabarito: 1 },
    { item: "Mobilidade", opcoes: ["1 - Completamente imóvel", "2 - Bastante limitado", "3 - Levemente limitado", "4 - Não apresenta limitações"], gabarito: 2 },
    { item: "Nutrição", opcoes: ["1 - Muito pobre", "2 - Provavelmente inadequada", "3 - Adequada", "4 - Excelente"], gabarito: 2 },
    { item: "Fricção e cisalhamento", opcoes: ["1 - Problema", "2 - Problema em potencial", "3 - Nenhum problema"], gabarito: 1 }
  ],

  /* Cena 1.1 · devolutiva */
  envio: [
    C("Avaliação finalizada! Vamos conferir o resultado da sua <b>avaliação clínica.</b>"),
    C("Na enfermagem, um item mal avaliado na Escala de Braden pode significar uma <b>medida de prevenção</b> que deixamos de realizar."),
    C("Veja se os seus registros de <b>avaliação</b> estão <b>adequados</b> à realidade do Sr. João:")
  ],
  gabarito: {
    titulo: "Avaliação clínica × Gabarito",
    resumo: (acertos, erros, pts) => `${acertos} acertos · ${erros} erros · −${pts} pts`,
    suaColuna: soma => `Sua avaliação · ${soma} pontos`,
    gabaritoColuna: soma => `Gabarito · ${soma} pontos`,
    marcaCerto: "✓",
    marcaErro: "✗"
  },
  feedbackErro: [
    C("Observe com atenção: O Sr. João murmura e abre os olhos ao seu chamado. Ele responde ao estímulo verbal, embora não consiga expressar o desconforto de forma plena. O correto seria a estratificação <b>3 - Levemente Limitado</b>.", "erro"),
    C("Cuidado! Aquela fralda saturada e a pele esbranquiçada (macerada) indicam a presença de umidade. Marcar um risco baixo aqui nos faria ignorar a necessidade de uma <b>barreira de proteção</b>. A categoria adequada é <b>2 - Muito Molhada</b>.", "erro"),
    C("O Sr. João está restrito ao leito pela cirurgia de fêmur e pela dor intensa. O correto é <b>1 - Acamado</b>.*", "erro"),
    C("Ele tenta se mexer, mas exige ajuda total da equipe para mudar de posição. O correto é <b>2 - Bastante Limitado</b>.*", "erro"),
    C("Aqui está o perigo! Você marcou uma nutrição boa, mas esqueceu que ele aceitou menos de <b>50% da dieta</b>. Sem proteína, a pele perde a matéria-prima para se manter íntegra. Na Braden, esse indicador é classificado em <b>2 - Provavelmente Inadequada</b>.", "erro"),
    C("Observe como o Sr. João <b>escorrega</b> no leito. Esse “arrastar” da pele no lençol áspero é o cenário perfeito para uma lesão. Esse é um <b>1 - Problema</b> real que exige nossa intervenção imediata.", "erro")
  ],
  feedbackAcerto: C("<b>Parabéns!</b> Sua avaliação foi correta. Veja tudo o que você acertou!", "ok"),
  fechamento: [
    C("A consolidação dos escores de avaliação dos parâmetros clínicos do Sr. João totaliza <b>11 pontos</b>, o que o classifica em <b>Alto Risco</b> para o desenvolvimento de <b>lesões por pressão</b>."),
    C("Este indicador servirá como base para o planejamento das nossas próximas intervenções. Avançaremos agora para o <b>exame físico dermatológico</b> direto no leito.")
  ],

  /* Cena 2 · inspeção das proeminências ósseas */
  inspecao: {
    titulo: "Teste de dígito-pressão",
    info: "Inspecione as proeminências ósseas. O sacro (ponto C) exige o teste de dígito-pressão.",
    pontos: {
      a: { rotulo: "Ponto A · ombro esquerdo", fala: N("Pele íntegra, sem alterações térmicas ou de cor.") },
      a2: { rotulo: "Ponto A · ombro direito", fala: N("Pele íntegra, sem alterações térmicas ou de cor.") },
      b: { rotulo: "Ponto B · calcanhar esquerdo", fala: N("Pele íntegra. Nota-se leve ressecamento, mas sem hiperemia.") },
      b2: { rotulo: "Ponto B · calcanhar direito", fala: N("Pele íntegra. Nota-se leve ressecamento, mas sem hiperemia.") },
      c: { rotulo: "Ponto C · sacro", fala: N("Há uma mancha avermelhada visível na região sacral. Use a ferramenta de dígito-pressão.") }
    },
    ferramenta: "Dígito-pressão"
  },

  /* Cena 2 · dígito-pressão */
  digito: {
    titulo: "Teste de dígito-pressão",
    instrucao: segundos => N(`Clique e segure por ${segundos} segundos para avaliar a circulação no local.`),
    rotuloBotao: segundos => `Pressionar o sacro: segure o clique, ou a barra de espaço, por ${segundos} segundos`,
    soltouCedo: segundos => C(`<b>Atenção!</b> Para avaliar o dano tecidual, você precisa manter a pressão por <b>${segundos} segundos</b>. Se soltar antes, não saberemos se o sangue está circulando de forma adequada nesta região. Vamos tentar de novo, com calma.`, "erro"),
    branqueia: [
      C("Excelente decisão clínica! A priorização do exame físico dermatológico permitiu a identificação precoce do <b>risco tecidual</b>. Note que, ao pressionar, a <b>mancha branqueou.</b>", "ok"),
      C("Isso se chama <b>hiperemia reativa</b>: o sangue ainda consegue circular, mas o corpo manifesta um sinal clínico de <b>sofrimento tecidual</b> gerado pela <b>pressão</b>."),
      C("O <b>reposicionamento do paciente</b> no leito no momento adequado diminui a probabilidade de surgimento de uma <b>lesão!</b>")
    ],
    naoBranqueia: [
      C("Observe com atenção... a mancha não branqueou. Infelizmente, o tempo utilizado em outras tarefas e a <b>ausência de avaliação</b> da pele permitiu que o aumento da pressão local contribuísse para a ruptura da integridade da <b>microcirculação local.</b>", "crit"),
      C("O Sr. João agora tem uma <b>Lesão por Pressão Estágio 1.</b> Se agirmos imediatamente com o <b>protocolo de reposicionamento</b> e <b>alívio de pressão</b>, podemos evitar a progressão para um dano estrutural mais grave.", "crit")
    ],
    humanizacao: [
      C("Veja a expressão do Sr. João... ele gemeu baixinho e franziu a testa quando você <b>pressionou o sacro</b>. Essa área está muito <b>sensível e dolorida.</b>"),
      C("Além da técnica, nunca esqueça de considerar a <b>dor física</b> e a <b>dimensão subjetiva</b> vivenciada pelo paciente neste momento da internação."),
      C("O Sr. João tem a pele branca, o que facilita a visualização do eritema. Mas se ele fosse um paciente de pele preta, o sinal clínico seria bem diferente. Abra a ficha para entender a avaliação na pele retinta.")
    ],
    verPeleNegra: "Ver avaliação em pele negra"
  },

  /* Cena 2 · ficha da pele negra */
  peleNegra: {
    titulo: "Avaliação Clínica na Pele Negra",
    paragrafos: [
      "<b>Invisibilidade do eritema:</b> na pele negra ou retinta, a hiperemia clássica (vermelhidão) pode não ser visível.",
      "<b>Investigue ativamente:</b> tons arroxeados, azulados ou acinzentados; temperatura local mais quente ou mais fria; pele mais firme ou edemaciada; dor ou desconforto local antes de qualquer alteração visual.",
      "Ignorar esses sinais atrasa a prevenção e eleva o risco de a lesão progredir para estágios graves."
    ],
    referencia: "Ref.: Dhoonmoon et al. (2023), Wounds International; Wounds UK (2021).",
    ciente: "Ciente / Entendido"
  }
};
})();
