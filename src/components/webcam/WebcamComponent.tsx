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

const MIME_TYPES = [
    'video/mp4;codecs=h264',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
];

const WebcamComponent = () => {
    const { addNewScreenshot } = useScreenshotStore();
    const { addVideo } = useVideoStore();
    const [webcamState, setWebcamState] = useState(WEBCAM_STATES.LOADING);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [selectedMimeType, setSelectedMimeType] = useState<string>('');

    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // Detectar el mejor formato soportado
    const getSupportedMimeType = () => {
        for (const mimeType of MIME_TYPES) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
                console.log('Using mime type:', mimeType);
                return mimeType;
            }
        }
        return 'video/webm'; // Fallback por defecto
    };

    navigator.mediaDevices.getUserMedia(videoConstraints).then(mediaStream => {
        if (mediaStream.active) {
            setWebcamState(WEBCAM_STATES.ACTIVE);
            setSelectedMimeType(getSupportedMimeType());
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

        try {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: selectedMimeType,
                videoBitsPerSecond: 2500000
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        } catch (error) {
            console.error('Error starting recording:', error);
            makeNotification("Error starting recording", "error");
            setIsRecording(false);
        }
    }, [handleDataAvailable, selectedMimeType]);

    const handleStopRecordClick = useCallback(() => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();
        setIsRecording(false);

        const completeBlob = new Blob(recordedChunks, { type: selectedMimeType });
        const videoUrl = URL.createObjectURL(completeBlob);
        addVideo(videoUrl);
        makeNotification("Video saved!", "success");

        setRecordedChunks([]);
        setIsRecording(false);
    }, [addVideo, recordedChunks, selectedMimeType]);

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
