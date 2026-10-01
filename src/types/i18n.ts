/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'fr' | 'ru' | 'ar' | 'de' | 'ja';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  institutionalJargonStyle: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    institutionalJargonStyle: 'Wall Street Multi-Strat Quantitative & L/S Equity',
    region: 'New York / London',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    institutionalJargonStyle: 'Finanzas Cuantitativas & Cobertura Macro Institucional',
    region: 'Madrid / LatAm',
  },
  zh: {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    dir: 'ltr',
    institutionalJargonStyle: '对冲基金多空量化与供应链产业链深度穿透研究',
    region: 'Shanghai / HK / SG',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    institutionalJargonStyle: 'Gestion Quantitative & Arbitrage de Valeur Relative',
    region: 'Paris / Geneva',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    institutionalJargonStyle: 'Институциональный Количественный и Макро Анализ',
    region: 'Global / CIS',
  },
  ar: {
    code: 'ar',
    name: 'Arabic (RTL)',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    institutionalJargonStyle: 'التحليل المالي الكمي المؤسسي وصناديق التحوط المحايدة',
    region: 'Riyadh / Dubai',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    institutionalJargonStyle: 'Institutionelle Quant-Strategien & Lieferketten-Arbitrage',
    region: 'Frankfurt / Zurich',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    institutionalJargonStyle: '機関投資家向けクオンツ・サプライチェーン波及分析',
    region: 'Tokyo / APAC',
  },
};

export interface UiTranslations {
  // Navigation & Header
  terminalTitle: string;
  tagline: string;
  liveApiConnected: string;
  degradedFallback: string;
  devAuditMode: string;
  liveSync: string;
  syncing: string;
  exportToSheets: string;
  signIn: string;
  signOut: string;
  agentMemorySynced: string;
  agentMemoryTooltip: string;

  // Disclaimer bar
  strictGroundingTitle: string;
  strictGroundingDesc: string;
  groundingEngineActive: string;
  provenanceAudited: string;

  // Event Input Panel
  eventInputLabel: string;
  eventInputPlaceholder: string;
  horizonLabel: string;
  horizonTactical: string;
  horizonStructural: string;
  depthLabel: string;
  depthStandard: string;
  depthDeep: string;
  runAnalysisBtn: string;
  runningBtn: string;
  runAuditBtn: string;
  auditingBtn: string;
  quickPromptsLabel: string;
  memoryRecentPromptsLabel: string;
  clearMemoryBtn: string;

  // Tabs
  tabAll: string;
  tabPairs: string;
  tabRipple: string;
  tabMargins: string;
  tabHeatmap: string;

  // Long / Short Section & Table
  alphaPairsTitle: string;
  filterAll: string;
  filterLongs: string;
  filterShorts: string;
  viewTable: string;
  viewHeatmap: string;
  viewCards: string;
  colAction: string;
  colTicker: string;
  colPrice: string;
  colChange: string;
  colCompany: string;
  colConfidence: string;
  colAudit: string;
  colCitation: string;
  colMarginDelta: string;
  colTargetRR: string;
  colEpsSurprise: string;
  colTelemetry: string;

  // Heatmap Grid
  heatmapTitle: string;
  heatmapSubtitle: string;
  sortAlphaRank: string;
  sortConviction: string;
  sortMarginDelta: string;
  sortLsGrouped: string;
  convictionScoreLabel: string;
  estMarginDeltaLabel: string;
  scatterTitle: string;

  // Ripple & Margins
  supplyChainRippleTitle: string;
  marginMatrixTitle: string;
  propagationVelocity: string;
  chokepoints: string;
  substitutability: string;
  squeezedSectors: string;
  expandedSectors: string;

