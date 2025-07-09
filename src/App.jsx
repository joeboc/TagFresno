import { useState, useEffect } from 'react';
import GraffitiCanvas from './components/GraffitiCanvas';

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
    <div style={{ 
      width: '100%',
      maxWidth: '1200px', // Optional: limit width on large screens
      margin: '0 auto', 
      flexDirection: 'column',
      padding: '2rem', 
      textAlign: 'center',
    }}>
      <h1>TagFresno</h1>
      <p>Draw your tag on a Fresno location:</p>
      {photo && <GraffitiCanvas backgroundImage={photo}/>}
    </div>
  );
}

export default App;