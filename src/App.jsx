import { useState, useEffect } from 'react';

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
      {photo && <img src={photo} alt="Fresno location" style={{maxWidth: '100%', borderRadius: '8px'}} />}
      <p>Canvas coming next!</p>
    </div>
  );
}

export default App;