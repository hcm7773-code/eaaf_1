export type ResearchTrackId = 'all' | 'edtech' | 'ai-tutor' | 'multi-agent' | 'edu-ai-market';
export type RegionFilter = 'all' | 'tw' | 'global';
export type ConfidenceLevel = '高' | '中' | '低';
export type CompetitionTier = '直接競爭' | '間接競爭' | '標竿參照';

export interface ResearchTrack {
  id: Exclude<ResearchTrackId, 'all'>;
  name: string;
  shortName: string;
  color: string;
  description: string;
}

export const RESEARCH_TRACKS: ResearchTrack[] = [
  {
    id: 'edtech',
    name: '教育新創平台',
    shortName: '教育平台',
    color: '#38BDF8',
    description: '數位內容平台轉型適性學習與校務採購動態追蹤',
  },
  {
    id: 'ai-tutor',
    name: 'AI Tutor',
    shortName: 'AI Tutor',
    color: '#22D3EE',
    description: '評量、診斷、推薦、引導至教師覆核之個人化學習循環',
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent',
    shortName: 'Multi-Agent',
    color: '#818CF8',
    description: '教學、診斷、評量與教師支援多代理人協作與 Orchestrator',
  },
  {
    id: 'edu-ai-market',
    name: '教育 AI 市場',
    shortName: '教育 AI 市場',
    color: '#34D399',
    description: '政策法規、校園數位採購預算、隱私治理與商業化訊號',
  },
];

export const EVOLUTION_STAGES = [
  {
    id: 'content',
    order: 1,
    name: '內容與課程平台',
    shortName: '內容與課程',
    color: '#64748B',
    description: '以線上課程、數位教材與開放題庫為核心供給',
  },
  {
    id: 'adaptive',
    order: 2,
    name: '評量與適性學習',
    shortName: '評量與適性',
    color: '#0EA5E9',
    description: '導入知識點診斷與基本學習路徑推薦機制',
  },
  {
    id: 'ai-tutor',
    order: 3,
    name: 'AI Tutor 個人化助教',
    shortName: 'AI Tutor',
    color: '#22D3EE',
    description: '從即時問答演化為「評量→診斷→推薦→引導→覆核」學習循環',
  },
  {
    id: 'workflow',
    order: 4,
    name: '教師工作流與校務整合',
    shortName: '教師與校務',
    color: '#38BDF8',
    description: '整合備課、出題、批改、班級摘要與校務 LMS 系統',
  },
  {
    id: 'multi-agent',
    order: 5,
    name: 'Agentic AI ／ Multi-Agent',
    shortName: 'Multi-Agent',
    color: '#34D399',
    description: 'Orchestrator 協調多角色代理分工並保留人類教師監督',
  },
];

export interface KeyIndicatorDef {
  id: string;
  code: string;
  name: string;
  shortName: string;
  dimension: '市場競爭' | '社群輿情' | '使用者需求' | '服務生態系';
  description: string;
}

export const KEY_INDICATORS: KeyIndicatorDef[] = [
  {
    id: 'outcome',
    code: '01',
    name: '學習成效與評量',
    shortName: '學習成效',
    dimension: '使用者需求',
    description: '能否量化前後測進步幅度、弱點收斂速度與素養評量效度',
  },
  {
    id: 'personalization',
    code: '02',
    name: '個人化程度與學習分析',
    shortName: '個人化分析',
    dimension: '使用者需求',
    description: '依據學習者程度動態調整難度與學習路徑的精準度',
  },
  {
    id: 'agent',
    code: '03',
    name: 'AI Tutor ／ Agent 能力',
    shortName: 'AI Agent 能力',
    dimension: '服務生態系',
    description: '蘇格拉底式引導、多步驟解題診斷與多代理協作成熟度',
  },
  {
    id: 'teacher',
    code: '04',
    name: '教師可控性與工作流',
    shortName: '教師可控性',
    dimension: '使用者需求',
    description: '教師覆核權限、派題調度、班級學習摘要與減負效率',
  },
  {
    id: 'content',
    code: '05',
    name: '課程、內容與知識庫整合',
    shortName: '課程知識庫',
    dimension: '市場競爭',
    description: '課綱對齊度、結構化知識圖譜與跨學科題庫豐富度',
  },
  {
    id: 'governance',
    code: '06',
    name: '資料治理、隱私與信任',
    shortName: '治理與信任',
    dimension: '服務生態系',
    description: '兒少資料保護、AI 幻覺防制、校方與家長信任度',
  },
  {
    id: 'interop',
    code: '07',
    name: '跨平台互通及校園採用',
    shortName: '互通與採用',
    dimension: '市場競爭',
    description: 'SSO / LTI 校務串接、政府教育雲整合與跨校滲透率',
  },
];

export interface IndicatorEvidence {
  score: number; // 1.0 - 5.0
  source: string;
  observedDate: string;
  confidence: ConfidenceLevel;
  note: string;
}

export interface PlatformProfile {
  id: string;
  name: string;
  region: 'tw' | 'global';
  regionLabel: string;
  tier: CompetitionTier;
  primarySegment: string;
  procurementModel: string;
  stageLabel: string;
  aiSearchVisibility: number; // %
  monthlyGrowthSignal: number; // %
  discussionVolume: number; // monthly mentions avg
  volatilityIndex: number; // 0-100 for Competitive Storm
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  positioning: {
    agenticIndex: number; // X-axis 0 (Content-centric) -> 100 (AI Agentic)
    institutionalIndex: number; // Y-axis 0 (B2C Consumer) -> 100 (B2B2School/Gov)
  };
  indicators: Record<string, IndicatorEvidence>;
}

