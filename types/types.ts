export type Message = {
  messageId: string;
  message: string;
  sessionId: string;
  isChatMessageLoading: boolean;
  type: "user" | "ai";
};
