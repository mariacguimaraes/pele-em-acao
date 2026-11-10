/* ===== escala do palco ===== */
const S=document.getElementById("stage"),VP=document.getElementById("vp");
function fit(){S.style.transform=`scale(${VP.clientWidth/1440})`}
new ResizeObserver(fit).observe(VP);fit();

/* ===== estado ===== */
const BL={b1:"Conhecer o paciente e avaliar a pele",b2:"Mudar a posição e ajustar os apoios",b3:"Limpar e proteger a pele",b4:"Cuidar da alimentação e da hidratação"};
let E;
function novo(){E={ordem:[],feito:{},pts:{prior:0,b1:100,b2:100,b3:100,b4:100},dor:20,selos:{aguia:true,mao:true,mestre:true,esp:true,humaniza:true},ingestaOk:false,brErros:0,tentDigito:0,critico:false,b3:{}};}
novo();
const ias=()=>E.pts.prior+["b1","b2","b3","b4"].reduce((s,k)=>s+Math.max(0,E.pts[k]),0);
function pen(b,v){E.pts[b]=Math.max(0,E.pts[b]-v);upd()}
function upd(){document.getElementById("hud").textContent=`IAS ${ias()} / 450 · Ordem: ${E.ordem.map(b=>b.toUpperCase()).join(" → ")||"—"}`}

/* ===== utilidades de render ===== */
let A=[];
const act=f=>{A.push(f);return A.length-1};
S.addEventListener("click",e=>{const t=e.target.closest("[data-a]");if(t&&!t.disabled)A[+t.dataset.a]()});
const P=(x,y,w,h)=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
const asset=(name,x,y,w,h,extra="")=>`<div class="a ${extra}" data-asset="${name}" style="${P(x,y,w,h)}">${name}</div>`;
const btn=(label,f,x,y,w,h,cls="",dis=false)=>`<button class="btn ${cls}" style="${P(x,y,w,h)}" data-a="${act(f)}" ${dis?"disabled":""}>${label}</button>`;
const title=(t,sub="")=>`<div class="title">${t}${sub?`<small>${sub}</small>`:""}</div>`;
const pause=()=>`<button class="ic" style="${P(37,57,100,100)}" aria-label="Pausar" data-a="${act(pausa)}">❚❚</button>`;
const back=f=>`<button class="ic" style="${P(37,53,100,100)}" aria-label="Voltar" data-a="${act(f)}">↩</button>`;
const right=(l,f,dis)=>btn(l,f,1069,57,270,46,"white",dis);
const info=txt=>`<button class="info" data-a="${act(()=>falar([["Enfa. Camila",txt]]))}"><span>i</span>Informações</button>`;
const dock=items=>`<div class="dock">${items.map(i=>`<button data-a="${act(i.f)}" class="${i.on?"on":""}" ${i.dis?"disabled":""}><span>${i.ic}</span>${i.l}</button>`).join("")}</div>`;
const painBar=(max)=>`<div class="pain ${max?"max":""}"><span>☹ Índice de dor</span><div class="t"><i style="width:${E.dor}%"></i></div></div>`;
const hs=(x,y,w,h,f,lbl,cls="")=>`<button class="hs ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" aria-label="${lbl}" data-a="${act(f)}"></button>`;
function render(html){S.innerHTML=html;upd()}
function add(html){S.insertAdjacentHTML("beforeend",html)}

/* cenários base (slots de asset) */
const BG={
 quarto:()=>asset("Fundo · quarto hospitalar (abertura)",0,0,1440,810,"soft"),
 leito:(o={})=>asset("Gameplay · quarto vista de cima",0,0,1440,810,"soft")+
   asset("Régua de gases",575,60,290,46)+asset("Lixo",320,300,56,80)+
   asset("Mesa de cabeceira E",0,430,300,180)+asset("Mesa de cabeceira D",1140,430,300,180)+
   asset("Bandeja + copo",1170,330,230,70)+
   asset(o.lado?"Sr. João · decúbito lateral E 30º":"Sr. João · decúbito dorsal (fralda)",560,120,320,690)+
   (o.ajuda?asset("Silhueta · ajudante",920,220,140,590):""),
 lateral:()=>asset("Gameplay · Sr. João de lado, foco glúteo/sacro",0,0,1440,810,"soft"),
 zoom:()=>asset("Close · região sacral (dígito-pressão)",0,0,1440,810,"soft"),
 cabeceira:()=>asset("Vista lateral · leito com cabeceira articulada",0,0,1440,810,"soft")
};
const cam=()=>`<div class="a cam" data-asset="Avatar Enfa. Camila">Enfa. Camila</div>`;
const joao=()=>`<div class="a cam" data-asset="Avatar Sr. João">Sr. João</div>`;

/* ===== diálogo (componente Dialogue) ===== */
function falar(lines,done,tom){
  let i=0;S.querySelectorAll(".dlg,.cam").forEach(n=>n.remove());
  const show=()=>{
    S.querySelectorAll(".dlg,.cam").forEach(n=>n.remove());
    const [sp,tx,t]=lines[i];const temCam=sp==="Enfa. Camila"||sp==="Sr. João";
    add((sp==="Enfa. Camila"?cam():sp==="Sr. João"?joao():"")+
     `<div class="dlg ${temCam?"":"nocam"}" data-t="${t||tom||""}">${sp?`<span class="sp">${sp}: </span>`:""}${tx}<button class="nx" aria-label="Avançar" data-a="${act(nx)}">›</button></div>`);
    S.querySelector(".dlg .nx").focus();
  };
  const nx=()=>{i++;if(i<lines.length)show();else{S.querySelectorAll(".dlg,.cam").forEach(n=>n.remove());done&&done();}};
  show();
}
const C=(t,tone)=>["Enfa. Camila",t,tone];
function pausa(){add(`<div class="ov" id="pz"><div class="card" style="width:520px"><h2>Pausado</h2>${`<button class="btn white" style="position:static;height:56px" data-a="${act(()=>document.getElementById("pz").remove())}">Continuar</button><button class="btn" style="position:static;height:56px" data-a="${act(()=>{novo();inicio()})}">Voltar ao menu (reinicia)</button>`}</div></div>`)}

/* ===== 1. Início ===== */
function inicio(){render(BG.quarto()+`<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-size:72px;font-weight:600">Pele em Ação</div>`+
  btn("Sobre",sobre,60,48,120,50)+btn("Começar",abertura,600,420,240,64,"white"))}
function sobre(){add(`<div class="ov" id="sb"><div class="card"><h2>Sobre o jogo</h2>
<p><b>Fundamentação:</b> Guideline Internacional de Prevenção e Tratamento de Lesões por Pressão 2026 (EPUAP, NPIAP, PPPIA).</p>
<p><b>Origem acadêmica:</b> produto tecnológico da dissertação de Mestrado de Camila Lemos Guimarães, PPG em Enfermagem da EEAN/UFRJ.</p>
<p><b>Nota técnica:</b> linguagem simplificada para a dinâmica do jogo, com termos técnicos preservados.</p>
<p><b>Pontuação:</b> cada bloco começa com 100 pontos; priorizar a avaliação dá +50. Máximo de 450 no Índice de Aproveitamento Simulado (IAS).</p>
<button class="btn white" style="position:static;height:56px" data-a="${act(()=>document.getElementById("sb").remove())}">Fechar</button></div></div>`)}