export const PLATFORMS: PlatformProfile[] = [
  {
    id: 'junyi',
    name: '均一教育平台',
    region: 'tw',
    regionLabel: '台灣樣本',
    tier: '直接競爭',
    primarySegment: 'K-12 數理基礎與個人化數位學習',
    procurementModel: '公益免費 ＋ 縣市教育專案合作',
    stageLabel: 'AI Tutor 個人化助教',
    aiSearchVisibility: 68,
    monthlyGrowthSignal: 24.5,
    discussionVolume: 1840,
    volatilityIndex: 42,
    sentiment: { positive: 64, neutral: 27, negative: 9 },
    positioning: { agenticIndex: 66, institutionalIndex: 78 },
    indicators: {
      outcome: { score: 4.3, source: '均一年度影響力報告 / 縣市學力追蹤', observedDate: '2026-09-18', confidence: '高', note: 'K-12 數學與自然科前後測追蹤數據完整，診斷效度穩定。' },
      personalization: { score: 4.4, source: '星空知識圖譜與錯題推薦實測', observedDate: '2026-10-04', confidence: '高', note: '知識節點結構細緻，支援前置概念回溯補強。' },
      agent: { score: 4.1, source: 'Jutor / 生成式 AI 學習助教功能評測', observedDate: '2026-10-12', confidence: '高', note: '已整合引導式提問與英文寫作批改，朝多角色協作演進。' },
      teacher: { score: 4.5, source: '中小學教師工作坊訪談 (N=34)', observedDate: '2026-09-29', confidence: '高', note: '指派任務與班級弱點儀表板為台灣教師高頻使用核心。' },
      content: { score: 4.6, source: '108 課綱對應清冊盤點', observedDate: '2026-08-30', confidence: '高', note: '台灣 K-12 課綱覆蓋最齊全，整合多元外部教材。' },
      governance: { score: 4.7, source: '教育部資安規範與教育雲稽核紀錄', observedDate: '2026-09-10', confidence: '高', note: '非營利公益信任度高，具備嚴謹的未成年學習資料隔離。' },
      interop: { score: 4.4, source: '教育雲 OpenID 串接統計', observedDate: '2026-10-02', confidence: '高', note: '高度互通各縣市親師生平台與公開課堂架構。' },
    },
  },
  {
    id: 'pagamo',
    name: 'PaGamO',
    region: 'tw',
    regionLabel: '台灣樣本',
    tier: '直接競爭',
    primarySegment: '遊戲化素養學習與閱讀評量',
    procurementModel: 'B2B 學校訂閱 ＋ B2C 素養課程',
    stageLabel: '評量與適性學習',
    aiSearchVisibility: 54,
    monthlyGrowthSignal: 18.2,
    discussionVolume: 2120,
    volatilityIndex: 58,
    sentiment: { positive: 58, neutral: 29, negative: 13 },
    positioning: { agenticIndex: 48, institutionalIndex: 62 },
    indicators: {
      outcome: { score: 4.1, source: '素養品學堂閱讀能力追蹤資料', observedDate: '2026-09-14', confidence: '高', note: '閱讀素養任務完成率與答題留存表現突出。' },
      personalization: { score: 3.7, source: '適性出題模組產品拆解', observedDate: '2026-08-22', confidence: '中', note: '以遊戲關卡與任務驅動為主，細粒度知識診斷較弱。' },
      agent: { score: 3.4, source: '平台 AI 解析輔助功能觀察', observedDate: '2026-10-01', confidence: '中', note: '具備自動化解析輔助，尚未形成多代理即時對話引導。' },
      teacher: { score: 3.9, source: '電競與班級任務管理實測', observedDate: '2026-09-05', confidence: '高', note: '教師可快速發起班級競賽並檢視閱讀進度報表。' },
      content: { score: 4.3, source: '跨領域素養題庫統計', observedDate: '2026-08-19', confidence: '高', note: '涵蓋國語文素養、反毒與金融科普等高互動題材。' },
      governance: { score: 4.0, source: '隱私權條款與校園採購審查', observedDate: '2026-07-28', confidence: '中', note: '商業化訂閱模式需兼顧遊戲成癮防制與家長溝通。' },
      interop: { score: 3.8, source: '校園帳號登入機制檢核', observedDate: '2026-09-12', confidence: '高', note: '支援教育雲單一簽入，與校務系統深度資料回寫仍有限。' },
    },
  },
  {
    id: 'adl',
    name: '因材網',
    region: 'tw',
    regionLabel: '台灣樣本',
    tier: '直接競爭',
    primarySegment: '公部門知識結構診斷與自主學習',
    procurementModel: '政府公部門計畫全校免費導入',
    stageLabel: 'AI Tutor 個人化助教',
    aiSearchVisibility: 62,
    monthlyGrowthSignal: 27.8,
    discussionVolume: 1690,
    volatilityIndex: 36,
    sentiment: { positive: 61, neutral: 30, negative: 9 },
    positioning: { agenticIndex: 69, institutionalIndex: 94 },
    indicators: {
      outcome: { score: 4.5, source: '教育部學習扶助與學力檢測報告', observedDate: '2026-10-08', confidence: '高', note: '診斷測驗對齊學習扶助指標，補救教學成效顯著。' },
      personalization: { score: 4.6, source: '知識結構縱貫診斷演算法評估', observedDate: '2026-09-25', confidence: '高', note: '可精準定位跨年級知識斷點並自動派送微課程。' },
      agent: { score: 4.2, source: 'e 度 AI 學習夥伴應用實測', observedDate: '2026-10-15', confidence: '高', note: '導入蘇格拉底式提問機制，協助學生逐步拆解題意。' },
      teacher: { score: 4.4, source: '國小國中種子教師回饋', observedDate: '2026-09-20', confidence: '高', note: '班級診斷報表詳盡，惟介面學習曲線對新手教師略高。' },
      content: { score: 4.5, source: '國英數社自結構化知識節點清冊', observedDate: '2026-09-02', confidence: '高', note: '公版教材與微影片完整覆蓋國中小核心知識點。' },
      governance: { score: 4.8, source: '教育部資安與 AI 倫理指引驗證', observedDate: '2026-10-10', confidence: '高', note: '台灣公部門最高等級資料落地與隱私合規保障。' },
      interop: { score: 4.9, source: '全國縣市 OpenID 與生生用平板整合', observedDate: '2026-10-11', confidence: '高', note: '直接內嵌於全國校務行政與數位學習推動計畫。' },
    },
  },
  {
    id: 'learnmode',
    name: '學習吧 LearnMode',
    region: 'tw',
    regionLabel: '台灣樣本',
    tier: '間接競爭',
    primarySegment: '備課平台、語音 AI 辨識與教材整合',
    procurementModel: '免費平台 ＋ 出版社內容合作',
    stageLabel: '教師工作流與校務整合',
    aiSearchVisibility: 41,
    monthlyGrowthSignal: 14.6,
    discussionVolume: 980,
    volatilityIndex: 31,
    sentiment: { positive: 57, neutral: 34, negative: 9 },
    positioning: { agenticIndex: 52, institutionalIndex: 82 },
    indicators: {
      outcome: { score: 3.9, source: '英語與國語朗讀 AI 評測案例', observedDate: '2026-08-18', confidence: '中', note: '語音辨識對口說練習即時回饋助益明顯。' },
      personalization: { score: 3.6, source: '課程編輯與派題機制檢核', observedDate: '2026-08-29', confidence: '中', note: '偏重教師策展與分組派課，學生端動態適性較基礎。' },
      agent: { score: 3.7, source: 'AI 語音評分與備課摘要測試', observedDate: '2026-09-27', confidence: '中', note: '具備單點 AI 工具能力，多代理串接仍在早期階段。' },
      teacher: { score: 4.6, source: '現場教師備課效率調查', observedDate: '2026-09-30', confidence: '高', note: '出版社電子書與自編講義融合順暢，深受現場教師青睞。' },
      content: { score: 4.4, source: '康軒/南一/翰林合作書目統計', observedDate: '2026-09-01', confidence: '高', note: '三大教科書商內容深度整合，課堂即時可用性極高。' },
      governance: { score: 4.3, source: '教育雲合作隱私規範查核', observedDate: '2026-08-11', confidence: '高', note: '遵循校園帳號規範，資料透明度佳。' },
      interop: { score: 4.3, source: '教育雲與 Google Classroom 串接測試', observedDate: '2026-09-14', confidence: '高', note: '支援跨平台作業匯出與各縣市帳號互通。' },
    },
  },
  {
    id: 'uedu',
    name: 'Uedu',
    region: 'tw',
    regionLabel: '台灣樣本',
    tier: '間接競爭',
    primarySegment: '垂直學科評量與智慧學習輔助',
    procurementModel: 'B2B2C 補教機構 / 課程授權',
    stageLabel: '評量與適性學習',
    aiSearchVisibility: 29,
    monthlyGrowthSignal: 16.4,
    discussionVolume: 540,
    volatilityIndex: 47,
    sentiment: { positive: 53, neutral: 35, negative: 12 },
    positioning: { agenticIndex: 55, institutionalIndex: 51 },
    indicators: {
      outcome: { score: 3.8, source: '機構導入學習成效追蹤樣本', observedDate: '2026-08-15', confidence: '低', note: '垂直檢定與學科練習效率佳，公開長期追蹤樣本仍少。' },
      personalization: { score: 3.9, source: '弱點題型推播機制測試', observedDate: '2026-09-06', confidence: '中', note: '針對特定學科能力檢定具備有效路徑切入。' },
      agent: { score: 3.6, source: 'AI 解題助理互動深度評估', observedDate: '2026-09-22', confidence: '中', note: '聚焦解題提示與自動批改，適合垂直小規模驗證場景。' },
      teacher: { score: 3.8, source: '合作教師與助教訪談', observedDate: '2026-08-25', confidence: '中', note: '提供學員進度報表，跨班級校務整合仍在擴充。' },
      content: { score: 3.7, source: '學科與檢定題庫覆蓋盤點', observedDate: '2026-08-05', confidence: '中', note: '集中於高需求垂直領域，泛用課綱覆蓋不如大型平台。' },
      governance: { score: 3.8, source: '服務條款與資安聲明檢視', observedDate: '2026-07-19', confidence: '低', note: '商業營運合規基本完善，缺乏公部門級第三方稽核揭露。' },
      interop: { score: 3.4, source: 'API 與外部系統串接文件評估', observedDate: '2026-09-09', confidence: '中', note: '以獨立平台運作為主，校園端 LTI 串接深度有待加強。' },
    },
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    region: 'global',
    regionLabel: '國際標竿',
    tier: '標竿參照',
    primarySegment: '語言學習 × 遊戲化 × Duolingo Max AI',
    procurementModel: 'Freemium B2C 訂閱 ＋ DET 檢定',
    stageLabel: 'AI Tutor 個人化助教',
    aiSearchVisibility: 92,
    monthlyGrowthSignal: 31.4,
    discussionVolume: 4850,
    volatilityIndex: 64,
    sentiment: { positive: 71, neutral: 19, negative: 10 },
    positioning: { agenticIndex: 82, institutionalIndex: 18 },
    indicators: {
      outcome: { score: 4.5, source: 'DET 效度論文與 Birdbrain 模型報告', observedDate: '2026-10-05', confidence: '高', note: '語言能力檢定與記憶曲線演算法具備大量實證論文支撐。' },
      personalization: { score: 4.8, source: 'Birdbrain 動態難度實測', observedDate: '2026-10-14', confidence: '高', note: '每題即時估測學習者熟悉度並微調難度，業界領先標竿。' },
      agent: { score: 4.7, source: 'Roleplay & Video Call with Lily 實測', observedDate: '2026-10-16', confidence: '高', note: '多模態對話 AI Tutor 體驗自然，具即時語誤修正循環。' },
      teacher: { score: 3.1, source: 'Duolingo for Schools 功能盤點', observedDate: '2026-08-12', confidence: '中', note: '偏重 B2C 自主學習，教師課程主導與覆核彈性較低。' },
      content: { score: 4.4, source: 'LLM 自動化課程產製速度追蹤', observedDate: '2026-09-18', confidence: '高', note: 'AI 輔助生成多語種練習內容，迭代與擴張速度極快。' },
      governance: { score: 4.2, source: 'GDPR / COPPA 隱私審查報告', observedDate: '2026-09-04', confidence: '高', note: '具備國際合規架構，但跨國雲端資料落地需視本地法規。' },
      interop: { score: 3.3, source: '學校 LMS 串接支援檢核', observedDate: '2026-08-20', confidence: '中', note: '以獨立 App 生態為核心，非校務系統深度整合導向。' },
    },
  },
  {
    id: 'coursera',
    name: 'Coursera',
    region: 'global',
    regionLabel: '國際標竿',
    tier: '標竿參照',
    primarySegment: '高教與企業職能課程 ＋ Coursera Coach',
    procurementModel: 'B2C 證照訂閱 ＋ B2B 企業與大學授權',
    stageLabel: '教師工作流與校務整合',
    aiSearchVisibility: 85,
    monthlyGrowthSignal: 21.3,
    discussionVolume: 3120,
    volatilityIndex: 49,
    sentiment: { positive: 63, neutral: 26, negative: 11 },
    positioning: { agenticIndex: 74, institutionalIndex: 71 },
    indicators: {
      outcome: { score: 4.4, source: '高教微學分與企業技能認證報告', observedDate: '2026-09-21', confidence: '高', note: '結合產業實作專案與同儕/AI 評量，職場轉換成效可驗證。' },
      personalization: { score: 4.2, source: 'Role-based 技能路徑推薦系統', observedDate: '2026-09-16', confidence: '高', note: '依目標職務推薦課程組合並提供隨堂重點摘要。' },
      agent: { score: 4.3, source: 'Coursera Coach 課程助教實測', observedDate: '2026-10-09', confidence: '高', note: '可針對影片內容進行跨章節問答、練習出題與翻譯。' },
      teacher: { score: 4.2, source: 'Course Builder & AI Grading 功能測試', observedDate: '2026-10-03', confidence: '高', note: '支援講師快速建課與作業初評覆核，提升教學產能。' },
      content: { score: 4.9, source: '全球頂尖大學與科技業課程庫統計', observedDate: '2026-09-28', confidence: '高', note: '具備最高權威度的高教與專業 AI 課程知識庫。' },
      governance: { score: 4.5, source: 'SOC 2 / FERPA 合規文件查閱', observedDate: '2026-08-30', confidence: '高', note: '企業與大學採購標準齊備，資料授權界線清楚。' },
      interop: { score: 4.4, source: 'LTI 1.3 與大學 Canvas/Blackboard 串接', observedDate: '2026-09-24', confidence: '高', note: '與全球大學 LMS 深度互通，採購落地障礙低。' },
    },
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    region: 'global',
    regionLabel: '國際標竿',
    tier: '標竿參照',
    primarySegment: 'K-12 全學科 × Khanmigo 多角色助教',
    procurementModel: '非營利免費 ＋ 學區 Khanmigo 授權',
    stageLabel: 'Agentic AI ／ Multi-Agent',
    aiSearchVisibility: 88,
    monthlyGrowthSignal: 34.8,
    discussionVolume: 3940,
    volatilityIndex: 45,
    sentiment: { positive: 74, neutral: 20, negative: 6 },
    positioning: { agenticIndex: 91, institutionalIndex: 84 },
    indicators: {
      outcome: { score: 4.7, source: '學區對照實驗研究與 MAP 測驗相關性', observedDate: '2026-10-12', confidence: '高', note: '嚴謹的教學法設計避免直接給答案，顯著提升解題遷移力。' },
      personalization: { score: 4.6, source: 'Mastery Learning 精熟路徑評估', observedDate: '2026-10-01', confidence: '高', note: '將精熟學習與動態引導對話結合，診斷精準度極高。' },
      agent: { score: 4.9, source: 'Khanmigo 學生/教師雙軌 Agent 架構拆解', observedDate: '2026-10-18', confidence: '高', note: '具備蘇格拉底學生助教與教師備課/診斷協作代理，業界標竿。' },
      teacher: { score: 4.8, source: 'Khanmigo for Teachers 學區實測', observedDate: '2026-10-14', confidence: '高', note: '大幅減輕教師備課、分級教材改寫與班級學習摘要負擔。' },
      content: { score: 4.7, source: 'K-12 全科與 AP 知識體系盤點', observedDate: '2026-09-19', confidence: '高', note: '結構化知識點與練習題庫成熟，多語系在地化持續擴充。' },
      governance: { score: 4.8, source: '學生對話安全護欄與人工稽核報告', observedDate: '2026-10-10', confidence: '高', note: '內建即時不當內容預警與教師對話回溯機制，信任度極高。' },
      interop: { score: 4.5, source: 'Clever / Google Classroom / Microsoft 整合', observedDate: '2026-09-27', confidence: '高', note: '北美學區部署順暢，微軟合作大幅降低教師導入門檻。' },
    },
  },
  {
    id: 'quizlet',
    name: 'Quizlet',
    region: 'global',
    regionLabel: '國際標竿',
    tier: '標竿參照',
    primarySegment: '記憶複習工具 × Q-Chat / Magic Notes',
    procurementModel: 'B2C Freemium 訂閱',
    stageLabel: '評量與適性學習',
    aiSearchVisibility: 77,
    monthlyGrowthSignal: 12.1,
    discussionVolume: 2680,
    volatilityIndex: 69,
    sentiment: { positive: 51, neutral: 31, negative: 18 },
    positioning: { agenticIndex: 61, institutionalIndex: 24 },
    indicators: {
      outcome: { score: 3.8, source: '記憶卡片間隔重複學習實證研究', observedDate: '2026-08-27', confidence: '中', note: '擅長事實記憶與考前複習，高階推理與素養養成較弱。' },
      personalization: { score: 4.0, source: 'Learn Mode 記憶曲線適性演算法', observedDate: '2026-09-08', confidence: '高', note: '自動調整錯題重現頻率，考前衝刺效率受學生肯定。' },
      agent: { score: 3.9, source: 'Magic Notes & AI 測驗生成實測', observedDate: '2026-09-29', confidence: '中', note: '筆記一鍵轉題庫與閃卡便利，但深度教學引導有限。' },
      teacher: { score: 3.4, source: 'Quizlet Live 課堂互動調查', observedDate: '2026-08-14', confidence: '中', note: '課堂搶答互動性強，但缺乏完整學期縱貫診斷與覆核流。' },
      content: { score: 4.1, source: 'UGC 億級字卡庫與教科書解答驗證', observedDate: '2026-09-03', confidence: '高', note: '海量 UGC 內容為優勢，同時面臨內容品質參差風險。' },
      governance: { score: 3.6, source: '學術誠信爭議與 AI 代寫規範觀察', observedDate: '2026-09-15', confidence: '中', note: '傳統題庫搜尋易被視為作弊輔助，需強化學習過程驗證。' },
      interop: { score: 3.0, source: '校務系統串接支援盤點', observedDate: '2026-08-08', confidence: '中', note: '以學生端自主工具定位為主，少數學校正式統一採購。' },
    },
  },
];

