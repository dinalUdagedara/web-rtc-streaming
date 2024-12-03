"use client";
import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useChatStore } from "@/store/chat-store";
import { v4 as uuidv4 } from "uuid";

import webSocketService from "@/services/websocket-service";

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [websocketId, setWebsocketId] = useState<string>("");
  const [messageId, setMessageId] = useState<string>("");

  const setChatSessionId = useChatStore((state) => state.setChatSessionId);
  const chatSessionId = useChatStore((state) => state.chatSessionId);

  useEffect(() => {
    if (chatSessionId === "") {
      let sessionId = uuidv4();
      setChatSessionId(sessionId);
    }
  }, [chatSessionId]);

  const startRecording = async () => {
    if (!webSocketService.isConnected()) {
      webSocketService.connect();
    }

    const messageId = uuidv4();
    setMessageId(messageId);

    const userId = localStorage.getItem("userId");

    const id = uuidv4();
    setWebsocketId(id);

    const startAudioRequest = {
      web_socket_id: id,
      session_id: chatSessionId,
      message_id: messageId,
      user_id: userId,
    };

    try {
      const socket = webSocketService.getSocket();

      socket?.emit("onboarding_start_audio", startAudioRequest);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;

      setTimeout(() => {
        let recorder = new RecordRTC(stream, {
          type: "audio",
          recorderType: RecordRTC.StereoAudioRecorder,
          mimeType: "audio/wav",
          timeSlice: 500,
          sampleRate: 46000,
          numberOfAudioChannels: 1,
          ondataavailable: (blob: Blob) => {
            console.log("ondataavailable", blob);
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              socket?.emit("onboarding_stream_audio", {
                web_socket_id: id,
                session_id: chatSessionId,
                message_id: messageId,
                user_id: userId,
                audio_data: base64data,
                mime_type: "audio/wav",
              });
            };
            reader.readAsDataURL(blob);
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
      setTimeout(() => {
        recorderRef.current?.stopRecording(() => {
          const socket = webSocketService.getSocket();

          const userId = localStorage.getItem("userId");

          const stopAudioRequest = {
            web_socket_id: websocketId,
            session_id: chatSessionId,
            message_id: messageId,
            user_id: userId,
          };
          socket?.emit("onboarding_stop_audio", stopAudioRequest);
        });

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