/* ===== 2. Abertura (3 falas) ===== */
function abertura(){render(BG.quarto()+`<div style="position:absolute;left:0;right:0;top:220px;text-align:center;font-size:64px;font-weight:600">Pele em Ação</div>`+btn("Pular abertura",selecao,1180,40,200,44,"white"));
 falar([C("Olá! Boas-vindas ao <b>Pele em Ação</b>. Este é um espaço para você aprimorar seu raciocínio clínico e aplicar na prática as evidências científicas atualizadas sobre prevenção de lesões por pressão."),
  C("Aqui você assume o papel do profissional de enfermagem responsável pelo cuidado, cujas decisões garantem a segurança do paciente."),
  C("Lembre-se: aprenderemos com cada acerto e, principalmente, com cada desafio. O seu objetivo é um cuidado de enfermagem de excelência! <b>Vamos começar?</b>")],selecao)}

/* ===== 3. Seleção de caso ===== */
function selecao(fase){
 const card=(n,d,lock,f)=>`<button class="case ${lock?"lock":""} ${fase&&!lock?"sel":""}" ${lock?"aria-disabled=true":`data-a="${act(f)}"`}><div class="im">Miniatura do caso</div><b>${n}</b><span>${d}</span></button>`;
 render(`<div style="position:absolute;left:0;right:0;top:32px;text-align:center;font-size:30px;font-weight:700">Selecione o caso clínico</div>`+
  `<div class="cases"><button class="btn" style="position:static;width:56px;height:56px" disabled>‹</button>`+card("Sr. João (75 anos)","Pós-operatório de Fêmur. Hipoativo e com baixa ingesta alimentar.",0,()=>selecao(1))+card("Em breve","Caso bloqueado nesta versão.",1)+card("Em breve","Caso bloqueado nesta versão.",1)+`<button class="btn" style="position:static;width:56px;height:56px" disabled>›</button></div>`+
  (fase?btn("Iniciar atendimento",leito,540,709,360,70,"white"):""));
 if(!fase)falar([C("Para começarmos, qual caso clínico você deseja estudar hoje?")]);
}

/* ===== 4. O leito do Sr. João ===== */
function leito(){render(BG.leito()+back(()=>selecao(1)));
 falar([C("Este é o Sr. João, de 75 anos. Ele está na nossa enfermaria em pós-operatório estável de <b>correção cirúrgica de fratura no fêmur direito.</b>"),
  C("Possui Diabetes Mellitus e Hipertensão Arterial. Ao examiná-lo, notei que está orientado, mas bastante <b>hipoativo</b> e <b>emagrecido</b>."),
  C("Ele usa fralda por incontinência e hoje quase não aceitou a refeição, embora consiga engolir sem problemas. <b>Vamos estruturar o seu plano de cuidados?</b>"),
  C("Para evitarmos uma lesão por pressão em seu João, <b>o que faremos primeiro?</b>")],investigar)}
/* Investigação clínica (pontos opcionais) */
function investigar(vistos=new Set()){
 const pista=(k,t)=>()=>{vistos.add(k);investigar(vistos);falar([["",t]])};
 render(BG.leito()+back(leito)+right("Encerrar investigação",priorizacao)+
  hs(1285,365,190,90,pista("b","Ingestão menor que 50% das refeições oferecidas"),"Bandeja",vistos.has("b")?"seen":"pulse")+
  hs(720,450,130,80,pista("f","Presença de umidade por incontinência urinária"),"Fralda",vistos.has("f")?"seen":"pulse")+
  hs(720,83,300,60,pista("r","Paciente em ar ambiente, estável."),"Régua de gases",vistos.has("r")?"seen":"pulse")+
  `<div class="btn" style="${P(470,730,500,48)};cursor:default">Investigação clínica · ${vistos.size}/3 pistas</div>`)}

/* ===== 5. Priorização ===== */
function priorizacao(sel){
 if(["b1","b2","b3","b4"].every(b=>E.feito[b]))return final();
 const pos={b3:[183,364],b2:[732,364],b4:[183,523],b1:[732,523]};
 render(BG.leito()+`<div class="shade"></div>`+back(investigar)+
  `<div class="title" style="left:241px;top:60px;width:957px;z-index:16">Priorização das ações assistenciais</div>`+
  Object.keys(pos).map(b=>btn(BL[b],()=>priorizacao(b),pos[b][0],pos[b][1],525,138,"white "+(E.feito[b]?"done":"")+(sel===b?" sel":""),!!E.feito[b]).replace('class="btn','style-z class="btn')).join("").replaceAll("style-z ","")+
  btn("Escolher prioridade",()=>iniciarBloco(sel),522,700,395,70,"",!sel));
 S.querySelectorAll(".btn").forEach(b=>b.style.zIndex=16);
 if(!sel&&!E.ordem.length)falar([C("Para garantir a segurança do Sr. João e evitar que a pele dele sofra danos, precisamos agir. Por qual dessas tarefas você vai começar o seu cuidado?")]);
}
function iniciarBloco(b){
 E.ordem.push(b);
 if(E.ordem.length===1){if(b==="b1"){E.pts.prior=50}}
 upd();({b1:b1Intro,b2:b2Intro,b3:b3Intro,b4:b4Intro})[b]();
}
const fimBloco=b=>{E.feito[b]=1;priorizacao()};

/* ===== BLOCO 1 · Avaliação diagnóstica ===== */
const BRADEN=[["Percepção sensorial",["1 - Completamente limitado","2 - Muito limitado","3 - Levemente limitado","4 - Nenhuma limitação"],3],
 ["Umidade",["1 - Completamente molhada","2 - Muito molhada","3 - Ocasionalmente molhada","4 - Raramente molhada"],2],
 ["Atividade",["1 - Acamado","2 - Confinado à cadeira","3 - Anda ocasionalmente","4 - Anda frequentemente"],1],
 ["Mobilidade",["1 - Completamente imóvel","2 - Bastante limitado","3 - Levemente limitado","4 - Não apresenta limitações"],2],
 ["Nutrição",["1 - Muito pobre","2 - Provavelmente inadequada","3 - Adequada","4 - Excelente"],2],
 ["Fricção e cisalhamento",["1 - Problema","2 - Problema em potencial","3 - Nenhum problema"],1]];
const PISTAS=[[720,200,90,90,"Rosto","Sr. João abre os olhos lentamente, murmura algo incompreensível e volta a dormir."],
 [720,450,130,80,"Fralda","Fralda saturada; pele ao redor úmida."],
 [720,640,150,150,"Pernas","Grade do leito elevada. Restrito ao leito por cirurgia de fêmur direito e dor intensa."],
 [620,330,90,140,"Braços","Tenta se mexer levemente, mas exige ajuda total da equipe para mudar de posição."],
 [1285,365,190,90,"Bandeja","Prato com apenas algumas colheradas do purê. Aceitou menos de 50% do oferecido hoje."],
 [810,470,70,70,"Sacro / lençol","Sr. João escorrega com frequência; a pele “arrasta” no lençol áspero ao ser reposicionado."]];
let br={vistos:new Set(),val:[],ficha:false};
function b1Intro(){br={vistos:new Set(),val:Array(6).fill(""),ficha:false};render(BG.leito()+pause()+title("Avaliação Diagnóstica"));
 falar([C("Antes de qualquer intervenção, precisamos saber de quem estamos cuidando."),
  C("Vamos usar a <b>Escala de Braden</b> para medir o risco de desenvolvimento de uma <b>lesão por pressão</b> pelo Sr. João e examinar de perto as áreas em risco. Sua avaliação atenta pode evitar a ocorrência de uma lesão no futuro.")],b1Braden)}
