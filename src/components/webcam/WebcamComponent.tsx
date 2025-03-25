import './Webcam.css'
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { makeNotification } from '../../helpers/notification';
import { useScreenshotStore } from '../../store/webcam-store';

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
    const { addNewScreenshot, screenshots } = useScreenshotStore();
    const [webcamState, setWebcamState] = useState(WEBCAM_STATES.LOADING);
    const webcamRef = useRef<Webcam>(null);
    console.log(screenshots)
    const capture = useCallback(() => {
        if (!webcamRef.current) return;
        const imgSrc = webcamRef.current.getScreenshot();
        if (!imgSrc) makeNotification("Error at saving screenshot", "error");
        makeNotification("Screenshot saved!", "success");
        addNewScreenshot(imgSrc!);
    }, [webcamRef, addNewScreenshot]);

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
                        ref={webcamRef}
                        audio={false}
                        mirrored={false}
                        screenshotFormat='image/webp'
                        screenshotQuality={1} // add Low => 0.33, Medium => 0.66, High => 1
                    />
                    {
                        webcamRef.current?.video !== null &&
                        <div className='webcam-actions'>
                            <button className='take-screenshot' onClick={capture}>Screenshot</button>
                            <button className='record-video' onClick={capture}>Record</button>
                        </div>
                    }
                </div>

            }
        </>
    )
}

export default WebcamComponent