  // Export & Modals
  exportTitle: string;
  telemetryModalTitle: string;
  closeBtn: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, UiTranslations> = {
  en: {
    terminalTitle: 'AlphaChain // Screener',
    tagline: 'Institutional Physical Event Sourcing, Zero-Trust Fact-Checking & Asymmetric L/S Synthesis',
    liveApiConnected: 'LIVE API CONNECTED',
    degradedFallback: 'DEGRADED: FALLBACK TO HEURISTICS',
    devAuditMode: 'DEV AUDIT',
    liveSync: 'LIVE SYNC',
    syncing: 'SYNCING...',
    exportToSheets: 'EXPORT TO SHEETS',
    signIn: 'SIGN IN WITH GOOGLE',
    signOut: 'SIGN OUT',
    agentMemorySynced: 'Agent Memory: Synced',
    agentMemoryTooltip: 'Cross-session PM preferences, recent events & audit states remembered',

    strictGroundingTitle: 'STRICT GROUNDING DIRECTIVE:',
    strictGroundingDesc: 'All theses are generated via grounded web-search verification. Unverified claims are strictly filtered.',
    groundingEngineActive: 'GROUNDING ENGINE: ACTIVE',
    provenanceAudited: 'PROVENANCE L3 AUDITED',

    eventInputLabel: 'PHYSICAL EVENT DISRUPTION TRIGGER',
    eventInputPlaceholder: 'Enter real-world physical event: e.g. Port strike in Rotterdam, Lithium refinery fire in Atacama, Red Sea missile strike...',
    horizonLabel: 'HORIZON',
    horizonTactical: 'Tactical (1-3M)',
    horizonStructural: 'Structural (6-12M)',
    depthLabel: 'SUPPLY CHAIN DEPTH',
    depthStandard: 'Tier-3 Standard',
    depthDeep: 'Tier-4 Forensics',
    runAnalysisBtn: 'GENERATE ALPHA THESIS',
    runningBtn: 'SYNTHESIZING ALPHA...',
    runAuditBtn: 'RUN CRITIC AGENT AUDIT',
    auditingBtn: 'AUDITING CITATIONS...',
    quickPromptsLabel: 'INSTITUTIONAL BENCHMARK SCENARIOS',
    memoryRecentPromptsLabel: 'AGENT MEMORY RECENT PROMPTS',
    clearMemoryBtn: 'CLEAR MEMORY',

    tabAll: 'COMPLETE ALPHA DASHBOARD',
    tabPairs: 'L/S TRADE PAIRS',
    tabRipple: 'SUPPLY CHAIN RIPPLE',
    tabMargins: 'MARGIN MATRIX',
    tabHeatmap: 'HEATMAP GRID',

    alphaPairsTitle: 'Zero-Trust Fact-Checked Alpha Pairs // Institutional Execution Table',
    filterAll: 'All (6)',
    filterLongs: 'Longs (3)',
    filterShorts: 'Shorts (3)',
    viewTable: 'Data Table',
    viewHeatmap: 'Heatmap Grid',
    viewCards: 'Quant Cards',
    colAction: 'Action / Direction',
    colTicker: 'Ticker & Exchange',
    colPrice: 'Live Price',
    colChange: 'Today % Chg',
    colCompany: 'Company & Sector',
    colConfidence: 'Confidence Score',
    colAudit: 'Critic Audit Status',
    colCitation: 'Primary Source & Citation (Data Provenance)',
    colMarginDelta: 'Est Margin Delta',
    colTargetRR: 'Target R/R',
    colEpsSurprise: 'Earnings Surprise',
    colTelemetry: 'Telemetry',

    heatmapTitle: 'HEATMAP MATRIX: CONVICTION SCORE VS. ESTIMATED MARGIN DELTA',
    heatmapSubtitle: 'Visual Cross-Ranking of All 6 Physical Event Alpha Tickers',
    sortAlphaRank: 'Alpha Rank',
    sortConviction: 'Conviction',
    sortMarginDelta: 'Margin Delta',
    sortLsGrouped: 'L/S Grouped',
    convictionScoreLabel: 'Conviction Score',
    estMarginDeltaLabel: 'Est Margin Delta',
    scatterTitle: '2D Conviction vs. Margin Delta Scatter Dispersion',

    supplyChainRippleTitle: 'Supply Chain Ripple Stages (Tier 0 to Tier 4)',
    marginMatrixTitle: 'Margin Compression vs. Expansion Divergence',
    propagationVelocity: 'Propagation Velocity',
    chokepoints: 'Chokepoints',
    substitutability: 'Substitutability',
    squeezedSectors: 'Margin Squeezed Industries (Input Inflation)',
    expandedSectors: 'Margin Expanded Industries (Pricing Scarcity)',

    exportTitle: 'Export to Google Sheets',
    telemetryModalTitle: 'Institutional Factor Telemetry & Data Provenance',
    closeBtn: 'Close',
  },

  es: {
    terminalTitle: 'AlphaChain // Screener',
    tagline: 'Originación de Eventos Físicos, Auditoría Zero-Trust y Síntesis L/S Asimétrica',
    liveApiConnected: 'API EN VIVO CONECTADA',
    degradedFallback: 'DEGRADADO: MODO HEURÍSTICO',
    devAuditMode: 'AUDITORÍA DEV',
    liveSync: 'SINC EN VIVO',
    syncing: 'SINCRONIZANDO...',
    exportToSheets: 'EXPORTAR A HOJAS',
    signIn: 'INICIAR SESIÓN CON GOOGLE',
    signOut: 'CERRAR SESIÓN',
    agentMemorySynced: 'Memoria del Agente: Sincronizada',
    agentMemoryTooltip: 'Preferencias de cartera, últimos eventos y estado de auditoría recordados',

    strictGroundingTitle: 'DIRECTIVA DE VERIFICACIÓN ESTRICTA:',
    strictGroundingDesc: 'Todas las tesis se generan mediante búsqueda empírica verificada. Las afirmaciones no contrastadas se descartan.',
    groundingEngineActive: 'MOTOR DE GROUNDING: ACTIVO',
    provenanceAudited: 'TRAZABILIDAD L3 AUDITADA',

    eventInputLabel: 'DISPARADOR DE DISRUPCIÓN FÍSICA Y MACRO',
    eventInputPlaceholder: 'Introduzca evento físico real: p. ej., Huelga portuaria en Róterdam, Incendio en refinería de litio en Atacama...',
    horizonLabel: 'HORIZONTE TEMPORAL',
    horizonTactical: 'Táctico (1-3M)',
    horizonStructural: 'Estructural (6-12M)',
    depthLabel: 'PROFUNDIDAD DE CADENA',
    depthStandard: 'Nivel 3 Estándar',
    depthDeep: 'Forense Nivel 4',
    runAnalysisBtn: 'GENERAR TESIS DE ALPHA',
    runningBtn: 'SINTETIZANDO ALPHA...',
    runAuditBtn: 'EJECUTAR AUDITORÍA AGENTE CRÍTICO',
    auditingBtn: 'AUDITANDO CITAS...',
    quickPromptsLabel: 'ESCENARIOS DE REFERENCIA INSTITUCIONAL',
    memoryRecentPromptsLabel: 'EVENTOS RECIENTES EN MEMORIA AGÉNTICA',
    clearMemoryBtn: 'LIMPIAR MEMORIA',

    tabAll: 'PANEL COMPLETO DE ALPHA',
    tabPairs: 'PARES L/S',
    tabRipple: 'ONDAS DE SUMINISTRO',
    tabMargins: 'MATRIZ DE MÁRGENES',
    tabHeatmap: 'MAPA DE CALOR',

    alphaPairsTitle: 'Pares Cuantitativos Auditados Zero-Trust // Mesa de Ejecución Institucional',
    filterAll: 'Todos (6)',
    filterLongs: 'Largos (3)',
    filterShorts: 'Cortos (3)',
    viewTable: 'Tabla Cuantitativa',
    viewHeatmap: 'Mapa de Calor',
    viewCards: 'Tarjetas Quant',
    colAction: 'Acción / Posición',
    colTicker: 'Ticker y Bolsa',
    colPrice: 'Precio en Vivo',
    colChange: '% Cambio Hoy',
    colCompany: 'Empresa y Sector',
    colConfidence: 'Puntuación de Confianza',
    colAudit: 'Estado de Auditoría',
    colCitation: 'Fuente Primaria y Cita (Trazabilidad)',
    colMarginDelta: 'Delta Margen Est.',
    colTargetRR: 'Riesgo / Retorno',
    colEpsSurprise: 'Sorpresa en BPA',
    colTelemetry: 'Telemetría',

    heatmapTitle: 'MATRIZ DE CALOR: CONVICCIÓN VS. DELTA DE MARGEN ESTIMADO',
    heatmapSubtitle: 'Clasificación Visual Cruzada de los 6 Tickers de Alpha',
    sortAlphaRank: 'Rango de Alpha',
    sortConviction: 'Convicción',
    sortMarginDelta: 'Delta Margen',
    sortLsGrouped: 'Agrupado L/S',
    convictionScoreLabel: 'Puntuación de Convicción',
    estMarginDeltaLabel: 'Delta de Margen Est.',
    scatterTitle: 'Dispersión 2D Convicción vs. Delta de Margen',

    supplyChainRippleTitle: 'Etapas de Impacto en Cadena de Suministro (Nivel 0 a 4)',
    marginMatrixTitle: 'Divergencia de Compresión vs. Expansión de Márgenes',
    propagationVelocity: 'Velocidad de Propagación',
    chokepoints: 'Cuellos de Botella',
    substitutability: 'Sustituibilidad',
    squeezedSectors: 'Industrias Afectadas por Costes (Compresión)',
    expandedSectors: 'Industrias con Poder de Fijación (Expansión)',

    exportTitle: 'Exportar a Google Sheets',
    telemetryModalTitle: 'Telemetría de Factores y Trazabilidad de Datos',
    closeBtn: 'Cerrar',
  },

  zh: {
    terminalTitle: 'AlphaChain // 智能量化终端',
    tagline: '物理世界事件溯源、零信任事实验证与非对称多空对冲阿尔法生成',
    liveApiConnected: '实时行情 API 已连接',
    degradedFallback: '降级模式：本地启发式算法',
    devAuditMode: '开发者审计模式',
    liveSync: '实时同步',
    syncing: '正在同步...',
    exportToSheets: '导出至 Google 电子表格',
    signIn: '使用谷歌账户登录',
    signOut: '登出',
    agentMemorySynced: 'Agent 状态记忆：已同步',
    agentMemoryTooltip: '跨会话记忆投资偏好、近期宏观事件及审计模式状态',

    strictGroundingTitle: '严格溯源指令：',
    strictGroundingDesc: '所有阿尔法投资假说均经实时网络搜索与事实查证生成，未经核实的论断已被过滤。',
    groundingEngineActive: '事实验证引擎：运行中',
    provenanceAudited: 'L3 级数据来源已核验',

    eventInputLabel: '物理世界宏观/产业链突发冲击事件输入',
    eventInputPlaceholder: '输入真实物理世界事件：例如：鹿特丹港口工人罢工、阿塔卡马锂矿精炼厂火灾、红海航道集装箱禁运...',
    horizonLabel: '投资久期',
    horizonTactical: '战术性对冲 (1-3个月)',
    horizonStructural: '结构性敞口 (6-12个月)',
    depthLabel: '产业链穿透深度',
    depthStandard: '三级标准产业链穿透',
    depthDeep: '四级法务级深度穿透',
    runAnalysisBtn: '生成多空阿尔法投资策略',
    runningBtn: '正在量化合成中...',
    runAuditBtn: '启动评论家智能体审计',
    auditingBtn: '正在核查原始文献...',
    quickPromptsLabel: '机构基准突发情景预设',
    memoryRecentPromptsLabel: '智能体跨会话记忆：历史研究事件',
    clearMemoryBtn: '重置记忆',

    tabAll: '阿尔法全景看板',
    tabPairs: '多空对冲标的组',
    tabRipple: '供应链波及脉络',
    tabMargins: '毛利弹性矩阵',
    tabHeatmap: '热力矩阵网格',

    alphaPairsTitle: '零信任事实核验阿尔法多空配对 // 机构级执行交易表',
    filterAll: '全部标的 (6)',
    filterLongs: '做多头寸 (3)',
    filterShorts: '做空头寸 (3)',
    viewTable: '数据明细表',
    viewHeatmap: '热力网格图',
    viewCards: '量化卡片组',
    colAction: '交易方向 / 头寸',
    colTicker: '股票代码与交易所',
    colPrice: '最新股价',
    colChange: '今日涨跌幅',
    colCompany: '公司名称与行业',
    colConfidence: '可信度评分',
    colAudit: '事实审计结论',
    colCitation: '一手信源与监管披露 (数据溯源)',
    colMarginDelta: '预估毛利率变化',
    colTargetRR: '风险收益比',
    colEpsSurprise: 'EPS 预期差',
    colTelemetry: '量化遥测',

    heatmapTitle: '热力矩阵：确信度得分 VS. 预估毛利率基点变化',
    heatmapSubtitle: '六大物理事件受影响标的之量化综合排序',
    sortAlphaRank: '综合阿尔法排序',
    sortConviction: '确信度高低',
    sortMarginDelta: '毛利变化幅度',
    sortLsGrouped: '多空分组',
    convictionScoreLabel: '确信度得分',
    estMarginDeltaLabel: '预估毛利弹性',
    scatterTitle: '二维确信度与毛利变动离散分布图',

    supplyChainRippleTitle: '供应链多级波及路径 (0 级源头至 4 级终端)',
    marginMatrixTitle: '成本通胀挤压 VS. 定价权扩张分化矩阵',
    propagationVelocity: '波及扩散速率',
    chokepoints: '咽喉枢纽',
    substitutability: '替代弹性',
    squeezedSectors: '毛利率承压行业 (上游成本通胀)',
    expandedSectors: '毛利率扩张行业 (供给短缺溢价)',

    exportTitle: '导出至 Google Sheets',
    telemetryModalTitle: '机构因子遥测与数据来源剖析',
    closeBtn: '关闭',
  },

  fr: {
    terminalTitle: 'AlphaChain // Screener',
    tagline: 'Sourcing d’Événements Physiques, Audit Zéro-Trust et Synthèse Long/Short Asymétrique',
    liveApiConnected: 'API TEMPS RÉEL CONNECTÉE',
    degradedFallback: 'DÉGRADÉ : MODE HEURISTIQUE',
    devAuditMode: 'AUDIT DÉVELOPPEUR',
    liveSync: 'SYNCHRO LIVE',
    syncing: 'SYNCHRONISATION...',
    exportToSheets: 'EXPORTER SUR SHEETS',
    signIn: 'CONNEXION GOOGLE',
    signOut: 'DÉCONNEXION',
    agentMemorySynced: 'Mémoire de l’Agent : Synchronisée',
    agentMemoryTooltip: 'Préférences du gestionnaire, événements récents et état d’audit mémorisés',

    strictGroundingTitle: 'DIRECTIVE D’ANCRAGE FACTUEL STRICT :',
    strictGroundingDesc: 'Toutes les thèses sont vérifiées par recherche empirique. Les assertions non confirmées sont éliminées.',
    groundingEngineActive: 'MOTEUR DE RECHERCHE : ACTIF',
    provenanceAudited: 'TRAÇABILITÉ L3 AUDITÉE',

    eventInputLabel: 'DÉCLENCHEUR DE DISRUPTION PHYSIQUE ET GÉOPOLITIQUE',
    eventInputPlaceholder: 'Saisissez un événement réel : ex. Grève portuaire à Rotterdam, Incendie d’une raffinerie de lithium en Atacama...',
    horizonLabel: 'HORIZON D’INVESTISSEMENT',
    horizonTactical: 'Tactique (1-3 mois)',
    horizonStructural: 'Structurel (6-12 mois)',
    depthLabel: 'PROFONDEUR DE CHAÎNE',
    depthStandard: 'Niveau 3 Standard',
    depthDeep: 'Forensique Niveau 4',
    runAnalysisBtn: 'GÉNÉRER LA THÈSE D’ALPHA',
    runningBtn: 'SYNTHÈSE EN COURS...',
    runAuditBtn: 'LANCER L’AUDIT CRITIQUE',
    auditingBtn: 'AUDIT DES CITATIONS...',
    quickPromptsLabel: 'SCÉNARIOS DE RÉFÉRENCE INSTITUTIONNELS',
    memoryRecentPromptsLabel: 'ÉVÉNEMENTS RÉCENTS EN MÉMOIRE AGENTIQUE',
    clearMemoryBtn: 'EFFACER LA MÉMOIRE',

    tabAll: 'TABLEAU DE BORD ALPHA',
    tabPairs: 'PAIRES LONG/SHORT',
    tabRipple: 'ONDES D’APPROVISIONNEMENT',
    tabMargins: 'MATRICE DES MARGES',
    tabHeatmap: 'GRILLE HEATMAP',

    alphaPairsTitle: 'Paires Quantitatives Auditées Zéro-Trust // Table d’Exécution Institutionnelle',
    filterAll: 'Tous (6)',
    filterLongs: 'Longs (3)',
    filterShorts: 'Shorts (3)',
    viewTable: 'Tableau de Données',
    viewHeatmap: 'Grille Heatmap',
    viewCards: 'Fiches Quant',
    colAction: 'Position / Sens',
    colTicker: 'Ticker & Marché',
    colPrice: 'Cours en Direct',
    colChange: 'Var. Jour %',
    colCompany: 'Société & Secteur',
    colConfidence: 'Score de Confiance',
    colAudit: 'Statut d’Audit Critique',
    colCitation: 'Source Primaire & Citation (Traçabilité)',
    colMarginDelta: 'Delta Marge Est.',
    colTargetRR: 'Ratio R/R',
    colEpsSurprise: 'Surprise BPA',
    colTelemetry: 'Télémétrie',

    heatmapTitle: 'MATRICE HEATMAP : SCORE DE CONVICTION VS. DELTA DE MARGE ESTIMÉ',
    heatmapSubtitle: 'Classement Visuel Croisé des 6 Tickers d’Alpha',
    sortAlphaRank: 'Rang Alpha',
    sortConviction: 'Conviction',
    sortMarginDelta: 'Delta Marge',
    sortLsGrouped: 'Groupé L/S',
    convictionScoreLabel: 'Score de Conviction',
    estMarginDeltaLabel: 'Delta de Marge Est.',
    scatterTitle: 'Dispersion 2D Conviction vs. Delta de Marge',

    supplyChainRippleTitle: 'Étapes d’Onde Logistique (Tier 0 à Tier 4)',
    marginMatrixTitle: 'Divergence Compression vs. Expansion des Marges',
    propagationVelocity: 'Vitesse de Propagation',
    chokepoints: 'Goulots d’Étranglement',
    substitutability: 'Substituabilité',
    squeezedSectors: 'Industries sous Compression (Inflation Coûts)',
    expandedSectors: 'Industries sous Expansion (Rareté & Prix)',

    exportTitle: 'Exporter vers Google Sheets',
    telemetryModalTitle: 'Télémétrie des Facteurs & Traçabilité des Données',
    closeBtn: 'Fermer',
  },

  ru: {
    terminalTitle: 'AlphaChain // Терминал Квант-Анализа',
    tagline: 'Мониторинг Физических Событий, Аудит Нулевого Доверия и Синтез L/S Альфы',
    liveApiConnected: 'РЕАЛЬНЫЕ КОТИРОВКИ ПОДКЛЮЧЕНЫ',
    degradedFallback: 'ДЕГРАДАЦИЯ: ЭВРИСТИЧЕСКАЯ МОДЕЛЬ',
    devAuditMode: 'АУДИТ РАЗРАБОТЧИКА',
    liveSync: 'СИНХРОНИЗАЦИЯ',
    syncing: 'СИНХРОНИЗАЦИЯ...',
    exportToSheets: 'ЭКСПОРТ В ТАБЛИЦЫ',
    signIn: 'ВОЙТИ ЧЕРЕЗ GOOGLE',
    signOut: 'ВЫЙТИ',
    agentMemorySynced: 'Память Агента: Синхронизирована',
    agentMemoryTooltip: 'Запомнены параметры портфельного управляющего, недавние события и статус аудита',

    strictGroundingTitle: 'ДИРЕКТИВА СТРОГОГО ПОДТВЕРЖДЕНИЯ ДАННЫХ:',
    strictGroundingDesc: 'Все инвестиционные гипотезы генерируются на основе фактов и проверенных новостей. Неподтвержденные тезисы отсекаются.',
    groundingEngineActive: 'ДВИЖОК ВЕРИФИКАЦИИ: АКТИВЕН',
    provenanceAudited: 'ИСТОЧНИКИ L3 ПРОВЕРЕНЫ',

    eventInputLabel: 'ТРИГГЕР МАКРОЭКОНОМИЧЕСКОГО СБОЯ',
    eventInputPlaceholder: 'Введите реальное событие: например, Забастовка портовых рабочих в Роттердаме, Пожар на литиевом заводе в Атакаме...',
    horizonLabel: 'ГОРИЗОНТ ИНВЕСТИРОВАНИЯ',
    horizonTactical: 'Тактический (1-3 мес)',
    horizonStructural: 'Структурный (6-12 мес)',
    depthLabel: 'ГЛУБИНА АНАЛИЗА ЦЕПОЧКИ',
    depthStandard: 'Уровень 3 Стандарт',
    depthDeep: 'Уровень 4 Экспертиза',
    runAnalysisBtn: 'СИНТЕЗИРОВАТЬ АЛЬФА-СТРАТЕГИЮ',
    runningBtn: 'ГЕНЕРАЦИЯ АЛЬФЫ...',
    runAuditBtn: 'ЗАПУСТИТЬ КРИТИЧЕСКИЙ АУДИТ',
    auditingBtn: 'ПРОВЕРКА ИСТОЧНИКОВ...',
    quickPromptsLabel: 'ИНСТИТУЦИОНАЛЬНЫЕ СЦЕНАРИИ',
    memoryRecentPromptsLabel: 'СОХРАНЕННЫЕ СОБЫТИЯ В ПАМЯТИ АГЕНТА',
    clearMemoryBtn: 'ОЧИСТИТЬ ПАМЯТЬ',

    tabAll: 'ПОЛНЫЙ ДАШБОРД АЛЬФЫ',
    tabPairs: 'ПАРЫ LONG/SHORT',
    tabRipple: 'ВОЛНЫ В ЦЕПОЧКЕ',
    tabMargins: 'МАТРИЦА МАРЖИ',
    tabHeatmap: 'ТЕПЛОВАЯ КАРТА',

    alphaPairsTitle: 'Проверенные Альфа-Пары // Институциональная Таблица Исполнения',
    filterAll: 'Все (6)',
    filterLongs: 'Лонг (3)',
    filterShorts: 'Шорт (3)',
    viewTable: 'Таблица',
    viewHeatmap: 'Тепловая Карта',
    viewCards: 'Квант-Карточки',
    colAction: 'Позиция',
    colTicker: 'Тикер и Биржа',
    colPrice: 'Цена Онлайн',
    colChange: 'Изм. за день %',
    colCompany: 'Компания и Сектор',
    colConfidence: 'Индекс Доверия',
    colAudit: 'Статус Аудита',
    colCitation: 'Первоисточник и Цитата (Трассируемость)',
    colMarginDelta: 'Дельта Маржи (б.п.)',
    colTargetRR: 'Риск / Доходность',
    colEpsSurprise: 'Сюрприз EPS',
    colTelemetry: 'Телеметрия',

    heatmapTitle: 'ТЕПЛОВАЯ МАТРИЦА: УВЕРЕННОСТЬ VS. ОЦЕНКА ИЗМЕНЕНИЯ МАРЖИ',
    heatmapSubtitle: 'Наглядное ранжирование всех 6 инструментов физического события',
    sortAlphaRank: 'Ранг Альфы',
    sortConviction: 'Уверенность',
    sortMarginDelta: 'Дельта Маржи',
    sortLsGrouped: 'Группировка L/S',
    convictionScoreLabel: 'Уверенность',
    estMarginDeltaLabel: 'Дельта Маржи',
    scatterTitle: '2D-Диаграмма рассеяния: Уверенность против Дельты Маржи',

    supplyChainRippleTitle: 'Этапы распространения шока в цепочке поставок (Tier 0 - Tier 4)',
    marginMatrixTitle: 'Сжатие против Экспансии Маржинальности',
    propagationVelocity: 'Скорость распространения',
    chokepoints: 'Узкие места',
    substitutability: 'Взаимозаменяемость',
    squeezedSectors: 'Секторы под давлением издержек (Сжатие)',
    expandedSectors: 'Секторы с ценовой силой (Экспансия)',

    exportTitle: 'Экспорт в Google Sheets',
    telemetryModalTitle: 'Квант-Телеметрия и Происхождение Данных',
    closeBtn: 'Закрыть',
  },

  ar: {
    terminalTitle: 'AlphaChain // شاشة الكم المؤسسية',
    tagline: 'رصد الأحداث المادية، التحقق الصارم الخالي من الثقة، وتوليد استراتيجيات التحوط غير المتماثلة',
    liveApiConnected: 'واجهة الأسعار المباشرة متصلة',
    degradedFallback: 'الوضع التقديري: تفعيل القواعد الإرشادية',
    devAuditMode: 'تدقيق المطور',
    liveSync: 'تزامن مباشر',
    syncing: 'جارٍ التزامن...',
    exportToSheets: 'تصدير إلى الجداول',
    signIn: 'تسجيل الدخول عبر Google',
    signOut: 'تسجيل الخروج',
    agentMemorySynced: 'ذاكرة الوكيل: متزامنة',
    agentMemoryTooltip: 'تم حفظ تفضيلات مدير المحفظة والأحداث السابقة وحالة التدقيق عبر الجلسات',

    strictGroundingTitle: 'توجيه الإسناد الحقيقي الصارم:',
    strictGroundingDesc: 'تُستخلص جميع الأطروحات الاستثمارية من أبحاث واقعية موثقة. تُستبعد الادعاءات غير المؤكدة بدقة.',
    groundingEngineActive: 'محرك التحقق: نشط',
    provenanceAudited: 'موثوقية البيانات L3 مدققة',

    eventInputLabel: 'مُحفز الاضطراب المادي واللوجستي العالمي',
    eventInputPlaceholder: 'أدخل حدثاً واقعياً: مثل إضراب عمال موانئ روتردام، حريق مصفاة الليثيوم في أتاكاما، تهديدات الملاحة في البحر الأحمر...',
    horizonLabel: 'الأفق الزمني',
    horizonTactical: 'تكتيكي (1-3 أشهر)',
    horizonStructural: 'هيكلي (6-12 شهراً)',
    depthLabel: 'عمق سلاسل الإمداد',
    depthStandard: 'المستوى 3 القياسي',
    depthDeep: 'المستوى 4 الجنائي المتعمق',
    runAnalysisBtn: 'توليد أطروحة الألفا الاستثمارية',
    runningBtn: 'جارٍ التركيب الكمي...',
    runAuditBtn: 'تشغيل تدقيق الوكيل الناقد',
    auditingBtn: 'جارٍ تدقيق المراجع...',
    quickPromptsLabel: 'سيناريوهات معيارية مؤسسية',
    memoryRecentPromptsLabel: 'الأحداث المحفوظة في ذاكرة الوكيل',
    clearMemoryBtn: 'مسح الذاكرة',

    tabAll: 'لوحة الألفا الشاملة',
    tabPairs: 'أزواج الشراء/البيع (L/S)',
    tabRipple: 'موجات سلاسل التوريد',
    tabMargins: 'مصفوفة الهوامش',
    tabHeatmap: 'الخريطة الحرارية',

    alphaPairsTitle: 'أزواج الألفا المدققة عديمة الثقة // جدول التنفيذ المؤسسي',
    filterAll: 'الكل (6)',
    filterLongs: 'شراء (3)',
    filterShorts: 'بيع على المكشوف (3)',
    viewTable: 'جدول البيانات',
    viewHeatmap: 'الخريطة الحرارية',
    viewCards: 'بطاقات التداول',
    colAction: 'الاتجاه / العملية',
    colTicker: 'رمز السهم والسوق',
    colPrice: 'السعر المباشر',
    colChange: 'التغير اليومي %',
    colCompany: 'الشركة والقطاع',
    colConfidence: 'معدل الثقة',
    colAudit: 'حالة التدقيق الحرج',
    colCitation: 'المصدر الأساسي والإسناد (موثوقية المصدر)',
    colMarginDelta: 'تغير الهامش المقدر',
    colTargetRR: 'العائد / المخاطرة',
    colEpsSurprise: 'مفاجأة الربحية',
    colTelemetry: 'القياس الكمي',

    heatmapTitle: 'مصفوفة الخريطة الحرارية: درجة اليقين مقابل تغير هامش الربح المقدر',
    heatmapSubtitle: 'تصنيف بصري متقاطع للأسهم الستة المتأثرة بالحدث المادي',
    sortAlphaRank: 'تصنيف الألفا',
    sortConviction: 'درجة اليقين',
    sortMarginDelta: 'تغير الهامش',
    sortLsGrouped: 'تجميع شراء/بيع',
    convictionScoreLabel: 'درجة اليقين',
    estMarginDeltaLabel: 'تغير الهامش المقدر',
    scatterTitle: 'مخطط التشتت ثنائي الأبعاد: اليقين مقابل تغير الهامش',

    supplyChainRippleTitle: 'مراحل تموج سلاسل الإمداد (المستوى 0 إلى 4)',
    marginMatrixTitle: 'تباين ضغط الهوامش مقابل التوسع السعري',
    propagationVelocity: 'سرعة الانتشار',
    chokepoints: 'نقاط الاختناق',
    substitutability: 'قابلية الاستبدال',
    squeezedSectors: 'القطاعات المتضررة بتضخم التكاليف (انكماش)',
    expandedSectors: 'القطاعات ذات القوة التسعيرية (توسع الهوامش)',

    exportTitle: 'تصدير إلى جداول بيانات Google',
    telemetryModalTitle: 'قياسات العوامل وتوثيق مصادر البيانات',
    closeBtn: 'إغلاق',
  },

  de: {
    terminalTitle: 'AlphaChain // Quant-Terminal',
    tagline: 'Physische Ereignis-Sourcing, Zero-Trust-Faktenprüfung & Asymmetrische L/S-Alpha-Synthese',
    liveApiConnected: 'ECHTZEIT-API VERBUNDEN',
    degradedFallback: 'DEGRADIERT: HEURISTISCHES FALLBACK',
    devAuditMode: 'DEV-AUDIT',
    liveSync: 'LIVE-SYNC',
    syncing: 'SYNCHRONISIERE...',
    exportToSheets: 'IN SHEETS EXPORTIEREN',
    signIn: 'MIT GOOGLE ANMELDEN',
    signOut: 'ABMELDEN',
    agentMemorySynced: 'Agenten-Gedächtnis: Synchronisiert',
    agentMemoryTooltip: 'Fondsmanager-Präferenzen, kürzliche Makroereignisse und Audit-Status sitzungsübergreifend gespeichert',

    strictGroundingTitle: 'STRIKTE VERIFIKATIONSRICHTLINIE:',
    strictGroundingDesc: 'Alle Anlagehypothesen werden durch verifizierte Echtzeit-Websuche fundiert. Unbestätigte Thesen werden rigoros gefiltert.',
    groundingEngineActive: 'GROUNDING-ENGINE: AKTIV',
    provenanceAudited: 'L3-DATENURSPRUNG GEPRÜFT',

    eventInputLabel: 'PHYSISCHER DISRUPTIONS- UND LIEFERKETTEN-AUSLÖSER',
    eventInputPlaceholder: 'Reales Ereignis eingeben: z. B. Hafenstreik in Rotterdam, Brand in Atacama-Lithium-Raffinerie, Red-Sea-Blockade...',
    horizonLabel: 'ZEITHORIZONT',
    horizonTactical: 'Taktisch (1-3 Monate)',
    horizonStructural: 'Strukturell (6-12 Monate)',
    depthLabel: 'LIEFERKETTENTIEFE',
    depthStandard: 'Tier-3 Standardanalyse',
    depthDeep: 'Tier-4 Forensische Tiefe',
    runAnalysisBtn: 'ALPHA-THESE GENERIEREN',
    runningBtn: 'SYNTHETISIERE ALPHA...',
    runAuditBtn: 'KRITIKER-AGENTEN-AUDIT STARTEN',
    auditingBtn: 'PRÜFE ZITATE...',
    quickPromptsLabel: 'INSTITUTIONELLE BENCHMARK-SZENARIEN',
    memoryRecentPromptsLabel: 'IM AGENTEN-GEDÄCHTNIS GESPEICHERTE EREIGNISSE',
    clearMemoryBtn: 'SPEICHER LEEREN',

    tabAll: 'VOLLSTÄNDIGES ALPHA-DASHBOARD',
    tabPairs: 'L/S-HANDELSPAARE',
    tabRipple: 'LIEFERKETTEN-KASKADEN',
    tabMargins: 'MARGEN-MATRIX',
    tabHeatmap: 'HEATMAP-RASTER',

    alphaPairsTitle: 'Zero-Trust Faktengeprüfte Alpha-Paare // Institutionelle Ausführungstabelle',
    filterAll: 'Alle (6)',
    filterLongs: 'Long (3)',
    filterShorts: 'Short (3)',
    viewTable: 'Datentabelle',
    viewHeatmap: 'Heatmap-Raster',
    viewCards: 'Quant-Karten',
    colAction: 'Position / Richtung',
    colTicker: 'Ticker & Börse',
    colPrice: 'Live-Kurs',
    colChange: 'Tag % Änd.',
    colCompany: 'Unternehmen & Branche',
    colConfidence: 'Konfidenz-Score',
    colAudit: 'Audit-Status',
    colCitation: 'Primärquelle & Zitat (Datenprovenienz)',
    colMarginDelta: 'Geschätztes Margendelta',
    colTargetRR: 'Chance-Risiko-Verhältnis',
    colEpsSurprise: 'EPS-Überraschung',
    colTelemetry: 'Telemetrie',

    heatmapTitle: 'HEATMAP-MATRIX: CONVICTION-SCORE VS. GESCHÄTZTES MARGENDELTA',
    heatmapSubtitle: 'Visuelles Kreuz-Ranking aller 6 physischen Alpha-Kandidaten',
    sortAlphaRank: 'Alpha-Rang',
    sortConviction: 'Conviction',
    sortMarginDelta: 'Margendelta',
    sortLsGrouped: 'L/S Gruppiert',
    convictionScoreLabel: 'Conviction-Score',
    estMarginDeltaLabel: 'Geschätztes Margendelta',
    scatterTitle: '2D-Streudiagramm: Conviction vs. Margendelta',

    supplyChainRippleTitle: 'Lieferketten-Ausbreitungsstufen (Tier 0 bis Tier 4)',
    marginMatrixTitle: 'Divergenz Margenkompression vs. Margenexpansion',
    propagationVelocity: 'Ausbreitungsgeschwindigkeit',
    chokepoints: 'Engpässe',
    substitutability: 'Substituierbarkeit',
    squeezedSectors: 'Margenkomprimierte Sektoren (Inputkosten-Inflation)',
    expandedSectors: 'Margenexpandierte Sektoren (Preissetzungskraft)',

    exportTitle: 'In Google Sheets exportieren',
    telemetryModalTitle: 'Faktortelemetrie & Datenursprung',
    closeBtn: 'Schließen',
  },

  ja: {
    terminalTitle: 'AlphaChain // クオンツ端末',
    tagline: '実世界事象ソーシング、ゼロトラスト事実検証、非対称ロング/ショート・アルファ合成',
    liveApiConnected: 'リアルタイムAPI接続中',
    degradedFallback: '縮退運転：ヒューリスティックモード',
    devAuditMode: '開発者監査モード',
    liveSync: 'リアルタイム同期',
    syncing: '同期中...',
    exportToSheets: 'スプレッドシートへエクスポート',
    signIn: 'Googleアカウントでログイン',
    signOut: 'ログアウト',
    agentMemorySynced: 'エージェント記憶：同期完了',
    agentMemoryTooltip: 'ポートフォリオ管理者の嗜好、直近の分析事象、監査設定をセッション間で保持',

    strictGroundingTitle: '厳格な事実根拠付け指令：',
    strictGroundingDesc: 'すべてのアルファ投資仮説はリアルタイムのウェブ事実検証に基づき生成されます。裏付けのない主張は除外されます。',
    groundingEngineActive: '根拠付けエンジン：稼働中',
    provenanceAudited: 'L3レベルのデータ出所検証済み',

    eventInputLabel: '実世界物理的サプライチェーン混乱トリガー',
    eventInputPlaceholder: '実際の物理的事象を入力：例：ロッテルダム港湾ストライキ、アタカマのリチウム精錬所火災、紅海航路の運航停止...',
    horizonLabel: '投資期間',
    horizonTactical: '戦術的 (1〜3ヶ月)',
    horizonStructural: '構造的 (6〜12ヶ月)',
    depthLabel: 'サプライチェーン分析深度',
    depthStandard: 'Tier-3 標準分析',
    depthDeep: 'Tier-4 フォレンジック深層分析',
    runAnalysisBtn: 'アルファ投資仮説を合成',
    runningBtn: 'アルファ合成中...',
    runAuditBtn: '批評家エージェント監査を実行',
    auditingBtn: '引用文献を検証中...',
    quickPromptsLabel: '機関投資家向けベンチマーク事例',
    memoryRecentPromptsLabel: 'エージェント記憶：最近分析した事象',
    clearMemoryBtn: '記憶を消去',

    tabAll: 'アルファ総合ダッシュボード',
    tabPairs: 'L/Sペア銘柄',
    tabRipple: '波及パス',
    tabMargins: 'マージン変化',
    tabHeatmap: 'ヒートマップ',

    alphaPairsTitle: 'ゼロトラスト事実検証済みアルファペア // 機関投資家向け執行テーブル',
    filterAll: '全銘柄 (6)',
    filterLongs: 'ロング (3)',
    filterShorts: 'ショート (3)',
    viewTable: 'データテーブル',
    viewHeatmap: 'ヒートマップ格子',
    viewCards: 'クオンツカード',
    colAction: 'ポジション / 方向',
    colTicker: 'ティッカー & 取引所',
    colPrice: '現在値',
    colChange: '前日比 %',
    colCompany: '企業名 & セクター',
    colConfidence: '確信度スコア',
    colAudit: '監査ステータス',
    colCitation: '一次情報源 & 引用文 (データ出所)',
    colMarginDelta: '予想マージン変化 (bps)',
    colTargetRR: '目標リスクリワード',
    colEpsSurprise: 'EPSサプライズ',
    colTelemetry: 'テレメトリ',

    heatmapTitle: 'ヒートマップ行列：確信度スコア VS. 予想マージン変化',
    heatmapSubtitle: '物理的混乱の影響を受ける6大アルファ銘柄の総合ビジュアル格付け',
    sortAlphaRank: '総合アルファ順',
    sortConviction: '確信度順',
    sortMarginDelta: 'マージン変動順',
    sortLsGrouped: 'L/Sグループ順',
    convictionScoreLabel: '確信度スコア',
    estMarginDeltaLabel: '予想マージン変化',
    scatterTitle: '2D散布図：確信度 vs. マージン変動',

    supplyChainRippleTitle: 'サプライチェーン波及ステージ (Tier 0 〜 Tier 4)',
    marginMatrixTitle: 'マージン圧迫 vs. 拡大のダイバージェンス',
    propagationVelocity: '波及速度',
    chokepoints: 'ボトルネック',
    substitutability: '代替容易性',
    squeezedSectors: '投入コスト高騰による圧迫セクター',
    expandedSectors: '価格決定力による利益率拡大セクター',

    exportTitle: 'Googleスプレッドシートへ出力',
    telemetryModalTitle: '機関投資家向けファクター解析 & データ出所',
    closeBtn: '閉じる',
  },
};
