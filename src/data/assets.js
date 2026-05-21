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