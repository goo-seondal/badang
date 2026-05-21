export default function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#051828',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }}>
      <div style={{
        width: 'min(100vw, calc(100vh * 9/16))',
        height: 'min(100vh, calc(100vw * 16/9))',
        background: 'linear-gradient(to bottom, #2d7ea3 0%, #1a5673 30%, #0d3a52 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          color: 'white',
          padding: 24,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 18,
        }}>
          바당 — 셋업 중
        </div>
      </div>
    </div>
  );
}