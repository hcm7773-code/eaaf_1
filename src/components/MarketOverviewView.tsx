import React, { useMemo, useState } from 'react';
import {
  DEMAND_RANKING,
  KEY_INDICATORS,
  MONTHLY_VOLUME_SERIES,
  PLATFORMS,
  PlatformProfile,
  RESEARCH_TRACKS,
  RegionFilter,
  ResearchTrackId,
} from '../data/edtechResearchData';
import {
  AiSearchVisibilityChart,
  CompetitivenessMatrixChart,
  CompetitiveStormChart,
  DemandRankingChart,
  KolNetworkChart,
  PositioningScatterChart,
  SentimentAnalysisChart,
  VolumeTrendChart,
} from './charts/InteractiveCharts';
import { X } from 'lucide-react';

interface MarketOverviewViewProps {
  onNavigateToMatrix: (platformId: string, indicatorId?: string) => void;
  onNavigateToForecast: () => void;
}

export const MarketOverviewView: React.FC<MarketOverviewViewProps> = ({
  onNavigateToMatrix,
  onNavigateToForecast,
}) => {
  const [activeTrack, setActiveTrack] = useState<ResearchTrackId>('all');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [inspectedEvidence, setInspectedEvidence] = useState<{
    platform: PlatformProfile;
    indicatorId: string;
  } | null>(null);

  const filteredPlatforms = useMemo(() => {
    if (regionFilter === 'all') return PLATFORMS;
    return PLATFORMS.filter((p) => p.region === regionFilter);
  }, [regionFilter]);

  const filteredDemands = useMemo(() => {
    if (activeTrack === 'all') return DEMAND_RANKING;
    return DEMAND_RANKING.filter((d) => d.track === activeTrack);
  }, [activeTrack]);

  // Compute dynamic KPI figures from the real data
  const firstMonth = MONTHLY_VOLUME_SERIES[0];
  const lastMonth = MONTHLY_VOLUME_SERIES[MONTHLY_VOLUME_SERIES.length - 1];
  const aiTutorGrowth = (((lastMonth.aiTutor - firstMonth.aiTutor) / firstMonth.aiTutor) * 100).toFixed(1);
  const multiAgentGrowth = (((lastMonth.multiAgent - firstMonth.multiAgent) / firstMonth.multiAgent) * 100).toFixed(1);
  const avgAiVisibility = (
    filteredPlatforms.reduce((acc, p) => acc + p.aiSearchVisibility, 0) / filteredPlatforms.length
  ).toFixed(1);

  const handleSelectEvidence = (platformId: string, indicatorId: string) => {
    const platform = PLATFORMS.find((p) => p.id === platformId);
    if (platform) {
      setInspectedEvidence({ platform, indicatorId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B3554] pb-5">
        <div>
          <p className="text-xs text-cyan-400 font-medium mb-1">
            EAAF Research Context · 台灣為主、全球為輔 · 研究期間 2025.11—2026.10
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight text-balance">
            01. 教育新創產業情報儀表板（四條主線 × 八大圖表）
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            每月追蹤產品演進、AI Tutor 學習循環、Multi-Agent 協作與校園採購政策，將零散市場訊息轉化為可比較之連續資料。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Region Filter */}
          <div className="flex items-center p-1 bg-[#0D1C31] border border-[#1B3554] rounded-md">
            {(
              [
                { id: 'all', label: '全部樣本 (9)' },
                { id: 'tw', label: '台灣樣本 (5)' },
                { id: 'global', label: '國際標竿 (4)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRegionFilter(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  regionFilter === opt.id
                    ? 'bg-[#163254] text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onNavigateToForecast}
            className="px-4 py-2 text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 rounded-md hover:bg-cyan-500/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            前往 2027 趨勢預測模型
          </button>
        </div>
      </div>

      {/* 4 Research Tracks Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1 whitespace-nowrap">情報主線篩選：</span>
        <button
          type="button"
          onClick={() => setActiveTrack('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTrack === 'all'
              ? 'bg-cyan-500 text-[#081221] border-cyan-400'
              : 'bg-[#0D1C31] text-slate-300 border-[#1B3554] hover:border-cyan-500/40'
          }`}
        >
          全部主線
        </button>
        {RESEARCH_TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => setActiveTrack(track.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTrack === track.id
                ? 'bg-[#142C4C] text-cyan-300 border-cyan-400/70'
                : 'bg-[#0D1C31] text-slate-300 border-[#1B3554] hover:border-[#2B5382]'
            }`}
          >
            {track.name}
          </button>
        ))}
      </div>

      {/* Top 4 KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 bg-[#0D1C31] border border-[#1B3554] rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#1B3554]">
        <div className="p-4">
          <div className="text-xs text-slate-400">追蹤樣本與研究週期</div>
          <div className="mt-1.5 text-2xl font-semibold font-mono tabular-nums text-slate-100">
            {filteredPlatforms.length} 平台
          </div>
          <div className="mt-1 text-xs text-slate-500">
            2025.11 — 2026.10 · 12 個月連續追蹤
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400">AI Tutor 主線年度聲量增幅</div>
          <div className="mt-1.5 text-2xl font-semibold font-mono tabular-nums text-cyan-300">
            +{aiTutorGrowth}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            由單向問答轉向評量診斷引導閉環
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400">Multi-Agent 討論動能增幅</div>
          <div className="mt-1.5 text-2xl font-semibold font-mono tabular-nums text-indigo-300">
            +{multiAgentGrowth}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            教學 / 診斷 / 評量 / 教師支援分工加速
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-400">樣本平均 AI 搜尋能見度</div>
          <div className="mt-1.5 text-2xl font-semibold font-mono tabular-nums text-emerald-300">
            {avgAiVisibility}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            生成式搜尋與推薦場景平均引用占比
          </div>
        </div>
      </div>

      {/* 8-Chart Analytical Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Chart 1: 聲量趨勢 (8 cols) */}
        <section className="xl:col-span-7 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">01. 聲量趨勢（四條主線月度追蹤）</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                比較教育新創平台、AI Tutor、Multi-Agent 與教育 AI 市場之連續討論聲量變化
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap shrink-0">2025.11–2026.10</span>
          </div>
          <VolumeTrendChart data={MONTHLY_VOLUME_SERIES} activeTrack={activeTrack} />
        </section>

        {/* Chart 3: 競爭風暴 (5 cols) */}
        <section className="xl:col-span-5 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">03. 競爭風暴（成長動能 × 輿情波動）</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                識別高成長訊號與高競爭強度交會之焦點平台
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap shrink-0">氣泡 = 聲量</span>
          </div>
          <CompetitiveStormChart
            platforms={filteredPlatforms}
            onSelectPlatform={(p) => onNavigateToMatrix(p.id)}
          />
        </section>

        {/* Chart 2: 競爭力矩陣 (12 cols full width for crisp readability) */}
        <section className="xl:col-span-12 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">02. 競爭力矩陣（七項關鍵指標一致性量表）</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                從功能比較走向教育價值驗證，同步保留每項分數之資料來源、觀察日期與信心等級
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToMatrix(filteredPlatforms[0]?.id ?? 'junyi')}
              className="text-xs text-cyan-300 hover:text-cyan-200 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer text-left"
            >
              開啟完整雷達圖與證據稽核表
            </button>
          </div>
          <CompetitivenessMatrixChart
            platforms={filteredPlatforms}
            onSelectEvidence={handleSelectEvidence}
          />
        </section>

        {/* Chart 4: 情緒分析 (6 cols) */}
        <section className="xl:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-100">04. 社群輿情情緒分析</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              解析親師生社群對各平台學習體驗、遊戲化與 AI 引導的正面、中立與負面比例
            </p>
          </div>
          <SentimentAnalysisChart platforms={filteredPlatforms} />
        </section>

        {/* Chart 5: 需求排行 (6 cols) */}
        <section className="xl:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">05. 使用者需求排行（學生・教師・家長・學校）</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                彙整四大角色核心痛點急迫度與季度成長幅
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap shrink-0">
              {filteredDemands.length} 項需求
            </span>
          </div>
          <DemandRankingChart items={filteredDemands} />
        </section>

        {/* Chart 6: KOL 網絡 (6 cols) */}
        <section className="xl:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-100">06. KOL 意見領袖與社群擴散網絡</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              點選節點檢視公部門輔導團、現場教師群、AI 技術研究與親子評論間的議題連結
            </p>
          </div>
          <KolNetworkChart activeTrack={activeTrack} />
        </section>

        {/* Chart 7: 定位散布 (6 cols) */}
        <section className="xl:col-span-6 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-100">07. 市場定位散布圖（商業採購 × AI 協作深度）</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              橫軸反映數位內容至 AI Agentic 演進程度；縱軸反映 B2C 消費至 B2B2School 校園生態整合度
            </p>
          </div>
          <PositioningScatterChart
            platforms={filteredPlatforms}
            onSelectPlatform={(p) => onNavigateToMatrix(p.id)}
          />
        </section>

        {/* Chart 8: AI 搜尋能見度 (12 cols) */}
        <section className="xl:col-span-12 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-base font-semibold text-slate-100">08. AI 搜尋能見度（GEO 引用占比）</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                在生成式搜尋與教育工具推薦問答中，國際標竿平台（Duolingo 92%、Khan Academy 88%）因結構化英文知識與論文實證具備高度引用優勢；台灣樣本則以均一（68%）與因材網（62%）領先，顯示在地課綱知識庫與 AI 生態曝光仍是新創突圍關鍵。
              </p>
            </div>
            <div className="lg:col-span-8">
              <AiSearchVisibilityChart platforms={filteredPlatforms} />
            </div>
          </div>
        </section>
      </div>

      {/* Inline Evidence Quick-Inspector Modal */}
      {inspectedEvidence && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectedEvidence(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0D1C31] border border-[#22D3EE]/40 rounded-lg p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const { platform, indicatorId } = inspectedEvidence;
              const indicator = KEY_INDICATORS.find((k) => k.id === indicatorId)!;
              const ev = platform.indicators[indicatorId];
              return (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-[#1B3554] pb-4">
                    <div>
                      <div className="text-xs text-cyan-400 font-mono">
                        {indicator.code} {indicator.name} · {indicator.dimension}
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-slate-100">
                        {platform.name} 指標評估證據
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectedEvidence(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-100 rounded hover:bg-[#163254] cursor-pointer"
                      aria-label="關閉證據視窗"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 border-b border-[#1B3554] pb-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">一致性評分</span>
                      <span className="mt-1 block text-xl font-mono font-semibold text-cyan-300 tabular-nums">
                        {ev.score.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">觀察日期</span>
                      <span className="mt-1 block text-sm font-mono text-slate-200 tabular-nums">
                        {ev.observedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">信心等級</span>
                      <span
                        className={`mt-1 block text-sm font-medium ${
                          ev.confidence === '高'
                            ? 'text-emerald-400'
                            : ev.confidence === '中'
                              ? 'text-amber-300'
                              : 'text-rose-400'
                        }`}
                      >
                        {ev.confidence}信心
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">資料來源</span>
                      <p className="text-slate-200 font-medium">{ev.source}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">研究觀察備註</span>
                      <p className="text-slate-300 leading-relaxed">{ev.note}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setInspectedEvidence(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 cursor-pointer"
                    >
                      關閉
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInspectedEvidence(null);
                        onNavigateToMatrix(platform.id, indicatorId);
                      }}
                      className="px-4 py-2 text-xs font-medium bg-cyan-500 text-[#081221] rounded hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      前往完整競爭力矩陣
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
