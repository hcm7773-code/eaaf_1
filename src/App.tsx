/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Cpu,
  Download,
  Menu,
  Radar,
  TrendingUp,
  X,
} from 'lucide-react';
import { MarketOverviewView } from './components/MarketOverviewView';
import { TrendForecastView } from './components/TrendForecastView';
import { CompetitivenessView } from './components/CompetitivenessView';
import { FrameworkStrategyView } from './components/FrameworkStrategyView';
import { KEY_INDICATORS, PLATFORMS } from './data/edtechResearchData';

type WorkspaceTab = 'overview' | 'forecast' | 'competitiveness' | 'framework';

const NAV_ITEMS: {
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: '01. 產業情報總覽', shortLabel: '情報總覽', icon: BarChart3 },
  { id: 'forecast', label: '02. 產業趨勢預測', shortLabel: '趨勢預測', icon: TrendingUp },
  { id: 'competitiveness', label: '03. 競爭力指標矩陣', shortLabel: '競爭力矩陣', icon: Radar },
  { id: 'framework', label: '04. EAAF 架構與策略', shortLabel: 'EAAF 策略', icon: Cpu },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [matrixTarget, setMatrixTarget] = useState<{
    platformId: string;
    indicatorId: string;
  }>({ platformId: 'junyi', indicatorId: 'outcome' });

  const handleNavigateToMatrix = (platformId: string, indicatorId = 'outcome') => {
    setMatrixTarget({ platformId, indicatorId });
    setActiveTab('competitiveness');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportMasterDataset = () => {
    const headers = [
      'Platform',
      'Region',
      'Competition_Tier',
      'Evolution_Stage',
      'AI_Search_Visibility_%',
      'Monthly_Growth_%',
      ...KEY_INDICATORS.map((k) => `${k.code}_${k.name}`),
    ];

    const rows = PLATFORMS.map((p) => [
      `"${p.name}"`,
      p.regionLabel,
      p.tier,
      `"${p.stageLabel}"`,
      p.aiSearchVisibility,
      p.monthlyGrowthSignal,
      ...KEY_INDICATORS.map((k) => p.indicators[k.id].score.toFixed(1)),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'eaaf-edtech-industry-benchmark-2025-2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentNav = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#081221] text-[#F1F5F9] flex">
      {/* Desktop Left Sidebar (248px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[248px] lg:fixed lg:inset-y-0 bg-[#0B1729] border-r border-[#1B3554] z-30">
        <div className="px-5 h-16 flex items-center border-b border-[#1B3554]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="text-left focus:outline-none cursor-pointer"
          >
            <span className="block text-sm font-semibold tracking-tight text-slate-100 whitespace-nowrap">
              EAAF EdTech 情報中心
            </span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1" aria-label="主要分析模組">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#142C4C] text-cyan-300 border border-cyan-400/35'
                    : 'text-slate-300 hover:bg-[#10223A] hover:text-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1B3554] text-[11px] text-slate-400 space-y-1.5">
          <div className="text-slate-300 font-medium">研究基礎資料範圍</div>
          <div>台灣為主（5）· 全球為輔（4）</div>
          <div className="font-mono text-slate-500">觀察期：2025.11 — 2026.10</div>
          <div className="font-mono text-cyan-400/90">預測期：2026.11 — 2027.10</div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="w-64 bg-[#0B1729] border-r border-[#1B3554] h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 h-14 flex items-center justify-between border-b border-[#1B3554]">
              <span className="text-sm font-semibold text-slate-100 whitespace-nowrap">
                EAAF EdTech 情報中心
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 cursor-pointer"
                aria-label="關閉選單"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#142C4C] text-cyan-300 border border-cyan-400/35'
                        : 'text-slate-300 hover:bg-[#10223A] border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[248px] min-w-0 flex flex-col min-h-screen">
        {/* Top Contextual Bar */}
        <header className="sticky top-0 z-20 h-14 lg:h-16 bg-[#081221]/95 backdrop-blur-sm border-b border-[#1B3554] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-cyan-300 cursor-pointer"
              aria-label="開啟導覽選單"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
              <span className="hidden sm:inline text-slate-500">教育新創平台產業分析</span>
              <span className="hidden sm:inline text-slate-600">/</span>
              <span className="text-slate-200 font-medium truncate">{currentNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportMasterDataset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#0D1C31] text-cyan-300 border border-cyan-400/40 rounded-md hover:bg-[#142C4C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出研究基準表 CSV</span>
            </button>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1400px] w-full mx-auto">
          {activeTab === 'overview' && (
            <MarketOverviewView
              onNavigateToMatrix={handleNavigateToMatrix}
              onNavigateToForecast={() => {
                setActiveTab('forecast');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          {activeTab === 'forecast' && <TrendForecastView />}
          {activeTab === 'competitiveness' && (
            <CompetitivenessView
              initialPlatformId={matrixTarget.platformId}
              initialIndicatorId={matrixTarget.indicatorId}
            />
          )}
          {activeTab === 'framework' && <FrameworkStrategyView />}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-[#1B3554] px-4 sm:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>EAAF Research Context · Educational AI Ecosystem（2025.11 — 2026.10）</span>
          <span>EdTech × AI Tutor × Multi-Agent 產業分析與趨勢預測平台</span>
        </footer>
      </div>
    </div>
  );
}