function b1Braden(){
 const pronto=br.val.every(v=>v);
 render(BG.leito()+pause()+title("Avaliação Diagnóstica")+
  PISTAS.map((p,i)=>hs(p[0],p[1],p[2],p[3],()=>{br.vistos.add(i);b1Braden();falar([["",p[5]]])},p[4],br.vistos.has(i)?"seen":"pulse")).join("")+
  (br.ficha?`<div class="drawer"><h3>Ficha de avaliação · Escala de Braden</h3><div class="list braden">${BRADEN.map((b,i)=>`<label for="br${i}">${i+1}. ${b[0]}<select id="br${i}" data-i="${i}"><option value="">Selecione a opção</option>${b[1].map((o,j)=>`<option value="${j+1}" ${+br.val[i]===j+1?"selected":""}>${o}</option>`).join("")}</select></label>`).join("")}</div>
   <div class="foot"><span>${br.val.filter(Boolean).length}/6 preenchidos</span><button class="btn white" style="position:static;height:50px" data-a="${act(()=>{br.ficha=false;b1Braden()})}">Minimizar</button><button class="btn" style="position:static;height:50px" data-a="${act(b1Enviar)}" ${pronto?"":"disabled"}>Enviar avaliação</button></div></div>`
   :`<button class="tab-v" data-a="${act(()=>{br.ficha=true;b1Braden()})}">Ficha de avaliação Escala de Braden</button>`)+
  info("Clique nos pontos do leito para coletar as pistas e preencha a Ficha de Avaliação. O resultado aparece só ao enviar."));
 S.querySelectorAll(".braden select").forEach(s=>s.onchange=()=>{br.val[+s.dataset.i]=s.value;const sc=S.querySelector(".list").scrollTop;b1Braden();S.querySelector(".list").scrollTop=sc});
}
function b1Enviar(){
 const erros=BRADEN.map((b,i)=>+br.val[i]!==b[2]);E.brErros=erros.filter(Boolean).length;pen("b1",25*E.brErros);if(E.brErros)E.selos.aguia=false;
 const soma=br.val.reduce((s,v)=>s+ +v,0);
 render(BG.leito()+pause()+title("Avaliação Diagnóstica"));
 falar([C("Avaliação finalizada! Vamos conferir o resultado da sua <b>avaliação clínica.</b>"),C("Na enfermagem, um item mal avaliado na Escala de Braden pode significar uma <b>medida de prevenção</b> que deixamos de realizar."),C("Veja se os seus registros de <b>avaliação</b> estão <b>adequados</b> à realidade do Sr. João:")],()=>{
  const linhas=BRADEN.map((b,i)=>`<tr><td class="${erros[i]?"x":"v"}">${i+1}. ${b[0]}<br><b>${b[1][br.val[i]-1]}</b></td><td>${i+1}. ${b[0]}<br><b>${b[1][b[2]-1]}</b></td></tr>`).join("");
  add(`<div class="ov" id="cmpov"><div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Avaliação clínica × Gabarito</h2><span>${6-E.brErros} acertos · ${E.brErros} erros · −${25*E.brErros} pts</span></div><div class="cmp"><table><tr><td><b>Sua avaliação · ${soma} pontos</b></td><td><b>Gabarito · 11 pontos</b></td></tr>${linhas}</table></div></div></div>`);
  const FB={0:"Observe com atenção: O Sr. João murmura e abre os olhos ao seu chamado. Ele responde ao estímulo verbal, embora não consiga expressar o desconforto de forma plena. O correto seria a estratificação <b>3 - Levemente Limitado</b>.",
   1:"Cuidado! Aquela fralda saturada e a pele esbranquiçada (macerada) indicam a presença de umidade. Marcar um risco baixo aqui nos faria ignorar a necessidade de uma <b>barreira de proteção</b>. A categoria adequada é <b>2 - Muito Molhada</b>.",
   2:"O Sr. João está restrito ao leito pela cirurgia de fêmur e pela dor intensa. O correto é <b>1 - Acamado</b>.*",
   3:"Ele tenta se mexer, mas exige ajuda total da equipe para mudar de posição. O correto é <b>2 - Bastante Limitado</b>.*",
   4:"Aqui está o perigo! Você marcou uma nutrição boa, mas esqueceu que ele aceitou menos de <b>50% da dieta</b>. Sem proteína, a pele perde a matéria-prima para se manter íntegra. Na Braden, esse indicador é classificado em <b>2 - Provavelmente Inadequada</b>.",
   5:"Observe como o Sr. João <b>escorrega</b> no leito. Esse “arrastar” da pele no lençol áspero é o cenário perfeito para uma lesão. Esse é um <b>1 - Problema</b> real que exige nossa intervenção imediata."};
  const ls=E.brErros?erros.map((e,i)=>e?C(FB[i],"erro"):null).filter(Boolean):[C("<b>Parabéns!</b> Sua avaliação foi correta. Veja tudo o que você acertou!","ok")];
  falar(ls,()=>{document.getElementById("cmpov").remove();
   falar([C("A consolidação dos escores de avaliação dos parâmetros clínicos do Sr. João totaliza <b>11 pontos</b>, o que o classifica em <b>Alto Risco</b> para o desenvolvimento de <b>lesões por pressão</b>."),C("Este indicador servirá como base para o planejamento das nossas próximas intervenções. Avançaremos agora para o <b>exame físico dermatológico</b> direto no leito.")],()=>b1Inspecao())});
 });
}
function b1Inspecao(v=new Set(),ferr=false){
 const t=(k,txt)=>()=>{v.add(k);b1Inspecao(v,ferr);falar([["",txt]])};
 render(BG.leito()+pause()+title("Teste de dígito-pressão",v.size?["","Ombros","Calcanhares"][v.size]||"":"")+
  hs(660,230,80,80,t("a","Pele íntegra, sem alterações térmicas ou de cor."),"Ponto A · ombros",v.has("a")?"seen":"pulse")+
  hs(780,230,80,80,t("a2","Pele íntegra, sem alterações térmicas ou de cor."),"Ponto A · ombro direito",v.has("a2")?"seen":"pulse")+
  hs(680,740,70,70,t("b","Pele íntegra. Nota-se leve ressecamento, mas sem hiperemia."),"Ponto B · calcanhar",v.has("b")?"seen":"pulse")+
  hs(760,740,70,70,t("b2","Pele íntegra. Nota-se leve ressecamento, mas sem hiperemia."),"Ponto B · calcanhar direito",v.has("b2")?"seen":"pulse")+
  hs(720,470,160,70,()=>{v.add("c");b1Inspecao(v,ferr);falar([["","Há uma mancha avermelhada visível na região sacral. Use a ferramenta de dígito-pressão."]])},"Ponto C · sacro",v.has("c")?"seen":"pulse")+
  info("Inspecione as proeminências ósseas. O sacro (ponto C) exige o teste de dígito-pressão.")+
  (v.has("c")?dock([{ic:"☝",l:"Dígito-pressão",f:b1Digito}]):""))}
