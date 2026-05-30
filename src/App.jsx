import React, { useState, useEffect } from 'react';

// Semana 1 original e imutável fornecida por você
const Semana1Base = {
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
  ],
  days: [
    {
      id: "seg_s1",
      day: "Segunda-feira — Dia 1",
      tag: { text: "Zona 2", color: "bg-[#1f3723] text-[#4ade80]" },
      time: "35-40 min · ~4-5 km",
      bodyBattery: "Verifique Body Battery ao acordar. Se < 50 → substitua por 30 min de caminhada.",
      title: "Corrida contínua — base aeróbica",
      fcAlvo: "135–148 bpm",
      fcTag: "Z2",
      isCardio: true,
      content: [
        "Aquecimento: 5 min caminhada progressiva.",
        "Corpo da sessão: 30 min corrida contínua controlando pela FC — não pelo pace. Se a FC passar de 148 bpm, reduza o ritmo imediatamente, mesmo que pareça devagar demais. Pace esperado hoje: 6:30–7:30/km. Aceite isso sem julgamento — é onde você está agora.",
        "Desaquecimento: 5 min caminhada + 5 min mobilidade de quadril.",
        "Anote: pace médio, FC média, como se sentiu. Esses dados definem a progressão."
      ]
    },
    {
      id: "ter_s1",
      day: "Terça-feira — Dia 2",
      tag: { text: "Força", color: "bg-[#2d2d2d] text-[#d1d5db]" },
      time: "50 min · academia",
      bodyBattery: "Força pode be feita com Body Battery mais baixo (≥ 35). Reduz carga se < 40.",
      title: "Força específica para corredor — bloco A",
      isCardio: false,
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
      id: "qua_s1",
      day: "Quarta-feira — Dia 3",
      tag: { text: "Zona 1", color: "bg-[#1e293b] text-[#60a5fa]" },
      time: "30 min · recuperação ativa",
      bodyBattery: "Dia de recuperação activa — independente do Body Battery. Nunca repouso total.",
      title: "Corrida/caminhada de recuperação",
      isCardio: true,
      content: [
        "FC alvo: 120-135 bpm (Z1)",
        "Trote muito leve ou caminhada acelerada — o que mantiver FC abaixo de 135 bpm. Se dor muscular persistir de terça, caminhada apenas.",
        "Finalizar com 15 min de mobilidade:",
        "• 90/90 hip stretch — 60 seg cada lado",
        "• World's greatest stretch — 5 rep cada lado",
        "• Flexor de quadril em afundo — 60 seg cada lado",
        "• Tornozelo em cookies — 10 rep cada direção",
        "Objetivo real desta sessão: aumentar fluxo sanguíneo para o muscle, reduzir DOMS, não gerar estresse adicional."
      ]
    },
    {
      id: "qui_s1",
      day: "Quinta-feira — Dia 4",
      tag: { text: "Zona 2", color: "bg-[#1f3723] text-[#4ade80]" },
      time: "45 min · ~5-6 km",
      bodyBattery: "Verifique Body Battery. Se < 50 → reduza para 30 min zona 1 apenas.",
      title: "Corrida contínua + 4 strides",
      isCardio: true,
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
      id: "sex_s1",
      day: "Sexta-feira — Dia 5",
      tag: { text: "Força", color: "bg-[#2d2d2d] text-[#d1d5db]" },
      time: "55 min · academia",
      bodyBattery: "Amanhã é o teste diagnóstico — não exagere na carga hoje. Técnica sobre peso.",
      title: "Força específica — bloco B + mobilidade",
      isCardio: false,
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
      id: "sab_s1",
      day: "Sábado — Dia 6",
      tag: { text: "TESTE 5 km", color: "bg-[#4c1d1d] text-[#f87171]" },
      time: "60-70 min total",
      bodyBattery: "Body Battery mínimo: 50. Se abaixo disso, adie o teste para domingo e descanse sábado.",
      title: "Teste diagnóstico — 5 km em esforço máximo sustentável",
      isCardio: true,
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
      id: "dom_s1",
      day: "Domingo — Dia 7",
      tag: { text: "Recuperação ativa", color: "bg-[#1e3a8a] text-[#60a5fa]" },
      time: "45-50 min",
      bodyBattery: "Dia de recarregar o Body Battery. Nada que eleve FC acima de 120 bpm.",
      title: "Caminhada + mobilidade + revisão de dados",
      isCardio: false,
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

// Gera as 50 semanas de forma limpa carregando a estrutura de cópia
const generateFiftyWeeksObject = () => {
  const fullPlan = { semana1: Semana1Base };
  const daysPrefixes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

  for (let w = 2; w <= 50; w++) {
    const startDayNumber = (w - 1) * 7 + 1;
    
    fullPlan[`semana${w}`] = {
      ...Semana1Base,
      title: `Semana ${w} — Planejamento de Treino Customizável`,
      alert: `Alerta e orientações estruturais da Semana ${w}. Clique em "⚙️ Editar Texto do Treino" em qualquer um dos dias para customizar totalmente a planilha desta semana.`,
      days: Semana1Base.days.map((baseDay, index) => {
        return {
          ...baseDay,
          id: `w${w}_d${index + 1}`,
          day: `${daysPrefixes[index]} — Dia ${startDayNumber + index}`,
        };
      }),
      footerNote: `Métricas de encerramento da Semana ${w}. Salve os registros e utilize o painel de consolidação para dar feedbacks.`
    };
  }
  return fullPlan;
};

export default function App() {
  const [activeWeek, setActiveWeek] = useState('semana1');
  const [openForms, setOpenForms] = useState({});
  const [openEditForms, setOpenEditForms] = useState({});
  const [editFields, setEditFields] = useState({});

  // Armazena as 50 semanas no state (puxando do localStorage se já houver alteração)
  const [weeksData, setWeeksData] = useState(() => {
    const localStructure = localStorage.getItem('meu_plano_treino_50_semanas_v1');
    return localStructure ? JSON.parse(localStructure) : generateFiftyWeeksObject();
  });

  // Inputs para inserção de dados temporários de digitação
  const [inputs, setInputs] = useState({});

  // Histórico salvo de treinos executados
  const [records, setRecords] = useState(() => {
    const localData = localStorage.getItem('meu_plano_treino_records_50_semanas_v1');
    return localData ? JSON.parse(localData) : {};
  });

  useEffect(() => {
    localStorage.setItem('meu_plano_treino_50_semanas_v1', JSON.stringify(weeksData));
  }, [weeksData]);

  useEffect(() => {
    localStorage.setItem('meu_plano_treino_records_50_semanas_v1', JSON.stringify(records));
  }, [records]);

  const toggleForm = (dayId) => {
    setOpenForms(prev => ({ ...prev, [dayId]: !prev[dayId] }));
    if (!inputs[dayId]) {
      setInputs(prev => ({ ...prev, [dayId]: { val1: '', val2: '', val3: '', notes: '' } }));
    }
  };

  const toggleEditForm = (dayId, dayData) => {
    if (!openEditForms[dayId]) {
      setEditFields(prev => ({
        ...prev,
        [dayId]: {
          title: dayData.title,
          time: dayData.time,
          bodyBattery: dayData.bodyBattery,
          tagText: dayData.tag.text,
          isCardio: dayData.isCardio,
          contentRaw: dayData.content.join('\n')
        }
      }));
    }
    setOpenEditForms(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleInputChange = (dayId, field, value) => {
    setInputs(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  const handleEditFieldChange = (dayId, field, value) => {
    setEditFields(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  const saveStructureEdition = (dayId) => {
    const edited = editFields[dayId];
    if (!edited) return;

    setWeeksData(prev => {
      const updatedWeek = { ...prev[activeWeek] };
      updatedWeek.days = updatedWeek.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            title: edited.title,
            time: edited.time,
            bodyBattery: edited.bodyBattery,
            isCardio: edited.isCardio,
            tag: { ...day.tag, text: edited.tagText },
            content: edited.contentRaw.split('\n').filter(line => line.trim() !== '')
          };
        }
        return day;
      });
      return { ...prev, [activeWeek]: updatedWeek };
    });

    setOpenEditForms(prev => ({ ...prev, [dayId]: false }));
  };

  const handleSaveRecord = (dayId, dayName, title, isCardio) => {
    const currentInput = inputs[dayId] || { val1: '', val2: '', val3: '', notes: '' };
    if (!currentInput.val1 && !currentInput.val2 && !currentInput.val3 && !currentInput.notes) return;

    const now = new Date();
    const timestamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newRecord = {
      dayId,
      dayName,
      title,
      timestamp,
      isCardio,
      metric1: currentInput.val1,
      metric2: currentInput.val2,
      metric3: currentInput.val3,
      notes: currentInput.notes
    };

    setRecords(prev => ({ ...prev, [dayId]: newRecord }));
    setInputs(prev => ({ ...prev, [dayId]: { val1: '', val2: '', val3: '', notes: '' } }));
    setOpenForms(prev => ({ ...prev, [dayId]: false }));
  };

  const handleClearRecord = (dayId) => {
    if (window.confirm("Deseja deletar o registro salvo deste treino?")) {
      setRecords(prev => {
        const updated = { ...prev };
        delete updated[dayId];
        return updated;
      });
    }
  };

  const generateWeeklyReport = () => {
    const currentWeekData = weeksData[activeWeek];
    const weekDaysIds = currentWeekData.days.map(d => d.id);
    const filledDaysThisWeek = Object.keys(records).filter(id => weekDaysIds.includes(id));

    const weekFormattedName = activeWeek.replace('semana', 'Semana ');

    if (filledDaysThisWeek.length === 0) {
      return `Nenhum treino foi registrado ainda na ${weekFormattedName} para gerar o relatório.`;
    }

    let report = `RELATÓRIO DE TREINO — ${weekFormattedName.toUpperCase()} — ANÁLISE PROFESSOR\n`;
    report += `===========================================================\n\n`;

    currentWeekData.days.forEach(day => {
      const record = records[day.id];
      if (record) {
        report += `• ${record.dayName} (${record.title})\n`;
        report += `  Feito e Registrado em: ${record.timestamp}\n`;
        if (record.isCardio) {
          report += `  Pace Médio: ${record.metric1 || 'Não informado'} | FC Média: ${record.metric2 || '---'} bpm | FC Máxima: ${record.metric3 || '---'} bpm\n`;
        } else {
          report += `  Carga Geral Utilizada: ${record.metric1 || 'Não informada'} | Percepção de Esforço: ${record.metric2 || 'Não informada'}\n`;
        }
        if (record.notes) {
          report += `  Notas/Sensações do Aluno: "${record.notes}"\n`;
        }
        report += `-----------------------------------------------------------\n`;
      }
    });

    return report;
  };

  const currentData = weeksData[activeWeek];
  const activeWeekNum = parseInt(activeWeek.replace('semana', ''), 10);

  return (
    <div className="min-h-screen bg-[#191919] text-[#f3f4f6] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* SELETOR DE ABAS DAS 50 SEMANAS EM GRADE OTIMIZADA */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Navegar pelas 50 Semanas do Plano:</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-[#202020] rounded border border-[#2a2a2a] max-h-28 overflow-y-auto">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => { setActiveWeek(`semana${num}`); setOpenForms({}); setOpenEditForms({}); }}
                className={`w-10 h-8 text-xs font-bold rounded transition-all border ${activeWeek === `semana${num}` ? 'bg-green-600 text-white border-green-500' : 'bg-[#282828] text-gray-400 border-zinc-800 hover:text-white hover:bg-zinc-800'}`}
              >
                S{num}
              </button>
            ))}
          </div>
        </div>

        {/* TÍTULO PRINCIPAL DINÂMICO */}
        <h1 className="text-2xl md:text-3xl font-bold border-b border-[#2a2a2a] pb-4 text-white">
          {currentData.title}
        </h1>

        {/* ALERTA CRÍTICO DA SEMANA */}
        <div className="bg-[#3c2424] border-l-4 border-[#ef4444] p-4 rounded-r text-[#fca5a5] text-sm leading-relaxed">
          <span className="mr-2">⚡</span>
          <strong>Orientação Geral:</strong> {currentData.alert}
        </div>

        {/* REGRAS DO SEMÁFORO DE CONTROLE */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Semáforo Body Battery — regra diária antes de treinar:
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {currentData.rules.map((rule, idx) => (
              <span key={idx} className={`px-2 py-1 rounded ${rule.color}`}>
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* METAS RESUMIDAS DO TOPO */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-[#2a2a2a] pb-1">Resumo do microciclo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {currentData.summary.map((item, idx) => (
              <div key={idx} className="bg-[#202020] border border-[#2a2a2a] p-3 rounded flex flex-col justify-between">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-lg font-bold my-1 text-white">{item.value}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ITERAÇÃO DOS CARDS DE TREINOS DO DIA */}
        <div className="space-y-4 pt-4">
          {currentData.days.map((dayData) => {
            const currentInput = inputs[dayData.id] || { val1: '', val2: '', val3: '', notes: '' };
            const savedRecord = records[dayData.id];
            const isFormOpen = openForms[dayData.id];
            const isEditOpen = openEditForms[dayData.id];
            const currentEdit = editFields[dayData.id];

            return (
              <div key={dayData.id} className="bg-[#202020] border border-[#2a2a2a] rounded-lg p-5 space-y-4">
                
                {/* MODO EXIBIÇÃO NORMAL DO CARD */}
                {!isEditOpen ? (
                  <>
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

                    <div className="bg-[#282828] border border-[#383838] p-3 rounded text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500">⚡</span>
                      <p><em>{dayData.bodyBattery}</em></p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {dayData.title}
                        {dayData.fcAlvo && (
                          <span className="text-xs font-normal text-gray-400">
                            — Alvo: <span className="text-white font-mono">{dayData.fcAlvo}</span> 
                            <span className="ml-1 px-1.5 py-0.2 bg-[#1f3723] text-[#4ade80] text-[10px] rounded font-bold">{dayData.fcTag}</span>
                          </span>
                        )}
                      </h4>

                      <div className="text-sm text-gray-300 space-y-1.5 leading-relaxed pb-1">
                        {dayData.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className={paragraph.startsWith('•') ? "pl-2 text-gray-400" : ""}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* MODO EDIÇÃO COMPLETO DA ESTRUTURA */
                  <div className="space-y-4 border-b border-zinc-800 pb-2">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-sm font-bold text-yellow-500">🛠️ Editando: {dayData.day}</span>
                      <button onClick={() => toggleEditForm(dayData.id, dayData)} className="text-xs text-gray-400 hover:text-white">Cancelar</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Título do Treino</label>
                        <input 
                          type="text"
                          value={currentEdit?.title || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'title', e.target.value)}
                          className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Volume/Tempo (Badge superior)</label>
                        <input 
                          type="text"
                          value={currentEdit?.time || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'time', e.target.value)}
                          className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Texto da Categoria</label>
                        <input 
                          type="text"
                          value={currentEdit?.tagText || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'tagText', e.target.value)}
                          className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Tipo de Formulário</label>
                        <select
                          value={currentEdit?.isCardio ? "true" : "false"}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'isCardio', e.target.value === "true")}
                          className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="true">Cardio (Pace + Frequência Cardíaca)</option>
                          <option value="false">Musculação / Outros (Cargas + Esforço)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-1">Aviso de Regra/Body Battery</label>
                        <input 
                          type="text"
                          value={currentEdit?.bodyBattery || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'bodyBattery', e.target.value)}
                          className="w-full bg-[#151515] border border-zinc-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-1">Conteúdo Detalhado (Uma linha por parágrafo / Use • para tópicos)</label>
                        <textarea 
                          rows="5"
                          value={currentEdit?.contentRaw || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'contentRaw', e.target.value)}
                          className="w-full bg-[#151515] border border-zinc-700 rounded p-2 text-xs text-white focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleEditForm(dayData.id, dayData)} className="bg-zinc-800 text-xs text-gray-300 px-3 py-1.5 rounded">Cancelar</button>
                      <button onClick={() => saveStructureEdition(dayData.id)} className="bg-green-600 text-xs text-white font-semibold px-4 py-1.5 rounded">Salvar Alterações</button>
                    </div>
                  </div>
                )}

                {/* VISUALIZAÇÃO DO HISTÓRICO SALVO EM TELA */}
                {savedRecord && !isEditOpen && (
                  <div className="bg-[#1b2b1e] border border-[#2e4d34] p-3 rounded text-xs text-gray-200 space-y-1 relative font-sans">
                    <div className="flex justify-between items-center text-green-400 font-semibold mb-1">
                      <span>✓ HISTÓRICO SALVO EM TELA</span>
                      <span className="text-gray-400 font-normal text-[11px] mr-16">{savedRecord.timestamp}</span>
                    </div>
                    {savedRecord.isCardio ? (
                      <p><strong>Pace:</strong> {savedRecord.metric1 || '---'} | <strong> FC Média:</strong> {savedRecord.metric2 || '---'} bpm | <strong> FC Máx:</strong> {savedRecord.metric3 || '---'} bpm</p>
                    ) : (
                      <p><strong>Cargas/Pesos:</strong> {savedRecord.metric1 || '---'} | <strong>Percepção de Esforço:</strong> {savedRecord.metric2 || '---'}</p>
                    )}
                    {savedRecord.notes && <p className="text-gray-400 italic mt-1">" {savedRecord.notes} "</p>}
                    <button onClick={() => handleClearRecord(dayData.id)} className="absolute top-2 right-2 text-red-400/60 hover:text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded text-[10px]">Apagar</button>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO DO CARD */}
                {!isEditOpen && (
                  <div className="flex flex-wrap gap-2 justify-start">
                    <button
                      onClick={() => toggleForm(dayData.id)}
                      className="bg-[#242424] hover:bg-[#2d2d2d] border border-[#3a3a3a] text-xs font-medium text-gray-300 px-3 py-1.5 rounded transition"
                    >
                      {isFormOpen ? "🔼 Recolher Aba" : "📊 Registrar Treino"}
                    </button>
                    <button
                      onClick={() => toggleEditForm(dayData.id, dayData)}
                      className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 px-3 py-1.5 rounded transition"
                    >
                      ⚙️ Editar Texto do Treino
                    </button>
                  </div>
                )}

                {/* FORMULÁRIO DE INSERÇÃO DE REGISTRO */}
                {isFormOpen && !isEditOpen && (
                  <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dayData.isCardio ? (
                        <>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-0.5">Pace Médio Final</label>
                            <input type="text" placeholder="ex: 6:15/km" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none font-mono" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-0.5">FC Média (bpm)</label>
                            <input type="text" placeholder="ex: 142" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none font-mono" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-0.5">FC Máxima (bpm)</label>
                            <input type="text" placeholder="ex: 155" value={currentInput.val3} onChange={(e) => handleInputChange(dayData.id, 'val3', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none font-mono" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-400 mb-0.5">Pesos / Cargas anotadas por exercício</label>
                            <input type="text" placeholder="ex: agachamento 40kg, leg 120kg" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-0.5">Percepção de Cansaço (1 a 10)</label>
                            <input type="text" placeholder="ex: 7" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none" />
                          </div>
                        </>
                      )}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-gray-400 mb-0.5">Sintomas, dores ou observações relevantes gerais</label>
                        <input type="text" placeholder="Como se sentiu trocando o treino?" value={currentInput.notes} onChange={(e) => handleInputChange(dayData.id, 'notes', e.target.value)} className="w-full bg-[#232323] border border-[#333] rounded px-2 py-1 text-xs text-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button onClick={() => handleSaveRecord(dayData.id, dayData.day, dayData.title, dayData.isCardio)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-[11px] px-4 py-1 rounded transition">
                        Confirmar e Salvar Registro
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* NOTA FIXA DO RODAPÉ */}
        <div className="bg-[#1c3322] border border-[#274e31] p-4 rounded-lg text-sm text-[#a7f3d0] leading-relaxed">
          {currentData.footerNote}
        </div>

        {/* RELATÓRIO FINAL CONSOLIDADO */}
        <div className="bg-[#202020] border border-[#2a2a2a] rounded-lg p-5 mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#2a2a2a] pb-2">
            <div>
              <h3 className="text-base font-bold text-white">📋 Painel Semanal Consolidado (Semana {activeWeekNum})</h3>
              <p className="text-xs text-gray-400">Gera de forma mesclada o texto com todos os inserts salvos para enviar ao professor.</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(generateWeeklyReport());
                alert(`Relatório da Semana ${activeWeekNum} copiado!`);
              }}
              className="bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800 text-blue-300 text-xs px-3 py-1.5 rounded transition self-start"
            >
              Copiar texto do relatório
            </button>
          </div>
          <pre className="bg-[#151515] text-xs font-mono p-4 rounded text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {generateWeeklyReport()}
          </pre>
        </div>

        <div className="flex justify-center pt-2 pb-12">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-[#202020] border border-[#3e3e3e] hover:bg-[#2d2d2d] transition text-xs px-4 py-2 rounded font-medium text-gray-400">
            Voltar ao Topo ↑
          </button>
        </div>

      </div>
    </div>
  );
}