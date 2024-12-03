"use client";
import React, { useState, useRef } from "react";
import RecordRTC from "recordrtc";
import { FaMicrophone, FaStop } from "react-icons/fa";

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;

      setTimeout(() => {
        // const recorder = new RecordRTC(stream, {
        //   type: "audio",
        //   recorderType: RecordRTC.StereoAudioRecorder,
        //   mimeType: "audio/wav",
        //   timeSlice: 500, // Increased timeSlice to ensure initial audio is captured
        //   sampleRate: 46000,
        //   numberOfAudioChannels: 1,
        //   // ondataavailable: (blob: Blob) => {
        //   //   console.log("ondataavailable", blob);
        //   //   const reader = new FileReader();
        //   //   reader.onloadend = () => {
        //   //     const base64data = reader.result;
        //   //     socket?.emit("stream_audio", {
        //   //       web_socket_id: id,
        //   //       session_id: chatSessionId,
        //   //       message_id: messageId,
        //   //       user_id: userId,
        //   //       audio_data: base64data,
        //   //       mime_type: "audio/wav",
        //   //     });
        //   //   };
        //   //   reader.readAsDataURL(blob);
        //   // },
        // });

        let recorder = new RecordRTC(stream, {
          type: "audio",
          recorderType: RecordRTC.StereoAudioRecorder,
          mimeType: "audio/wav",
          timeSlice: 500,
          sampleRate: 46000,
          numberOfAudioChannels: 1,
          ondataavailable: (blob: Blob) => {
            console.log("ondataavailable", blob);
          },
        });
        recorderRef.current = recorder;
        recorder.startRecording();
      }, 500);

      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      // Add a buffer before stopping the recording
      setTimeout(() => {
        // recorderRef.current?.stopRecording(() => {
        //   const socket = webSocketService.getSocket();

        //   const userId = localStorage.getItem("userId");

        //   const stopAudioRequest = {
        //     web_socket_id: websocketId,
        //     session_id: chatSessionId,
        //     message_id: messageId,
        //     user_id: userId,
        //   };
        //   socket?.emit("stop_audio", stopAudioRequest);

        //   // const blob = recorderRef.current?.getBlob();
        //   // if (blob) {
        //   //   const audioUrl = URL.createObjectURL(blob); // Newly added line
        //   //   setAudioUrl(audioUrl); // Newly added line
        //   //   const audio = new Audio(audioUrl);
        //   //   audio.play();
        //   // }
        // });

        setIsRecording(false);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      }, 1000); // 500ms buffer
    }
  };

  return (
    <div className=" bg-gray-700 text-white  flex justify-center flex-col text-center items-center h-[550px] w-[350px] rounded-xl p-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="bg-green-500 text-white px-4 py-4  hover:bg-green-600 transition duration-300 rounded-full"
        >
          <FaMicrophone className="h-10 w-10" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-4  rounded hover:bg-red-600 transition duration-300"
        >
          <FaStop className="h-10 w-10" />
        </button>
      )}
      {audioUrl && (
        <div className="mt-4">
          <h3 className="mb-2">Recorded Audio:</h3>
          <audio controls src={audioUrl} className="w-[250px]"></audio>
        </div>
      )}
    </div>
  );
};

export default Recorder;