// Chart 1: 聲量趨勢 (Volume Trend 2025.11 - 2026.10 across 4 tracks)
export interface MonthlyVolumePoint {
  month: string;
  edtech: number;
  aiTutor: number;
  multiAgent: number;
  eduAiMarket: number;
}

export const MONTHLY_VOLUME_SERIES: MonthlyVolumePoint[] = [
  { month: '2025.11', edtech: 3420, aiTutor: 2180, multiAgent: 640, eduAiMarket: 1890 },
  { month: '2025.12', edtech: 3580, aiTutor: 2490, multiAgent: 790, eduAiMarket: 2040 },
  { month: '2026.01', edtech: 3890, aiTutor: 2840, multiAgent: 980, eduAiMarket: 2290 },
  { month: '2026.02', edtech: 3610, aiTutor: 3010, multiAgent: 1180, eduAiMarket: 2410 },
  { month: '2026.03', edtech: 4120, aiTutor: 3560, multiAgent: 1520, eduAiMarket: 2780 },
  { month: '2026.04', edtech: 4290, aiTutor: 3880, multiAgent: 1840, eduAiMarket: 2950 },
  { month: '2026.05', edtech: 4460, aiTutor: 4210, multiAgent: 2210, eduAiMarket: 3180 },
  { month: '2026.06', edtech: 4720, aiTutor: 4590, multiAgent: 2630, eduAiMarket: 3490 },
  { month: '2026.07', edtech: 4380, aiTutor: 4420, multiAgent: 2890, eduAiMarket: 3320 },
  { month: '2026.08', edtech: 4650, aiTutor: 4980, multiAgent: 3340, eduAiMarket: 3840 },
  { month: '2026.09', edtech: 5140, aiTutor: 5620, multiAgent: 3910, eduAiMarket: 4280 },
  { month: '2026.10', edtech: 5280, aiTutor: 5940, multiAgent: 4420, eduAiMarket: 4610 },
];

