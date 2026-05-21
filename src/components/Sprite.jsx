export default function Sprite({
  x, y, width, height,
  src,
  placeholderColor = '#666',
  placeholderBorder = 'white',
  rotation = 0,
  zIndex = 10,
  highlighted = false,
  smooth = false,
  placeholderStyle = {},
  style = {},
}) {
  const borderColor = highlighted ? '#ffe89a' : placeholderBorder;
  const borderWidth = highlighted ? 3 : 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transition: smooth ? 'left 50ms linear, top 50ms linear' : undefined,
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
            imageRendering: 'pixelated',
            userSelect: 'none',
            pointerEvents: 'none',
            outline: highlighted ? `${borderWidth}px solid ${borderColor}` : 'none',
            outlineOffset: highlighted ? 2 : 0,
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: placeholderColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: 4,
          ...placeholderStyle,
        }} />
      )}
    </div>
  );
}