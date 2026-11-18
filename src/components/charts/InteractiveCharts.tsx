import React, { useState } from 'react';
import {
  DemandRankItem,
  ForecastMonthPoint,
  KEY_INDICATORS,
  KOL_LINKS,
  KOL_NODES,
  KolNode,
  MonthlyVolumePoint,
  PlatformProfile,
  ResearchTrackId,
} from '../../data/edtechResearchData';

// 1. 聲量趨勢 (Volume Trend)
export const VolumeTrendChart: React.FC<{
  data: MonthlyVolumePoint[];
  activeTrack: ResearchTrackId;
}> = ({ data, activeTrack }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const w = 640;
  const h = 240;
  const pad = { top: 20, right: 20, bottom: 32, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const seriesMeta = [
    { key: 'edtech' as const, id: 'edtech' as const, label: '教育新創平台', color: '#38BDF8' },
    { key: 'aiTutor' as const, id: 'ai-tutor' as const, label: 'AI Tutor', color: '#22D3EE' },
    { key: 'multiAgent' as const, id: 'multi-agent' as const, label: 'Multi-Agent', color: '#818CF8' },
    { key: 'eduAiMarket' as const, id: 'edu-ai-market' as const, label: '教育 AI 市場', color: '#34D399' },
  ];

  const maxVal = 6500;
  const xAt = (i: number) => pad.left + (i / (data.length - 1)) * plotW;
  const yAt = (v: number) => pad.top + plotH - (v / maxVal) * plotH;

  const yTicks = [0, 1500, 3000, 4500, 6000];

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-slate-400">
        {seriesMeta.map((s) => {
          const dimmed = activeTrack !== 'all' && activeTrack !== s.id;
          return (
            <div key={s.key} className={`flex items-center gap-1.5 transition-opacity ${dimmed ? 'opacity-30' : 'opacity-100'}`}>
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {yTicks.map((tick) => {
          const y = yAt(tick);
          return (
            <g key={tick}>
              <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} stroke="#1B3554" strokeDasharray="3 3" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono tabular-nums">
                {tick.toLocaleString()}
              </text>
            </g>
          );
        })}

        {data.map((pt, i) => (
          <text
            key={pt.month}
            x={xAt(i)}
            y={h - 8}
            textAnchor="middle"
            className={`text-[10px] font-mono tabular-nums ${i % 2 === 0 || hoverIdx === i ? 'fill-slate-400' : 'fill-transparent sm:fill-slate-600'}`}
          >
            {pt.month.slice(2)}
          </text>
        ))}

        {seriesMeta.map((s) => {
          const dimmed = activeTrack !== 'all' && activeTrack !== s.id;
          const pts = data.map((d, i) => `${xAt(i)},${yAt(d[s.key])}`).join(' ');
          const areaPts = `${xAt(0)},${yAt(0)} ${pts} ${xAt(data.length - 1)},${yAt(0)}`;
          return (
            <g key={s.key} className={`transition-opacity duration-200 ${dimmed ? 'opacity-20' : 'opacity-100'}`}>
              {!dimmed && activeTrack === s.id && (
                <polygon points={areaPts} fill={s.color} fillOpacity={0.12} />
              )}
              <polyline fill="none" stroke={s.color} strokeWidth={activeTrack === s.id ? 2.5 : 1.8} points={pts} />
              {hoverIdx !== null && (
                <circle
                  cx={xAt(hoverIdx)}
                  cy={yAt(data[hoverIdx][s.key])}
                  r={4}
                  fill="#081221"
                  stroke={s.color}
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}

        {hoverIdx !== null && (
          <line
            x1={xAt(hoverIdx)}
            x2={xAt(hoverIdx)}
            y1={pad.top}
            y2={pad.top + plotH}
            stroke="#22D3EE"
            strokeOpacity={0.45}
            strokeDasharray="3 3"
          />
        )}

        {/* Invisible hover columns */}
        {data.map((pt, i) => {
          const colW = plotW / data.length;
          return (
            <rect
              key={pt.month}
              x={xAt(i) - colW / 2}
              y={pad.top}
              width={colW}
              height={plotH}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          );
        })}
      </svg>

      {hoverIdx !== null && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#081221] border border-[#1B3554] rounded text-xs">
          <span className="font-mono text-cyan-300 tabular-nums">{data[hoverIdx].month} 聲量指數</span>
          <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
            <span className="text-sky-300">教育平台: {data[hoverIdx].edtech.toLocaleString()}</span>
            <span className="text-cyan-300">AI Tutor: {data[hoverIdx].aiTutor.toLocaleString()}</span>
            <span className="text-indigo-300">Multi-Agent: {data[hoverIdx].multiAgent.toLocaleString()}</span>
            <span className="text-emerald-300">教育 AI 市場: {data[hoverIdx].eduAiMarket.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. 競爭力矩陣 (Competitiveness Matrix Heatmap)
export const CompetitivenessMatrixChart: React.FC<{
  platforms: PlatformProfile[];
  onSelectEvidence: (platformId: string, indicatorId: string) => void;
}> = ({ platforms, onSelectEvidence }) => {
  const getCellStyle = (score: number) => {
    if (score >= 4.5) return 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40';
    if (score >= 4.0) return 'bg-sky-500/20 text-sky-200 border-sky-400/30';
    if (score >= 3.5) return 'bg-slate-700/45 text-slate-200 border-slate-600/40';
    return 'bg-amber-500/15 text-amber-200 border-amber-400/30';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1B3554] text-[11px] text-slate-400">
            <th className="py-2 pr-3 font-medium whitespace-nowrap">平台樣本</th>
            {KEY_INDICATORS.map((ind) => (
              <th key={ind.id} className="py-2 px-1.5 font-medium text-center whitespace-nowrap" title={ind.name}>
                {ind.code} {ind.shortName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1B3554]/60 text-xs">
          {platforms.map((p) => (
            <tr key={p.id} className="hover:bg-[#122642]/50 transition-colors">
              <td className="py-2 pr-3 font-medium text-slate-200 whitespace-nowrap">
                {p.name}
                <span className="ml-1.5 text-[10px] text-slate-500 font-normal">
                  {p.region === 'tw' ? 'TW' : 'GL'}
                </span>
              </td>
              {KEY_INDICATORS.map((ind) => {
                const ev = p.indicators[ind.id];
                return (
                  <td key={ind.id} className="py-1.5 px-1 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectEvidence(p.id, ind.id)}
                      title={`${p.name} · ${ind.name} (${ev.score}/5.0) — 點擊檢視資料來源與信心等級`}
                      className={`w-full min-w-[42px] py-1 rounded border font-mono text-[11px] tabular-nums transition-transform hover:scale-105 cursor-pointer ${getCellStyle(ev.score)}`}
                    >
                      {ev.score.toFixed(1)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>點擊任一指標分數可檢視資料來源、觀察日期與信心等級</span>
        <span className="font-mono">量表 1.0 – 5.0</span>
      </div>
    </div>
  );
};

// 3. 競爭風暴 (Competitive Storm — Growth Momentum vs Volatility)
export const CompetitiveStormChart: React.FC<{
  platforms: PlatformProfile[];
  onSelectPlatform?: (platform: PlatformProfile) => void;
}> = ({ platforms, onSelectPlatform }) => {
  const [hovered, setHovered] = useState<PlatformProfile | null>(null);
  const w = 520;
  const h = 250;
  const pad = { top: 20, right: 24, bottom: 34, left: 46 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xAt = (vol: number) => pad.left + ((vol - 20) / 60) * plotW;
  const yAt = (growth: number) => pad.top + plotH - ((growth - 5) / 35) * plotH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {/* Storm zones */}
        <rect
          x={xAt(48)}
          y={pad.top}
          width={w - pad.right - xAt(48)}
          height={yAt(22) - pad.top}
          fill="#22D3EE"
          fillOpacity={0.05}
        />
        <text x={w - pad.right - 6} y={pad.top + 14} textAnchor="end" className="fill-cyan-400/70 text-[10px]">
          高成長 × 高波動風暴區
        </text>

        {[10, 20, 30].map((g) => (
          <g key={g}>
            <line x1={pad.left} x2={w - pad.right} y1={yAt(g)} y2={yAt(g)} stroke="#1B3554" strokeDasharray="3 3" />
            <text x={pad.left - 8} y={yAt(g) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono tabular-nums">
              +{g}%
            </text>
          </g>
        ))}

        {[30, 45, 60, 75].map((v) => (
          <g key={v}>
            <line x1={xAt(v)} x2={xAt(v)} y1={pad.top} y2={pad.top + plotH} stroke="#1B3554" strokeDasharray="3 3" />
            <text x={xAt(v)} y={h - 10} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono tabular-nums">
              {v}
            </text>
          </g>
        ))}

        <text x={w / 2} y={h - 0} textAnchor="middle" className="fill-slate-500 text-[10px]">
          輿情波動與競爭強度指數
        </text>

        {platforms.map((p) => {
          const cx = xAt(p.volatilityIndex);
          const cy = yAt(p.monthlyGrowthSignal);
          const r = Math.max(7, Math.sqrt(p.discussionVolume) * 0.3);
          const isTw = p.region === 'tw';
          const color = isTw ? '#22D3EE' : '#818CF8';
          const isActive = hovered?.id === p.id;
          return (
            <g
              key={p.id}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelectPlatform?.(p)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                fillOpacity={isActive ? 0.45 : 0.25}
                stroke={color}
                strokeWidth={isActive ? 2 : 1.2}
              />
              <text
                x={cx}
                y={cy - r - 4}
                textAnchor="middle"
                className="fill-slate-200 text-[10px] font-medium pointer-events-none"
              >
                {p.name.replace(' LearnMode', '').replace('教育平台', '')}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/50 border border-cyan-400" /> 台灣樣本
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/50 border border-indigo-400" /> 國際標竿
          </span>
        </div>
        {hovered ? (
          <span className="font-mono text-cyan-300 tabular-nums">
            {hovered.name} · 成長 +{hovered.monthlyGrowthSignal}% · 聲量 {hovered.discussionVolume.toLocaleString()}
          </span>
        ) : (
          <span className="text-slate-500">氣泡面積代表月均聲量規模</span>
        )}
      </div>
    </div>
  );
};

// 4. 情緒分析 (Sentiment Analysis)
export const SentimentAnalysisChart: React.FC<{
  platforms: PlatformProfile[];
}> = ({ platforms }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400" /> 正面肯定
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-600" /> 中立討論
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500/80" /> 負面疑慮
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">佔比 %</span>
      </div>
      {platforms.map((p) => (
        <div key={p.id} className="group">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-200 font-medium">{p.name}</span>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              正 {p.sentiment.positive}% / 中 {p.sentiment.neutral}% / 負 {p.sentiment.negative}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-xs overflow-hidden flex bg-[#081221]">
            <div
              className="bg-cyan-400 transition-all duration-300"
              style={{ width: `${p.sentiment.positive}%` }}
              title={`正面: ${p.sentiment.positive}%`}
            />
            <div
              className="bg-slate-600 transition-all duration-300"
              style={{ width: `${p.sentiment.neutral}%` }}
              title={`中立: ${p.sentiment.neutral}%`}
            />
            <div
              className="bg-rose-500/85 transition-all duration-300"
              style={{ width: `${p.sentiment.negative}%` }}
              title={`負面: ${p.sentiment.negative}%`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// 5. 需求排行 (Demand Ranking)
export const DemandRankingChart: React.FC<{
  items: DemandRankItem[];
}> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="group">
          <div className="flex items-baseline justify-between gap-2 text-xs mb-1">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="font-mono text-cyan-400 text-[11px] tabular-nums shrink-0">
                0{idx + 1}
              </span>
              <span className="text-slate-200 font-medium truncate">{item.need}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
              <span className="text-slate-400">{item.stakeholder}</span>
              <span className="text-emerald-400">{item.urgencyDelta}</span>
              <span className="text-slate-100 font-semibold w-7 text-right">{item.demandScore}</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-[#081221] rounded-xs overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-xs transition-all duration-300"
              style={{ width: `${item.demandScore}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-snug">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

// 6. KOL 網絡 (KOL Network)
export const KolNetworkChart: React.FC<{
  activeTrack: ResearchTrackId;
}> = ({ activeTrack }) => {
  const [selectedKol, setSelectedKol] = useState<KolNode>(KOL_NODES[1]);
  const w = 480;
  const h = 230;

  const clusterColors: Record<KolNode['cluster'], string> = {
    '政策與公部門': '#38BDF8',
    '現場教師社群': '#22D3EE',
    '技術與 AI 研究': '#818CF8',
    '親子與產業評論': '#34D399',
  };

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto bg-[#081221]/70 rounded border border-[#1B3554]/80">
        {KOL_LINKS.map((link, idx) => {
          const src = KOL_NODES.find((n) => n.id === link.source)!;
          const tgt = KOL_NODES.find((n) => n.id === link.target)!;
          const isHighlighted = selectedKol.id === src.id || selectedKol.id === tgt.id;
          return (
            <line
              key={idx}
              x1={(src.x / 100) * w}
              y1={(src.y / 100) * h}
              x2={(tgt.x / 100) * w}
              y2={(tgt.y / 100) * h}
              stroke={isHighlighted ? '#22D3EE' : '#1E3A5F'}
              strokeWidth={isHighlighted ? link.strength * 0.9 : 1}
              strokeOpacity={isHighlighted ? 0.85 : 0.65}
            />
          );
        })}

        {KOL_NODES.map((node) => {
          const cx = (node.x / 100) * w;
          const cy = (node.y / 100) * h;
          const r = 6 + (node.influence / 100) * 10;
          const color = clusterColors[node.cluster];
          const isSelected = selectedKol.id === node.id;
          const dimmed = activeTrack !== 'all' && node.track !== activeTrack;

          return (
            <g
              key={node.id}
              className={`cursor-pointer transition-opacity ${dimmed ? 'opacity-30' : 'opacity-100'}`}
              onClick={() => setSelectedKol(node)}
            >
              {isSelected && (
                <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="3 2" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="#0D1C31"
                stroke={color}
                strokeWidth={isSelected ? 2.5 : 1.6}
              />
              <text
                x={cx}
                y={cy + r + 12}
                textAnchor="middle"
                className={`text-[10px] font-medium ${isSelected ? 'fill-cyan-300' : 'fill-slate-300'}`}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-[#081221] border border-[#1B3554] rounded text-xs">
        <div>
          <span className="font-medium text-cyan-300">{selectedKol.name}</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-slate-400">{selectedKol.cluster}</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-slate-300">{selectedKol.primaryTopic}</span>
        </div>
        <span className="font-mono text-slate-300 tabular-nums shrink-0">
          影響力指數 {selectedKol.influence}
        </span>
      </div>
    </div>
  );
};

// 7. 定位散布 (Positioning Scatter — Content vs Agentic, B2C vs B2B2School)
export const PositioningScatterChart: React.FC<{
  platforms: PlatformProfile[];
  onSelectPlatform?: (platform: PlatformProfile) => void;
}> = ({ platforms, onSelectPlatform }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const w = 520;
  const h = 250;
  const pad = { top: 20, right: 24, bottom: 32, left: 42 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xAt = (v: number) => pad.left + (v / 100) * plotW;
  const yAt = (v: number) => pad.top + plotH - (v / 100) * plotH;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {/* Quadrant Dividers */}
        <line x1={xAt(50)} x2={xAt(50)} y1={pad.top} y2={pad.top + plotH} stroke="#1E3A5F" strokeDasharray="4 4" />
        <line x1={pad.left} x2={w - pad.right} y1={yAt(50)} y2={yAt(50)} stroke="#1E3A5F" strokeDasharray="4 4" />

        {/* Quadrant Labels */}
        <text x={pad.left + 6} y={pad.top + 13} className="fill-slate-500 text-[10px]">
          校務內容整合區
        </text>
        <text x={w - pad.right - 6} y={pad.top + 13} textAnchor="end" className="fill-cyan-400/80 text-[10px]">
          Multi-Agent 校園生態區
        </text>
        <text x={pad.left + 6} y={pad.top + plotH - 6} className="fill-slate-500 text-[10px]">
          B2C 題庫與工具區
        </text>
        <text x={w - pad.right - 6} y={pad.top + plotH - 6} textAnchor="end" className="fill-slate-400 text-[10px]">
          B2C AI Tutor 消費區
        </text>

        <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="none" stroke="#1B3554" />

        {platforms.map((p) => {
          const cx = xAt(p.positioning.agenticIndex);
          const cy = yAt(p.positioning.institutionalIndex);
          const isTw = p.region === 'tw';
          const color = isTw ? '#22D3EE' : '#38BDF8';
          const isHover = hoveredId === p.id;
          return (
            <g
              key={p.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectPlatform?.(p)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHover ? 7 : 5.5}
                fill={isTw ? '#22D3EE' : '#081221'}
                stroke={color}
                strokeWidth={2}
              />
              <text
                x={cx + 8}
                y={cy + 3}
                className={`text-[10px] ${isHover ? 'fill-cyan-300 font-semibold' : 'fill-slate-300'}`}
              >
                {p.name.replace(' LearnMode', '').replace('教育平台', '')}
              </text>
            </g>
          );
        })}

        <text x={w / 2} y={h - 4} textAnchor="middle" className="fill-slate-500 text-[10px]">
          數位內容導向 ──────────→ AI Agentic 協作深度
        </text>
      </svg>
    </div>
  );
};

// 8. AI 搜尋能見度 (AI Search Visibility / GEO Citation Share)
export const AiSearchVisibilityChart: React.FC<{
  platforms: PlatformProfile[];
}> = ({ platforms }) => {
  const sorted = [...platforms].sort((a, b) => b.aiSearchVisibility - a.aiSearchVisibility);
  return (
    <div className="space-y-2.5">
      {sorted.map((p) => (
        <div key={p.id}>
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-medium">{p.name}</span>
              <span className="text-[11px] text-slate-500">{p.regionLabel}</span>
            </div>
            <span className="font-mono text-cyan-300 tabular-nums text-xs">{p.aiSearchVisibility}%</span>
          </div>
          <div className="h-2 w-full bg-[#081221] rounded-xs overflow-hidden">
            <div
              className={`h-full rounded-xs transition-all duration-300 ${
                p.region === 'tw' ? 'bg-cyan-400' : 'bg-sky-500/80'
              }`}
              style={{ width: `${p.aiSearchVisibility}%` }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-slate-500">
        衡量各平台在生成式 AI 搜尋與課程推薦場景中之引用能見度指數（0–100%）。
      </p>
    </div>
  );
};

// 7-Axis Competitiveness Radar Chart (for up to 3 platforms)
export const RadarSevenAxisChart: React.FC<{
  platforms: PlatformProfile[];
}> = ({ platforms }) => {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 112;
  const axes = KEY_INDICATORS;
  const palette = ['#22D3EE', '#818CF8', '#34D399'];

  const pointAt = (axisIdx: number, score: number) => {
    const angle = (Math.PI * 2 * axisIdx) / axes.length - Math.PI / 2;
    const r = (score / 5) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] h-auto overflow-visible">
        {[1, 2, 3, 4, 5].map((level) => {
          const pts = axes
            .map((_, idx) => {
              const p = pointAt(idx, level);
              return `${p.x},${p.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="#1B3554"
              strokeWidth={level === 5 ? 1.2 : 0.8}
            />
          );
        })}

        {axes.map((ind, idx) => {
          const outer = pointAt(idx, 5);
          const labelPos = pointAt(idx, 5.85);
          return (
            <g key={ind.id}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#1B3554" strokeWidth={0.9} />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-300 text-[10px] font-medium"
              >
                {ind.code} {ind.shortName}
              </text>
            </g>
          );
        })}

        {platforms.map((platform, pIdx) => {
          const color = palette[pIdx % palette.length];
          const pts = axes
            .map((ind, idx) => {
              const pt = pointAt(idx, platform.indicators[ind.id].score);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');
          return (
            <g key={platform.id}>
              <polygon points={pts} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2} />
              {axes.map((ind, idx) => {
                const pt = pointAt(idx, platform.indicators[ind.id].score);
                return <circle key={ind.id} cx={pt.x} cy={pt.y} r={3} fill={color} />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
        {platforms.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: palette[idx % palette.length] }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Predictive Trend Forecast Chart (2025.11–2026.10 Observed -> 2026.11–2027.10 Forecast)
export const TrendForecastChart: React.FC<{
  data: ForecastMonthPoint[];
  visibleStages: Record<string, boolean>;
}> = ({ data, visibleStages }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const w = 880;
  const h = 340;
  const pad = { top: 26, right: 24, bottom: 38, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xAt = (i: number) => pad.left + (i / (data.length - 1)) * plotW;
  const yAt = (val: number) => pad.top + plotH - (val / 100) * plotH;

  const splitIndex = data.findIndex((d) => d.isForecast); // index 12 (2026.11)

  const series = [
    { key: 'contentPlatform' as const, id: 'content', label: '內容與課程平台', color: '#64748B' },
    { key: 'adaptiveAssessment' as const, id: 'adaptive', label: '評量與適性學習', color: '#0EA5E9' },
    { key: 'aiTutorLoop' as const, id: 'ai-tutor', label: 'AI Tutor 個人化助教', color: '#22D3EE' },
    { key: 'teacherWorkflow' as const, id: 'workflow', label: '教師工作流與校務整合', color: '#38BDF8' },
    { key: 'multiAgentEcosystem' as const, id: 'multi-agent', label: 'Agentic AI ／ Multi-Agent', color: '#34D399' },
  ];

  // Build confidence polygon for AI Tutor & Multi-Agent in forecast region
  const forecastSlice = data.slice(splitIndex - 1);
  const buildBandPolygon = (upperKey: 'aiTutorUpper' | 'multiAgentUpper', lowerKey: 'aiTutorLower' | 'multiAgentLower') => {
    const upperPts = forecastSlice.map((d, idx) => `${xAt(splitIndex - 1 + idx)},${yAt(d[upperKey])}`);
    const lowerPts = [...forecastSlice]
      .reverse()
      .map((d, idx) => `${xAt(data.length - 1 - idx)},${yAt(d[lowerKey])}`);
    return [...upperPts, ...lowerPts].join(' ');
  };

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {/* Forecast shaded backdrop */}
        <rect
          x={xAt(splitIndex - 0.5)}
          y={pad.top}
          width={w - pad.right - xAt(splitIndex - 0.5)}
          height={plotH}
          fill="#22D3EE"
          fillOpacity={0.04}
        />

        {/* Divider line between Observed & Forecast */}
        <line
          x1={xAt(splitIndex - 0.5)}
          x2={xAt(splitIndex - 0.5)}
          y1={pad.top}
          y2={pad.top + plotH}
          stroke="#22D3EE"
          strokeOpacity={0.5}
          strokeDasharray="4 4"
        />
        <text x={xAt(splitIndex - 0.5) - 8} y={pad.top + 14} textAnchor="end" className="fill-slate-400 text-[10px]">
          實測觀察期 (2025.11–2026.10)
        </text>
        <text x={xAt(splitIndex - 0.5) + 8} y={pad.top + 14} textAnchor="start" className="fill-cyan-300 text-[10px]">
          模型預測期 (2026.11–2027.10)
        </text>

        {/* Y gridlines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={pad.left} x2={w - pad.right} y1={yAt(v)} y2={yAt(v)} stroke="#1B3554" strokeDasharray="3 3" />
            <text x={pad.left - 8} y={yAt(v) + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono tabular-nums">
              {v}%
            </text>
          </g>
        ))}

        {/* X axis ticks */}
        {data.map((pt, i) => (
          <text
            key={pt.month}
            x={xAt(i)}
            y={h - 10}
            textAnchor="middle"
            className={`text-[10px] font-mono tabular-nums ${
              i % 3 === 0 || hoverIdx === i ? (pt.isForecast ? 'fill-cyan-400' : 'fill-slate-400') : 'fill-transparent'
            }`}
          >
            {pt.month.slice(2)}
          </text>
        ))}

        {/* Confidence Bands */}
        {visibleStages['ai-tutor'] && (
          <polygon points={buildBandPolygon('aiTutorUpper', 'aiTutorLower')} fill="#22D3EE" fillOpacity={0.11} />
        )}
        {visibleStages['multi-agent'] && (
          <polygon points={buildBandPolygon('multiAgentUpper', 'multiAgentLower')} fill="#34D399" fillOpacity={0.11} />
        )}

        {/* Historical solid + Forecast dashed */}
        {series.map((s) => {
          if (!visibleStages[s.id]) return null;
          const histPts = data
            .slice(0, splitIndex)
            .map((d, i) => `${xAt(i)},${yAt(d[s.key])}`)
            .join(' ');
          const predPts = data
            .slice(splitIndex - 1)
            .map((d, idx) => `${xAt(splitIndex - 1 + idx)},${yAt(d[s.key])}`)
            .join(' ');
          return (
            <g key={s.key}>
              <polyline fill="none" stroke={s.color} strokeWidth={2.2} points={histPts} />
              <polyline fill="none" stroke={s.color} strokeWidth={2.2} strokeDasharray="5 4" points={predPts} />
              {hoverIdx !== null && (
                <circle
                  cx={xAt(hoverIdx)}
                  cy={yAt(data[hoverIdx][s.key])}
                  r={4}
                  fill="#081221"
                  stroke={s.color}
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}

        {hoverIdx !== null && (
          <line
            x1={xAt(hoverIdx)}
            x2={xAt(hoverIdx)}
            y1={pad.top}
            y2={pad.top + plotH}
            stroke="#38BDF8"
            strokeOpacity={0.4}
          />
        )}

        {data.map((pt, i) => {
          const colW = plotW / data.length;
          return (
            <rect
              key={pt.month}
              x={xAt(i) - colW / 2}
              y={pad.top}
              width={colW}
              height={plotH}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          );
        })}
      </svg>

      {/* Live readout strip */}
      <div className="mt-2 px-3 py-2 bg-[#081221] border border-[#1B3554] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
        {hoverIdx !== null ? (
          <>
            <span className="font-mono text-cyan-300 tabular-nums">
              {data[hoverIdx].month} · {data[hoverIdx].isForecast ? '預測值 (含 95% 信賴區間)' : '歷史觀測值'}
            </span>
            <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
              {series.map((s) =>
                visibleStages[s.id] ? (
                  <span key={s.id} style={{ color: s.color }}>
                    {s.label}: {data[hoverIdx][s.key]}%
                  </span>
                ) : null
              )}
            </div>
          </>
        ) : (
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-slate-400">
            <span>實線為 EAAF 實測期間（2025.11–2026.10），虛線與陰影帶為未來 12 個月趨勢預測與信賴區間</span>
            <span className="font-mono text-slate-500">移動游標檢視各月採用率</span>
          </div>
        )}
      </div>
    </div>
  );
};