// Chart 5: 需求排行 (Demand Ranking across Student / Teacher / Parent / School)
export interface DemandRankItem {
  id: string;
  need: string;
  stakeholder: '學生' | '教師' | '家長' | '學校';
  track: Exclude<ResearchTrackId, 'all'>;
  demandScore: number; // 0-100
  urgencyDelta: string;
  description: string;
}

export const DEMAND_RANKING: DemandRankItem[] = [
  { id: 'd1', need: '學習診斷精準定位弱點與補救路徑', stakeholder: '學生', track: 'ai-tutor', demandScore: 92, urgencyDelta: '+18%', description: '學生與教師最期待 AI 先診斷能力斷點，再推薦個人化練習。' },
  { id: 'd2', need: '班級作業自動批改與教師覆核工作流', stakeholder: '教師', track: 'multi-agent', demandScore: 89, urgencyDelta: '+26%', description: '減輕教師重複性批改負擔，並保留人工審核與派題控制權。' },
  { id: 'd3', need: '兒少隱私隔離與 AI 回答幻覺防制', stakeholder: '學校', track: 'edu-ai-market', demandScore: 86, urgencyDelta: '+21%', description: '校方採購首重資料落地合規、可追溯教材來源與安全護欄。' },
  { id: 'd4', need: '蘇格拉底式漸進引導（不直接給答案）', stakeholder: '家長', track: 'ai-tutor', demandScore: 83, urgencyDelta: '+15%', description: '家長擔憂學生抄答案產生依賴，偏好分步驟引導思考的工具。' },
  { id: 'd5', need: '跨平台教育雲 SSO 與課綱知識圖譜互通', stakeholder: '學校', track: 'edtech', demandScore: 79, urgencyDelta: '+11%', description: '避免校園系統孤島化，需與現有校務與 OpenID 帳號順暢整合。' },
  { id: 'd6', need: '教案與差異化教材即時生成協作', stakeholder: '教師', track: 'multi-agent', demandScore: 76, urgencyDelta: '+29%', description: '教師支援 Agent 自動產出多難度學習單與班級學情摘要。' },
  { id: 'd7', need: '學習成效前後測可視化報告', stakeholder: '家長', track: 'edtech', demandScore: 72, urgencyDelta: '+9%', description: '從「使用時數」轉向可驗證的學科精熟度與進步幅度證明。' },
];