function b1Digito(){
 E.tentDigito++;
 render(BG.zoom()+pause()+title("Teste de dígito-pressão")+asset("Mancha avermelhada · sacro",620,280,200,200)+
  `<div class="ring" id="ring" style="left:720px;top:380px"></div>`+
  `<button id="dedo" class="a" style="${P(660,330,120,240)};pointer-events:auto;cursor:pointer;border-radius:60px 60px 10px 10px;background:#7d8ad1;color:#fff;border-style:solid" aria-label="Pressionar sacro (segure 5 s ou a barra de espaço)">Mão com luva<br>(segurar)</button>`+info("Clique e segure por 5 segundos para avaliar a circulação no local."));
 falar([["","Clique e segure por 5 segundos para avaliar a circulação no local."]]);
 const d=document.getElementById("dedo"),r=document.getElementById("ring");let t0,iv;
 const ini=()=>{if(iv)return;S.querySelectorAll(".dlg").forEach(n=>n.remove());t0=Date.now();iv=setInterval(()=>{const s=Math.min(5,(Date.now()-t0)/1000);r.style.background=`conic-gradient(var(--accent) ${s*72}deg,#fff3 0)`;r.style.mask="radial-gradient(circle,transparent 62px,#000 63px)";r.style.webkitMask=r.style.mask;if(s>=5)fim()},50)};
 const fim=()=>{if(!iv)return;clearInterval(iv);iv=null;const s=(Date.now()-t0)/1000;r.style.background="none";
  if(s<5){E.selos.mao=false;falar([C("<b>Atenção!</b> Para avaliar o dano tecidual, você precisa manter a pressão por <b>5 segundos</b>. Se soltar antes, não saberemos se o sangue está circulando de forma adequada nesta região. Vamos tentar de novo, com calma.","erro")]);return}
  const ok=E.ordem[0]==="b1";
  add(asset(ok?"Pele branqueia (hiperemia reativa)":"Pele NÃO branqueia (LP estágio 1)",620,280,200,200));
  const fala=ok?[C("Excelente decisão clínica! A priorização do exame físico dermatológico permitiu a identificação precoce do <b>risco tecidual</b>. Note que, ao pressionar, a <b>mancha branqueou.</b>","ok"),C("Isso se chama <b>hiperemia reativa</b>: o sangue ainda consegue circular, mas o corpo manifesta um sinal clínico de <b>sofrimento tecidual</b> gerado pela <b>pressão</b>."),C("O <b>reposicionamento do paciente</b> no leito no momento adequado diminui a probabilidade de surgimento de uma <b>lesão!</b>")]
   :[C("Observe com atenção... a mancha não branqueou. Infelizmente, o tempo utilizado em outras tarefas e a <b>ausência de avaliação</b> da pele permitiu que o aumento da pressão local contribuísse para a ruptura da integridade da <b>microcirculação local.</b>","crit"),C("O Sr. João agora tem uma <b>Lesão por Pressão Estágio 1.</b> Se agirmos imediatamente com o <b>protocolo de reposicionamento</b> e <b>alívio de pressão</b>, podemos evitar a progressão para um dano estrutural mais grave.","crit")];
  if(!ok)E.critico=true;
  falar([...fala,C("Veja a expressão do Sr. João... ele gemeu baixinho e franziu a testa quando você <b>pressionou o sacro</b>. Essa área está muito <b>sensível e dolorida.</b>"),C("Além da técnica, nunca esqueça de considerar a <b>dor física</b> e a <b>dimensão subjetiva</b> vivenciada pelo paciente neste momento da internação."),C("O Sr. João tem a pele branca, o que facilita a visualização do eritema. Mas se ele fosse um paciente de pele preta, o sinal clínico seria bem diferente. Abra a ficha para entender a avaliação na pele retinta.")],peleNegra);
 };
 d.onpointerdown=e=>{e.preventDefault();ini()};d.onpointerup=fim;d.onpointerleave=fim;
 d.onkeydown=e=>{if(e.key===" "){e.preventDefault();ini()}};d.onkeyup=e=>{if(e.key===" ")fim()};
}
function peleNegra(){add(btn("Ver avaliação em pele negra",()=>{
 add(`<div class="ov"><div class="card" style="grid-template-columns:1fr 1.2fr;width:1100px"><div class="a" style="position:static;height:420px">Ilustração comparativa · LP estágio 1 pele clara × pele escura</div><div style="display:grid;gap:10px;font-size:17px;align-content:start"><h2>Avaliação Clínica na Pele Negra</h2>
 <p><b>Invisibilidade do eritema:</b> na pele negra ou retinta, a hiperemia clássica (vermelhidão) pode não ser visível.</p>
 <p><b>Investigue ativamente:</b> tons arroxeados, azulados ou acinzentados; temperatura local mais quente ou mais fria; pele mais firme ou edemaciada; dor ou desconforto local antes de qualquer alteração visual.</p>
 <p>Ignorar esses sinais atrasa a prevenção e eleva o risco de a lesão progredir para estágios graves.</p>
 <p style="font-size:13px;color:var(--muted)">Ref.: Dhoonmoon et al. (2023), Wounds International; Wounds UK (2021).</p>
 <button class="btn" style="position:static;height:56px" data-a="${act(()=>fimBloco("b1"))}">Ciente / Entendido</button></div></div></div>`)},540,320,360,70,"white"))}

/* ===== BLOCO 2 · Reposicionar ===== */
let b2={};
function b2Intro(){b2={ajuda:false,lado:false,itens:{},sel:null,errou:{}};render(BG.leito()+pause()+title("Reposicionar paciente"));
 falar([C("O objetivo principal desta intervenção é não deixar o Sr. João na <b>mesma posição</b> por muito tempo. Vamos revezar de 2 em 2 horas e realizar um rodízio programado entre as posições de <b>decúbito dorsal</b> e <b>inclinações laterais</b> para a esquerda e para a direita."),
  C("É importante não deixar ele deitado totalmente de lado em cima do osso do quadril (90º) e nem com a cabeceira muito alta, senão pode <b>escorregar</b> e sofrer <b>danos</b> causados pelas forças de fricção e cisalhamento contra o lençol."),
  C("Um <b>ângulo de 30º</b> é o ideal para proteger o osso e a pele.")],b2Cena)}
function b2Cena(maxDor){
 render(BG.leito({ajuda:b2.ajuda})+pause()+title("Reposicionar paciente")+right("Finalizar reposição",()=>{},true)+(maxDor||E.dor>20?painBar(maxDor):"")+
  btn("↷<br><small>Virar para Esquerda</small>",b2Esq,380,330,140,120,"white")+btn("↶<br><small>Virar para Direita</small>",b2Dir,920,330,140,120,"white")+
  dock([{ic:"✋",l:"Pedir Ajuda",f:()=>{b2.ajuda=true;b2Cena()},on:b2.ajuda,dis:b2.ajuda},{ic:"▤",l:"Inventário",dis:true,f:()=>{}}])+
  info("Peça ajuda a um colega e escolha o lado do decúbito. A fratura é no fêmur direito."));
}
function semAjuda(){falar([C("O Sr. João está com muita dor no <b>fêmur direito</b> e não consegue nos ajudar."),C("Fazer esse procedimento sozinho contraria as diretrizes de <b>ergonomia e mecânica corporal</b> adequada do trabalhador, além de elevar exponencialmente o risco de <b>lesões mecânicas</b> por forças de fricção e cisalhamento na pele vulnerável do idoso.","erro"),C("Clique no ícone “<b>Pedir Ajuda</b>” para chamarmos o colega da equipe.")])}
function b2Dir(){if(!b2.ajuda)return semAjuda();
 if(!b2.errou.dir){pen("b2",50);E.selos.mestre=false;E.selos.humaniza=false;b2.errou.dir=1}
 E.dor=100;E.critico=true;b2Cena(true);
 falar([["Sr. João","Ai! Minha <b>perna operada</b>! Não!","crit"],C("<b>Atenção!</b> O Sr. João está em pós-operatório cirúrgico recente de fratura de <b>fêmur DIREITO</b>. Reposicioná-lo sobre o lado afetado contraria as diretrizes de segurança, causa <b>dor física</b> extrema e pode comprometer a estabilização cirúrgica do osso.","crit"),C("O guideline recomenda preferencialmente o <b>decúbito lateral esquerdo</b> ou o <b>decúbito dorsal inclinado a 30º</b>. Planeje seu cuidado protegendo a região vulnerável! (−50 · Selo Mestre do Posicionamento bloqueado)","crit")],()=>{E.dor=60;b2Cena()})}
