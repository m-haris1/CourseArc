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
  );
};

export default App;