// Chart 6: KOL 網絡 (KOL Network nodes & links)
export interface KolNode {
  id: string;
  name: string;
  role: string;
  cluster: '政策與公部門' | '現場教師社群' | '技術與 AI 研究' | '親子與產業評論';
  influence: number; // 1-100
  x: number; // 0-100
  y: number; // 0-100
  primaryTopic: string;
  track: Exclude<ResearchTrackId, 'all'>;
}

export interface KolLink {
  source: string;
  target: string;
  strength: number; // 1-3
}

export const KOL_NODES: KolNode[] = [
  { id: 'k1', name: '中小學數位學習推動網', role: '政策與縣市輔導團', cluster: '政策與公部門', influence: 94, x: 26, y: 28, primaryTopic: '生生用平板 × 因材網導入', track: 'edu-ai-market' },
  { id: 'k2', name: '第一線創新教師聯盟', role: 'K-12 種子教師群', cluster: '現場教師社群', influence: 88, x: 52, y: 22, primaryTopic: '教師工作流與覆核實務', track: 'edtech' },
  { id: 'k3', name: 'EdTech 教學科技實驗室', role: '教育 AI 評測與研究社群', cluster: '技術與 AI 研究', influence: 85, x: 78, y: 34, primaryTopic: 'AI Tutor 引導效度比較', track: 'ai-tutor' },
  { id: 'k4', name: 'Multi-Agent 開源教育社群', role: '開發者與架構師', cluster: '技術與 AI 研究', influence: 76, x: 82, y: 68, primaryTopic: 'Orchestrator 多代理分工', track: 'multi-agent' },
  { id: 'k5', name: '親子數位素養媒體', role: '親師教育專欄', cluster: '親子與產業評論', influence: 81, x: 24, y: 70, primaryTopic: '兒童隱私與自主學習成效', track: 'edu-ai-market' },
  { id: 'k6', name: 'EAAF 教育科技智庫', role: '跨平台研究觀測站', cluster: '技術與 AI 研究', influence: 79, x: 50, y: 52, primaryTopic: '七大競爭指標與標竿研究', track: 'ai-tutor' },
  { id: 'k7', name: '補教與檢定實務顧問', role: '垂直學科評量渠道', cluster: '親子與產業評論', influence: 68, x: 53, y: 80, primaryTopic: '小規模垂直切入與付費意願', track: 'edtech' },
];