function b2Esq(){if(!b2.ajuda)return semAjuda();b2.lado=true;
 render(BG.leito({ajuda:1,lado:1})+pause()+title("Reposicionar paciente"));
 falar([C("Para o posicionamento do Sr. João, temos disponíveis em nossa unidade <b>travesseiros convencionais e coxins de espuma.</b>"),C("O nosso desafio clínico consiste em otimizar a aplicação desses recursos combinados, garantindo o correto <b>alinhamento corporal</b>, a <b>descompressão</b> das proeminências ósseas e a <b>eficácia</b> do protocolo preventivo."),C("Faça as escolhas certas para acumular pontos e tentar liberar uma <b>tecnologia bônus</b> ao final do jogo!")],()=>b2Apoios())}
const PONTOS2={costas:[640,330,"Costas"],joelhos:[700,560,"Entre os joelhos"],pant:[740,680,"Panturrilha"],calc:[760,770,"Calcanhar"]};
function b2Apoios(inv){
 const usados=Object.keys(b2.itens).length;
 render(BG.leito({ajuda:1,lado:1})+pause()+title("Ajustar apoios do paciente",b2.sel?"Selecione onde posicionar o item":"")+right("Finalizar ajustes",b2Fim,usados<1)+
  Object.entries(b2.itens).map(([k,v])=>asset(v,PONTOS2[k][0]-60,PONTOS2[k][1]-24,120,48)).join("")+
  (b2.sel?Object.entries(PONTOS2).map(([k,p])=>hs(p[0],p[1],70,70,()=>b2Colocar(k),p[2],b2.itens[k]?"seen":"pulse")).join(""):"")+
  (inv?inventario("apoios",b2.sel,it=>{b2.sel=it;b2Apoios()},()=>b2Apoios(),usados,4):"")+
  dock([{ic:"✋",l:"Pedir Ajuda",dis:true,f:()=>{}},{ic:"▤",l:"Inventário",on:inv,f:()=>b2Apoios(!inv)}])+
  info("Selecione um item no inventário e depois o ponto do corpo: costas (inclinação 30º), entre os joelhos e panturrilha (calcanhares flutuando)."));
}
function b2Colocar(k){
 if(k==="calc"){if(!b2.errou.calc){pen("b2",25);b2.errou.calc=1;E.selos.mestre=false}
  b2.sel=null;b2Apoios();return falar([C("Observe o posicionamento: colocar o travesseiro direto no calcanhar mantém a <b>pressão</b> na área. O correto é apoiar o travesseiro sob a <b>panturrilha</b> para que os calcanhares fiquem totalmente suspensos e livres de carga mecânica. <b>Vamos corrigir o apoio das pernas?</b> (−25*)","erro")])}
 b2.itens[k]=b2.sel;b2.sel=null;b2Apoios();
}
function b2Fim(){
 const fala=[];
 if(!b2.itens.costas){pen("b2",50);E.selos.mestre=false;fala.push(C("Cuidado! Nessa posição, todo o peso do paciente está em cima do <b>osso do quadril</b>, aumentando o risco de isquemia compressiva imediata no tecido subjacente. Essa posição acelera a <b>deformação tecidual profunda</b> e a <b>degradação microvascular</b>. Vamos ajustar o ângulo do posicionamento para 30º. (−50)","erro"))}
 if(!b2.itens.joelhos){pen("b2",25);E.selos.mestre=false;fala.push(["Sr. João","Enfermeiro, <b>meu joelho está doendo</b>, parece que está um osso batendo no outro! (−25*)","erro"])}
 if(!b2.itens.pant){pen("b2",25);E.selos.mestre=false;fala.push(C("Os calcanhares continuam apoiados no colchão. Um apoio sob a panturrilha deixa os calcanhares flutuando. (−25*)","erro"))}
 if(!fala.length)fala.push(C("Muito bem! O ângulo de 30º é o ideal para proteger o osso e a pele. E os calcanhares flutuando garantem alívio total da pressão!","ok"));
 falar(fala,()=>fimBloco("b2"));
}

/* ===== inventário compartilhado ===== */
const INV={apoios:[["Travesseiro"],["Coxim de Espuma"],["Colchão Pneumático",1]],
 higiene:[["Kit Higiene pH Neutro"],["Álcool 70%"],["Lenço Umedecido c/ Fragrância"],["Clorexidina Degermante"],["Toalha Macia"],["Fralda Limpa"],["Creme de Barreira"],["Película Protetora Spray",1]]};
let invTab=null;
function inventario(tab0,sel,onEquip,onClose,usados,cap){
 const tab=invTab||tab0;
 return `<div class="drawer"><div class="tabs"><button class="${tab==="apoios"?"on":""}" data-a="${act(()=>{invTab="apoios";onClose();S.querySelector(".dock button:last-child").click()})}">Superfícies e Apoios</button><button class="${tab==="higiene"?"on":""}" data-a="${act(()=>{invTab="higiene";onClose();S.querySelector(".dock button:last-child").click()})}">Higiene e Barreira</button><button style="flex:0" aria-label="Fechar inventário" data-a="${act(()=>{invTab=null;onClose()})}">✕</button></div>
 <div class="list">${INV[tab].map(([n,lock])=>`<button ${lock?"disabled":""} class="${sel===n?"on":""}" data-a="${act(()=>{invTab=null;onEquip(n)})}"><span>${n}</span><span>${lock?"🔒 bônus":sel===n?"Equipado":"Equipar"}</span></button>`).join("")}</div>
 <div class="foot"><div class="slots">${Array.from({length:cap},(_,i)=>`<i class="${i<usados?"f":""}"></i>`).join("")}</div><span>${usados}/${cap} itens</span></div></div>`;
}

/* ===== BLOCO 3 · Limpar e proteger ===== */
let b3;
function b3Intro(){b3={etapa:"fralda",sel:null,limpo:0,umid:new Set(),barreira:0,fric:false,kitErr:{},fraldaSel:false};
 render(BG.lateral()+pause()+title("Limpar e proteger a pele"));
 falar([C("Agora que o Sr. João está posicionado de lado, vamos resolver o <b>problema da umidade</b>. A fralda está saturada!"),C("Se a gente só fizer a limpeza, a urina pode agredir a pele. Vamos criar uma <b>barreira de proteção</b> para evitar o surgimento de complicações!")],()=>b3Cena())}
