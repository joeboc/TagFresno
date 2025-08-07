import { useState, useEffect } from 'react';
import GraffitiCanvas from './components/GraffitiCanvas';

function Header() {
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
    </div>
  );
}

const photoList = [
  'photos/OtcLibrary.jpg',
  'photos/OtcTower.jpg',
  'photos/RaMural.jpg',
  'photos/TowerMural.jpg',
];

function App() {
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const RandomIndex = Math.floor(Math.random() * photoList.length);
    setPhoto(photoList[RandomIndex]);
  }, []);

  return (
    <div
      style={{
        /*backgroundImage: "url('/photos/Assets/ConcreteWall.png')", */// ✅ Make sure this path is correct
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        paddingBottom: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Header />
        <p style={{ marginTop: '0.5rem', color: 'white', fontSize: '1.2rem' }}>
          Draw your tag on a Fresno location:
        </p>
        {photo && <GraffitiCanvas backgroundImage={photo} />}
      </div>
    </div>
  );
}

export default App;
