import React, { useState, useEffect } from 'react';
// Substitua a linha antiga por esta:
const API_BASE_URL = 'https://meu-plano-treino.onrender.com';
// URL base da sua API .NET (Ajuste a porta conforme o seu projeto local)


export default function App() {
  // Estados de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Estados da Planilha
  const [activeWeek, setActiveWeek] = useState('semana1');
  const [planeId, setPlaneId] = useState(null); // Armazenará o ID do plano vindo do banco
  const [weeksData, setWeeksData] = useState({});
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados de Controle de UI
  const [openForms, setOpenForms] = useState({});
  const [openEditForms, setOpenEditForms] = useState({});
  const [editFields, setEditFields] = useState({});
  const [inputs, setInputs] = useState({});

  // 🔐 FUNÇÃO DE LOGIN (Integração com a API)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    try {
      // Em produção, você faria um POST para api/auth/login. 
      // Aqui vamos buscar o usuário pelo email para carregar seu plano correspondente.
      const response = await fetch(`${API_BASE_URL}/person`);
      if (response.ok) {
        const users = await response.json();
        const userFound = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());

        if (userFound) {
          setCurrentUser(userFound);
          setIsAuthenticated(true);
          // Se o usuário tem planos, carrega o primeiro plano dele
          if (userFound.planes && userFound.planes.length > 0) {
            setPlaneId(userFound.planes[0].id);
            fetchPlaneStructure(userFound.planes[0].id);
          } else {
            alert("Usuário autenticado, mas nenhum plano de treino foi associado a ele no banco.");
          }
        } else {
          alert("Usuário não encontrado no banco de dados. Verifique o e-mail.");
        }
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert("Falha ao conectar ao servidor da API.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 BUSCAR ESTRUTURA DO PLANO (GET)
  const fetchPlaneStructure = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/plane/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Reconstrói o dicionário de semanas estruturado que o front usa para renderizar
        const formattedWeeks = {};
        data.weeksStructure.forEach(week => {
          formattedWeeks[`semana${week.weekNumber}`] = {
            title: week.title,
            alert: week.alert,
            footerNote: week.footerNote,
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
            days: week.days.map(d => ({
              id: d.id,
              dayIdentifier: d.dayIdentifier,
              day: d.dayName,
              tag: { text: d.tagText, color: d.isCardio ? "bg-[#1f3723] text-[#4ade80]" : "bg-[#2d2d2d] text-[#d1d5db]" },
              time: d.timeInfo,
              bodyBattery: d.bodyBatteryInstruction,
              title: d.title,
              isCardio: d.isCardio,
              content: d.contentRaw.split('\n')
            }))
          };
        });

        setWeeksData(formattedWeeks);
      }
    } catch (error) {
      console.error("Erro ao carregar estrutura do plano:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ SALVAR EDIÇÃO TEXTUAL DO TREINO (PUT)
  const saveStructureEdition = async (dayGuidId) => {
    const edited = editFields[dayGuidId];
    if (!edited) return;

    try {
      const response = await fetch(`${API_BASE_URL}/plane/days/${dayGuidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: edited.title,
          timeInfo: edited.time,
          tagText: edited.tagText,
          isCardio: edited.isCardio,
          bodyBatteryInstruction: edited.bodyBattery,
          contentRaw: edited.contentRaw
        })
      });

      if (response.ok) {
        // Atualiza a UI localmente apenas se salvou com sucesso no Banco
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
      }
    } catch (error) {
      console.error("Erro ao salvar edição no banco de dados:", error);
    }
  };

  // 📊 CONFIRMAR E SALVAR REGISTRO DE HISTÓRICO (POST)
  const handleSaveRecord = async (dayGuidId, dayName, title, isCardio) => {
    const currentInput = inputs[dayGuidId] || { val1: '', val2: '', val3: '', notes: '' };
    if (!currentInput.val1 && !currentInput.val2 && !currentInput.val3 && !currentInput.notes) return;

    const payload = {
      planeId: planeId,
      dayId: dayGuidId,
      dayName: dayName,
      title: title,
      isCardio: isCardio,
      metric1: currentInput.val1,
      metric2: currentInput.val2,
      metric3: currentInput.val3,
      notes: currentInput.notes
    };

    try {
      const response = await fetch(`${API_BASE_URL}/trainingdata/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedDataFromServer = await response.json();
        const timestamp = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        setRecords(prev => ({
          ...prev,
          [dayGuidId]: { ...payload, id: savedDataFromServer.id, timestamp }
        }));
        
        setInputs(prev => ({ ...prev, [dayGuidId]: { val1: '', val2: '', val3: '', notes: '' } }));
        setOpenForms(prev => ({ ...prev, [dayGuidId]: false }));
      }
    } catch (error) {
      console.error("Erro ao enviar registro de treino:", error);
    }
  };

  // 🗑️ APAGAR REGISTRO DE HISTÓRICO (DELETE)
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

  // Funções Utilitárias de UI
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

  // RENDER DA TELA DE LOGIN (Caso não esteja autenticado)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center p-4 font-sans text-gray-200">
        <div className="w-full max-w-md bg-[#191919] border border-zinc-800 rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">🏃‍♂️ HighPerformance API</h2>
            <p className="text-sm text-gray-400">Entre para acessar a sua planilha de 50 semanas</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">E-mail do Aluno</label>
              <input 
                type="email" 
                required
                placeholder="seuemail@provedor.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#222] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Senha de Acesso</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#222] border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition font-mono"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg text-sm transition shadow-lg shadow-green-900/20 disabled:opacity-50"
            >
              {loading ? "Autenticando e Conectando..." : "Entrar no Painel de Treino"}
            </button>
          </form>
          <div className="text-center text-xs text-gray-500 border-t border-zinc-800 pt-4">
            Acesso integrado via HTTPS Seguro e Documentado pelo Swagger.
          </div>
        </div>
      </div>
    );
  }

  // RENDER DO APP PRINCIPAL (Após Autenticação Bem Sucedida)
  const currentData = weeksData[activeWeek];
  const activeWeekNum = parseInt(activeWeek.replace('semana', ''), 10);

  if (!currentData) {
    return (
      <div className="min-h-screen bg-[#191919] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-400 text-sm">Carregando malha estrutural das tabelas do banco...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#e4e4e7] p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER DE USUÁRIO LOGADO */}
        <div className="flex justify-between items-center bg-[#1c1c1c] border border-zinc-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/20 border border-green-500 rounded-full flex items-center justify-center font-bold text-green-400">
              {currentUser?.name?.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{currentUser?.name}</h4>
              <p className="text-xs text-gray-400">Plano Ativo ID: <span className="font-mono text-[10px]">{planeId}</span></p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 bg-red-950/20 px-3 py-1.5 rounded-lg transition">Sair</button>
        </div>
        
        {/* SELETOR DE ABAS DAS 50 SEMANAS EM GRADE OTIMIZADA */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Navegar pelas 50 Semanas do Plano:</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-[#1c1c1c] rounded-xl border border-zinc-800 max-h-28 overflow-y-auto">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => { setActiveWeek(`semana${num}`); setOpenForms({}); setOpenEditForms({}); }}
                className={`w-10 h-8 text-xs font-bold rounded-lg transition-all border ${activeWeek === `semana${num}` ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/20' : 'bg-[#252525] text-gray-400 border-zinc-800 hover:text-white hover:bg-zinc-800'}`}
              >
                S{num}
              </button>
            ))}
          </div>
        </div>

        {/* TÍTULO PRINCIPAL DINÂMICO */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white pb-2 border-b border-zinc-800">
          {currentData.title}
        </h1>

        {/* ALERTA CRÍTICO DA SEMANA */}
        <div className="bg-[#2c1d1d] border-l-4 border-red-500 p-4 rounded-r-xl text-red-300 text-sm leading-relaxed border-y border-r border-red-950">
          <strong>⚡ Orientação Geral:</strong> {currentData.alert}
        </div>

        {/* REGRAS DO SEMÁFORO DE CONTROLE */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Semáforo Body Battery — regra diária antes de treinar:
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {currentData.rules.map((rule, idx) => (
              <span key={idx} className={`px-2 py-1 rounded-md shadow-sm ${rule.color}`}>
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* METAS RESUMIDAS DO TOPO */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white tracking-tight">Resumo do microciclo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {currentData.summary.map((item, idx) => (
              <div key={idx} className="bg-[#1c1c1c] border border-zinc-800 p-3 rounded-xl flex flex-col justify-between shadow-sm">
                <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                <span className="text-xl font-black my-1 text-white tracking-tight">{item.value}</span>
                <span className="text-[10px] text-gray-500 leading-tight font-medium">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ITERAÇÃO DOS CARDS DE TREINOS DO DIA */}
        <div className="space-y-4 pt-2">
          {currentData.days.map((dayData) => {
            const currentInput = inputs[dayData.id] || { val1: '', val2: '', val3: '', notes: '' };
            const savedRecord = records[dayData.id];
            const isFormOpen = openForms[dayData.id];
            const isEditOpen = openEditForms[dayData.id];
            const currentEdit = editFields[dayData.id];

            return (
              <div key={dayData.id} className="bg-[#1c1c1c] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm hover:border-zinc-700 transition">
                
                {/* MODO EXIBIÇÃO NORMAL DO CARD */}
                {!isEditOpen ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <h3 className="text-base font-bold text-white tracking-tight">{dayData.day}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] uppercase tracking-wider ${dayData.tag.color}`}>
                          {dayData.tag.text}
                        </span>
                        <span className="bg-[#242424] border border-zinc-700 px-2 py-0.5 rounded-md text-gray-300 font-semibold text-[11px]">
                          {dayData.time}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#222] border border-zinc-800 p-3 rounded-lg text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500 font-bold">⚡</span>
                      <p><em>{dayData.bodyBattery}</em></p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                        {dayData.title}
                      </h4>

                      <div className="text-sm text-gray-400 space-y-1.5 leading-relaxed pb-1">
                        {dayData.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className={paragraph.startsWith('•') ? "pl-2 text-zinc-500 font-medium" : ""}>
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
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Título do Treino</label>
                        <input 
                          type="text"
                          value={currentEdit?.title || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'title', e.target.value)}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Volume/Tempo (Badge superior)</label>
                        <input 
                          type="text"
                          value={currentEdit?.time || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'time', e.target.value)}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Texto da Categoria</label>
                        <input 
                          type="text"
                          value={currentEdit?.tagText || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'tagText', e.target.value)}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Tipo de Formulário</label>
                        <select
                          value={currentEdit?.isCardio ? "true" : "false"}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'isCardio', e.target.value === "true")}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 transition"
                        >
                          <option value="true">Cardio (Pace + Frequência Cardíaca)</option>
                          <option value="false">Musculação / Outros (Cargas + Esforço)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Aviso de Regra/Body Battery</label>
                        <input 
                          type="text"
                          value={currentEdit?.bodyBattery || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'bodyBattery', e.target.value)}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 transition"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Conteúdo Detalhado (Uma linha por parágrafo / Use • para tópicos)</label>
                        <textarea 
                          rows="5"
                          value={currentEdit?.contentRaw || ''}
                          onChange={(e) => handleEditFieldChange(dayData.id, 'contentRaw', e.target.value)}
                          className="w-full bg-[#111] border border-zinc-700 rounded-lg p-3 text-xs text-white focus:outline-none font-sans focus:border-yellow-500 transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleEditForm(dayData.id, dayData)} className="bg-zinc-800 text-xs font-semibold text-gray-300 px-3 py-2 rounded-lg">Cancelar</button>
                      <button onClick={() => saveStructureEdition(dayData.id)} className="bg-yellow-600 hover:bg-yellow-500 text-xs text-white font-bold px-4 py-2 rounded-lg transition shadow-md shadow-yellow-900/10">Salvar Alterações</button>
                    </div>
                  </div>
                )}

                {/* VISUALIZAÇÃO DO HISTÓRICO SALVO EM TELA */}
                {savedRecord && !isEditOpen && (
                  <div className="bg-[#162519] border border-green-900 p-4 rounded-xl text-xs text-green-200 space-y-1 relative font-sans">
                    <div className="flex justify-between items-center text-green-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5">💾 PERSISTIDO NO BANCO DE DADOS</span>
                      <span className="text-gray-400 font-normal text-[10px] mr-16">{savedRecord.timestamp}</span>
                    </div>
                    {savedRecord.isCardio ? (
                      <p><strong>Pace:</strong> <span className="font-mono">{savedRecord.metric1 || '---'}</span> | <strong> FC Média:</strong> <span className="font-mono">{savedRecord.metric2 || '---'} bpm</span> | <strong> FC Máx:</strong> <span className="font-mono">{savedRecord.metric3 || '---'} bpm</span></p>
                    ) : (
                      <p><strong>Cargas/Pesos:</strong> {savedRecord.metric1 || '---'} | <strong>Percepção de Esforço:</strong> <span className="font-mono">{savedRecord.metric2 || '---'}/10</span></p>
                    )}
                    {savedRecord.notes && <p className="text-green-300/70 italic mt-1.5 border-t border-green-900/40 pt-1.5">" {savedRecord.notes} "</p>}
                    <button onClick={() => handleClearRecord(dayData.id)} className="absolute top-3 right-3 text-red-400/60 hover:text-red-400 bg-red-950/40 border border-red-900/30 px-2 py-1 rounded-md text-[10px] font-semibold transition">Apagar</button>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO DO CARD */}
                {!isEditOpen && (
                  <div className="flex flex-wrap gap-2 justify-start border-t border-zinc-800/60 pt-3">
                    <button
                      onClick={() => toggleForm(dayData.id)}
                      className="bg-[#252525] hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-gray-200 px-3 py-1.5 rounded-lg transition"
                    >
                      {isFormOpen ? "🔼 Recolher Painel" : "📊 Registrar Execução"}
                    </button>
                    <button
                      onClick={() => toggleEditForm(dayData.id, dayData)}
                      className="bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-400 px-3 py-1.5 rounded-lg transition"
                    >
                      ⚙️ Configurar Treino
                    </button>
                  </div>
                )}

                {/* FORMULÁRIO DE INSERÇÃO DE REGISTRO */}
                {isFormOpen && !isEditOpen && (
                  <div className="bg-[#111] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {dayData.isCardio ? (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Pace Médio Final</label>
                            <input type="text" placeholder="ex: 6:15/km" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono focus:border-green-500 transition" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">FC Média (bpm)</label>
                            <input type="text" placeholder="ex: 142" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono focus:border-green-500 transition" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">FC Máxima (bpm)</label>
                            <input type="text" placeholder="ex: 155" value={currentInput.val3} onChange={(e) => handleInputChange(dayData.id, 'val3', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono focus:border-green-500 transition" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Pesos / Cargas anotadas por exercício</label>
                            <input type="text" placeholder="ex: agachamento 40kg, leg 120kg" value={currentInput.val1} onChange={(e) => handleInputChange(dayData.id, 'val1', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500 transition" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Percepção de Cansaço (1 a 10)</label>
                            <input type="text" placeholder="ex: 7" value={currentInput.val2} onChange={(e) => handleInputChange(dayData.id, 'val2', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono focus:border-green-500 transition" />
                          </div>
                        </>
                      )}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Sintomas, dores ou observações relevantes gerais</label>
                        <input type="text" placeholder="Como se sentiu executando o treino hoje?" value={currentInput.notes} onChange={(e) => handleInputChange(dayData.id, 'notes', e.target.value)} className="w-full bg-[#1c1c1c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500 transition" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button onClick={() => handleSaveRecord(dayData.id, dayData.day, dayData.title, dayData.isCardio)} className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md shadow-green-900/10">
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
        <div className="bg-[#192b1f] border border-green-900 p-4 rounded-xl text-sm text-green-300 leading-relaxed">
          {currentData.footerNote}
        </div>

        {/* RELATÓRIO FINAL CONSOLIDADO */}
        <div className="bg-[#1c1c1c] border border-zinc-800 rounded-xl p-5 mt-6 space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-800 pb-2">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">📋 Painel Semanal Consolidado (Semana {activeWeekNum})</h3>
              <p className="text-xs text-gray-400">Gera o texto mesclado com as métricas da API para copiar para o clipboard.</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(generateWeeklyReport());
                alert(`Relatório da Semana ${activeWeekNum} copiado com sucesso!`);
              }}
              className="bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800 text-blue-300 text-xs px-3 py-1.5 rounded-lg transition self-start font-semibold"
            >
              Copiar texto do relatório
            </button>
          </div>
          <pre className="bg-[#111] text-xs font-mono p-4 rounded-lg text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto border border-zinc-800/60">
            {generateWeeklyReport()}
          </pre>
        </div>

        <div className="flex justify-center pt-2 pb-12">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-[#1c1c1c] border border-zinc-800 hover:bg-[#252525] transition text-xs px-4 py-2 rounded-lg font-bold text-gray-400">
            Voltar ao Topo ↑
          </button>
        </div>

      </div>
    </div>
  );
}