const ETAPAS3=[["higiene","Higiene suave"],["secagem","Secagem por compressão"],["barreira","Proteção de barreira"]];
function b3Cena(inv){
 const ord=["fralda","higiene","secagem","barreira","fim"],ix=ord.indexOf(b3.etapa);
 const sub={fralda:"Troca de fralda",higiene:"Higiene suave e secagem por compressão",secagem:"Higiene suave e secagem por compressão",barreira:"Proteção de barreira",fim:"Colocar fralda limpa"}[b3.etapa];
 const area=`<div id="area" class="a" style="${P(470,230,460,330)};pointer-events:auto;border-radius:50%;cursor:${b3.sel?"crosshair":"default"};background:#e9b9b4">Região glútea / sacral</div>`;
 render(BG.lateral()+pause()+title("Limpar e proteger a pele",sub)+(E.dor>20?painBar():"")+
  (b3.etapa==="fralda"?`<button class="a" style="${P(470,230,460,330)};pointer-events:auto;cursor:pointer;background:#f1e7a8;border-style:solid;${b3.fraldaSel?"box-shadow:0 0 0 5px var(--accent)":""}" data-a="${act(()=>{b3.fraldaSel=true;b3Cena()})}">Fralda saturada (clique e leve ao lixo)</button>`:area)+
  (ix>=1?`<div class="steps">${ETAPAS3.map(([k,l],i)=>`<div class="${b3.etapa===k?"now":ord.indexOf(k)<ix?"ok":""}">${l}</div>`).join("")}</div><div class="prog"><i id="pg" style="width:${b3.etapa==="higiene"?b3.limpo:b3.etapa==="secagem"?b3.umid.size/6*100:b3.barreira}%"></i></div>`:"")+
  (b3.etapa==="secagem"?[[560,320],[700,280],[840,320],[560,460],[700,500],[840,460]].map(([x,y],i)=>b3.umid.has(i)?"":`<button class="hs" style="left:${x}px;top:${y}px;width:60px;height:60px;background:#7fb3e6aa" aria-label="Área úmida ${i+1}" data-k="${i}"></button>`).join(""):"")+
  (["secagem","barreira","fim"].includes(b3.etapa)?right(b3.etapa==="fim"?"Finalizar":"Finalizar etapa",b3Finalizar):"")+
  (inv?inventario("higiene",b3.sel,b3Equip,()=>b3Cena(),0,4):"")+
  (b3.sel?`<div class="btn white" style="${P(1080,630,300,48)};cursor:default">Em uso: ${b3.sel}</div>`:"")+
  dock([{ic:"🗑",l:"Lixo Infectante",f:()=>{if(b3.etapa==="fralda"&&b3.fraldaSel){b3.etapa="higiene";b3Cena();falar([C("A pele aparece avermelhada e brilhante pela umidade. Abra o inventário e escolha o material de higiene.")])}},dis:b3.etapa!=="fralda"},{ic:"▤",l:"Inventário",on:inv,f:()=>b3Cena(!inv)}])+
  info({fralda:"Clique na fralda suja e depois no Lixo Infectante.",higiene:"Escolha o material de higiene e faça movimentos circulares suaves sobre a pele.",secagem:"Equipe a toalha e toque cada área úmida. Não arraste.",barreira:"Equipe o creme de barreira e pinte a região do sacro.",fim:"Equipe a fralda limpa e aplique-a."}[b3.etapa]));
 b3Bind();
}
function b3Equip(n){
 const ERR={"Álcool 70%":"<b>Cuidado!</b> O uso de álcool 70% na pele de um idoso restrito ao leito é altamente prejudicial. Ele remove a camada lipídica de proteção natural, causa ressecamento extremo e descamação. Utilize água e sabão de pH neutro para uma limpeza segura!",
  "Lenço Umedecido c/ Fragrância":"<b>Atenção!</b> Lenços umedecidos comerciais frequentemente contêm álcool e fragrâncias que irritam a pele sensível, e sua textura induz fricção. Prefira compressas macias com sabão de pH neutro!",
  "Clorexidina Degermante":"<b>Espere!</b> A clorexidina degermante é um antisséptico forte indicado para o <b>preparo cirúrgico</b> ou <b>procedimentos invasivos</b>, e não para a higiene diária. Ela altera drasticamente o pH da pele, destrói a microbiota protetora e causa irritação severa. Prefira compressas macias com sabão de pH neutro!"};
 if(b3.etapa==="higiene"&&ERR[n]){if(!b3.kitErr[n]){pen("b3",25);b3.kitErr[n]=1;E.selos.esp=false}if(n.startsWith("Clor"))E.dor=Math.min(100,E.dor+20);b3.sel=null;b3Cena();return falar([C(ERR[n]+" (−25)","erro")])}
 const certo={higiene:"Kit Higiene pH Neutro",secagem:"Toalha Macia",barreira:"Creme de Barreira",fim:"Fralda Limpa"}[b3.etapa];
 if(n!==certo){b3.sel=null;b3Cena();return falar([C(`Esse item não é o desta etapa. Agora precisamos de: <b>${certo}</b>.`)])}
 b3.sel=n;b3Cena();
}
function b3Bind(){
 const ar=document.getElementById("area");if(!ar)return;
 const sc=()=>VP.clientWidth/1440;let last=null,down=false;
 S.querySelectorAll("[data-k]").forEach(b=>b.onclick=e=>{e.stopPropagation();if(b3.sel!=="Toalha Macia")return falar([C("Equipe a <b>Toalha Macia</b> no inventário.")]);b3.umid.add(+b.dataset.k);if(b3.umid.size===6){b3.etapa="barreira";b3.sel=null;b3Cena();falar([C("Muito bem! Concluímos a secagem.","ok"),C("Lembre-se: a gente não esfrega a toalha, apenas a <b>pressiona devagar</b> contra a pele para secar.")])}else b3Cena()});
 ar.onpointerdown=()=>{down=true};window.onpointerup=()=>{down=false;last=null};
 ar.onclick=()=>{if(b3.etapa==="fim"&&b3.sel==="Fralda Limpa")b3Concluir();else if(!b3.sel)falar([C("Abra o <b>Inventário</b> e equipe o material desta etapa.")])};
 ar.onpointermove=e=>{
  if(!b3.sel)return;const now=performance.now(),x=e.clientX/sc(),y=e.clientY/sc();
  if(last){const v=Math.hypot(x-last.x,y-last.y)/Math.max(1,now-last.t);
   if(b3.etapa==="higiene"&&b3.sel==="Kit Higiene pH Neutro"){
    if(v>2.4){if(!S.querySelector(".dlg"))falar([C("<b>Cuidado!</b> A pele do Sr. João está muito fina. Se você esfregar com força, pode provocar uma lesão por fricção. Aplique <b>movimentos suaves!</b>","erro")])}
    else{b3.limpo=Math.min(100,b3.limpo+.6);document.getElementById("pg").style.width=b3.limpo+"%";
     if(b3.limpo>=100){b3.etapa="secagem";b3.sel=null;b3Cena();falar([C("Muito bem! A pele está <b>completamente limpa</b>. Agora, vamos <b>secá-la</b> com cuidado para finalizar essa etapa.","ok")])}}}
   if(b3.etapa==="secagem"&&b3.sel==="Toalha Macia"&&down&&!b3.fric){b3.fric=true;pen("b3",50);E.selos.esp=false;E.selos.mao=false;
    falar([["","A fricção excessiva removeu a camada protetora da pele. Surge uma pequena escoriação. Penalidade em Precisão Técnica. (−50)","erro"]])}
   if(b3.etapa==="barreira"&&b3.sel==="Creme de Barreira"){b3.barreira=Math.min(100,b3.barreira+.8);document.getElementById("pg").style.width=b3.barreira+"%";ar.style.background=`linear-gradient(90deg,#fff ${b3.barreira}%,#e9b9b4 0)`;
    if(b3.barreira>=100){b3.etapa="fim";b3.sel=null;b3Cena();falar([C("<b>Ótimo trabalho!</b> A barreira de proteção foi aplicada. Agora coloque a fralda limpa.","ok")])}}}
  last={x,y,t:now};
 };
}
function b3Finalizar(){
 if(b3.etapa==="secagem")return falar([C("Seque todas as áreas úmidas antes de seguir.")]);
 if(b3.etapa==="barreira"){pen("b3",50);E.selos.esp=false;b3.etapa="fim";b3.semBarreira=true;b3Cena();
  return falar([C("Você limpou a pele, mas sem o uso do creme barreira para a sua proteção, deixamos a pele vulnerável aos efeitos da umidade, como é o caso do alto risco de <b>dermatite associada à incontinência</b>. (−50)","erro"),C("Agora coloque a fralda limpa.")])}
 falar([C("Equipe a <b>Fralda Limpa</b> e clique sobre a região para aplicá-la.")]);
}
function b3Concluir(){render(BG.lateral()+pause()+title("Limpar e proteger a pele")+asset("Fralda limpa aplicada",470,230,460,330));
 const l=b3.semBarreira?[]:[["Sr. João","Que alívio...!! A pele estava queimando muito essa região."]];
 falar([...l,C("<b>Missão cumprida aqui!</b> Pele limpa, seca e com a barreira aplicada.","ok")],()=>fimBloco("b3"))}

