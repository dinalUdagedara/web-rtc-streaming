import { useChatStore } from "@/store/chat-store";
import { Message } from "@/types/types";
import dynamic from "next/dynamic";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const Recorder = dynamic(() => import("@/components/recorder"), {
  ssr: false,
});

export default function LandingPage() {
  const messageSessionId = useChatStore((state) => state.messageSessionId);

  const setChatSessionId = useChatStore((state) => state.setChatSessionId);
  // const chatSessionId = useChatStore((state) => state.chatSessionId);
  const [initialized, setInitialized] = useState<boolean>(false);

  const initConversation = async () => {
    // generate session id for chat session and use it for user id also for testing

    const sampleID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    // const userId = uuidv4();
    await setChatSessionId(sampleID);

    //generate a seprate indivdual message id for each message
    const messageId = uuidv4();

    const message: Message = {
      messageId: messageId,
      sessionId: sampleID,
      isChatMessageLoading: true,
      message: "Please wait",
      type: "ai",
    };

    console.log("init message details", message);

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/on-boarding/init`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: sampleID,
        session_id: sampleID,
        message_id: messageId,
      }),
    });

    if (!response.body) {
      console.error("Error initializing chat session");
      return;
    }
    console.log({ response });

    setInitialized(true);
  };
  return (
    <div className="flex flex-col justify-end items-center  h-[550px] w-[350px] bg-slate-600  rounded-xl p-4">
      {!initialized ? (
        <button
          className="bg-green-500 text-white px-4 py-4  hover:bg-green-600 transition duration-400 rounded-full"
          onClick={initConversation}
        >
          Start Chat
        </button>
      ) : (
        <Recorder />
      )}
    </div>
  );
}
