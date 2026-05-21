// 이미지가 준비되면 src 받아서 표시, 없으면 placeholder 사각형
export default function Sprite({
  x, y, width, height,
  src,                  // 이미지 경로 (없으면 placeholder)
  placeholderColor = '#666',
  placeholderBorder = 'white',
  rotation = 0,
  zIndex = 10,
  style = {},
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        zIndex,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated', // 픽셀 아트용
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: placeholderColor,
          border: `2px solid ${placeholderBorder}`,
          borderRadius: 4,
        }} />
      )}
    </div>
  );
}