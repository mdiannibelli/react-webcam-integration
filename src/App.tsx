import { useState } from 'react';
import Modal from "./components/modal/Modal";
import { ToastContainer } from 'react-toastify';
import './App.css';
import { useScreenshotStore } from './store/webcam-store';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { screenshots, clearScreenshots } = useScreenshotStore();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreen = (screenshot: string) => {
    setFullscreenImage(screenshot);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div>
      <div className='header'>
        <h1>React Webcam Integration</h1>

        <div className='modalcontainer'>
          {
            !isModalOpen
              ?
              <button className='modalbtn' onClick={() => setIsModalOpen(!isModalOpen)}>Start Webcam</button>
              :
              <div>
                <button onClick={() => setIsModalOpen(!isModalOpen)} className='close-modal-btn'>Close camera</button>
                <Modal />
              </div>
          }
        </div>

      </div>
      {
        screenshots.length > 0 &&
        <div className='screenshots-container'>
          <h2>Your screenshots:</h2>
          <div className='screenshots'>
            {screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className='screenshot'
                onClick={() => openFullscreen(screenshot)}
              />
            ))}
          </div>
          <button onClick={() => clearScreenshots()} className='remove-screenshots'>Remove all screenshots</button>
        </div>
      }

      {fullscreenImage && (
        <div className='fullscreen-overlay' onClick={closeFullscreen}>
          <img src={fullscreenImage} alt="Fullscreen Screenshot" className='fullscreen-image' />
          <button className='close-fullscreen-btn' onClick={closeFullscreen}>
            Close
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default App
