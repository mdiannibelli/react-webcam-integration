import './Webcam.css'
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { makeNotification } from '../../helpers/notification';
import { useScreenshotStore, useVideoStore } from '../../store/webcam-store';

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
    const { addNewScreenshot } = useScreenshotStore();
    const { addVideo } = useVideoStore();
    const [webcamState, setWebcamState] = useState(WEBCAM_STATES.LOADING);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    navigator.mediaDevices.getUserMedia(videoConstraints).then(mediaStream => {
        if (mediaStream.active) {
            setWebcamState(WEBCAM_STATES.ACTIVE);
        }
    }).catch(() => setWebcamState(WEBCAM_STATES.DENIED));

    const capture = useCallback(() => {
        if (!webcamRef.current) return;
        const imgSrc = webcamRef.current.getScreenshot();
        if (!imgSrc) makeNotification("Error at saving screenshot", "error");
        makeNotification("Screenshot saved!", "success");
        addNewScreenshot(imgSrc!);
    }, [webcamRef, addNewScreenshot]);

    const handleDataAvailable = useCallback(
        ({ data }: { data: Blob }) => {
            if (data && data.size > 0) {
                setRecordedChunks((prev) => [...prev, data]);
            }
        },
        []
    );

    const handleStartRecordClick = useCallback(() => {
        setIsRecording(true);
        if (!webcamRef.current || !webcamRef.current.stream) return;
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [handleDataAvailable]);



    const handleStopRecordClick = useCallback(() => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();
        setIsRecording(false);

        if (recordedChunks.length === 0) {
            makeNotification("Error at saving video", "error");
            return;
        }

        const completeBlob = new Blob(recordedChunks, { type: "video/webm" });
        addVideo(completeBlob);
        makeNotification("Video saved!", "success");

        setRecordedChunks([]);
        setIsRecording(false);
    }, [addVideo, recordedChunks]);

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

                    <div className='webcam-actions'>
                        <button className='take-screenshot' onClick={capture}>Screenshot</button>
                        {
                            isRecording
                                ? <button className='record-video' onClick={handleStopRecordClick}>Stop Recording</button>
                                : <button className='record-video' onClick={handleStartRecordClick}>Record</button>
                        }
                    </div>

                </div>

            }
        </>
    )
}

export default WebcamComponent
