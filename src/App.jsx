import GameCanvas from './components/GameCanvas';

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
    }}>
      <GameCanvas />
    </div>
  );
}