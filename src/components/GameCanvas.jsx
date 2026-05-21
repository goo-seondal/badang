import { useState, useEffect, useRef } from 'react';
import Sprite from './Sprite';
import { ASSETS, SIZES, PLACEHOLDER_COLORS, TRASH_TYPES } from '../data/assets';

const W = 360;
const H = 640;
const REACH_RADIUS = 60;       // 해녀가 쓰레기에 닿는 거리 (잡기 + 줍기 공통)
const TOUCH_GRAB_RADIUS = 32;  // 터치가 어떤 쓰레기 가리키는지 정확도

const initialTrash = [
  { id: 1, type: 'can',    x: 80,  y: 250 },
  { id: 2, type: 'bottle', x: 180, y: 320 },
  { id: 3, type: 'bag',    x: 280, y: 280 },
  { id: 4, type: 'net',    x: 150, y: 450 },
  { id: 5, type: 'ring',   x: 230, y: 400 },
  { id: 6, type: 'can',    x: 100, y: 500 },
  { id: 7, type: 'bottle', x: 290, y: 530 },
];

export default function GameCanvas() {
  const [pos, setPos] = useState({ x: W / 2, y: 100 });
  const [trashList, setTrashList] = useState(initialTrash);
  const [draggingId, setDraggingId] = useState(null);
  const [scale, setScale] = useState(1);
  const [pickups, setPickups] = useState([]); // 줍기 애니메이션 중인 쓰레기들

  const posRef = useRef({ x: W / 2, y: 100 });
  const keys = useRef({});
  const target = useRef(null);
  const boxRef = useRef(null);
  const trashListRef = useRef(initialTrash);
  const draggingIdRef = useRef(null);
  const dragPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => { posRef.current = pos; }, [pos]);
  useEffect(() => { trashListRef.current = trashList; }, [trashList]);

  // 키보드
  useEffect(() => {
    const wasdMap = { w: 'ArrowUp', W: 'ArrowUp', s: 'ArrowDown', S: 'ArrowDown', a: 'ArrowLeft', A: 'ArrowLeft', d: 'ArrowRight', D: 'ArrowRight' };
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const onDown = (e) => {
      if (arrows.includes(e.key)) { e.preventDefault(); keys.current[e.key] = true; }
      else if (wasdMap[e.key]) keys.current[wasdMap[e.key]] = true;
    };
    const onUp = (e) => {
      if (arrows.includes(e.key)) keys.current[e.key] = false;
      else if (wasdMap[e.key]) keys.current[wasdMap[e.key]] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // 스케일
  useEffect(() => {
    const update = () => {
      if (!boxRef.current) return;
      setScale(boxRef.current.getBoundingClientRect().width / W);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 드래그 핸들러 (window)
  useEffect(() => {
    if (draggingId === null) return;

    const getPos = (e) => {
      const rect = boxRef.current.getBoundingClientRect();
      const cx = e.touches?.[0]?.clientX ?? e.clientX;
      const cy = e.touches?.[0]?.clientY ?? e.clientY;
      return {
        x: ((cx - rect.left) / rect.width) * W,
        y: ((cy - rect.top) / rect.height) * H,
      };
    };

    const onMove = (e) => {
      if (e.cancelable) e.preventDefault();
      dragPosRef.current = getPos(e);
    };

    const onUp = () => {
      const idToRemove = draggingIdRef.current;
      if (idToRemove !== null) {
        const trash = trashListRef.current.find(t => t.id === idToRemove);
        if (trash) {
          // 트래시에서 제거 + pickups에 추가 (애니메이션용)
          setTrashList(prev => prev.filter(t => t.id !== idToRemove));
          setPickups(prev => [...prev, {
            id: `pickup-${Date.now()}-${idToRemove}`,
            type: trash.type,
            startX: trash.x,
            startY: trash.y,
            startTime: Date.now(),
          }]);
        }
      }
      setDraggingId(null);
      draggingIdRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [draggingId]);

  // 게임 루프
  useEffect(() => {
    const TICK = 50;
    const speed = 4.5;
    const interval = setInterval(() => {
      // 캐릭터 이동
      setPos((prev) => {
        let { x, y } = prev;
        const anyKey = keys.current['ArrowUp'] || keys.current['ArrowDown'] || keys.current['ArrowLeft'] || keys.current['ArrowRight'];
        if (anyKey) {
          let dx = 0, dy = 0;
          if (keys.current['ArrowUp']) dy -= 1;
          if (keys.current['ArrowDown']) dy += 1;
          if (keys.current['ArrowLeft']) dx -= 1;
          if (keys.current['ArrowRight']) dx += 1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            x += (dx / len) * speed;
            y += (dy / len) * speed;
          }
          target.current = null;
        } else if (target.current) {
          const dx = target.current.x - x;
          const dy = target.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < speed) {
            x = target.current.x; y = target.current.y;
            target.current = null;
          } else {
            x += (dx / dist) * speed;
            y += (dy / dist) * speed;
          }
        }
        x = Math.max(15, Math.min(W - 15, x));
        y = Math.max(15, Math.min(H - 15, y));
        return { x, y };
      });

      // 드래그 중 쓰레기 lerp 업데이트
      if (draggingIdRef.current !== null) {
        const id = draggingIdRef.current;
        setTrashList(prev => {
          const trash = prev.find(t => t.id === id);
          if (!trash) return prev;
          const lerpAmt = TRASH_TYPES[trash.type].lerp;
          const nx = trash.x + (dragPosRef.current.x - trash.x) * lerpAmt;
          const ny = trash.y + (dragPosRef.current.y - trash.y) * lerpAmt;
          return prev.map(t => t.id === id ? { ...t, x: nx, y: ny } : t);
        });
      }
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = (e) => {
    if (e.cancelable) e.preventDefault();
    const rect = boxRef.current.getBoundingClientRect();
    const cx = e.touches?.[0]?.clientX ?? e.clientX;
    const cy = e.touches?.[0]?.clientY ?? e.clientY;
    const x = ((cx - rect.left) / rect.width) * W;
    const y = ((cy - rect.top) / rect.height) * H;

    // 1) 터치로 어떤 쓰레기인지 결정
    let nearest = null;
    let minDist = TOUCH_GRAB_RADIUS;
    for (const t of trashListRef.current) {
      const dx = t.x - x;
      const dy = t.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) { minDist = dist; nearest = t; }
    }

    if (nearest) {
      // 2) 해녀가 그 쓰레기에 닿을 만큼 가까운가?
      const cdx = nearest.x - posRef.current.x;
      const cdy = nearest.y - posRef.current.y;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
      if (cdist < REACH_RADIUS) {
        draggingIdRef.current = nearest.id;
        dragPosRef.current = { x, y };
        setDraggingId(nearest.id);
      } else {
        // 멀어서 못 잡음 → 거기로 이동
        target.current = { x, y };
      }
    } else {
      target.current = { x, y };
    }
  };
  // 줍기 애니메이션 끝난 거 자동 정리
  useEffect(() => {
    if (pickups.length === 0) return;
    const t = setTimeout(() => {
      const now = Date.now();
      setPickups(prev => prev.filter(p => now - p.startTime < 400));
    }, 100);
    return () => clearTimeout(t);
  }, [pickups]);
  return (
    <div
      ref={boxRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{
        width: 'min(100vw, calc(100vh * 9/16))',
        height: 'min(100vh, calc(100vw * 16/9))',
        background: 'linear-gradient(to bottom, #2d7ea3 0%, #1a5673 30%, #0d3a52 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        touchAction: 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: W, height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
      }}>
        {/* 쓰레기 */}
        {trashList.map(t => {
          const tp = TRASH_TYPES[t.type];
          return (
            <Sprite
              key={t.id}
              x={t.x} y={t.y}
              width={tp.size.w} height={tp.size.h}
              src={ASSETS.trash[t.type]}
              placeholderColor={tp.color}
              placeholderBorder="#222"
              highlighted={draggingId === t.id}
              zIndex={draggingId === t.id ? 30 : 10}
            />
          );
        })}
        {/* 줍기 애니메이션 */}
        {pickups.map(p => {
          const tp = TRASH_TYPES[p.type];
          const PICKUP_MS = 350;
          const elapsed = Date.now() - p.startTime;
          const t = Math.min(1, elapsed / PICKUP_MS);
          // easeInQuad — 처음엔 천천히, 끝에 가속
          const ease = t * t;
          const targetX = pos.x + 14;
          const targetY = pos.y + 10;
          const x = p.startX + (targetX - p.startX) * ease;
          const y = p.startY + (targetY - p.startY) * ease;
          const scale = 1 - ease * 0.8; // 1 → 0.2 (작아짐)
          const opacity = 1 - ease * 0.5;
          return (
            <div key={p.id} style={{
              position: 'absolute',
              left: x - tp.size.w / 2,
              top: y - tp.size.h / 2,
              width: tp.size.w,
              height: tp.size.h,
              background: tp.color,
              border: '2px solid #222',
              borderRadius: 4,
              transform: `scale(${scale})`,
              opacity,
              zIndex: 25,
              pointerEvents: 'none',
            }} />
          );
        })}
        {/* 캐릭터 */}
          <Sprite
            x={pos.x} y={pos.y}
            width={SIZES.haenyeo.w} height={SIZES.haenyeo.h}
            src={ASSETS.haenyeo}
            placeholderColor={PLACEHOLDER_COLORS.haenyeo}
            placeholderBorder="white"
            smooth
            zIndex={20}
          />

        {/* 망사리 */}
        <Sprite
          x={pos.x + 14} y={pos.y + 10}
          width={16} height={16}
          src={null}
          placeholderColor="rgba(140, 100, 70, 0.85)"
          placeholderBorder="#4a3520"
          smooth
          zIndex={19}
          placeholderStyle={{ borderRadius: '40% 50% 50% 40%' }}
        />

        {/* 디버그 */}
        <div style={{
          position: 'absolute',
          top: 10, left: 10,
          color: 'white',
          fontFamily: 'system-ui',
          fontSize: 11,
          opacity: 0.7,
        }}>
          쓰레기 {trashList.length}개 / 줍힘 {initialTrash.length - trashList.length}개
        </div>
      </div>
    </div>
  );
}