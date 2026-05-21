// 이미지/사운드 경로 한 곳에서 관리
// 이미지 추가하면 여기에 경로만 적어두면 자동 적용
export const ASSETS = {
  // 캐릭터
  haenyeo: null,  // 예: '/assets/images/haenyeo.png'
  
  // 쓰레기
  trash: {
    can:    null, // '/assets/images/trash_can.png'
    ring:   null,
    bottle: null,
    bag:    null,
    net:    null,
  },

  // 환경
  rock:   null,
  coral:  null,
  
  // 생물 (트랙 B + 거북 서브 이벤트)
  turtle: null,
  
  // 사운드
  sounds: {
    pickup:    null, // '/assets/sounds/pickup.mp3'
    sumbi:     null, // 숨비소리
    splash:    null,
    cleanArea: null, // 영역 정화 완료
    gradeUp:   null,
  },
};

// 캐릭터/오브젝트 기본 크기 (이미지 없을 때 placeholder + 이미지 들어와도 화면상 크기 기준)
export const SIZES = {
  haenyeo: { w: 24, h: 28 },
  trash: {
    can:    { w: 14, h: 18 },
    ring:   { w: 18, h: 8 },
    bottle: { w: 10, h: 20 },
    bag:    { w: 20, h: 16 },
    net:    { w: 22, h: 22 },
  },
  rock:   { w: 60, h: 24 },
  coral:  { w: 30, h: 30 },
  turtle: { w: 40, h: 30 },
};

// placeholder 색상 (이미지 없을 때)
export const PLACEHOLDER_COLORS = {
  haenyeo: '#1a1a1a',
  trash: {
    can:    '#a85040',
    ring:   '#80a0c0',
    bottle: '#7ba87b',
    bag:    '#d8d8d0',
    net:    '#604030',
  },
  rock:   '#4a4035',
  coral:  '#d88090',
  turtle: '#5a7050',
};

// 쓰레기 정의 — 색/크기/무게/lerp를 한 곳에 모음
// lerp: 드래그 시 손가락 따라오는 속도 (1=즉시, 0.15=많이 끌림)
export const TRASH_TYPES = {
  can:    { color: '#a85040', label: '캔',           size: { w: 14, h: 18 }, weight: 1, lerp: 1.0  },
  ring:   { color: '#80a0c0', label: '플라스틱 고리', size: { w: 18, h: 8  }, weight: 1, lerp: 1.0  },
  bottle: { color: '#7ba87b', label: '병',           size: { w: 10, h: 20 }, weight: 2, lerp: 0.5  },
  bag:    { color: '#d8d8d0', label: '비닐봉지',     size: { w: 20, h: 16 }, weight: 3, lerp: 0.3  },
  net:    { color: '#604030', label: '폐그물',       size: { w: 22, h: 22 }, weight: 4, lerp: 0.18 },
};