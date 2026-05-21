import { useState, useEffect, useRef } from 'react';
import Sprite from './Sprite';
import { ASSETS, SIZES, PLACEHOLDER_COLORS } from '../data/assets';

const W = 360;
const H = 640;

export default function GameCanvas() {
  const [pos, setPos] = useState({ x: W / 2, y: 100 });
  const posRef = useRef({ x: W / 2, y: 100 });
  const keys = useRef({});
  const target = useRef(null);
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => { posRef.current = pos; }, [pos]);

  // 키보드 입력
  useEffect(() => {
    const wasdMap = {
      w: 'ArrowUp', W: 'ArrowUp',
      s: 'ArrowDown', S: 'ArrowDown',
      a: 'ArrowLeft', A: 'ArrowLeft',
      d: 'ArrowRight', D: 'ArrowRight',
    };
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

  // 화면 스케일 (모바일 대응)
  useEffect(() => {
    const update = () => {
      if (!boxRef.current) return;
      const rect = boxRef.current.getBoundingClientRect();
      setScale(rect.width / W);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 게임 루프
  useEffect(() => {
    const TICK = 50;
    const speed = 4.5;
    const interval = setInterval(() => {
      setPos((prev) => {
        let { x, y } = prev;
        const anyKey = keys.current['ArrowUp'] || keys.current['ArrowDown'] ||
                       keys.current['ArrowLeft'] || keys.current['ArrowRight'];

        if (anyKey) {
            let dx = 0, dy = 0;
            if (keys.current['ArrowUp']) dy -= 1;
            if (keys.current['ArrowDown']) dy += 1;
            if (keys.current['ArrowLeft']) dx -= 1;
            if (keys.current['ArrowRight']) dx += 1;
            // 대각선 정규화 (단일/대각선 항상 같은 속도)
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
            x = target.current.x;
            y = target.current.y;
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
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  const handleTap = (e) => {
    if (e.cancelable) e.preventDefault();
    const rect = boxRef.current.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const x = ((clientX - rect.left) / rect.width) * W;
    const y = ((clientY - rect.top) / rect.height) * H;
    target.current = { x, y };
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
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
        top: 0,
        left: 0,
        width: W,
        height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
      }}>
        {/* 캐릭터 */}
        <Sprite
        x={pos.x}
        y={pos.y}
        width={SIZES.haenyeo.w}
        height={SIZES.haenyeo.h}
        src={ASSETS.haenyeo}
        placeholderColor={PLACEHOLDER_COLORS.haenyeo}
        placeholderBorder="white"
        zIndex={20}
        />

        {/* 디버그 표시 */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          fontFamily: 'system-ui',
          fontSize: 11,
          opacity: 0.7,
        }}>
          ({Math.round(pos.x)}, {Math.round(pos.y)})
        </div>
      </div>
    </div>
  );
}