export const KOL_LINKS: KolLink[] = [
  { source: 'k1', target: 'k2', strength: 3 },
  { source: 'k1', target: 'k6', strength: 2 },
  { source: 'k2', target: 'k6', strength: 3 },
  { source: 'k2', target: 'k3', strength: 2 },
  { source: 'k3', target: 'k4', strength: 3 },
  { source: 'k3', target: 'k6', strength: 3 },
  { source: 'k6', target: 'k4', strength: 2 },
  { source: 'k6', target: 'k5', strength: 2 },
  { source: 'k5', target: 'k1', strength: 2 },
  { source: 'k5', target: 'k7', strength: 2 },
  { source: 'k7', target: 'k6', strength: 1 },
];

// Trend Forecasting Engine (2026.11 - 2027.10)
export type ForecastScenarioId = 'baseline' | 'ai-accelerated' | 'conservative';

export interface ForecastDrivers {
  aiTutorPenetration: number; // 0 - 100 (default 62)
  multiAgentMaturity: number; // 0 - 100 (default 54)
  governanceReadiness: number; // 0 - 100 (default 68)
  teacherAdoption: number; // 0 - 100 (default 58)
}

export const FORECAST_SCENARIO_PRESETS: Record<
  ForecastScenarioId,
  { label: string; subtitle: string; drivers: ForecastDrivers }
> = {
  baseline: {
    label: '基準情境 (Baseline)',
    subtitle: '延續 2025.11–2026.10 年成長動能，AI Tutor 與教師工作流穩步滲透校園。',
    drivers: {
      aiTutorPenetration: 62,
      multiAgentMaturity: 54,
      governanceReadiness: 68,
      teacherAdoption: 58,
    },
  },
  'ai-accelerated': {
    label: 'AI 加速普及 (AI-Accelerated)',
    subtitle: 'Multi-Agent 協作與教育雲合規突破，帶動多校大規模採用多角色助教。',
    drivers: {
      aiTutorPenetration: 86,
      multiAgentMaturity: 82,
      governanceReadiness: 78,
      teacherAdoption: 76,
    },
  },
  conservative: {
    label: '校園保守採購 (Conservative)',
    subtitle: '受限於隱私法規審查與教師覆核負荷，平台優先聚焦單一垂直學科驗證。',
    drivers: {
      aiTutorPenetration: 44,
      multiAgentMaturity: 32,
      governanceReadiness: 52,
      teacherAdoption: 41,
    },
  },
};

export interface ForecastMonthPoint {
  month: string;
  isForecast: boolean;
  contentPlatform: number; // Market share / adoption index
  adaptiveAssessment: number;
  aiTutorLoop: number;
  teacherWorkflow: number;
  multiAgentEcosystem: number;
  aiTutorUpper: number;
  aiTutorLower: number;
  multiAgentUpper: number;
  multiAgentLower: number;
}

const HISTORICAL_EVOLUTION_BASE: Omit<
  ForecastMonthPoint,
  'aiTutorUpper' | 'aiTutorLower' | 'multiAgentUpper' | 'multiAgentLower'
