import './Webcam.css'
import { useState } from 'react';
import Webcam from 'react-webcam';

const WEBCAM_STATES = {
    LOADING: 'LOADING',
    DENIED: 'DENIED',
    ACTIVE: 'ACTIVE'
}

const videoConstraints = {
    audio: true,
    video: {
        width: 640,
        height: 480,
        facingMode: "user" // user => Main camera | environment => Front camera
    }
};

const WebcamComponent = () => {
    const [webcamState, setWebcamState] = useState(WEBCAM_STATES.LOADING);

    navigator.mediaDevices.getUserMedia(videoConstraints).then(mediaStream => {
        if (mediaStream.active) {
            setWebcamState(WEBCAM_STATES.ACTIVE);
        }
    }).catch(() => setWebcamState(WEBCAM_STATES.DENIED));

    // TODO: Create context, get Webcam options with a customHook, and provide an interface to change it.
    return (
        <>
            {webcamState === WEBCAM_STATES.LOADING && <img className='loading-camera-img' alt='Loading Camera' src='/images/loading-camera.jpg' />}
            {webcamState === WEBCAM_STATES.DENIED && <img className='loading-camera-img' alt='Permission Denied Camera' src='/images/permission-denied.png' />}
            {webcamState === WEBCAM_STATES.ACTIVE
                &&
                <div>
                    <Webcam
                        audio={false}
                        mirrored={false}
                        screenshotFormat='image/webp'
                        screenshotQuality={1} // add Low => 0.33, Medium => 0.66, High => 1
                    />
                </div>

            }
        </>
    )
}

export default WebcamComponent
