import React from 'react';

// Dados estruturados com base nas imagens enviadas
const DashboardData = {
  header: {
    title: "Semana 1 — ajustada com dados reais do Garmin",
    alert: "Ponto de partida hoje: Body Battery 5, carga crônica/aguda 1.4, Sleep Score 48. Esta semana não é sobre construir — é sobre reorganizar a base para que o treino funcione. Volume reduzido intencionalmente. Qualquer dia que você acordar com Body Battery abaixo de 30, substitua a sessão por caminhada + mobilidade.",
    rules: [
      { label: "≥ 70 → treino completo conforme prescrito", color: "bg-[#1f3723] text-[#4ade80]" },
      { label: "50–69 → só zona 1-2, reduz 20% do volume", color: "bg-[#3a2f1d] text-[#fbbf24]" },
      { label: "< 50 → caminhada 30 min + mobilidade apenas", color: "bg-[#3c1e1e] text-[#f87171]" }
    ],
    summary: [
      { label: "Volume total", value: "4h-4h30", sub: "Reduzido vs plano original" },
      { label: "Km estimados", value: "~22-26 km", sub: "Dependendo do pace Z2" },
      { label: "Sessões de força", value: "2×", sub: "Ter + Sex" },
      { label: "Intensidade máxima", value: "Z2", sub: "Sem Z3-Z5 esta semana" },
      { label: "Teste diagnóstico", value: "Sábado", sub: "5 km esforço máximo" },
    ]
  },
  days: [
    {
      day: "Segunda-feira — Dia 1",
      tag: { text: "Zona 2", color: "bg-[#1f3723] text-[#4ade80]" },
      time: "35-40 min · ~4-5 km",
      bodyBattery: "Verifique Body Battery ao acordar. Se < 50 → substitua por 30 min de caminhada.",
      title: "Corrida contínua — base aeróbica",
      fcAlvo: "135–148 bpm",
      fcTag: "Z2",
      content: [
        "Aquecimento: 5 min caminhada progressiva.",
        "Corpo da sessão: 30 min corrida contínua controlando pela FC — não pelo pace. Se a FC passar de 148 bpm, reduza o ritmo imediatamente, mesmo que pareça devagar demais. Pace esperado hoje: 6:30–7:30/km. Aceite isso sem julgamento — é onde você está agora.",
        "Desaquecimento: 5 min caminhada + 5 min mobilidade de quadril.",
        "Anote: pace médio, FC média, como se sentiu. Esses dados definem a progressão."
      ]
    },
    {
      day: "Terça-feira — Dia 2",
      tag: { text: "Força", color: "bg-[#2d2d2d] text-[#d1d5db]" },
      time: "50 min · academia",
      bodyBattery: "Força pode ser feita com Body Battery mais baixo (≥ 35). Reduz carga se < 40.",
      title: "Força específica para corredor — bloco A",
      content: [
        "Aquecimento: 10 min bicicleta ergométrica leve (FC < 120 bpm).",
        "Circuito — 3 séries, 60s de descanso entre séries:",
        "• Agachamento búlgaro: 3 × 10 rep cada perna — foco no glúteo, joelho alinhado com o 2º dedo",
        "• Elevação pélvica (hip thrust) com barra: 3 × 15 rep — pausa 1s no topo",
        "• Passada lateral com halteres: 3 × 12 cada lado",
        "• Prancha frontal: 3 × 45 seg — costelas fechadas, não arqueie",
        "• Panturrilha excêntrica em degrau: 3 × 15 (sobe com dois pés, desce lento com um) — prevenção de tendinopatia de Aquiles",
        "Foco desta semana: aprender o movimento correto, não a carga máxima. Se não souber a técnica de algum exercício, reduza a carga até dominar."
      ]
    },
    {
      day: "Quarta-feira — Dia 3",
      tag: { text: "Zona 1", color: "bg-[#1e293b] text-[#60a5fa]" },
      time: "30 min · recuperação ativa",
      bodyBattery: "Dia de recuperação ativa — independente do Body Battery. Nunca repouso total.",
      title: "Corrida/caminhada de recuperação",
      content: [
        "FC alvo: 120-135 bpm (Z1)",
        "Trote muito leve ou caminhada acelerada — o que mantiver FC abaixo de 135 bpm. Se dor muscular persistir de terça, caminhada apenas.",
        "Finalizar com 15 min de mobilidade:",
        "• 90/90 hip stretch — 60 seg cada lado",
        "• World's greatest stretch — 5 rep cada lado",
        "• Flexor de quadril em afundo — 60 seg cada lado",
        "• Tornozelo em círculos — 10 rep cada direção",
        "Objetivo real desta sessão: aumentar fluxo sanguíneo para o músculo, reduzir DOMS, não gerar estresse adicional."
      ]
    },
    {
      day: "Quinta-feira — Dia 4",
      tag: { text: "Zona 2", color: "bg-[#1f3723] text-[#4ade80]" },
      time: "45 min · ~5-6 km",
      bodyBattery: "Verifique Body Battery. Se < 50 → reduza para 30 min zona 1 apenas.",
      title: "Corrida contínua + 4 strides",
      content: [
        "FC alvo corpo da sessão: 135–148 bpm (Z2)",
        "Aquecimento: 5 min caminhada + 5 min trote Z1.",
        "Corpo: 30 min contínuo em Z2. Compare com segunda — seu pace na mesma FC deve ser igual ou ligeiramente mais rápido (adaptação já começa em 72h).",
        "4 × Strides de 80 m — nos últimos 10 min:",
        "Aceleração suave até 85–90% do esforço máximo por 10–12 seg. Recuperação: 60 seg trote lento entre cada. Não é sprint — é uma aceleração controlada. Foco: postura alta, queda para frente, aterrissagem sob o quadril, cadência > 170 ppm se medir.",
        "Desaquecimento: 5 min caminhada."
      ]
    },
    {
      day: "Sexta-feira — Dia 5",
      tag: { text: "Força", color: "bg-[#2d2d2d] text-[#d1d5db]" },
      time: "55 min · academia",
      bodyBattery: "Amanhã é o teste diagnóstico — não exagere na carga hoje. Técnica sobre peso.",
      title: "Força específica — bloco B + mobilidade",
      content: [
        "Repetir circuito de terça com +5% de carga nos exercícios compostos (búlgaro, hip thrust).",
        "Adicionar:",
        "• Nordic curl: 3 × 6 rep — exercício mais eficaz para prevenção de lesão de isquiotibial em corredores (meta-análise van Dyk, BJSM 2019). Desça lentamente em 3-4 seg com controle. Se não conseguir, faça assistido com parceiro ou elástico.",
        "• Dead bug: 3 × 10 rep alternados — controle lombar, core profundo",
        "Finalizar com 10 min de mobilidade completa: piriforme (figura 4), flexor de quadril, posterior de coxa em pé, tornozelo em meia-lua.",
        "Sem corrida hoje. Pernas frescas para o teste de amanhã."
      ]
    },
    {
      day: "Sábado — Dia 6",
      tag: { text: "TESTE 5 km", color: "bg-[#4c1d1d] text-[#f87171]" },
      time: "60-70 min total",
      bodyBattery: "Body Battery mínimo: 50. Se abaixo disso, adie o teste para domingo e descanse sábado.",
      title: "Teste diagnóstico — 5 km em esforço máximo sustentável",
      content: [
        "Aquecimento obrigatório — 15 min:",
        "• 5 min caminhada progressiva | • 5 min trote leve (Z1) | • 4 × 80 m acelerações progressivas com 45 seg de pausa | • 2 min pausa antes de iniciar",
        "Teste — 5 km:",
        "Pace que consegue manter do km 1 ao km 5 sem explodir nos primeiros 2 km. Não saia no pace do km 1 como se fosse 400 m. Estratégia: largue conservador nos primeiros 2 km, mantenha nos 2 km do meio, vá ao limite no km 5.",
        "Dados obrigatórios para registrar:",
        "• Pace médio final | • FC média durante o teste | • FC máxima atingida | • Pace por km (ver no Garmin depois) | • Como se sentiu nos km 3-4 (escala 1-10)",
        "Pós-teste: 10 min de descanso completo + 20 min trote muito leve Z1 (FC < 135 bpm). Não pare abruptamente — o clearance de lactato é mais rápido em movimento leve."
      ]
    },
    {
      day: "Domingo — Dia 7",
      tag: { text: "Recuperação ativa", color: "bg-[#1e3a8a] text-[#60a5fa]" },
      time: "45-50 min",
      bodyBattery: "Dia de recarregar o Body Battery. Nada que eleve FC acima de 120 bpm.",
      title: "Caminhada + mobilidade + revisão de dados",
      content: [
        "30 min de caminhada em ritmo confortável — parque, rua, qualquer lugar agradável. FC deve ficar abaixo de 120 bpm.",
        "20 min de mobilidade — yoga para corredores:",
        "• Pigeon pose: 90 seg cada lado | • Downward dog com alternância de calcanhar: 10 rep | • Thoracic rotation em 4 apoios: 10 rep cada lado | • Supino com joelhos ao peito (knee hug): 60 seg",
        "Revisão obrigatória dos dados da semana no Garmin:",
        "• Verificar se o VO₂ máx estimado mudou | • Comparar FC média de segunda vs quinta na mesma distância | • Registrar os dados do teste de sábado e trazer para ajuste do plano"
      ]
    }
  ],
  footerNote: "O dado mais importante desta semana não é o pace — é o resultado do teste de sábado. Traga o pace médio, FC média e FC máxima atingida. Com isso, recalibro suas zonas definitivamente, confirmo seu VO₂ máx real (vs estimativa Garmin de 42) e monto a semana 2 com progressão precisa. O plano de 365 dias começa a ter números reais a partir daí."
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#191919] text-[#f3f4f6] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-2xl md:text-3xl font-bold border-b border-[#2a2a2a] pb-4">
          {DashboardData.header.title}
        </h1>

        {/* ALERTA DE SUBIDA / REORGANIZAÇÃO */}
        <div className="bg-[#3c2424] border-l-4 border-[#ef4444] p-4 rounded-r text-[#fca5a5] text-sm leading-relaxed">
          <span className="mr-2">⚡</span>
          <strong>Ponto de partida hoje:</strong> {DashboardData.header.alert}
        </div>

        {/* SEMÁFORO BODY BATTERY */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Semáforo Body Battery — regra diária antes de treinar:
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {DashboardData.header.rules.map((rule, idx) => (
              <span key={idx} className={`px-2 py-1 rounded ${rule.color}`}>
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* RESUMO DA SEMANA */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-[#2a2a2a] pb-1">Resumo da semana</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {DashboardData.header.summary.map((item, idx) => (
              <div key={idx} className="bg-[#202020] border border-[#2a2a2a] p-3 rounded flex flex-col justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-lg font-bold my-1 text-white">{item.value}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DOS DIAS DE TREINO */}
        <div className="space-y-4 pt-4">
          {DashboardData.days.map((dayData, idx) => (
            <div key={idx} className="bg-[#202020] border border-[#2a2a2a] rounded-lg p-5 space-y-4">
              
              {/* Header do Card */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2a2a] pb-3">
                <h3 className="text-lg font-bold text-white">{dayData.day}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded font-medium ${dayData.tag.color}`}>
                    {dayData.tag.text}
                  </span>
                  <span className="bg-[#2d2d2d] border border-[#3e3e3e] px-2 py-0.5 rounded text-gray-300">
                    {dayData.time}
                  </span>
                </div>
              </div>

              {/* Alerta de Body Battery Interno */}
              <div className="bg-[#282828] border border-[#383838] p-3 rounded text-xs text-gray-300 flex items-start gap-2">
                <span className="text-yellow-500">⚡</span>
                <p><em>{dayData.bodyBattery}</em></p>
              </div>

              {/* Conteúdo Principal do Treino */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {dayData.title}
                  {dayData.fcAlvo && (
                    <span className="text-xs font-normal text-gray-400">
                      — FC alvo: <span className="text-white font-mono">{dayData.fcAlvo}</span> 
                      <span className="ml-1 px-1.5 py-0.2 bg-[#1f3723] text-[#4ade80] text-[10px] rounded font-bold">{dayData.fcTag}</span>
                    </span>
                  )}
                </h4>

                <div className="text-sm text-gray-300 space-y-2 leading-relaxed">
                  {dayData.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className={paragraph.startsWith('•') ? "pl-2 text-gray-400" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* NOTA DO FOOTER (VERDE) */}
        <div className="bg-[#1c3322] border border-[#274e31] p-4 rounded-lg text-sm text-[#a7f3d0] leading-relaxed">
          {DashboardData.footerNote}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-wrap gap-3 justify-center pt-4 pb-12">
          <button className="bg-[#202020] border border-[#3e3e3e] hover:bg-[#2d2d2d] transition text-sm px-4 py-2 rounded font-medium flex items-center gap-1">
            Registrar resultado do teste <span className="text-xs">↗</span>
          </button>
          <button className="bg-[#202020] border border-[#3e3e3e] hover:bg-[#2d2d2d] transition text-sm px-4 py-2 rounded font-medium flex items-center gap-1">
            Semana 2 <span className="text-xs">↗</span>
          </button>
          <button className="bg-[#202020] border border-[#3e3e3e] hover:bg-[#2d2d2d] transition text-sm px-4 py-2 rounded font-medium flex items-center gap-1">
            Técnica de corrida <span className="text-xs">↗</span>
          </button>
        </div>

      </div>
    </div>
  );
}