>[] = [
  { month: '2025.11', isForecast: false, contentPlatform: 74, adaptiveAssessment: 52, aiTutorLoop: 28, teacherWorkflow: 31, multiAgentEcosystem: 11 },
  { month: '2025.12', isForecast: false, contentPlatform: 73, adaptiveAssessment: 54, aiTutorLoop: 31, teacherWorkflow: 33, multiAgentEcosystem: 13 },
  { month: '2026.01', isForecast: false, contentPlatform: 71, adaptiveAssessment: 55, aiTutorLoop: 34, teacherWorkflow: 36, multiAgentEcosystem: 15 },
  { month: '2026.02', isForecast: false, contentPlatform: 70, adaptiveAssessment: 57, aiTutorLoop: 37, teacherWorkflow: 38, multiAgentEcosystem: 18 },
  { month: '2026.03', isForecast: false, contentPlatform: 68, adaptiveAssessment: 58, aiTutorLoop: 41, teacherWorkflow: 41, multiAgentEcosystem: 21 },
  { month: '2026.04', isForecast: false, contentPlatform: 67, adaptiveAssessment: 60, aiTutorLoop: 44, teacherWorkflow: 44, multiAgentEcosystem: 24 },
  { month: '2026.05', isForecast: false, contentPlatform: 65, adaptiveAssessment: 61, aiTutorLoop: 48, teacherWorkflow: 47, multiAgentEcosystem: 28 },
  { month: '2026.06', isForecast: false, contentPlatform: 64, adaptiveAssessment: 62, aiTutorLoop: 51, teacherWorkflow: 50, multiAgentEcosystem: 32 },
  { month: '2026.07', isForecast: false, contentPlatform: 62, adaptiveAssessment: 63, aiTutorLoop: 53, teacherWorkflow: 52, multiAgentEcosystem: 35 },
  { month: '2026.08', isForecast: false, contentPlatform: 61, adaptiveAssessment: 64, aiTutorLoop: 57, teacherWorkflow: 55, multiAgentEcosystem: 39 },
  { month: '2026.09', isForecast: false, contentPlatform: 59, adaptiveAssessment: 65, aiTutorLoop: 61, teacherWorkflow: 59, multiAgentEcosystem: 44 },
  { month: '2026.10', isForecast: false, contentPlatform: 58, adaptiveAssessment: 66, aiTutorLoop: 64, teacherWorkflow: 62, multiAgentEcosystem: 48 },
];

const FORECAST_MONTHS = [
  '2026.11', '2026.12', '2027.01', '2027.02', '2027.03', '2027.04',
  '2027.05', '2027.06', '2027.07', '2027.08', '2027.09', '2027.10',
];

export function computeForecastSeries(drivers: ForecastDrivers): ForecastMonthPoint[] {
  const historical: ForecastMonthPoint[] = HISTORICAL_EVOLUTION_BASE.map((pt) => ({
    ...pt,
    aiTutorUpper: pt.aiTutorLoop,
    aiTutorLower: pt.aiTutorLoop,
    multiAgentUpper: pt.multiAgentEcosystem,
    multiAgentLower: pt.multiAgentEcosystem,
  }));

  const last = HISTORICAL_EVOLUTION_BASE[HISTORICAL_EVOLUTION_BASE.length - 1];

  // Driver factors normalized around baseline
  const aiFactor = (drivers.aiTutorPenetration - 50) / 50; // -1 to +1
  const agentFactor = (drivers.multiAgentMaturity - 50) / 50;
  const govFactor = (drivers.governanceReadiness - 50) / 50;
  const teacherFactor = (drivers.teacherAdoption - 50) / 50;

  const projected: ForecastMonthPoint[] = FORECAST_MONTHS.map((month, idx) => {
    const t = idx + 1; // 1..12 months ahead
    const uncertainty = 1.6 + t * 0.52;

    // Legacy content-only platforms gradually commoditize as AI Tutor rises
    const contentDecay = 1.15 + Math.max(0, aiFactor) * 0.65;
    const contentPlatform = Math.max(24, Number((last.contentPlatform - contentDecay * t).toFixed(1)));

    // Adaptive assessment plateaus and merges into AI Tutor
    const adaptiveAssessment = Math.min(82, Number((last.adaptiveAssessment + (0.65 + govFactor * 0.25) * t).toFixed(1)));

    // AI Tutor adoption accelerates with penetration + governance + teacher trust
    const aiSlope = 1.65 + aiFactor * 0.95 + govFactor * 0.45 + teacherFactor * 0.35;
    const aiTutorLoop = Math.min(96, Math.max(42, Number((last.aiTutorLoop + aiSlope * t - 0.025 * t * t).toFixed(1))));

    // Teacher workflow & LMS integration depends strongly on teacherAdoption + governance
    const wfSlope = 1.45 + teacherFactor * 0.9 + govFactor * 0.55;
    const teacherWorkflow = Math.min(94, Math.max(40, Number((last.teacherWorkflow + wfSlope * t).toFixed(1))));

    // Multi-Agent ecosystem shows S-curve acceleration when orchestrator & governance align
    const agentSlope = 1.85 + agentFactor * 1.15 + govFactor * 0.55 + teacherFactor * 0.35;
    const multiAgentEcosystem = Math.min(
      92,
      Math.max(28, Number((last.multiAgentEcosystem + agentSlope * t + 0.03 * t * t * (1 + agentFactor * 0.5)).toFixed(1)))
    );

    return {
      month,
      isForecast: true,
      contentPlatform,
      adaptiveAssessment,
      aiTutorLoop,
      teacherWorkflow,
      multiAgentEcosystem,
      aiTutorUpper: Math.min(99, Number((aiTutorLoop + uncertainty).toFixed(1))),
      aiTutorLower: Math.max(20, Number((aiTutorLoop - uncertainty).toFixed(1))),
      multiAgentUpper: Math.min(98, Number((multiAgentEcosystem + uncertainty * 1.15).toFixed(1))),
      multiAgentLower: Math.max(15, Number((multiAgentEcosystem - uncertainty * 1.15).toFixed(1))),
    };
  });

  return [...historical, ...projected];
}

// PDF Page 6: AI Tutor 5-Stage Learning Loop
export interface LearningLoopStep {
  step: number;
  title: string;
  subtitle: string;
  coreQuestion: string;
  inputArtifact: string;
  outputArtifact: string;
  humanGate: string;
}

