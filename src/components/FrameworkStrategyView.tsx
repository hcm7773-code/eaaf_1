import React, { useState } from 'react';
import {
  AI_TUTOR_LOOP_STEPS,
  EAAF_LAYERS,
  MULTI_AGENT_ROLES,
} from '../data/edtechResearchData';
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Workflow } from 'lucide-react';

export const FrameworkStrategyView: React.FC = () => {
  const [activeLoopStep, setActiveLoopStep] = useState<number>(1);
  const [activeAgentId, setActiveAgentId] = useState<string>('orchestrator');

  // Startup Entry Validation Readiness Calculator (PDF Page 8)
  const [validationScores, setValidationScores] = useState({
    userDemand: 78,
    learningOutcome: 72,
    teacherAdoption: 65,
    willingnessToPay: 58,
  });

  const currentLoop = AI_TUTOR_LOOP_STEPS.find((s) => s.step === activeLoopStep) ?? AI_TUTOR_LOOP_STEPS[0];
  const currentAgent = MULTI_AGENT_ROLES.find((a) => a.id === activeAgentId) ?? MULTI_AGENT_ROLES[0];

  const avgReadiness = Math.round(
    (validationScores.userDemand +
      validationScores.learningOutcome +
      validationScores.teacherAdoption +
      validationScores.willingnessToPay) /
      4
  );

  const recommendedExpansionStage =
    avgReadiness >= 80
      ? {
          phase: '階段三：多校與多角色 Agent 擴張',
          summary: '四項驗證指標皆具規模化基礎，可串接 Orchestrator 與校務 LMS 進行跨校複製。',
          color: 'text-emerald-300',
        }
      : avgReadiness >= 64
        ? {
            phase: '階段二：跨單元與多學科擴展',
            summary: '單一垂直場景成效已獲驗證，建議擴張鄰近學科並強化教師支援 Agent 工作流。',
            color: 'text-cyan-300',
          }
        : {
            phase: '階段一：聚焦單一垂直場景驗證',
            summary: '不宜過早投入全功能大型平台，應先鎖定單一學科或能力檢定驗證成效與付費意願。',
            color: 'text-amber-300',
          };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#1B3554] pb-5">
        <p className="text-xs text-cyan-400 font-medium mb-1">
          技術架構與落地策略 · AI Tutor 閉環 × Multi-Agent 協作 × EAAF 三層架構
        </p>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight text-balance">
          04. EAAF 教育 AI 架構與新創切入策略
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-3xl">
          最終目標不是增加一項 AI 工具，而是建立結合教育專業、AI、多代理協作及人類監督的教育 AI 生態系（逐步自動化、保留人工覆核）。
        </p>
      </div>

      {/* Section A: AI Tutor 5-Stage Learning Loop (PDF Page 6) */}
      <section className="bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              AI Tutor：從問答走向「評量 → 診斷 → 推薦 → 引導 → 覆核」學習循環
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              點選循環節點檢視輸入輸出資料規格與人類教師監督門檻
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 whitespace-nowrap shrink-0">5 階段持續改善閉環</span>
        </div>

        {/* Interactive 5-Step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-5">
          {AI_TUTOR_LOOP_STEPS.map((st) => {
            const isActive = st.step === activeLoopStep;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveLoopStep(st.step)}
                className={`text-left p-3.5 rounded-md border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#163254] border-cyan-400 text-slate-100'
                    : 'bg-[#081221] border-[#1B3554] text-slate-300 hover:border-[#2B5382]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={isActive ? 'text-cyan-300' : 'text-slate-500'}>STEP 0{st.step}</span>
                  {st.step < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />}
                </div>
                <div className="font-semibold text-sm">{st.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{st.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Specification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#1B3554] text-xs">
          <div>
            <span className="text-slate-400 block mb-1">核心教育問題</span>
            <p className="text-slate-100 font-medium leading-relaxed">{currentLoop.coreQuestion}</p>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">輸入與輸出學習歷程</span>
            <p className="text-slate-300 leading-relaxed">
              <span className="text-cyan-300">輸入：</span>
              {currentLoop.inputArtifact}
            </p>
            <p className="text-slate-300 leading-relaxed mt-1">
              <span className="text-emerald-300">產出：</span>
              {currentLoop.outputArtifact}
            </p>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">人類監督與覆核機制</span>
            <p className="text-slate-200 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{currentLoop.humanGate}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section B: Multi-Agent Role Division & Orchestrator (PDF Page 7) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-100">
              Multi-Agent 角色分工拓樸
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              必須具備協調、品質驗證、資料一致性及人類監督，避免「為多 Agent 而多 Agent」
            </p>
          </div>

          <div className="space-y-2">
            {MULTI_AGENT_ROLES.map((role) => {
              const isSelected = role.id === activeAgentId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveAgentId(role.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-md border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#163254] border-cyan-400'
                      : 'bg-[#081221] border-[#1B3554] hover:border-[#2B5382]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {role.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{role.englishRole}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
              <Workflow className="w-3.5 h-3.5" />
              <span>代理角色規格與品質護欄</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-100">{currentAgent.name}</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{currentAgent.responsibility}</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1B3554] text-xs">
              <div>
                <span className="text-slate-400 block mb-2">接收資料輸入 (Inputs)</span>
                <ul className="space-y-1.5 text-slate-200">
                  {currentAgent.inputs.map((inp) => (
                    <li key={inp} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-slate-400 block mb-2">產生協作輸出 (Outputs)</span>
                <ul className="space-y-1.5 text-slate-200">
                  {currentAgent.outputs.map((out) => (
                    <li key={out} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1B3554] text-xs">
            <span className="text-amber-300 font-medium block mb-1">防呆護欄與人類監督原則</span>
            <p className="text-slate-300 leading-relaxed">{currentAgent.guardrail}</p>
          </div>
        </div>
      </section>

      {/* Section C: Startup Vertical Entry Validator + EAAF 3-Layer Roadmap (PDF Pages 8 & 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Startup Entry Readiness Simulator */}
        <section className="lg:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                新創切入策略模擬器：垂直驗證與擴張路徑
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                優先切入「能力評量＋學習診斷＋個人化學習」，驗證四項指標後再逐步擴張
              </p>
            </div>
            <span className="text-xl font-mono font-semibold text-cyan-300 tabular-nums">
              {avgReadiness} / 100
            </span>
          </div>

          <div className="space-y-3.5 mb-5">
            {(
              [
                { key: 'userDemand', label: '01. 使用者需求強度（學生／家長痛點）' },
                { key: 'learningOutcome', label: '02. 可驗證學習成效（前後測進步幅度）' },
                { key: 'teacherAdoption', label: '03. 現場教師採用與工作流契合度' },
                { key: 'willingnessToPay', label: '04. 機構／個人付費意願與續約率' },
              ] as const
            ).map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-200">{item.label}</span>
                  <span className="font-mono text-cyan-300 tabular-nums">{validationScores[item.key]}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={validationScores[item.key]}
                  onChange={(e) =>
                    setValidationScores((prev) => ({
                      ...prev,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full tech-slider"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1B3554]">
            <div className={`text-sm font-semibold ${recommendedExpansionStage.color}`}>
              建議策略：{recommendedExpansionStage.phase}
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {recommendedExpansionStage.summary}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>擴張路徑：單一場景</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span>多學科</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span>多校與多角色 Agent</span>
            </div>
          </div>
        </section>

        {/* EAAF 3-Layer Synthesis */}
        <section className="lg:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-100">
                研究結論：銜接 EAAF 長期發展三層架構
              </h2>
            </div>

            <div className="divide-y divide-[#1B3554]">
              {EAAF_LAYERS.map((item) => (
                <div key={item.layer} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-100">
                      <span className="text-cyan-400 font-mono mr-2">{item.layer}</span>
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.focus}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{item.deliverable}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1B3554] flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-slate-100">核心演進路徑：</strong>
              市場研究 → 技術驗證 → 框架設計 → 平台實作；始終堅持「逐步自動化、保留人工覆核」治理準則。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
