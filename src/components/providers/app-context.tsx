"use client";

import { createContext, useContext } from "react";
import { projects as seedProjects } from "@/data/projects";
import { posts as seedPosts } from "@/data/posts";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type {
  BlogPost,
  BlogSubmission,
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
  posts: BlogPost[];
  catalogReady: boolean;
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
  addContact: (input: Omit<ContactRequest, "id" | "createdAt">) => Promise<boolean>;
  addCustomization: (input: Omit<CustomizationRequest, "id" | "createdAt">) => void;
  deleteContact: (id: string) => void;
  deleteCustomization: (id: string) => void;
  submissions: BlogSubmission[];
  submitBlogPost: (input: Omit<BlogSubmission, "id" | "createdAt" | "status">) => boolean;
  approveBlogSubmission: (item: BlogSubmission) => void;
  deleteBlogSubmission: (id: string) => void;
  rejectBlogSubmission: (id: string, reason: string) => void;
  resubmitBlogSubmission: (id: string, input: { title: string; excerpt: string; content: string; tags: string[]; cover?: string; phone?: string; resubmitNote?: string }) => boolean;
  addReview: (input: { projectSlug: string; projectType: string; quote: string; rating: number }) => boolean;
  pushNotice: (input: { kind: NoticeKind; title: string; body: string; href?: string }) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  upsertProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setProjectStatus: (id: string, status: Project["status"]) => void;
  upsertPost: (post: BlogPost) => void;
  importSeedPosts: () => Promise<{ imported: number; skipped: number; error?: string }>;
  deletePost: (id: string) => void;
  setPostStatus: (id: string, status: BlogPost["status"]) => void;
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
  projects: isFirebaseConfigured() ? [] : seedProjects,
  posts: isFirebaseConfigured() ? [] : seedPosts,
  catalogReady: !isFirebaseConfigured(),
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
  addContact: async () => false,
  addCustomization: () => undefined,
  deleteContact: () => undefined,
  deleteCustomization: () => undefined,
  submissions: [],
  submitBlogPost: () => false,
  approveBlogSubmission: () => undefined,
  deleteBlogSubmission: () => undefined,
  rejectBlogSubmission: () => undefined,
  resubmitBlogSubmission: () => false,
  addReview: () => false,
  pushNotice: () => undefined,
  markNoticeRead: () => undefined,
  markAllNoticesRead: () => undefined,
  upsertProject: () => undefined,
  deleteProject: () => undefined,
  setProjectStatus: () => undefined,
  upsertPost: () => undefined,
  importSeedPosts: async () => ({ imported: 0, skipped: 0, error: "Firebase is not connected." }),
  deletePost: () => undefined,
  setPostStatus: () => undefined,
  setOrderStatus: () => undefined,
  toast: () => undefined,
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
