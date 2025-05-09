import { useState } from 'react';
import Modal from "./components/modal/Modal";
import { ToastContainer } from 'react-toastify';
import './App.css';
import { useScreenshotStore, useVideoStore } from './store/webcam-store';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { screenshots, clearScreenshots } = useScreenshotStore();
  const { videos, clearVideos } = useVideoStore();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreen = (screenshot: string) => {
    setFullscreenImage(screenshot);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const getFileExtension = (mimeType: string) => {
    switch (mimeType) {
      case 'video/mp4':
      case 'video/mp4;codecs=h264':
        return 'mp4';
      case 'video/webm':
      case 'video/webm;codecs=vp8':
      case 'video/webm;codecs=vp9':
      case 'video/webm;codecs=h264':
        return 'webm';
      default:
        return 'webm';
    }
  };

  const downloadVideo = (videoUrl: string) => {
    const a = document.createElement('a');
    a.href = videoUrl;
    const mimeType = videoUrl.split(';')[0];
    const extension = getFileExtension(mimeType);
    a.download = `video.${extension}`;
    a.click();
  }

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
      {
        videos.length > 0 &&
        <div className='videos-container'>
          <h2>Your videos:</h2>
          <div className='videos'>
            {videos.map((videoUrl, index) => (
              <div key={index}>
                <video controls width="300" className='video'>
                  <source src={videoUrl} type='video/*' />
                  Your browser does not support the video tag.
                </video>
                <button className='remove-videos' onClick={() => downloadVideo(videoUrl)}>Descargar</button>
              </div>
            ))}
          </div>
          <button onClick={() => clearVideos()} className='remove-videos'>Remove all videos</button>
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
