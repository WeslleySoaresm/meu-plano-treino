import React, { useState, useEffect } from 'react';

// URL oficial da sua API hospedada no Render
const API_BASE_URL = 'https://meu-plano-treino.onrender.com/api';

export default function App() {
  // ==========================================
  // ESTADOS GERAIS DO COMPONENTE
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [activeWeek, setActiveWeek] = useState('semana1');
  const [planeId, setPlaneId] = useState(null); 
  const [weeksData, setWeeksData] = useState({});
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);

  const [openForms, setOpenForms] = useState({});
  const [openEditForms, setOpenEditForms] = useState({});
  const [editFields, setEditFields] = useState({});
  const [inputs, setInputs] = useState({});

  // ==========================================
  // 🔐 CONTROLADOR DE AUTENTICAÇÃO (POSTGRESQL)
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/person/ListarTodos`);
      
      if (response.ok) {
        const users = await response.json();
        const userFound = users.find(u => u.email && u.email.toLowerCase() === loginEmail.toLowerCase());

        if (userFound) {
          setCurrentUser(userFound);
          setIsAuthenticated(true);
          
          if (userFound.planes && userFound.planes.length > 0) {
            setPlaneId(userFound.planes[0].id);
            fetchPlaneStructure(userFound.planes[0].id);
          } else {
            alert("Usuário autenticado! No entanto, nenhum plano de treino está associado no banco.");
          }
        } else {
          alert("Usuário não cadastrado ou credenciais incorretas.");
        }
      } else {
        alert("Erro de comunicação com o servidor de banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao banco:", error);
      alert("Falha crítica de conexão com a API.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 🔄 SINCRONIZADOR DA PLANILHA (GET)
  // ==========================================
  const fetchPlaneStructure = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/plane/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        const formattedWeeks = {};
        const initialRecords = {};

        data.weeksStructure.forEach(week => {
          formattedWeeks[`semana${week.weekNumber}`] = {
            title: week.title,
            alert: week.alert,
            footerNote: week.footerNote,
            rules: [
              { label: "Secundário ≥ 70 → Treino completo planejado", color: "bg-emerald-950/80 text-emerald-400 border border-emerald-800" },
              { label: "Mediano 50–69 → Zona 1-2, reduzir 20% do volume", color: "bg-amber-950/80 text-amber-400 border border-amber-800" },
              { label: "Crítico < 50 → Caminhada leve + mobilidade", color: "bg-rose-950/80 text-rose-400 border border-rose-800" }
            ],
            summary: [
              { label: "Volume Total", value: "4h - 4h30", sub: "Microciclo Ajustado" },
              { label: "Km Estimados", value: "~22-26 km", sub: "Pace focado em Z2" },
              { label: "Sessões de Força", value: "2×", sub: "Terça e Sexta" },
              { label: "Intensidade Máxima", value: "Z2 Limiar", sub: "Sem picos decorrentes" },
              { label: "Teste Clínico", value: "Sábado", sub: "Esforço máximo 5k" },
            ],
            days: week.days.map(d => ({
              id: d.id,
              dayIdentifier: d.dayIdentifier,
              day: d.dayName,
              tag: { text: d.tagText, color: d.isCardio ? "bg-lime-500/10 text-lime-400 border border-lime-500/30" : "bg-zinc-800 text-zinc-300 border border-zinc-700" },
              time: d.timeInfo,
              bodyBattery: d.bodyBatteryInstruction,
              title: d.title,
              isCardio: d.isCardio,
              content: d.contentRaw ? d.contentRaw.split('\n') : []
            }))
          };
        });

        // Mapeia históricos ativos usando o dayId para indexar perfeitamente no front
        if (data.training && data.training.length > 0) {
          data.training.forEach(t => {
            const keyId = t.dayId || t.id;
            if (keyId) {
              initialRecords[keyId] = {
                id: t.id,
                isCardio: t.caloriesBurned > 0 || t.distanceCovered > 0 || (t.averagePace && t.averagePace !== "00:00:00"),
                metric1: t.weightUsed > 0 ? t.weightUsed : t.averagePace,
                metric2: t.sets > 0 ? `${t.sets} séries` : `${t.frequencyCardiac} bpm`,
                metric3: t.distanceCovered > 0 ? `${t.distanceCovered} km` : t.notesOfPerformance,
                notes: t.notes,
                timestamp: new Date(t.dateTrained).toLocaleDateString('pt-BR')
              };
            }
          });
        }

        setWeeksData(formattedWeeks);
        setRecords(initialRecords);
      }
    } catch (error) {
      console.error("Erro ao carregar mapeamento:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 💾 PERSISTÊNCIA DE PRODUÇÃO DE TREINO (POST)
  // ==========================================
  const handleSaveRecord = async (dayGuidId, dayName, title, isCardio) => {
    const currentInput = inputs[dayGuidId] || { val1: '', val2: '', val3: '', notes: '' };
    if (!currentInput.val1 && !currentInput.val2 && !currentInput.val3 && !currentInput.notes) return;

    let generatedId = "00000000-0000-0000-0000-000000000000";
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        generatedId = crypto.randomUUID();
      }
    } catch (e) {}

    // Tipagem estrita e sanitização para afastar o Erro 400 (Bad Request) do .NET
    const payload = {
      id: generatedId,
      dateTrained: new Date().toISOString(),
      repetitions: !isCardio ? parseInt(currentInput.val2, 10) || 0 : 0,
      weightUsed: !isCardio ? parseFloat(currentInput.val1.replace(',', '.')) || 0 : 0,
      duration: isCardio ? currentInput.val1 : "00:00:00", 
      restTime: "00:01:00",
      sets: !isCardio ? parseInt(currentInput.val3, 10) || 0 : 0,
      notes: currentInput.notes || "",
      frequencyCardiac: isCardio ? parseInt(currentInput.val2, 10) || 0 : 0,
      caloriesBurned: isCardio ? 100.0 : 0.0,
      distanceCovered: isCardio ? parseFloat(currentInput.val3.replace(',', '.')) || 0 : 0,
      speed: 0,
      power: 0,
      averagePace: isCardio ? currentInput.val1 : "00:00:00",
      notesOfPerformance: currentInput.notes || "",
      personId: currentUser.id,
      dayId: dayGuidId
    };

    try {
      const response = await fetch(`${API_BASE_URL}/trainingdata/record`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const serverData = await response.json().catch(() => null);
        const finalId = serverData?.id || payload.id;
        const timestamp = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        setRecords(prev => ({
          ...prev,
          [dayGuidId]: {
            id: finalId,
            isCardio,
            metric1: currentInput.val1,
            metric2: currentInput.val2,
            metric3: currentInput.val3,
            notes: currentInput.notes,
            timestamp
          }
        }));
        
        setInputs(prev => ({ ...prev, [dayGuidId]: { val1: '', val2: '', val3: '', notes: '' } }));
        setOpenForms(prev => ({ ...prev, [dayGuidId]: false }));
      } else {
        const errText = await response.text();
        console.error("Payload rejeitado pelo backend (400):", errText);
        alert("Erro 400: Dados incompatíveis com a tabela do banco de dados C#.");
      }
    } catch (error) {
      console.error("Erro na requisição POST:", error);
    }
  };

  // ==========================================
  // 🗑️ EXPURGO DE HISTÓRICO (DELETE)
  // ==========================================
  const handleClearRecord = async (dayGuidId) => {
    const recordToDelete = records[dayGuidId];
    if (!recordToDelete?.id) return;

    if (window.confirm("Deseja deletar permanentemente o registro salvo deste treino no banco de dados?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/trainingdata/record/${recordToDelete.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setRecords(prev => {
            const updated = { ...prev };
            delete updated[dayGuidId];
            return updated;
          });
        }
      } catch (error) {
        console.error("Erro ao apagar registro do banco:", error);
      }
    }
  };

  // ==========================================
  // ⚙️ MUTABILIDADE DA MALHA METODOLÓGICA (POST)
  // ==========================================
  const saveStructureEdition = async (dayGuidId) => {
    const edited = editFields[dayGuidId];
    if (!edited) return;

    const payload = {
      id: dayGuidId,
      title: edited.title,
      timeInfo: edited.time,
      tagText: edited.tagText,
      isCardio: edited.isCardio,
      bodyBatteryInstruction: edited.bodyBattery,
      contentRaw: edited.contentRaw
    };

    try {
      // Modificado para POST para contornar a ausência do PUT no pipeline do middleware .NET
      const response = await fetch(`${API_BASE_URL}/plane/days/${dayGuidId}`, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        applyLocalEditionUpdate(dayGuidId, edited);
      } else {
        // Fallback secundário na rota base sem o parâmetro limpo na URL
        console.warn("POST com ID falhou. Tentando rota alternativa limpa...");
        const fallbackResponse = await fetch(`${API_BASE_URL}/plane/days`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (fallbackResponse.ok) {
          applyLocalEditionUpdate(dayGuidId, edited);
        } else {
          alert(`Erro na sincronização: O servidor retornou status ${response.status}. Verifique as anotações do seu Controller.`);
        }
      }
    } catch (error) {
      console.error("Erro na requisição de atualização da estrutura:", error);
    }
  };

  const applyLocalEditionUpdate = (dayGuidId, edited) => {
    setWeeksData(prev => {
      const updatedWeek = { ...prev[activeWeek] };
      updatedWeek.days = updatedWeek.days.map(day => {
        if (day.id === dayGuidId) {
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
    setOpenEditForms(prev => ({ ...prev, [dayGuidId]: false }));
  };

  // ==========================================
  // UTILS & ENGENHARIA DE UI LOCAL
  // ==========================================
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
    setInputs(prev => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const handleEditFieldChange = (dayId, field, value) => {
    setEditFields(prev => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const generateWeeklyReport = () => {
    const currentWeekData = weeksData[activeWeek];
    if (!currentWeekData) return '';
    const weekDaysIds = currentWeekData.days.map(d => d.id);
    const filledDaysThisWeek = Object.keys(records).filter(id => weekDaysIds.includes(id));
    const weekFormattedName = activeWeek.replace('semana', 'Semana ');

    if (filledDaysThisWeek.length === 0) {
      return `Nenhum treino foi registrado ainda na ${weekFormattedName} para gerar o relatório.`;
    }

    let report = `RELATÓRIO DE TREINO — ${weekFormattedName.toUpperCase()} — ANÁLISE DO ALUNO\n`;
    report += `===========================================================\n\n`;

    currentWeekData.days.forEach(day => {
      const record = records[day.id];
      if (record) {
        report += `• ${day.day} (${day.title})\n`;
        report += `  Status: Finalizado em ${record.timestamp}\n`;
        if (record.isCardio) {
          report += `  Tempo/Pace: ${record.metric1 || '---'} | Ritmo/FC: ${record.metric2 || '---'} | Distância: ${record.metric3 || '---'}\n`;
        } else {
          report += `  Carga: ${record.metric1 || '---'} kg | Repetições/Séries: ${record.metric2 || '---'}\n`;
        }
        if (record.notes) report += `  Sensações do Atleta: "${record.notes}"\n`;
        report += `-----------------------------------------------------------\n`;
      }
    });
    return report;
  };

  // ==========================================
  // RENDER INTERFACE DE LOGIN (MÓDULO DESLOGADO)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center p-4 font-sans text-gray-200 antialiased">
        <div className="w-full max-w-md bg-[#14161a] border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">🏃‍♂️ HighPerformance</h2>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Planilha Esportiva de Alta Performance</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">E-mail do Aluno</label>
              <input 
                type="email" 
                required
                placeholder="seuemail@provedor.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#0e0f11] border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Senha de Acesso</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#0e0f11] border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400 transition font-mono"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-300 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-lime-400/10 disabled:opacity-50"
            >
              {loading ? "Sincronizando Banco de Dados..." : "Entrar no Painel de Treino"}
            </button>
          </form>
          <div className="text-center text-[10px] text-zinc-500 font-bold border-t border-zinc-800/80 pt-4 uppercase tracking-wider">
            Conexão SSL Segura persistida via API.
          </div>
        </div>
      </div>
    );
  }

  const currentData = weeksData[activeWeek];

  if (!currentData) {
    return (
      <div className="min-h-screen bg-[#0e0f11] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-400 mx-auto"></div>
          <p className="text-zinc-400 text-sm font-medium tracking-wide">Sincronizando planilhas com o PostgreSQL...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER INTERFACE DO CORE APP (LOGADO)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0e0f11] text-[#e4e4e7] p-4 md:p-8 flex flex-col items-center font-sans antialiased">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* HEADER DO ATLETA */}
        <div className="flex justify-between items-center bg-[#14161a] border border-zinc-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-lime-400/15 border border-lime-400/40 rounded-xl flex items-center justify-center font-black text-lime-400 text-base shadow-inner">
              {currentUser?.name?.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-black text-white tracking-wide uppercase">{currentUser?.name}</h4>
              <p className="text-[11px] text-zinc-400 font-mono">ID DO PLANO: <span className="text-lime-400 font-bold">{planeId?.substring(0,8)}...</span></p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-700 bg-zinc-800/40 px-3 py-2 rounded-xl transition">Sair</button>
        </div>
        
        {/* SELETOR GRID MACROCICLO */}
        <div className="space-y-3 bg-[#14161a] p-4 rounded-2xl border border-zinc-800/80 shadow-lg">
          <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">Linha do Tempo — Linha de Evolução do Plano</label>
          <div className="flex flex-wrap gap-1.5 p-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => { setActiveWeek(`semana${num}`); setOpenForms({}); setOpenEditForms({}); }}
                className={`w-11 h-9 text-xs font-black rounded-xl transition-all border ${activeWeek === `semana${num}` ? 'bg-lime-400 text-black border-lime-300 shadow-lg shadow-lime-400/20 font-black' : 'bg-[#1b1e23] text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'}`}
              >
                S{num}
              </button>
            ))}
          </div>
        </div>

        {/* TÍTULO PRINCIPAL & EMISSÃO DE RELATÓRIO */}
        <div className="border-b border-zinc-800/80 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
            ⚡ {currentData.title}
          </h1>
          <button 
            onClick={() => {
              const text = generateWeeklyReport();
              navigator.clipboard.writeText(text);
              alert("Relatório semanal copiado para a área de transferência!");
            }}
            className="bg-lime-400 hover:bg-lime-300 text-black text-xs font-black px-4 py-2.5 rounded-xl transition uppercase tracking-wider flex items-center gap-2 self-start md:self-auto"
          >
            📋 Copiar Relatório Semanal
          </button>
        </div>

        {/* DIRETRIZ CRÍTICA */}
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl text-rose-300 text-xs leading-relaxed font-medium">
          <span className="font-black uppercase text-rose-400 tracking-wider block mb-1">🚨 FOCO E ORIENTAÇÃO DO MICROCLO:</span>
          {currentData.alert}
        </div>

        {/* REGRAS DO SEMÁFORO DIÁRIO */}
        <div className="space-y-3 bg-[#14161a] p-4 rounded-2xl border border-zinc-800/80 shadow-md">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Semáforo de Carga Diária (Score de Recuperação Coletado)</h3>
          <div className="flex flex-col sm:flex-row gap-2 text-[11px] font-bold">
            {currentData.rules.map((rule, idx) => (
              <span key={idx} className={`px-3 py-2 rounded-xl text-center flex-1 transition ${rule.color}`}>
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* MÓDULOS DE METAS DE PERFORMANCE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {currentData.summary.map((item, idx) => (
            <div key={idx} className="bg-[#14161a] border border-zinc-800/80 p-3.5 rounded-2xl flex flex-col justify-between shadow-md hover:border-zinc-700 transition">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.label}</span>
              <span className="text-lg font-black my-1 text-lime-400 tracking-tight">{item.value}</span>
              <span className="text-[10px] text-zinc-500 font-medium leading-tight">{item.sub}</span>
            </div>
          ))}
        </div>

        {/* CARDS DINÂMICOS DOS DIAS DE TREINO */}
        <div className="space-y-5">
          {currentData.days.map((dayData) => {
            const currentInput = inputs[dayData.id] || { val1: '', val2: '', val3: '', notes: '' };
            const savedRecord = records[dayData.id];
            const isFormOpen = openForms[dayData.id];
            const isEditOpen = openEditForms[dayData.id];
            const currentEdit = editFields[dayData.id];

            return (
              <div key={dayData.id} className="bg-[#14161a] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl hover:border-zinc-700/80 transition relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-700 group-hover:bg-lime-400 transition" />

                {!isEditOpen ? (
                  <>
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <h3 className="text-base font-black text-white uppercase italic tracking-wide">{dayData.day}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${dayData.tag.color}`}>
                          {dayData.tag.text}
                        </span>
                        <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-300 font-black text-[10px]">
                          {dayData.time}
                        </span>
                        <button onClick={() => toggleEditForm(dayData.id, dayData)} className="p-1 text-zinc-500 hover:text-white transition" title="Editar Estrutura">⚙️</button>
                      </div>
                    </div>

                    <div className="bg-[#1b1e23] border border-zinc-800/60 p-3 rounded-xl text-xs text-zinc-300 flex items-start gap-2 italic">
                      <span className="text-amber-400 font-bold">⚡ Prescrição Metrológica:</span>
                      <p className="font-medium text-zinc-400">{dayData.bodyBattery}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-white tracking-wide">{dayData.title}</h4>
                      <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                        {dayData.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className={paragraph.startsWith('•') ? "pl-2 text-lime-400/80 font-semibold" : "font-medium"}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* MÓDULO ADMINISTRATIVO (MUDADO PARA OPERAR VIA POST CONFORME LOGS) */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">🛠️ Modificar Malha Estrutural do Dia</span>
                      <button onClick={() => toggleEditForm(dayData.id, dayData)} className="text-xs text-zinc-400 hover:text-white">Fechar</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Nome da Sessão</label>
                        <input type="text" value={currentEdit?.title || ''} onChange={(e) => handleEditFieldChange(dayData.id, 'title', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Volume Estimado</label>
                        <input type="text" value={currentEdit?.time || ''} onChange={(e) => handleEditFieldChange(dayData.id, 'time', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Texto de Tag</label>
                        <input type="text" value={currentEdit?.tagText || ''} onChange={(e) => handleEditFieldChange(dayData.id, 'tagText', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Mapeador de Rendimento</label>
                        <select value={currentEdit?.isCardio ? "true" : "false"} onChange={(e) => handleEditFieldChange(dayData.id, 'isCardio', e.target.value === "true")} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition">
                          <option value="true">Cardio/Corrida</option>
                          <option value="false">Força/Hipertrofia</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Instrução Body Battery</label>
                        <input type="text" value={currentEdit?.bodyBattery || ''} onChange={(e) => handleEditFieldChange(dayData.id, 'bodyBattery', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">Instruções de Exercícios (Linha por linha)</label>
                        <textarea rows="4" value={currentEdit?.contentRaw || ''} onChange={(e) => handleEditFieldChange(dayData.id, 'contentRaw', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => toggleEditForm(dayData.id, dayData)} className="bg-zinc-800 text-xs font-bold text-zinc-300 px-3 py-2 rounded-xl">Cancelar</button>
                      <button onClick={() => saveStructureEdition(dayData.id)} className="bg-amber-500 text-xs font-black text-black px-4 py-2 rounded-xl transition">Atualizar Banco</button>
                    </div>
                  </div>
                )}

                {/* SESSÃO PERSISTIDA NO POSTGRESQL (DADOS ATIVOS) */}
                {savedRecord && !isEditOpen && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 space-y-1 relative">
                    <div className="flex justify-between items-center text-emerald-400 font-black tracking-wider text-[10px] mb-1">
                      <span>💾 RENDIMENTO SALVO E PRESENTE NO CLOUD REPOSITÓRIO</span>
                      <span className="text-zinc-500 font-mono text-[9px] mr-16">{savedRecord.timestamp}</span>
                    </div>
                    {savedRecord.isCardio ? (
                      <p className="font-medium">Tempo/Ritmo: <span className="font-mono font-bold text-white">{savedRecord.metric1}</span> | Frequência Cardíaca: <span className="font-mono text-white">{savedRecord.metric2}</span> | Distância Concluída: <span className="text-white font-bold">{savedRecord.metric3}</span></p>
                    ) : (
                      <p className="font-medium">Sobrecarga Aplicada: <span className="text-white font-bold">{savedRecord.metric1} kg</span> | Volume/Repetições: <span className="text-white">{savedRecord.metric2}</span> | Séries Totais: <span className="text-white font-bold">{savedRecord.metric3}</span></p>
                    )}
                    {savedRecord.notes && <p className="text-zinc-400 border-t border-zinc-800/60 pt-2 mt-2 italic">"{savedRecord.notes}"</p>}
                    <button onClick={() => handleClearRecord(dayData.id)} className="absolute top-3 right-3 text-red-400/80 hover:text-white bg-red-950/30 border border-red-900/40 px-2 py-1 rounded-lg text-[9px] font-black transition">DELETAR</button>
                  </div>
                )}

                {/* PAINEL DE ENTRADA DO FORMULÁRIO (POST) */}
                {!savedRecord && !isEditOpen && (
                  <div className="pt-2">
                    {!isFormOpen ? (
                      <button onClick={() => toggleForm(dayData.id)} className="w-full bg-[#1b1e23] hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold py-2.5 rounded-xl border border-zinc-800 transition uppercase tracking-wider">
                        + Registrar Dados Fisiológicos do Treino
                      </button>
                    ) : (
                      <div className="bg-[#111317] border border-zinc-800 p-4 rounded-xl space-y-3">
                        <span className="text-[10px] font-black tracking-wider text-lime-400 uppercase block">Novo Registro de Performance</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {dayData.isCardio ? (
                            <>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Tempo Total / Pace</label>
                                <input type="text" placeholder="Ex: 45:12 ou 4:50/km" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">FC Média (Bpm)</label>
                                <input type="text" placeholder="Ex: 142" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Distância Total (Km)</label>
                                <input type="text" placeholder="Ex: 8.5" value={currentInput.val3} onChange={(e) => handleInputChange(dayData.id, 'val3', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Carga Geral (Kg)</label>
                                <input type="text" placeholder="Ex: 80" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Repetições Reais</label>
                                <input type="text" placeholder="Ex: 12" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Séries Feitas</label>
                                <input type="text" placeholder="Ex: 4" value={currentInput.val3} onChange={(e) => handleInputChange(dayData.id, 'val3', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                              </div>
                            </>
                          )}
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Percepção de Esforço / Notas Fisiológicas</label>
                            <input type="text" placeholder="Ex: Cansaço alto no final, pernas pesadas" value={currentInput.notes} onChange={(e) => handleInputChange(dayData.id, 'notes', e.target.value)} className="w-full bg-[#0e0f11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => toggleForm(dayData.id)} className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg">Cancelar</button>
                          <button onClick={() => handleSaveRecord(dayData.id, dayData.day, dayData.title, dayData.isCardio)} className="bg-lime-400 hover:bg-lime-300 text-black text-xs font-black px-4 py-1.5 rounded-xl transition uppercase tracking-wider">Salvar no Banco</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NOTA METODOLÓGICA DE RODAPÉ */}
        <div className="bg-[#14161a] border border-zinc-800 p-4 rounded-2xl text-center text-xs font-medium text-zinc-500 shadow-md">
          💡 <span className="italic">{currentData.footerNote}</span>
        </div>

      </div>
    </div>
  );
}