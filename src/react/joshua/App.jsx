import { useState } from 'react';
import { MainCanvas } from './components/MainCanvas';
import './index.css';

function App() {
  const [score, setScore] = useState(0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <MainCanvas setScore={setScore} />
      <div
        style={{
          color: 'white',
          position: 'absolute',
          top: 32,
          right: 60,
          fontSize: 32,
        }}
      >
        점수: {score}점
      </div>
    </div>
  );
}

export default App;
