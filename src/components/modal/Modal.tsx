import WebcamComponent from '../webcam/WebcamComponent';
import './Modal.css';

const Modal = () => {
    return (
        <div className='modal'>
            <div className='camera-layout'>
                <div className='camera-container'>
                    <WebcamComponent />
                </div>
            </div>
        </div>
    )
}

export default Modal
