import { Message } from "@/types/types";
import { create } from "zustand";

interface IChatState {
  messageSessionId: string;
  chatSessionId: string;
  setChatSessionId: (chatSessionId: string) => void;
  chatHistory: Array<Message>;
  setChatHistory: (chatHistory: Array<Message>) => void;
  addChatToHistory: (chat: Message) => void;

  // update a chat in the chat history based on messageId
  updateChatInHistory: (
    messageId: string,
    updatedChat: Partial<Message>
  ) => void;

  addTiChatHistoryIfNotExists: (chat: Message) => void;
  resetChatHistory: () => void;
  isChatLoading: boolean;
  setIsChatLoading: (isChatLoading: boolean) => void;
  userPrompt: string;
  setUserPrompt: (userPrompt: string) => void;
  updateLastChatContent: (chatContent: string) => void;
  updateChatMessageLoadingStatus: (
    messageId: string,
    isLoading: boolean
  ) => void;
  updateMessageContentByChatMessageId: (
    messageId: string,
    message: string
  ) => void;
  setMessageSessionId: (messageSessionId: string) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  chatHistory: [],
  setChatHistory: (chatHistory) => set({ chatHistory }),
  addChatToHistory: (chat) =>
    set((state) => ({ chatHistory: [...state.chatHistory, chat] })),
  addTiChatHistoryIfNotExists: (chat) => {
    set((state) => {
      const chatHistory = state.chatHistory;
      const chatExists = chatHistory.find(
        (chatItem) => chatItem.messageId === chat.messageId
      );
      if (!chatExists) {
        chatHistory.push(chat);
      }
      return { chatHistory };
    });
  },
  resetChatHistory: () => set({ chatHistory: [] }),
  isChatLoading: false,
  setIsChatLoading: (isChatLoading) => set({ isChatLoading }),
  userPrompt: "",
  setUserPrompt: (userPrompt) => set({ userPrompt }),
  updateLastChatContent: (chatContent) => {
    set((state) => {
      const lastChat = state.chatHistory[state.chatHistory.length - 1];
      lastChat.message = chatContent;
      return { chatHistory: [...state.chatHistory] };
    });
  },

  updateChatMessageLoadingStatus: (messageId, isLoading) => {
    set((state) => {
      const chatHistory = state.chatHistory.map((chat) => {
        if (chat.messageId === messageId) {
          chat.isChatMessageLoading = isLoading;
        }
        return chat;
      });
      return { chatHistory };
    });
  },

  updateMessageContentByChatMessageId: (messageId, message) => {
    set((state) => {
      const chatHistory = state.chatHistory.map((chat) => {
        if (chat.messageId === messageId) {
          chat.message = message;
        }
        return chat;
      });
      return { chatHistory };
    });
  },
  messageSessionId: "",
  setMessageSessionId: (messageSessionId) => set({ messageSessionId }),
  chatSessionId: "",
  setChatSessionId: (chatSessionId) => set({ chatSessionId }),

  // Implementing the new method
  updateChatInHistory: (messageId, updatedChat) => {
    set((state) => {
      const chatHistory = state.chatHistory.map((chat) => {
        if (chat.messageId === messageId) {
          return { ...chat, ...updatedChat };
        }
        return chat;
      });
      return { chatHistory };
    });
  },
}));