export const AI_TUTOR_LOOP_STEPS: LearningLoopStep[] = [
  {
    step: 1,
    title: '能力評量',
    subtitle: '了解學生程度',
    coreQuestion: '學習者目前的先備知識與真實能力基準為何？',
    inputArtifact: '前測題組、課綱知識節點、作答時間與信心度',
    outputArtifact: '個人能力輪廓矩陣與知識精熟度向量',
    humanGate: '教師可設定評量範圍與及格門檻',
  },
  {
    step: 2,
    title: '學習診斷',
    subtitle: '辨識弱點與缺口',
    coreQuestion: '錯誤背後的迷思概念或前置斷點落在哪個節點？',
    inputArtifact: '錯題步驟軌跡、知識圖譜拓樸關係',
    outputArtifact: '概念缺口診斷報告與優先補強清單',
    humanGate: '標註高風險學習落差並提示教師關注',
  },
  {
    step: 3,
    title: '個人化推薦',
    subtitle: '安排學習路徑',
    coreQuestion: '下一步最適合學生的難度階梯與教材形式為何？',
    inputArtifact: '診斷結果、學習偏好與剩餘學習時間',
    outputArtifact: '動態學習任務序列與差異化教材包',
    humanGate: '教師可微調或鎖定班級必修進度節點',
  },
  {
    step: 4,
    title: 'AI 引導',
    subtitle: '提供練習與回饋',
    coreQuestion: '如何以提示與提問引導思考，而非直接給出標準答案？',
    inputArtifact: '即時作答對話、題意拆解狀態',
    outputArtifact: '蘇格拉底式提示、階段性肯定與延伸練習',
    humanGate: '防作弊護欄與對話異常即時記錄',
  },
  {
    step: 5,
    title: '教師覆核',
    subtitle: '形成持續改善循環',
    coreQuestion: 'AI 判斷是否符合現場教學脈絡，並如何修正下一輪循環？',
    inputArtifact: 'AI 診斷摘要、學生互動歷程與成效指標',
    outputArtifact: '教師核可批註、更新知識權重與班級教學策略',
    humanGate: '強制人工覆核（Human-in-the-Loop）確保教育責任歸屬',
  },
];

// PDF Page 7: Multi-Agent Roles
export interface AgentRoleNode {
  id: string;
  name: string;
  englishRole: string;
  responsibility: string;
  inputs: string[];
  outputs: string[];
  guardrail: string;
}

export const MULTI_AGENT_ROLES: AgentRoleNode[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator（總控協調者）',
    englishRole: '任務分派、協調與驗證',
    responsibility: '負責解構教學或學習請求，依序分派至專職 Agent，並執行跨代理資料一致性與品質驗證。',
    inputs: ['學生／教師請求意圖', '共享學習狀態快照'],
    outputs: ['協作執行計畫', '一致化最終回應與稽核紀錄'],
    guardrail: '避免「為多 Agent 而多 Agent」的冗餘呼叫，超時或衝突時轉交教師覆核。',
  },
  {
    id: 'teaching',
    name: '教學 Agent',
    englishRole: '解說、提問與引導',
    responsibility: '依據目前學習目標提供概念講解、蘇格拉底式提問與鷹架引導，維持互動節奏。',
    inputs: ['診斷 Agent 弱點提示', '課綱知識節點內容'],
    outputs: ['步驟化引導對話', '概念類比範例'],
    guardrail: '嚴格禁止直接吐出完整作業答案，必須保留思考引導回合。',
  },
  {
    id: 'diagnostic',
    name: '診斷 Agent',
    englishRole: '分析能力與學習落差',
    responsibility: '分析學生歷次作答與對話軌跡，比對知識圖譜以定位前置概念缺口與迷思類型。',
    inputs: ['作答對錯序列', '解題步驟與耗時分布'],
    outputs: ['知識斷點向量', '迷思概念分類標籤'],
    guardrail: '低信心度診斷結果需附帶證據來源，不可過度推論。',
  },
  {
    id: 'assessment',
    name: '評量 Agent',
    englishRole: '題目、評分與回饋',
    responsibility: '動態組卷出題、執行開放題或步驟題多維度評分，並產出具體修正建議。',
    inputs: ['能力難度目標', '課綱評量規準（Rubric）'],
    outputs: ['適性試題', '規準化評分與即時回饋'],
    guardrail: '關鍵成績或檢定評分須經過規則校驗與教師抽樣覆核。',
  },
  {
    id: 'teacher-support',
    name: '教師支援 Agent',
    englishRole: '教案、班級與學習摘要',
    responsibility: '彙整全班學情趨勢、自動生成差異化補救教案與親師溝通摘要，放大教師教學決策力。',
    inputs: ['班級診斷聚合資料', '進度表與教學目標'],
    outputs: ['班級弱點熱區摘要', '差異化學習單與教案草稿'],
    guardrail: '所有班級策略與對外摘要必須由教師確認後才生效發布。',
  },
];

// PDF Page 8 & 10: Startup Entry & EAAF 3-Layer Framework
export const EAAF_LAYERS = [
  {
    layer: '第一層',
    title: '教育新創產業研究',
    focus: '台灣樣本 × 國際標竿 × 市場訊號追蹤',
    deliverable: '建立四條主線、七項關鍵指標與八大情報圖表的連續觀測基礎。',
  },
  {
    layer: '第二層',
    title: 'AI Tutor × Multi-Agent 技術研究',
    focus: '評量診斷閉環 × 多代理分工與品質驗證',
    deliverable: '驗證學習循環效度、Orchestrator 一致性控制與教師覆核介面設計。',
  },
  {
    layer: '第三層',
    title: 'EAAF 教育 AI Agent Framework',
    focus: '結合教育專業、AI 與人類監督的教育生態系',
    deliverable: '落實「逐步自動化、保留人工覆核」的跨校、多學科可擴展平台架構。',
  },
];
