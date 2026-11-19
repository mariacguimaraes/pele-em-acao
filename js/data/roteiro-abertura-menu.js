/*
  js/data/roteiro-abertura-menu.js — os TEXTOS da Abertura e do Menu (seleção de caso, leito, priorização).
  Só texto: nada de posição, cor ou regra. Para corrigir uma fala, mexa só aqui.
  Formato de uma fala: { quem: "camila" | "joao" | "narrador" | "prototipo", texto: "...", tom: "ok" | "erro" | "crit" }
  <b>...</b> deixa a palavra em negrito.
  Origem: falas copiadas de legado/js/game.js (que segue o roteiro "Corrigido").
*/
window.PA = window.PA || {};
PA.roteiro = PA.roteiro || {};

/* Atalho para escrever falas da Enfa. Camila */
PA.fala = (texto, tom) => ({ quem: "camila", texto, tom });

PA.roteiro.falantes = {
  camila: { nome: "Enfa. Camila", avatar: "per-camila-avatar" },
  joao: { nome: "Sr. João", avatar: "per-joao-avatar" },
  narrador: { nome: "", avatar: null },
  prototipo: { nome: "Aviso do protótipo", avatar: null }
};

/* ---------- Tela 1 · Inicial ---------- */
PA.roteiro.inicio = {
  iniciar: "Iniciar o jogo",
  sobre: "Sobre o jogo"
};

PA.roteiro.sobre = {
  titulo: "Sobre o jogo",
  itens: [
    ["Fundamentação", "Guideline Internacional de Prevenção e Tratamento de Lesões por Pressão 2026 (EPUAP, NPIAP, PPPIA)."],
    ["Origem acadêmica", "produto tecnológico da dissertação de Mestrado de Camila Lemos Guimarães, PPG em Enfermagem da EEAN/UFRJ."],
    ["Nota técnica", "linguagem simplificada para a dinâmica do jogo, com termos técnicos preservados."],
    ["Pontuação", "cada bloco começa com 100 pontos; priorizar a avaliação dá +50. Máximo de 450 no Índice de Aproveitamento Simulado (IAS)."]
  ],
  fechar: "Fechar"
};

/* ---------- Abertura (3 falas de boas-vindas) ---------- */
PA.roteiro.abertura = {
  pular: "Pular abertura",
  falas: [
    PA.fala("Olá! Boas-vindas ao <b>Pele em Ação</b>. Este é um espaço para você aprimorar seu raciocínio clínico e aplicar na prática as evidências científicas atualizadas sobre prevenção de lesões por pressão."),
    PA.fala("Aqui você assume o papel do profissional de enfermagem responsável pelo cuidado, cujas decisões garantem a segurança do paciente."),
    PA.fala("Lembre-se: aprenderemos com cada acerto e, principalmente, com cada desafio. O seu objetivo é um cuidado de enfermagem de excelência! <b>Vamos começar?</b>")
  ]
};

/* ---------- Tela 2 · Seleção de caso ---------- */
PA.roteiro.selecao = {
  titulo: "Selecione o caso clínico",
  fala: PA.fala("Para começarmos, qual caso clínico você deseja estudar hoje?"),
  casos: [
    { id: "joao", nome: "Sr. João (75 anos)", descricao: "Pós-operatório de Fêmur. Hipoativo e com baixa ingesta alimentar.", estado: "Disponível", bloqueado: false },
    { id: "breve1", nome: "Em breve", descricao: "Caso bloqueado nesta versão.", estado: "Bloqueado", bloqueado: true },
    { id: "breve2", nome: "Em breve", descricao: "Caso bloqueado nesta versão.", estado: "Bloqueado", bloqueado: true }
  ],
  anterior: "Caso anterior",
  proximo: "Próximo caso",
  iniciar: "Iniciar atendimento"
};

/* ---------- Tela 3 · O leito do Sr. João ---------- */
PA.roteiro.leito = {
  voltar: "Voltar",
  falas: [
    PA.fala("Este é o Sr. João, de 75 anos. Ele está na nossa enfermaria em pós-operatório estável de <b>correção cirúrgica de fratura no fêmur direito.</b>"),
    PA.fala("Possui Diabetes Mellitus e Hipertensão Arterial. Ao examiná-lo, notei que está orientado, mas bastante <b>hipoativo</b> e <b>emagrecido</b>."),
    PA.fala("Ele usa fralda por incontinência e hoje quase não aceitou a refeição, embora consiga engolir sem problemas. <b>Vamos estruturar o seu plano de cuidados?</b>"),
    PA.fala("Para evitarmos uma lesão por pressão em seu João, <b>o que faremos primeiro?</b>")
  ]
};

/* Investigação clínica opcional (pistas no cenário) */
PA.roteiro.investigacao = {
  encerrar: "Encerrar investigação",
  contador: (n, total) => `Investigação clínica · ${n}/${total} pistas`,
  pistas: {
    bandeja: { rotulo: "Bandeja", texto: "Ingestão menor que 50% das refeições oferecidas" },
    fralda: { rotulo: "Fralda", texto: "Presença de umidade por incontinência urinária" },
    regua: { rotulo: "Régua de gases", texto: "Paciente em ar ambiente, estável." }
  }
};

/* ---------- Tela 4 · Priorização ("menu de priorização") ---------- */
PA.roteiro.blocos = {
  b1: "Conhecer o paciente e avaliar a pele",
  b2: "Mudar a posição e ajustar os apoios",
  b3: "Limpar e proteger a pele",
  b4: "Cuidar da alimentação e da hidratação"
};

PA.roteiro.priorizacao = {
  titulo: "Priorização das ações assistenciais",
  escolher: "Escolher prioridade",
  fala: PA.fala("Para garantir a segurança do Sr. João e evitar que a pele dele sofra danos, precisamos agir. Por qual dessas tarefas você vai começar o seu cuidado?"),
  /* Avisos do protótipo (não são falas do jogo) */
  foraDoEscopo: nome => ({ quem: "prototipo", texto: `O bloco “${nome}” ainda não foi migrado para esta versão. Ele foi marcado como concluído para você poder testar a ordem de prioridade. A versão completa continua em /legado/.` }),
  todosFeitos: { quem: "prototipo", texto: "Todos os blocos foram percorridos. Nesta versão o relatório final ainda não foi migrado; você volta para a tela inicial." }
};

/* ---------- Pausa ---------- */
PA.roteiro.pausa = {
  titulo: "Pausado",
  continuar: "Continuar",
  menu: "Voltar ao menu (reinicia)",
  botao: "Pausar"
};

/* ---------- Rótulos gerais da interface ---------- */
PA.roteiro.ui = {
  continuar: "Continuar",
  info: "Informações",
  pagina: (i, n) => `${i}/${n}`,
  tons: { ok: "✓ Acerto", erro: "⚠ Atenção", crit: "⛔ Alerta crítico" }
};