/* ===== BLOCO 4 · Ingesta e hidratação ===== */
let b4;
function b4Intro(){b4={ficha:false,marc:null,ang:0};b4Ingesta()}
function b4Ingesta(){
 render(BG.leito()+pause()+title("Avaliação da Ingesta")+hs(1285,365,190,90,()=>{b4.ficha=true;b4Ingesta()},"Bandeja","pulse")+
  (b4.ficha?asset("Bandeja vista de cima · prato em 4 quadrantes",120,140,560,560)+`<div class="drawer"><h3>Avaliação da ingesta</h3><p style="margin:0;font-size:16px">Selecione abaixo o nível de ingesta do paciente</p><div class="list">${[["exc","Ingesta excelente (75% a 100%)"],["ade","Ingesta adequada (50% a 75%)"],["ins","Ingesta insuficiente (menos de 50%)"]].map(([k,l])=>`<button class="${b4.marc===k?"on":""}" data-a="${act(()=>{b4.marc=k;b4Ingesta()})}"><span>${l}</span><span>${b4.marc===k?"☑":"☐"}</span></button>`).join("")}</div><div class="foot"><span></span><button class="btn" style="position:static;height:50px" ${b4.marc?"":"disabled"} data-a="${act(b4Enviar)}">Enviar avaliação</button></div></div>`
   :`<button class="tab-v" data-a="${act(()=>{b4.ficha=true;b4Ingesta()})}">Ficha de Avaliação da Ingesta</button>`)+
  info("Observe a bandeja: a carne (proteína) está quase intacta, o purê sumiu de um quadrante e a gelatina está cheia."));
 if(!b4.ficha&&!b4.vista){b4.vista=1;falar([C("Observe ativamente o cenário. Clique na <b>bandeja</b> para avaliar quanto o Sr. João comeu.")])}
}
function b4Enviar(){const ok=b4.marc==="ins";E.ingestaOk=ok;if(!ok)E.selos.aguia=false;
 render(BG.leito()+pause()+title("Avaliação da Ingesta"));
 falar(ok?[C("<b>Avaliação correta!</b> O Sr. João rejeitou mais de 50% da porção proteica oferecida.","ok"),C("Sem o aporte adequado de proteínas a pele perde sua capacidade de resistência e tolerância contra a pressão contínua, tornando-se mais vulnerável às lesões. Esse indicador foi encaminhado ao serviço de Nutrição para o ajuste imediato da dieta.")]
  :[C("<b>Análise imprecisa.</b> Observe o consumo dos alimentos: o paciente consumiu menos da metade da porção proteica planejada.","erro"),C("Não considerar esse dado é <b>perigoso</b>, pois a baixa ingestão de proteínas reduz a capacidade de regeneração celular e acelera o desgaste da pele sob pressão. O registro correto foi inserido no sistema e notificado à Nutrição.")],
  ()=>falar([C("A avaliação do conteúdo do prato nos forneceu informações objetivas sobre a alimentação, mas na enfermagem precisamos entender o <b>contexto</b> de cada paciente."),C("Antes de tomar qualquer decisão, utilize a ferramenta de <b>Escuta Ativa</b> para investigar o motivo dessa baixa ingesta.")],b4Escuta))}
function b4Escuta(){render(BG.leito()+pause()+title("Escuta ativa")+dock([{ic:"👂",l:"Escuta Ativa",f:()=>{render(BG.leito()+pause()+title("Escuta ativa"));
 falar([["Sr. João","Ah, meu filho(a)... É que eu estou com muita <b>dor na perna</b> por causa da cirurgia, e a <b>bandeja ficou longe</b>, eu não conseguia alcançar os talheres direito."],["Sr. João","Além disso, essa comida de hospital não tem gosto de nada... acabei <b>perdendo o apetite</b>."]],b4Intervencao)}}])+info("Use a Escuta Ativa para ouvir o Sr. João."))}
function b4Intervencao(sel){
 const OP=[["ajuda","Ajustar a posição do paciente (respeitando a fratura), aproximar a bandeja, oferecer auxílio e estimulação verbal e registrar a queixa de dor para analgesia"],["plantao","Registrar em prontuário que o paciente recusou a dieta por dor e orientar a equipe do turno da noite a observar a próxima refeição"],["meta","Explicar ao Sr. João a importância da proteína para a cicatrização e estimular para que ele coma o restante da comida"]];
 render(BG.leito()+`<div class="shade"></div>`+pause()+`<div class="title" style="z-index:16">Intervenção direta<small>Selecione o que achar mais adequado ao cenário do paciente</small></div>`+
  OP.map(([k,l],i)=>btn(l,()=>b4Intervencao(k),300,170+i*140,840,120,"white "+(sel===k?"sel":""))).join("")+btn("Escolher ação",()=>b4Resultado(sel),570,620,300,60,"",!sel));
 S.querySelectorAll(".btn").forEach(b=>{b.style.zIndex=16;b.style.fontWeight=400;b.style.fontSize="18px"});
}
function b4Resultado(k){render(BG.leito()+pause()+title("Intervenção direta")+painBar());
 if(k==="ajuda"){E.dor=Math.max(0,E.dor-15);render(BG.leito()+pause()+title("Intervenção direta")+painBar());
  falar([["","Sr. João se alimentou um pouco mais!"],C("<b>Excelente conduta!</b> A assistência de enfermagem vai além da dimensão técnica; ela identifica barreiras físicas e emocionais.","ok"),C("Ao ajustar o leito, aliviar o desconforto e oferecer apoio, você garantiu o aporte calórico necessário para proteger a integridade tecidual do Sr. João.")],b4Hidrat)}
 else if(k==="plantao"){pen("b4",50);E.selos.humaniza=false;
  falar([["","O prato é recolhido intacto. O Sr. João permanece em jejum prolongado e com dor."],C("Atrasar a intervenção para promover a alimentação do paciente de alto risco acelera o catabolismo. Sem o aporte proteico imediato, as células sofrem hipóxia precoce sob a pressão do leito. O recomendado é já solucionar a dor e eliminar a barreira mecânica. (−50)","erro")],b4Hidrat)}
 else{pen("b4",50);E.selos.humaniza=false;
  falar([["Sr. João","O Sr. João fica visivelmente agitado, recusa o alimento com irritação e engasga levemente com o purê.","crit"],C("<b>Conduta inadequada!</b> Forçar a alimentação em um paciente com dor gera <b>estresse</b> e risco de quebra do <b>vínculo terapêutico</b>. A recusa alimentar é um sinal clínico que exige manejo do conforto, não imposição. (−50 · Selo Humaniza bloqueado)","crit")],b4Hidrat)}
}
function b4Hidrat(){render(BG.leito()+pause()+title("Hidratação Ativa"));
 falar([C("Além do suporte nutricional, a <b>estabilidade hídrica</b> é fundamental. O Sr. João precisa de hidratação adequada para preservar a elasticidade e a tolerância do tecido cutâneo."),C("Atualmente, ele encontra-se orientado, porém <b>hipoativo</b> e <b>restrito ao leito</b>. Considerando o item de suporte hídrico disponível, quais cuidados de segurança você deve adotar antes de oferecer a água por via oral?")],b4Cabeceira)}
