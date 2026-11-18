import React, { useEffect, useMemo, useState } from 'react';
import {
  computeForecastSeries,
  EVOLUTION_STAGES,
  FORECAST_SCENARIO_PRESETS,
  ForecastDrivers,
  ForecastScenarioId,
} from '../data/edtechResearchData';
import { TrendForecastChart } from './charts/InteractiveCharts';
import { Download, RotateCcw, Save, Trash2 } from 'lucide-react';

interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  drivers: ForecastDrivers;
}

const STORAGE_KEY = 'eaaf_saved_forecast_scenarios_v1';

export const TrendForecastView: React.FC = () => {
  const [presetId, setPresetId] = useState<ForecastScenarioId>('baseline');
  const [drivers, setDrivers] = useState<ForecastDrivers>(FORECAST_SCENARIO_PRESETS.baseline.drivers);
  const [visibleStages, setVisibleStages] = useState<Record<string, boolean>>({
    content: true,
    adaptive: true,
    'ai-tutor': true,
    workflow: true,
    'multi-agent': true,
  });
  const [scenarioNameInput, setScenarioNameInput] = useState('');
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScenarios));
    } catch {
      // ignore storage quota issues
    }
  }, [savedScenarios]);

  const forecastSeries = useMemo(() => computeForecastSeries(drivers), [drivers]);

  const terminalPoint = forecastSeries[forecastSeries.length - 1];
  const baseLastObserved = forecastSeries[11]; // 2026.10

  // Detect crossover month when AI Tutor surpasses Legacy Content Platforms
  const aiCrossoverMonth = useMemo(() => {
    const found = forecastSeries.find((pt) => pt.aiTutorLoop > pt.contentPlatform);
    return found ? found.month : '尚未交叉';
  }, [forecastSeries]);

  const multiAgentCrossoverMonth = useMemo(() => {
    const found = forecastSeries.find((pt) => pt.multiAgentEcosystem > pt.contentPlatform);
    return found ? found.month : '2027.10 後';
  }, [forecastSeries]);

  const applyPreset = (id: ForecastScenarioId) => {
    setPresetId(id);
    setDrivers({ ...FORECAST_SCENARIO_PRESETS[id].drivers });
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = scenarioNameInput.trim();
    if (!trimmed) return;
    const newItem: SavedScenario = {
      id: `${Date.now()}`,
      name: trimmed,
      savedAt: new Date().toISOString().slice(0, 10),
      drivers: { ...drivers },
    };
    setSavedScenarios((prev) => [newItem, ...prev]);
    setScenarioNameInput('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Month',
      'Type',
      'Content_Platform_%',
      'Adaptive_Learning_%',
      'AI_Tutor_%',
      'Teacher_Workflow_%',
      'Multi_Agent_%',
      'AI_Tutor_95CI_Low',
      'AI_Tutor_95CI_High',
    ];
    const rows = forecastSeries.map((pt) => [
      pt.month,
      pt.isForecast ? 'Forecast' : 'Observed',
      pt.contentPlatform,
      pt.adaptiveAssessment,
      pt.aiTutorLoop,
      pt.teacherWorkflow,
      pt.multiAgentEcosystem,
      pt.aiTutorLower,
      pt.aiTutorUpper,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eaaf-edtech-forecast-2026-2027-${presetId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const driverMeta: {
    key: keyof ForecastDrivers;
    label: string;
    hint: string;
  }[] = [
    {
      key: 'aiTutorPenetration',
      label: 'AI Tutor 個人化引導導入率',
      hint: '影響「評量→診斷→推薦→引導」學習閉環於國高中與自主學習端滲透速度',
    },
    {
      key: 'multiAgentMaturity',
      label: 'Multi-Agent 協作與 Orchestrator 成熟度',
      hint: '影響教學、診斷、評量與教師支援代理跨模組穩定度與 S 曲線斜率',
    },
    {
      key: 'governanceReadiness',
      label: '資料治理、兒少隱私與法規合規度',
      hint: '決定公部門教育雲與學校端正式採購預算釋放之關鍵門檻',
    },
    {
      key: 'teacherAdoption',
      label: '教師覆核工作流接受度',
      hint: '決定教師減負效益與人機協作（Human-in-the-Loop）實際留存率',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B3554] pb-5">
        <div>
          <p className="text-xs text-cyan-400 font-medium mb-1">
            預測模型視窗 · 歷史基期 2025.11–2026.10 → 前瞻預測 2026.11–2027.10
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight text-balance">
            02. 教育科技產業趨勢預測工作室
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            依據五階段轉型結構（內容平台 → 適性評量 → AI Tutor → 教師校務整合 → Multi-Agent），動態調整驅動因子並模擬未來 12 個月市場採用率交叉拐點。
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => applyPreset('baseline')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-[#0D1C31] border border-[#1B3554] rounded-md hover:border-cyan-500/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重設基準參數
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-cyan-500 text-[#081221] rounded-md hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            匯出預測數據 CSV
          </button>
        </div>
      </div>

      {/* Scenario Selector + Top Forecast KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">情境假設與驅動參數模擬</h2>
            <span className="text-xs font-mono text-slate-500">4 項結構因子</span>
          </div>

          {/* Preset Segmented Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#081221] border border-[#1B3554] rounded-md">
            {(Object.keys(FORECAST_SCENARIO_PRESETS) as ForecastScenarioId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className={`px-2 py-2 text-xs font-medium rounded transition-colors truncate cursor-pointer ${
                  presetId === id
                    ? 'bg-[#163254] text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {FORECAST_SCENARIO_PRESETS[id].label.split(' ')[0]}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {FORECAST_SCENARIO_PRESETS[presetId].subtitle}
          </p>

          {/* 4 Driver Sliders */}
          <div className="space-y-4 pt-2 border-t border-[#1B3554]">
            {driverMeta.map((d) => (
              <div key={d.key}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor={`slider-${d.key}`} className="text-slate-200 font-medium">
                    {d.label}
                  </label>
                  <span className="font-mono text-cyan-300 tabular-nums">{drivers[d.key]}%</span>
                </div>
                <input
                  id={`slider-${d.key}`}
                  type="range"
                  min={20}
                  max={95}
                  value={drivers[d.key]}
                  onChange={(e) =>
                    setDrivers((prev) => ({
                      ...prev,
                      [d.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full tech-slider"
                />
                <p className="mt-1 text-[11px] text-slate-500">{d.hint}</p>
              </div>
            ))}
          </div>

          {/* Save Custom Scenario */}
          <form onSubmit={handleSaveScenario} className="pt-3 border-t border-[#1B3554] flex gap-2">
            <input
              type="text"
              value={scenarioNameInput}
              onChange={(e) => setScenarioNameInput(e.target.value)}
              placeholder="輸入自訂情境名稱（例如：2027 縣市全面採購）"
              className="flex-1 min-w-0 px-3 py-2 text-xs bg-[#081221] border border-[#1B3554] rounded text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#142C4C] text-cyan-300 border border-cyan-400/40 rounded hover:bg-[#193861] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              儲存情境
            </button>
          </form>

          {savedScenarios.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <div className="text-[11px] text-slate-400">已儲存之自訂預測情境</div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {savedScenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-[#081221] border border-[#1B3554] rounded text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setDrivers({ ...sc.drivers })}
                      className="text-left text-slate-200 hover:text-cyan-300 truncate flex-1 cursor-pointer"
                    >
                      {sc.name}
                      <span className="ml-2 text-[11px] font-mono text-slate-500">{sc.savedAt}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavedScenarios((prev) => prev.filter((item) => item.id !== sc.id))}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      aria-label={`刪除情境 ${sc.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Forecast Chart + Inflection Summary */}
        <div className="lg:col-span-7 space-y-5">
          {/* Inflection KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#0D1C31] border border-[#1B3554] rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#1B3554]">
            <div className="p-4">
              <div className="text-xs text-slate-400">AI Tutor 預測期末採用率</div>
              <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-cyan-300">
                {terminalPoint.aiTutorLoop}%
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
                2027.10（較 2026.10 +{(terminalPoint.aiTutorLoop - baseLastObserved.aiTutorLoop).toFixed(1)}%）
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs text-slate-400">Multi-Agent 生態系預測</div>
              <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-emerald-300">
                {terminalPoint.multiAgentEcosystem}%
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
                95% 信賴區間 {terminalPoint.multiAgentLower}%–{terminalPoint.multiAgentUpper}%
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs text-slate-400">黃金交叉拐點預測</div>
              <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-sky-300">
                {aiCrossoverMonth}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono">
                Multi-Agent 超越內容平台：{multiAgentCrossoverMonth}
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  教育平台五階段市場演化預測曲線（2025.11 – 2027.10）
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  點擊下方圖例可切換顯示單一或多重演進階層
                </p>
              </div>
            </div>

            {/* Stage Filter Legend */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {EVOLUTION_STAGES.map((st) => {
                const active = visibleStages[st.id];
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() =>
                      setVisibleStages((prev) => ({ ...prev, [st.id]: !prev[st.id] }))
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-opacity whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#081221] border-[#264B73] text-slate-200 opacity-100'
                        : 'bg-[#081221]/40 border-[#1B3554] text-slate-500 opacity-55'
                    }`}
                  >
                    <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: st.color }} />
                    <span>{st.name}</span>
                  </button>
                );
              })}
            </div>

            <TrendForecastChart data={forecastSeries} visibleStages={visibleStages} />
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Forecast Breakdown Table */}
      <section className="bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              各技術階段預測彙總與轉型策略建議
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              對照 2026.10 基期實測與 2027.10 預測終值，評估平台資源配置順序
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1B3554] text-xs text-slate-400">
                <th className="py-2.5 pr-4 font-medium">市場演化階層</th>
                <th className="py-2.5 px-4 font-medium text-right">2026.10 基期</th>
                <th className="py-2.5 px-4 font-medium text-right">2027.04 中期預測</th>
                <th className="py-2.5 px-4 font-medium text-right">2027.10 期末預測</th>
                <th className="py-2.5 px-4 font-medium text-right">12 個月淨變動</th>
                <th className="py-2.5 pl-4 font-medium">策略含意與 EAAF 建議</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B3554]/60 text-xs">
              {[
                {
                  name: '01. 內容與課程平台',
                  base: baseLastObserved.contentPlatform,
                  mid: forecastSeries[17].contentPlatform,
                  end: terminalPoint.contentPlatform,
                  advice: '純教材供給逐步商品化，須串接評量診斷以避免流量被生成式搜尋稀釋。',
                },
                {
                  name: '02. 評量與適性學習',
                  base: baseLastObserved.adaptiveAssessment,
                  mid: forecastSeries[17].adaptiveAssessment,
                  end: terminalPoint.adaptiveAssessment,
                  advice: '維持穩定校園基礎需求，作為新創垂直切入之首要驗證核心。',
                },
                {
                  name: '03. AI Tutor 個人化助教',
                  base: baseLastObserved.aiTutorLoop,
                  mid: forecastSeries[17].aiTutorLoop,
                  end: terminalPoint.aiTutorLoop,
                  advice: '成長最快主線；關鍵差異在於建立「評量→診斷→推薦→引導→覆核」完整閉環。',
                },
                {
                  name: '04. 教師工作流與校務整合',
                  base: baseLastObserved.teacherWorkflow,
                  mid: forecastSeries[17].teacherWorkflow,
                  end: terminalPoint.teacherWorkflow,
                  advice: '學校端付費與續約關鍵；優先解決批改減負、班級摘要與教育雲 SSO 互通。',
                },
                {
                  name: '05. Agentic AI ／ Multi-Agent',
                  base: baseLastObserved.multiAgentEcosystem,
                  mid: forecastSeries[17].multiAgentEcosystem,
                  end: terminalPoint.multiAgentEcosystem,
                  advice: '高成長高門檻；須導入 Orchestrator 品質驗證與人類監督，避免冗餘多代理。',
                },
              ].map((row) => {
                const delta = Number((row.end - row.base).toFixed(1));
                return (
                  <tr key={row.name} className="hover:bg-[#122642]/40 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-200 whitespace-nowrap">{row.name}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-300">{row.base}%</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-300">{row.mid}%</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-cyan-300 font-semibold">{row.end}%</td>
                    <td
                      className={`py-3 px-4 font-mono tabular-nums text-right font-medium ${
                        delta >= 0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {delta >= 0 ? `+${delta}%` : `${delta}%`}
                    </td>
                    <td className="py-3 pl-4 text-slate-400 leading-relaxed min-w-[260px]">{row.advice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
