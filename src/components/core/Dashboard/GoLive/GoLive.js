import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const App = () => {
  const [media, setMedia] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const socket = io("http://localhost:4000");
  const [streamUrl, setStreamUrl] = useState(""); // Stream URL for RTMP
  const [isRecording, setIsRecording] = useState(false); // Track recording state

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMedia(mediaStream);
        const userVideo = document.getElementById('user-video');
        userVideo.srcObject = mediaStream;
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getMedia();
  }, []);

  const handleStartRecording = () => {
    if (streamUrl === "") {
      toast.error("Please Enter your stream URL");
      return;
    }

    socket.emit("StreamKey", streamUrl);

    if (media) {
      const recorder = new MediaRecorder(media, {
        mimeType: "video/webm; codecs=vp8", // Ensure correct format
        videoBitsPerSecond: 2500000, // Set bitrate
      });

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          ev.data.arrayBuffer().then((buffer) => {
            socket.emit("binarystream", buffer); // Send stream data to server
          });
        }
      };

      recorder.start(1000); // Fire ondataavailable every 1 second
      setMediaRecorder(recorder);
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    socket.emit("stopStream");
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop the recording
      setIsRecording(false);
    }
  };

  return (
    <div>
      <div className='flex'>
        <div className='mx-auto w-50% bg-richblack-900 flex flex-col items-center justify-center gap-4'>
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡Go Live on Youtube</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>
              Go to your YouTube channel and click on the "YouTube Studio" button.
            </li>
            <li>
              Click on the "Create" button and select "Go Live" from the dropdown.
            </li>
            <li>
              Copy the stream key from the YouTube Live Control Room and paste it into the input field right.
            </li>
            <li>
              Click on the "Start Streaming" button to begin streaming your video .
            </li>
          </ul>
        </div>
        </div>
        <div className="flex-col">
          <div className="flex align-center justify-center">
            <video id="user-video" autoPlay muted className="w-50 h-50" />
          </div>
          <div className="h-10"></div>
          <div className="flex align-center justify-center">
            <input
              placeholder="Please Enter your Stream Key"
              onChange={(e) => setStreamUrl(e.target.value)}
            />
          </div>
          <div className="h-10"></div>
          <div className="flex align-center justify-center gap-8">
            <button
              className="bg-richblack-5"
              onClick={handleStartRecording}
              disabled={isRecording}
            >
              {isRecording ? "Streaming..." : "Start Streaming"}
            </button>
            <button
              className="bg-richblack-5"
              onClick={handleStopRecording}
              disabled={!isRecording}
            >
              Stop Streaming
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default App;
