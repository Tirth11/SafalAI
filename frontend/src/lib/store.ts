import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, ChatMessage, Notification } from "@/types";

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: "safal-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Multi-Chat Store
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  isTyping: boolean;
  // Computed helpers
  messages: ChatMessage[];
  // Actions
  createChat: () => string;
  switchChat: (chatId: string) => void;
  renameChat: (chatId: string, name: string) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isTyping: false,

      get messages() {
        const state = get();
        const active = state.chats.find((c) => c.id === state.activeChatId);
        return active?.messages || [];
      },

      createChat: () => {
        const id = generateChatId();
        const newChat: ChatSession = {
          id,
          name: "New Chat",
          messages: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          chats: [...state.chats, newChat],
          activeChatId: id,
        }));
        return id;
      },

      switchChat: (chatId) => {
        set({ activeChatId: chatId });
      },

      renameChat: (chatId, name) => {
        set((state) => ({
          chats: state.chats.map((c) => (c.id === chatId ? { ...c, name } : c)),
        }));
      },

      deleteChat: (chatId) => {
        set((state) => {
          const remaining = state.chats.filter((c) => c.id !== chatId);
          const newActive = state.activeChatId === chatId
            ? remaining[remaining.length - 1]?.id || null
            : state.activeChatId;
          return { chats: remaining, activeChatId: newActive };
        });
      },

      addMessage: (message) => {
        set((state) => {
          // If no active chat, create one
          let chatId = state.activeChatId;
          let chats = [...state.chats];

          if (!chatId || !chats.find((c) => c.id === chatId)) {
            const id = generateChatId();
            chats.push({ id, name: "New Chat", messages: [], createdAt: new Date().toISOString() });
            chatId = id;
          }

          chats = chats.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
          );

          return { chats, activeChatId: chatId };
        });
      },

      setMessages: (messages) => {
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === state.activeChatId ? { ...c, messages } : c
          ),
        }));
      },

      setTyping: (isTyping) => set({ isTyping }),

      clearMessages: () => {
        // Create a new chat instead of clearing
        const id = generateChatId();
        set((state) => ({
          chats: [...state.chats, { id, name: "New Chat", messages: [], createdAt: new Date().toISOString() }],
          activeChatId: id,
        }));
      },
    }),
    {
      name: "safal-chats",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ chats: state.chats, activeChatId: state.activeChatId }),
    }
  )
);

// Notification Store
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "light",
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "safal-ui",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
