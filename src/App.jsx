import { useState, useEffect } from 'react';
import GraffitiCanvas from './components/GraffitiCanvas';

const photoList = [
  'photos/ClovisOtownSign.jpg',
  'photos/FresnoCopyStore.jpg',
  'photos/FresnoWaterTower.jpg',
];

function App() {
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const RandomIndex = Math.floor(Math.random() * photoList.length);
    setPhoto(photoList[RandomIndex]);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem'}}>
      <h1>TagFresno</h1>
      <p>Draw your tag on a Fresno location:</p>
      {photo && <GraffitiCanvas backgroundImage={photo}/>}
    </div>
  );
}

export default App;