function b4Cabeceira(){
 render(BG.cabeceira()+pause()+title("Hidratação Ativa",`Cabeceira: ${b4.ang}º`)+
  `<div class="a" style="${P(380,420,520,40)};transform-origin:520px 20px;transform:rotate(${b4.ang}deg);background:#c9c9cc">Cabeceira (articulada)</div>`+asset("Leito",880,420,320,40)+
  btn("💧 Oferecer copo d'água",b4Agua,1080,630,300,60,"white")+
  dock([{ic:"⬆",l:"Subir",f:()=>{b4.ang=Math.min(60,b4.ang+15);b4Cabeceira()},dis:b4.ang>=60},{ic:"⬇",l:"Descer",f:()=>{b4.ang=Math.max(0,b4.ang-15);b4Cabeceira()},dis:b4.ang<=0}])+
  info("Eleve a cabeceira antes de oferecer água. O ângulo seguro aqui é entre 30º e 45º."));
}
function b4Agua(){
 if(b4.ang<30){if(!b4.engasgou){b4.engasgou=1;pen("b4",25)}
  return falar([["Sr. João","Cof... cof! Argh...","crit"],C("<b>Cuidado!</b> Ele quase aspirou o líquido ingerido para o pulmão. Oferecer água com o paciente deitado e hipoativo é um risco para <b>complicações!</b> Eleve a cabeceira antes de continuar. (−25*)","crit")])}
 falar([["Sr. João","Obrigado... estava com muita sede!"],C(b4.engasgou?"Excelente. No entanto, preste atenção: a hidratação oral restabelece apenas o <b>equilíbrio hídrico inicial.</b>":"Excelente! A hidratação oral imediata restabelece o equilíbrio hídrico e preserva a elasticidade da pele.","ok"),C("Para restabelecer a integridade e a tolerância cutânea do Sr. João, o tecido necessita do aporte imediato de <b>nutrientes essenciais</b>. Hidratar é o passo inicial, mas o suporte nutricional é indispensável para a eficácia do plano preventivo.")],b4Equipe)}
function b4Equipe(){render(BG.leito()+pause()+title("Acionamento da Equipe"));
 falar([C("O manejo imediato do conforto foi realizado. No entanto, para garantir que o Sr. João receba um plano terapêutico adequado ao seu déficit metabólico, precisamos trabalhar em conjunto."),C("Toque no <b>ramal</b> para acionar o suporte especializado.")],()=>{
  render(BG.leito()+pause()+title("Acionamento da Equipe")+dock([{ic:"☎",l:"Acionar equipe",f:()=>{render(BG.leito()+pause()+title("Acionamento da Equipe"));
   falar([["","Equipe multiprofissional foi acionada"],C("<b>Perfeito.</b> O acionamento da <b>Equipe Multiprofissional</b> foi registrado.","ok"),C("A parceria com o nutricionista para desenhar o <b>plano dietético</b> e com o médico para a prescrição formal de suplementos <b>hiperproteicos</b> e manejo analgésico é o que garante uma linha de cuidado eficiente para manter a integridade da pele do Sr. João.")],()=>fimBloco("b4"))}}]))})}

/* ===== Final ===== */
function final(){render(BG.quarto()+pause());
 falar([C("<b>Concluímos</b> esta sessão de simulação virtual! A garantia da segurança do paciente baseia-se no gerenciamento ativo dos <b>riscos</b> e na definição correta de <b>prioridades assistenciais.</b>"),C("Vamos analisar como as suas <b>avaliações clínicas</b> e <b>tomadas de decisão</b> impactaram diretamente a evolução do quadro da integridade da pele do Sr. João hoje?")],relatorio)}
function relatorio(){
 const p=E.pts,bon=[];if(p.b2===100)bon.push("Colchão Pneumático");if(p.b3===100)bon.push("Película Protetora Spray");
 const bom=ias()>=350&&!E.critico;
 const SL=[["aguia","Olhar de Águia"],["mao","Mão Leve"],["mestre","Mestre do Posicionamento"],["esp","Especialista em Proteção"],["humaniza","Humaniza"]];
 render(BG.quarto()+pause()+`<div class="a" style="${P(140,90,1180,700)};background:var(--panel);border-style:solid;pointer-events:auto;display:block;padding:30px;text-align:left;color:var(--fg);font-size:18px;overflow:auto">
 <div class="res"><div style="display:grid;gap:12px;align-content:start"><h2 style="margin:0;font-size:32px">Você tirou: ${ias()} pontos</h2>
 ${[["Avaliação Diagnóstica",p.b1],["Reposicionamento",p.b2],["Manejo do Microclima",p.b3],["Ingesta e Hidratação",p.b4],["Critério de Priorização Assistencial",p.prior]].map(([l,v])=>`<div class="row"><span>${l}</span><b>${v}</b></div>`).join("")}
 <div class="selos">${SL.map(([k,l])=>`<span class="${E.selos[k]?"":"off"}">Selo ${l}</span>`).join("")}</div></div>
 <div style="display:grid;gap:12px;align-content:start;background:#f2f2f4;padding:20px;border-radius:10px"><h2 style="margin:0">${bon.length?"Parabéns!":"Desempenho do plantão"}</h2>
 ${bon.length?`<p style="margin:0"><b>Você desbloqueou ${bon.length>1?"novas recompensas":"uma nova recompensa"}:</b></p>${bon.map(b=>`<div class="row" style="border-width:1px">${b}</div>`).join("")}<p style="margin:0;font-size:15px">O item estará disponível nas próximas sessões para apoiar seus cuidados com o paciente.</p>`:`<p style="margin:0;font-size:15px">Nenhuma tecnologia bônus desbloqueada. Faça 100 pontos em Reposicionamento ou em Manejo do Microclima para liberar.</p>`}
 <p style="margin:0;font-size:15px">${bom?"Graças às suas ações de prevenção, a hiperemia no sacro do Sr. João regrediu. Ele passará a noite confortável após se alimentar e com menos riscos de desenvolver uma lesão por pressão. Excelente trabalho!":"Atenção: embora você tenha se dedicado ao cuidado do Sr. João, algumas falhas nas medidas de prevenção podem contribuir para a manutenção ou agravamento do dano tecidual. Vamos revisar os protocolos e reaplicar esta sessão?"}</p>
 <p style="margin:0;font-size:14px;color:var(--muted)">Jogue novamente para conquistar novos itens e explorar outros casos clínicos.</p>
 <button class="btn" style="position:static;height:56px" data-a="${act(()=>{novo();inicio()})}">Voltar para o menu</button></div></div></div>`)}

/* ===== controles do protótipo ===== */
document.getElementById("btnReset").onclick=()=>{novo();inicio()};
let rot=true;document.getElementById("btnAssets").onclick=e=>{rot=!rot;e.target.textContent=rot?"Ocultar rótulos de assets":"Mostrar rótulos de assets";document.documentElement.style.setProperty("--muted",rot?"#6b6d72":"transparent")};
inicio();
