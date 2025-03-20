import { useState } from 'react';
import Modal from "./components/modal/Modal"
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <h1>React Webcam Integration</h1>

      <div className='modalcontainer'>
        {
          !isModalOpen
            ?
            <button id='modalbtn' onClick={() => setIsModalOpen(!isModalOpen)}>Start Webcam</button>
            :
            <Modal />
        }
      </div>
    </div>
  )
}

export default App
