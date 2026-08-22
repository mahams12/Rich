"use client";

import { createContext, useContext } from "react";
import type {
  ContactRequest,
  CustomizationRequest,
  Notice,
  NoticeKind,
  Order,
  Project,
  Review,
  Toast,
  UserAccount,
} from "@/types";

export interface CheckoutDraft {
  projectId: string;
  customized: boolean;
  customization?: string;
  express: boolean;
}

export interface AppContextValue {
  ready: boolean;
  firebaseReady: boolean;
  user: UserAccount | null;
  favourites: string[];
  orders: Order[];
  contacts: ContactRequest[];
  customizations: CustomizationRequest[];
  projects: Project[];
  reviews: Review[];
  notices: Notice[];
  unreadNotices: Notice[];
  unreadCount: number;
  toasts: Toast[];
  checkout: CheckoutDraft | null;
  login: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ ok: boolean; needsVerification?: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ account: UserAccount | null; error?: string; redirecting?: boolean }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  reloadAuthUser: () => Promise<UserAccount | null>;
  logout: () => void;
  toggleFavourite: (projectId: string) => boolean;
  isFavourite: (projectId: string) => boolean;
  startCheckout: (draft: CheckoutDraft) => void;
  clearCheckout: () => void;
  placeOrder: (express?: boolean) => Order | null;
  addContact: (input: Omit<ContactRequest, "id" | "createdAt">) => void;
  addCustomization: (input: Omit<CustomizationRequest, "id" | "createdAt">) => void;
  deleteContact: (id: string) => void;
  deleteCustomization: (id: string) => void;
  addReview: (input: { projectSlug: string; projectType: string; quote: string; rating: number }) => boolean;
  pushNotice: (input: { kind: NoticeKind; title: string; body: string; href?: string }) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  upsertProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setProjectStatus: (id: string, status: Project["status"]) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
  toast: (title: string, detail?: string) => void;
}

const asyncNo = async () => ({ ok: false as const });

export const stubAppValue: AppContextValue = {
  ready: false,
  firebaseReady: false,
  user: null,
  favourites: [],
  orders: [],
  contacts: [],
  customizations: [],
  projects: [],
  reviews: [],
  notices: [],
  unreadNotices: [],
  unreadCount: 0,
  toasts: [],
  checkout: null,
  login: asyncNo,
  adminLogin: asyncNo,
  loginWithGoogle: async () => ({ account: null }),
  register: asyncNo,
  resetPassword: async () => false,
  sendVerificationEmail: async () => false,
  reloadAuthUser: async () => null,
  logout: () => undefined,
  toggleFavourite: () => false,
  isFavourite: () => false,
  startCheckout: () => undefined,
  clearCheckout: () => undefined,
  placeOrder: () => null,
  addContact: () => undefined,
  addCustomization: () => undefined,
  deleteContact: () => undefined,
  deleteCustomization: () => undefined,
  addReview: () => false,
  pushNotice: () => undefined,
  markNoticeRead: () => undefined,
  markAllNoticesRead: () => undefined,
  upsertProject: () => undefined,
  deleteProject: () => undefined,
  setProjectStatus: () => undefined,
  setOrderStatus: () => undefined,
  toast: () => undefined,
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
