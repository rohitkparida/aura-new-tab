export interface Translations {
  // Time formats
  time: {
    am: string;
    pm: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
  // Settings UI
  settings: {
    title: string;
    basic: string;
    appearance: string;
    advanced: string;
    display: string;
    date: string;
    dayOfWeek: string;
    twelveHourFormat: string;
    showAmPm: string;
    clockStyle: string;
    digital: string;
    analog: string;
    colorTheme: string;
    auto: string;
    light: string;
    font: string;
    visualEffects: string;
    enableAnimations: string;
    grainEffect: string;
    analogFeatures: string;
    hourMarkers: string;
    smoothHandMotion: string;
    loading: string;
    settingsSaved: string;
    error: string;
  };
  // Theme names
  themes: {
    dynamic: string;
    light: string;
    aurora: string;
    graphite: string;
    pacific: string;
    sierra: string;
    sunrise: string;
    horizon: string;
    twilight: string;
    midnight: string;
    rose: string;
    forest: string;
    ocean: string;
    desert: string;
    lavender: string;
    mint: string;
  };
}

// Default English translations
export const en: Translations = {
  time: {
    am: 'AM',
    pm: 'PM',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  },
  settings: {
    title: 'Clock Settings',
    basic: 'Basic',
    appearance: 'Appearance',
    advanced: 'Advanced',
    display: 'Display',
    date: 'Date',
    dayOfWeek: 'Day of week',
    twelveHourFormat: '12-hour format',
    showAmPm: 'Show AM/PM',
    clockStyle: 'Clock Style',
    digital: 'Digital',
    analog: 'Analog',
    colorTheme: 'Color Theme',
    auto: 'Auto (Time-based)',
    light: 'Light',
    font: 'Font',
    visualEffects: 'Visual Effects',
    enableAnimations: 'Enable animations',
    grainEffect: 'Grain effect',
    analogFeatures: 'Analog Features',
    hourMarkers: 'Hour markers',
    smoothHandMotion: 'Smooth hand motion',
    loading: 'Loading settings...',
    settingsSaved: 'Settings saved',
    error: 'Error'
  },
  themes: {
    dynamic: 'Auto (Time-based)',
    light: 'Light',
    aurora: 'Aurora',
    graphite: 'Graphite',
    pacific: 'Pacific',
    sierra: 'Sierra',
    sunrise: 'Sunrise',
    horizon: 'Horizon',
    twilight: 'Twilight',
    midnight: 'Midnight',
    rose: 'Rose',
    forest: 'Forest',
    ocean: 'Ocean',
    desert: 'Desert',
    lavender: 'Lavender',
    mint: 'Mint'
  }
};

// Spanish translations
export const es: Translations = {
  time: {
    am: 'AM',
    pm: 'PM',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre'
  },
  settings: {
    title: 'Configuración del Reloj',
    basic: 'Básico',
    appearance: 'Apariencia',
    advanced: 'Avanzado',
    display: 'Mostrar',
    date: 'Fecha',
    dayOfWeek: 'Día de la semana',
    twelveHourFormat: 'Formato 12 horas',
    showAmPm: 'Mostrar AM/PM',
    clockStyle: 'Estilo de Reloj',
    digital: 'Digital',
    analog: 'Analógico',
    colorTheme: 'Tema de Color',
    auto: 'Automático (Basado en hora)',
    light: 'Claro',
    font: 'Fuente',
    visualEffects: 'Efectos Visuales',
    enableAnimations: 'Activar animaciones',
    grainEffect: 'Efecto granulado',
    analogFeatures: 'Características Analógicas',
    hourMarkers: 'Marcadores de hora',
    smoothHandMotion: 'Movimiento suave de manecillas',
    loading: 'Cargando configuración...',
    settingsSaved: 'Configuración guardada',
    error: 'Error'
  },
  themes: {
    dynamic: 'Automático (Basado en hora)',
    light: 'Claro',
    aurora: 'Aurora',
    graphite: 'Grafito',
    pacific: 'Pacífico',
    sierra: 'Sierra',
    sunrise: 'Amanecer',
    horizon: 'Horizonte',
    twilight: 'Crepúsculo',
    midnight: 'Medianoche',
    rose: 'Rosa',
    forest: 'Bosque',
    ocean: 'Océano',
    desert: 'Desierto',
    lavender: 'Lavanda',
    mint: 'Menta'
  }
};

// French translations
export const fr: Translations = {
  time: {
    am: 'AM',
    pm: 'PM',
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre'
  },
  settings: {
    title: 'Paramètres d\'Horloge',
    basic: 'Basique',
    appearance: 'Apparence',
    advanced: 'Avancé',
    display: 'Affichage',
    date: 'Date',
    dayOfWeek: 'Jour de la semaine',
    twelveHourFormat: 'Format 12 heures',
    showAmPm: 'Afficher AM/PM',
    clockStyle: 'Style d\'Horloge',
    digital: 'Numérique',
    analog: 'Analogique',
    colorTheme: 'Thème de Couleur',
    auto: 'Auto (Basé sur l\'heure)',
    light: 'Clair',
    font: 'Police',
    visualEffects: 'Effets Visuels',
    enableAnimations: 'Activer les animations',
    grainEffect: 'Effet de grain',
    analogFeatures: 'Fonctionnalités Analogiques',
    hourMarkers: 'Marqueurs d\'heure',
    smoothHandMotion: 'Mouvement fluide des aiguilles',
    loading: 'Chargement des paramètres...',
    settingsSaved: 'Paramètres sauvegardés',
    error: 'Erreur'
  },
  themes: {
    dynamic: 'Auto (Basé sur l\'heure)',
    light: 'Clair',
    aurora: 'Aurore',
    graphite: 'Graphite',
    pacific: 'Pacifique',
    sierra: 'Sierra',
    sunrise: 'Lever du soleil',
    horizon: 'Horizon',
    twilight: 'Crépuscule',
    midnight: 'Minuit',
    rose: 'Rose',
    forest: 'Forêt',
    ocean: 'Océan',
    desert: 'Désert',
    lavender: 'Lavande',
    mint: 'Menthe'
  }
};

// German translations
export const de: Translations = {
  time: {
    am: 'AM',
    pm: 'PM',
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
    january: 'Januar',
    february: 'Februar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Dezember'
  },
  settings: {
    title: 'Uhr-Einstellungen',
    basic: 'Basis',
    appearance: 'Aussehen',
    advanced: 'Erweitert',
    display: 'Anzeige',
    date: 'Datum',
    dayOfWeek: 'Wochentag',
    twelveHourFormat: '12-Stunden-Format',
    showAmPm: 'AM/PM anzeigen',
    clockStyle: 'Uhr-Stil',
    digital: 'Digital',
    analog: 'Analog',
    colorTheme: 'Farbthema',
    auto: 'Auto (Zeitbasiert)',
    light: 'Hell',
    font: 'Schriftart',
    visualEffects: 'Visuelle Effekte',
    enableAnimations: 'Animationen aktivieren',
    grainEffect: 'Körnungseffekt',
    analogFeatures: 'Analoge Funktionen',
    hourMarkers: 'Stundenmarkierungen',
    smoothHandMotion: 'Geschmeidige Zeigerbewegung',
    loading: 'Einstellungen werden geladen...',
    settingsSaved: 'Einstellungen gespeichert',
    error: 'Fehler'
  },
  themes: {
    dynamic: 'Auto (Zeitbasiert)',
    light: 'Hell',
    aurora: 'Aurora',
    graphite: 'Graphit',
    pacific: 'Pazifik',
    sierra: 'Sierra',
    sunrise: 'Sonnenaufgang',
    horizon: 'Horizont',
    twilight: 'Dämmerung',
    midnight: 'Mitternacht',
    rose: 'Rose',
    forest: 'Wald',
    ocean: 'Ozean',
    desert: 'Wüste',
    lavender: 'Lavendel',
    mint: 'Minze'
  }
};

// Japanese translations
export const ja: Translations = {
  time: {
    am: '午前',
    pm: '午後',
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月'
  },
  settings: {
    title: '時計の設定',
    basic: '基本',
    appearance: '外観',
    advanced: '詳細',
    display: '表示',
    date: '日付',
    dayOfWeek: '曜日',
    twelveHourFormat: '12時間表示',
    showAmPm: '午前/午後を表示',
    clockStyle: '時計スタイル',
    digital: 'デジタル',
    analog: 'アナログ',
    colorTheme: 'カラーテーマ',
    auto: '自動 (時間に応じて)',
    light: 'ライト',
    font: 'フォント',
    visualEffects: '視覚効果',
    enableAnimations: 'アニメーションを有効にする',
    grainEffect: 'グレイン効果',
    analogFeatures: 'アナログ機能',
    hourMarkers: '時間マーカー',
    smoothHandMotion: '針の滑らかな動き',
    loading: '設定を読み込み中...',
    settingsSaved: '設定を保存しました',
    error: 'エラー'
  },
  themes: {
    dynamic: '自動 (時間に応じて)',
    light: 'ライト',
    aurora: 'オーロラ',
    graphite: 'グラファイト',
    pacific: 'パシフィック',
    sierra: 'シエラ',
    sunrise: '日の出',
    horizon: 'ホライゾン',
    twilight: 'トワイライト',
    midnight: '真夜中',
    rose: 'ローズ',
    forest: 'フォレスト',
    ocean: 'オーシャン',
    desert: 'デザート',
    lavender: 'ラベンダー',
    mint: 'ミント'
  }
};

// Korean translations
export const ko: Translations = {
  time: {
    am: '오전',
    pm: '오후',
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
    january: '1월',
    february: '2월',
    march: '3월',
    april: '4월',
    may: '5월',
    june: '6월',
    july: '7월',
    august: '8월',
    september: '9월',
    october: '10월',
    november: '11월',
    december: '12월'
  },
  settings: {
    title: '시계 설정',
    basic: '기본',
    appearance: '외형',
    advanced: '고급',
    display: '표시',
    date: '날짜',
    dayOfWeek: '요일',
    twelveHourFormat: '12시간 형식',
    showAmPm: '오전/오후 표시',
    clockStyle: '시계 스타일',
    digital: '디지털',
    analog: '아날로그',
    colorTheme: '색상 테마',
    auto: '자동 (시간 기반)',
    light: '라이트',
    font: '글꼴',
    visualEffects: '시각 효과',
    enableAnimations: '애니메이션 활성화',
    grainEffect: '그레인 효과',
    analogFeatures: '아날로그 기능',
    hourMarkers: '시간 마커',
    smoothHandMotion: '부드러운 바늘 움직임',
    loading: '설정 불러오는 중...',
    settingsSaved: '설정이 저장되었습니다',
    error: '오류'
  },
  themes: {
    dynamic: '자동 (시간 기반)',
    light: '라이트',
    aurora: '오로라',
    graphite: '그래파이트',
    pacific: '퍼시픽',
    sierra: '시에라',
    sunrise: '일출',
    horizon: '수평선',
    twilight: '황혼',
    midnight: '자정',
    rose: '로즈',
    forest: '숲',
    ocean: '바다',
    desert: '사막',
    lavender: '라벤더',
    mint: '민트'
  }
};

// Portuguese (Brazil) translations
export const pt: Translations = {
  time: {
    am: 'AM',
    pm: 'PM',
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
    january: 'Janeiro',
    february: 'Fevereiro',
    march: 'Março',
    april: 'Abril',
    may: 'Maio',
    june: 'Junho',
    july: 'Julho',
    august: 'Agosto',
    september: 'Setembro',
    october: 'Outubro',
    november: 'Novembro',
    december: 'Dezembro'
  },
  settings: {
    title: 'Configurações do Relógio',
    basic: 'Básico',
    appearance: 'Aparência',
    advanced: 'Avançado',
    display: 'Exibição',
    date: 'Data',
    dayOfWeek: 'Dia da semana',
    twelveHourFormat: 'Formato 12 horas',
    showAmPm: 'Mostrar AM/PM',
    clockStyle: 'Estilo do Relógio',
    digital: 'Digital',
    analog: 'Analógico',
    colorTheme: 'Tema de Cores',
    auto: 'Automático (Baseado no horário)',
    light: 'Claro',
    font: 'Fonte',
    visualEffects: 'Efeitos Visuais',
    enableAnimations: 'Ativar animações',
    grainEffect: 'Efeito granulado',
    analogFeatures: 'Recursos Analógicos',
    hourMarkers: 'Marcadores de hora',
    smoothHandMotion: 'Movimento suave dos ponteiros',
    loading: 'Carregando configurações...',
    settingsSaved: 'Configurações salvas',
    error: 'Erro'
  },
  themes: {
    dynamic: 'Automático (Baseado no horário)',
    light: 'Claro',
    aurora: 'Aurora',
    graphite: 'Grafite',
    pacific: 'Pacífico',
    sierra: 'Sierra',
    sunrise: 'Nascer do sol',
    horizon: 'Horizonte',
    twilight: 'Crepúsculo',
    midnight: 'Meia-noite',
    rose: 'Rosa',
    forest: 'Floresta',
    ocean: 'Oceano',
    desert: 'Deserto',
    lavender: 'Lavanda',
    mint: 'Hortelã'
  }
};

// Simplified Chinese
export const zh: Translations = {
  time: {
    am: '上午',
    pm: '下午',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月'
  },
  settings: {
    title: '时钟设置',
    basic: '基础',
    appearance: '外观',
    advanced: '高级',
    display: '显示',
    date: '日期',
    dayOfWeek: '星期',
    twelveHourFormat: '12小时制',
    showAmPm: '显示上午/下午',
    clockStyle: '时钟样式',
    digital: '数字',
    analog: '指针',
    colorTheme: '配色主题',
    auto: '自动（基于时间）',
    light: '浅色',
    font: '字体',
    visualEffects: '视觉效果',
    enableAnimations: '启用动画',
    grainEffect: '颗粒效果',
    analogFeatures: '指针功能',
    hourMarkers: '小时标记',
    smoothHandMotion: '指针平滑移动',
    loading: '加载设置中...',
    settingsSaved: '设置已保存',
    error: '错误'
  },
  themes: {
    dynamic: '自动（基于时间）',
    light: '浅色',
    aurora: '极光',
    graphite: '石墨',
    pacific: '太平洋',
    sierra: '塞拉',
    sunrise: '日出',
    horizon: '地平线',
    twilight: '暮光',
    midnight: '午夜',
    rose: '玫瑰',
    forest: '森林',
    ocean: '海洋',
    desert: '沙漠',
    lavender: '薰衣草',
    mint: '薄荷'
  }
};

// Traditional Chinese (Taiwan)
export const zhTW: Translations = {
  time: {
    am: '上午',
    pm: '下午',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月'
  },
  settings: {
    title: '時鐘設定',
    basic: '基本',
    appearance: '外觀',
    advanced: '進階',
    display: '顯示',
    date: '日期',
    dayOfWeek: '星期',
    twelveHourFormat: '12 小時制',
    showAmPm: '顯示上午/下午',
    clockStyle: '時鐘樣式',
    digital: '數位',
    analog: '指針',
    colorTheme: '主題色彩',
    auto: '自動（依時間）',
    light: '淺色',
    font: '字體',
    visualEffects: '視覺效果',
    enableAnimations: '啟用動畫',
    grainEffect: '顆粒效果',
    analogFeatures: '指針功能',
    hourMarkers: '時標',
    smoothHandMotion: '指針平滑移動',
    loading: '正在載入設定...',
    settingsSaved: '設定已儲存',
    error: '錯誤'
  },
  themes: {
    dynamic: '自動（依時間）',
    light: '淺色',
    aurora: '極光',
    graphite: '石墨',
    pacific: '太平洋',
    sierra: '塞拉',
    sunrise: '日出',
    horizon: '地平線',
    twilight: '暮光',
    midnight: '午夜',
    rose: '玫瑰',
    forest: '森林',
    ocean: '海洋',
    desert: '沙漠',
    lavender: '薰衣草',
    mint: '薄荷'
  }
};

// Hindi translations
export const hi: Translations = {
    time: {
      am: 'पूर्वाह्न',
      pm: 'अपराह्न',
      monday: 'सोमवार',
      tuesday: 'मंगलवार',
      wednesday: 'बुधवार',
      thursday: 'गुरुवार',
      friday: 'शुक्रवार',
      saturday: 'शनिवार',
      sunday: 'रविवार',
      january: 'जनवरी',
      february: 'फ़रवरी',
      march: 'मार्च',
      april: 'अप्रैल',
      may: 'मई',
      june: 'जून',
      july: 'जुलाई',
      august: 'अगस्त',
      september: 'सितंबर',
      october: 'अक्टूबर',
      november: 'नवंबर',
      december: 'दिसंबर'
    },
    settings: {
      title: 'घड़ी सेटिंग्स',
      basic: 'मूल',
      appearance: 'रूप',
      advanced: 'उन्नत',
      display: 'प्रदर्शन',
      date: 'तारीख',
      dayOfWeek: 'सप्ताह का दिन',
      twelveHourFormat: '12-घंटे प्रारूप',
      showAmPm: 'पूर्वाह्न/अपराह्न दिखाएँ',
      clockStyle: 'घड़ी शैली',
      digital: 'डिजिटल',
      analog: 'एनालॉग',
      colorTheme: 'रंग थीम',
      auto: 'स्वचालित (समय आधारित)',
      light: 'हल्का',
      font: 'फ़ॉन्ट',
      visualEffects: 'दृश्य प्रभाव',
      enableAnimations: 'एनिमेशन सक्षम करें',
      grainEffect: 'ग्रेन प्रभाव',
      analogFeatures: 'एनालॉग विशेषताएँ',
      hourMarkers: 'घंटे के संकेत',
      smoothHandMotion: 'स्मूद हैंड मोशन',
      loading: 'सेटिंग्स लोड हो रही हैं...',
      settingsSaved: 'सेटिंग्स सहेजी गईं',
      error: 'त्रुटि'
    },
    themes: {
      dynamic: 'स्वचालित (समय आधारित)',
      light: 'हल्का',
      aurora: 'ऑरोरा',
      graphite: 'ग्रेफाइट',
      pacific: 'पैसिफिक',
      sierra: 'सिएरा',
      sunrise: 'सूर्योदय',
      horizon: 'क्षितिज',
      twilight: 'गोधूलि',
      midnight: 'मध्यरात्रि',
      rose: 'गुलाबी',
      forest: 'जंगल',
      ocean: 'महासागर',
      desert: 'रेगिस्तान',
      lavender: 'लैवेंडर',
      mint: 'पुदीना'
    }
  };  

const translations: Record<string, Translations> = {
  en,
  es,
  fr,
  de,
  ja,
  ko,
  pt,
  zh,
  'zh-TW': zhTW,
  hi
};


let currentLanguage = 'en';

export function setLanguage(lang: string): void {
  if (translations[lang]) {
    currentLanguage = lang;
    // Save to storage
    chrome.storage.sync.set({ language: lang });
  }
}

export function getCurrentLanguage(): string {
  return currentLanguage;
}

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

export async function initI18n(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get('language');
    const savedLang = (result as { language?: string })['language'] || navigator.language.split('-')[0] || 'en';
    setLanguage(savedLang);
  } catch (error) {
    console.warn('Could not load language preference, using default');
    setLanguage('en');
  }
}

// Format date with localization
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage;
  return date.toLocaleDateString(locale, options);
}

// Format time with localization
export function formatTime(date: Date, format24h: boolean = false): string {
  const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage;
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !format24h
  };
  return date.toLocaleTimeString(locale, options);
} 