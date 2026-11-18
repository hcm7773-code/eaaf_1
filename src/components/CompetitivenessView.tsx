import React, { useEffect, useMemo, useState } from 'react';
import {
  CompetitionTier,
  KEY_INDICATORS,
  PLATFORMS,
  PlatformProfile,
} from '../data/edtechResearchData';
import { RadarSevenAxisChart } from './charts/InteractiveCharts';
import { ArrowUpDown, Search } from 'lucide-react';

interface CompetitivenessViewProps {
  initialPlatformId?: string;
  initialIndicatorId?: string;
}

const NOTES_STORAGE_KEY = 'eaaf_analyst_evidence_notes_v1';

export const CompetitivenessView: React.FC<CompetitivenessViewProps> = ({
  initialPlatformId = 'junyi',
  initialIndicatorId = 'outcome',
}) => {
  const [selectedRadarIds, setSelectedRadarIds] = useState<string[]>(['junyi', 'adl', 'khan']);
  const [tierFilter, setTierFilter] = useState<'all' | CompetitionTier>('all');
  const [dimensionFilter, setDimensionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'avg' | string>('avg');
  const [sortDesc, setSortDesc] = useState(true);

  const [activePlatformId, setActivePlatformId] = useState<string>(initialPlatformId);
  const [activeIndicatorId, setActiveIndicatorId] = useState<string>(initialIndicatorId);
  const [customNotes, setCustomNotes] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    if (initialPlatformId) setActivePlatformId(initialPlatformId);
    if (initialIndicatorId) setActiveIndicatorId(initialIndicatorId);
  }, [initialPlatformId, initialIndicatorId]);

  useEffect(() => {
    const key = `${activePlatformId}:${activeIndicatorId}`;
    setNoteDraft(customNotes[key] ?? '');
  }, [activePlatformId, activeIndicatorId, customNotes]);

  const computeAverage = (p: PlatformProfile) => {
    const vals = KEY_INDICATORS.map((k) => p.indicators[k.id].score);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const visibleIndicators = useMemo(() => {
    if (dimensionFilter === 'all') return KEY_INDICATORS;
    return KEY_INDICATORS.filter((k) => k.dimension === dimensionFilter);
  }, [dimensionFilter]);

  const filteredPlatforms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PLATFORMS.filter((p) => {
      if (tierFilter !== 'all' && p.tier !== tierFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.primarySegment.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => {
      const valA = sortBy === 'avg' ? computeAverage(a) : a.indicators[sortBy].score;
      const valB = sortBy === 'avg' ? computeAverage(b) : b.indicators[sortBy].score;
      return sortDesc ? valB - valA : valA - valB;
    });
  }, [tierFilter, searchQuery, sortBy, sortDesc]);

  const radarPlatforms = useMemo(
    () => PLATFORMS.filter((p) => selectedRadarIds.includes(p.id)),
    [selectedRadarIds]
  );

  const toggleRadarPlatform = (id: string) => {
    setSelectedRadarIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((x) => x !== id) : prev;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const activePlatform = PLATFORMS.find((p) => p.id === activePlatformId) ?? PLATFORMS[0];
  const activeIndicator = KEY_INDICATORS.find((k) => k.id === activeIndicatorId) ?? KEY_INDICATORS[0];
  const activeEvidence = activePlatform.indicators[activeIndicator.id];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${activePlatform.id}:${activeIndicator.id}`;
    const updated = { ...customNotes, [key]: noteDraft.trim() };
    setCustomNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1B3554] pb-5">
        <div>
          <p className="text-xs text-cyan-400 font-medium mb-1">
            四大分析構面（市場 × 社群 × 需求 × 生態系） · 七項關鍵教育價值指標
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight text-balance">
            03. 競爭力矩陣與證據稽核資料庫
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            區分直接競爭、間接競爭與國際標竿參照，以一致量表評估 9 大教育平台，並為每項分數保留資料來源、觀察日期與信心等級。
          </p>
        </div>

        {/* Search + Tier Filter */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋平台或定位..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0D1C31] border border-[#1B3554] rounded-md text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <div className="flex items-center p-1 bg-[#0D1C31] border border-[#1B3554] rounded-md">
            {(['all', '直接競爭', '間接競爭', '標竿參照'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  tierFilter === tier ? 'bg-[#163254] text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier === 'all' ? '全部競爭層級' : tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Split: 7-Axis Radar + Evidence Audit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 7-Axis Radar Overlay */}
        <section className="lg:col-span-5 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-base font-semibold text-slate-100">七大關鍵指標雷達對照</h2>
              <span className="text-xs font-mono text-slate-500">最多選 3 個平台</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {PLATFORMS.map((p) => {
                const selected = selectedRadarIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleRadarPlatform(p.id)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selected
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60'
                        : 'bg-[#081221] text-slate-400 border-[#1B3554] hover:text-slate-200'
                    }`}
                  >
                    {p.name.replace(' LearnMode', '').replace('教育平台', '')}
                  </button>
                );
              })}
            </div>
          </div>

          <RadarSevenAxisChart platforms={radarPlatforms} />
        </section>

        {/* Right: Evidence Audit Inspector (PDF Page 5: 資料來源 / 觀察日期 / 信心等級) */}
        <section className="lg:col-span-7 bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B3554] pb-3 mb-4">
              <div>
                <div className="text-xs text-cyan-400 font-medium">
                  指標證據稽核記錄（點擊下方矩陣單元格切換）
                </div>
                <h2 className="mt-0.5 text-base font-semibold text-slate-100">
                  {activePlatform.name} — {activeIndicator.code} {activeIndicator.name}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-semibold text-cyan-300 tabular-nums">
                  {activeEvidence.score.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                </div>
              </div>
            </div>

            {/* Platform Profile Metadata (Unboxed text with separators) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-4">
              <span className="text-slate-200 font-medium">{activePlatform.tier}</span>
              <span aria-hidden="true">·</span>
              <span>{activePlatform.regionLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activePlatform.primarySegment}</span>
              <span aria-hidden="true">·</span>
              <span>採購模式：{activePlatform.procurementModel}</span>
            </div>

            {/* Evidence Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 border-y border-[#1B3554] text-xs mb-4">
              <div>
                <span className="text-slate-400 block">指標構面歸屬</span>
                <span className="mt-1 block text-slate-200 font-medium">{activeIndicator.dimension}</span>
              </div>
              <div>
                <span className="text-slate-400 block">觀察日期</span>
                <span className="mt-1 block font-mono text-slate-200 tabular-nums">{activeEvidence.observedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">評估信心等級</span>
                <span
                  className={`mt-1 block font-medium ${
                    activeEvidence.confidence === '高'
                      ? 'text-emerald-400'
                      : activeEvidence.confidence === '中'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                  }`}
                >
                  {activeEvidence.confidence}信心等級
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">佐證資料來源</span>
                <p className="text-slate-100 font-medium">{activeEvidence.source}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">評估基準與研究觀察</span>
                <p className="text-slate-300 leading-relaxed">{activeEvidence.note}</p>
              </div>
            </div>
          </div>

          {/* Analyst Supplemental Note (persisted locally) */}
          <form onSubmit={handleSaveNote} className="mt-5 pt-4 border-t border-[#1B3554]">
            <label htmlFor="analyst-note" className="block text-xs text-slate-400 mb-1.5">
              研究員補充觀察紀錄（自動儲存至本機工作區）
            </label>
            <div className="flex gap-2">
              <input
                id="analyst-note"
                type="text"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="輸入補充實測觀察、採購門檻或更新連結..."
                className="flex-1 min-w-0 px-3 py-2 text-xs bg-[#081221] border border-[#1B3554] rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#163254] text-cyan-300 border border-cyan-400/40 rounded hover:bg-[#1C406B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                儲存紀錄
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* High-Density Sortable Matrix Table */}
      <section className="bg-[#0D1C31] border border-[#1B3554] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">全平台七大指標評估總表</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              可依「四大分析構面」過濾欄位，或點擊任一分數檢視詳細佐證資料
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', '市場競爭', '使用者需求', '服務生態系'] as const).map((dim) => (
              <button
                key={dim}
                type="button"
                onClick={() => setDimensionFilter(dim)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dimensionFilter === dim
                    ? 'bg-[#163254] text-cyan-300 border-cyan-400/50'
                    : 'bg-[#081221] text-slate-400 border-[#1B3554] hover:text-slate-200'
                }`}
              >
                {dim === 'all' ? '全部構面指標 (7)' : dim}
              </button>
            ))}
          </div>
        </div>

        {filteredPlatforms.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[#1B3554] rounded-md">
            <p className="text-sm text-slate-300">沒有符合搜尋或競爭層級篩選條件的平台樣本</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTierFilter('all');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 rounded hover:bg-cyan-500/25 cursor-pointer"
            >
              重設篩選條件
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1B3554] text-xs text-slate-400">
                  <th className="py-2.5 pr-4 font-medium">平台名稱 / 定位</th>
                  <th className="py-2.5 px-3 font-medium">競爭層級</th>
                  <th className="py-2.5 px-3 font-medium">當前演進階段</th>
                  {visibleIndicators.map((ind) => (
                    <th key={ind.id} className="py-2.5 px-2 font-medium text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (sortBy === ind.id) setSortDesc(!sortDesc);
                          else {
                            setSortBy(ind.id);
                            setSortDesc(true);
                          }
                        }}
                        className="inline-flex items-center gap-1 hover:text-cyan-300 cursor-pointer"
                      >
                        <span>{ind.code} {ind.shortName}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  ))}
                  <th className="py-2.5 pl-3 font-medium text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (sortBy === 'avg') setSortDesc(!sortDesc);
                        else {
                          setSortBy('avg');
                          setSortDesc(true);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 cursor-pointer"
                    >
                      <span>綜合均分</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B3554]/60 text-xs">
                {filteredPlatforms.map((p) => {
                  const avg = computeAverage(p);
                  return (
                    <tr key={p.id} className="hover:bg-[#122642]/50 transition-colors h-11">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <div className="font-medium text-slate-100">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.regionLabel}</div>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-300">{p.tier}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-400">{p.stageLabel}</td>
                      {visibleIndicators.map((ind) => {
                        const ev = p.indicators[ind.id];
                        const isSelected = activePlatform.id === p.id && activeIndicator.id === ind.id;
                        return (
                          <td key={ind.id} className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setActivePlatformId(p.id);
                                setActiveIndicatorId(ind.id);
                              }}
                              className={`px-2 py-1 rounded font-mono tabular-nums transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500 text-[#081221] font-semibold'
                                  : ev.score >= 4.5
                                    ? 'text-cyan-300 hover:bg-[#163254]'
                                    : 'text-slate-300 hover:bg-[#163254]'
                              }`}
                            >
                              {ev.score.toFixed(1)}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-2 pl-3 text-right font-mono font-semibold text-slate-100 tabular-nums">
                        {avg.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
