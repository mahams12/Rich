"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { uid } from "@/lib/format";
import {
  SHARED_KEY,
  emptyShared,
  readSessionUser,
  readShared,
  writeSessionUser,
  writeShared,
  type SharedState,
} from "@/lib/liveStore";
import { isAdminEmail, isFirebaseConfigured, isPrimaryAdminEmail } from "@/lib/firebase/config";
import {
  firebaseAdminLogin,
  firebaseLogin,
  firebaseGoogleLogin,
  firebaseGoogleRedirectResult,
  firebaseLogout,
  firebaseRegister,
  firebaseReloadAuthUser,
  firebaseResetPassword,
  firebaseSendVerificationEmail,
  subscribeFirebaseUser,
  AUTH_NEXT_KEY,
} from "@/lib/firebase/auth";
import {
  markNoticeReadRemote,
  deleteProjectRemote,
  patchOrderStatus,
  patchProjectStatus,
  saveContact,
  saveCustomization,
  saveNotice,
  saveOrder,
  saveProject,
  saveReview,
  removeDoc,
  subscribeContacts,
  subscribeCustomizations,
  subscribeNotices,
  subscribeOrders,
  subscribeProjects,
  subscribeReviews,
  toggleFavouriteRemote,
} from "@/lib/firebase/db";
import { firebaseErrorMessage, resolveAuthErrorMessage } from "@/lib/firebase/errors";
import { ADMIN_INVALID_CREDENTIALS, INVALID_CREDENTIALS } from "@/lib/auth/messages";
import { reportAdminLoginFailed } from "@/lib/security/reportAdminLoginFailed";
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

interface CheckoutDraft {
  projectId: string;
  customized: boolean;
  customization?: string;
  express: boolean;
}

interface AppContextValue {
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

const AppContext = createContext<AppContextValue | null>(null);

const demoUsers: Record<string, UserAccount> = {
  "novexahub.net@gmail.com": { name: "Novexa Admin", email: "novexahub.net@gmail.com", role: "admin" },
  "admin@novexahub.live": { name: "Novexa Admin", email: "admin@novexahub.live", role: "admin" },
  "client@novexahub.live": { name: "Amina Client", email: "client@novexahub.live", role: "client" },
};

const remote = isFirebaseConfigured();

function applyShared(shared: SharedState, setters: {
  setProjects: (value: Project[]) => void;
  setNotices: (value: Notice[]) => void;
  setReviews: (value: Review[]) => void;
  setContacts: (value: ContactRequest[]) => void;
  setCustomizations: (value: CustomizationRequest[]) => void;
  setOrders: (value: Order[]) => void;
  setFavouritesByUser: (value: Record<string, string[]>) => void;
  setReadByUser: (value: Record<string, string[]>) => void;
}) {
  setters.setProjects(shared.projects);
  setters.setNotices(shared.notices);
  setters.setReviews(shared.reviews);
  setters.setContacts(shared.contacts);
  setters.setCustomizations(shared.customizations);
  setters.setOrders(shared.orders);
  setters.setFavouritesByUser(shared.favouritesByUser);
  setters.setReadByUser(shared.readByUser);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Always start null so SSR HTML matches the first client paint (avoids hydration errors).
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [favouritesByUser, setFavouritesByUser] = useState<Record<string, string[]>>({});
  const [readByUser, setReadByUser] = useState<Record<string, string[]>>({});
  const [remoteFavourites, setRemoteFavourites] = useState<string[]>([]);
  const [remoteReadIds, setRemoteReadIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [customizations, setCustomizations] = useState<CustomizationRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>(emptyShared().projects);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [checkout, setCheckout] = useState<CheckoutDraft | null>(null);
  const knownNoticeIds = useRef<Set<string>>(new Set());
  const sharedJson = useRef("");

  const toast = useCallback((title: string, detail?: string) => {
    const id = uid("toast");
    setToasts((current) => [...current, { id, title, detail }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    // Restore cached session after mount (client-only) so refresh feels instant.
    const cached = readSessionUser();
    if (cached) setUser(cached);

    if (remote) {
      let stopAuth: (() => void) | undefined;
      let stopProjects: (() => void) | undefined;
      let stopReviews: (() => void) | undefined;
      let cancelled = false;

      void (async () => {
        // Must finish redirect BEFORE attaching auth listener (Firebase requirement).
        const account = await firebaseGoogleRedirectResult();
        if (cancelled) return;
        if (account) {
          writeSessionUser(account);
          setUser(account);
          const next = sessionStorage.getItem(AUTH_NEXT_KEY) || "/";
          sessionStorage.removeItem(AUTH_NEXT_KEY);
          const dest = isAdminEmail(account.email) ? "/admin" : next === "/admin" ? "/" : next;
          if (
            window.location.pathname.startsWith("/login") ||
            window.location.pathname.startsWith("/auth/google") ||
            window.location.pathname.startsWith("/register")
          ) {
            window.location.replace(dest);
            return;
          }
        }

        stopAuth = subscribeFirebaseUser(
          (nextUser) => {
            setUser(nextUser);
            writeSessionUser(nextUser);
            if (nextUser) sessionStorage.removeItem("novexah-google-redirect");
          },
          (favourites, readIds) => {
            setRemoteFavourites(favourites);
            setRemoteReadIds(readIds);
          },
          () => {
            if (!cancelled) setReady(true);
          },
        );
        stopProjects = subscribeProjects(setProjects);
        stopReviews = subscribeReviews(setReviews);
      })();

      return () => {
        cancelled = true;
        stopAuth?.();
        stopProjects?.();
        stopReviews?.();
      };
    }

    const shared = readShared();
    applyShared(shared, {
      setProjects,
      setNotices,
      setReviews,
      setContacts,
      setCustomizations,
      setOrders,
      setFavouritesByUser,
      setReadByUser,
    });
    setUser(readSessionUser());
    knownNoticeIds.current = new Set(shared.notices.map((item) => item.id));
    sharedJson.current = JSON.stringify(shared);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!remote || !user) {
      if (remote) {
        setNotices([]);
        setContacts([]);
        setCustomizations([]);
        setOrders([]);
      }
      return;
    }
    const admin = user.role === "admin";
    const stopNotices = subscribeNotices(setNotices);
    const stopContacts = subscribeContacts(user.email, admin, setContacts);
    const stopCustomizations = subscribeCustomizations(user.email, admin, setCustomizations);
    const stopOrders = subscribeOrders(user.email, admin, setOrders);
    return () => {
      stopNotices();
      stopContacts();
      stopCustomizations();
      stopOrders();
    };
  }, [user]);

  useEffect(() => {
    if (!ready || remote) return;
    const state: SharedState = {
      projects,
      notices,
      reviews,
      contacts,
      customizations,
      orders,
      favouritesByUser,
      readByUser,
    };
    writeShared(state);
    sharedJson.current = JSON.stringify(state);
  }, [ready, projects, notices, reviews, contacts, customizations, orders, favouritesByUser, readByUser]);

  useEffect(() => {
    if (remote) return;
    function pull() {
      const raw = localStorage.getItem(SHARED_KEY);
      if (!raw || raw === sharedJson.current) return;
      sharedJson.current = raw;
      applyShared(readShared(), {
        setProjects,
        setNotices,
        setReviews,
        setContacts,
        setCustomizations,
        setOrders,
        setFavouritesByUser,
        setReadByUser,
      });
    }
    function onStorage(event: StorageEvent) {
      if (event.key === SHARED_KEY) pull();
    }
    window.addEventListener("storage", onStorage);
    const poll = window.setInterval(pull, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    const fresh = notices.filter((item) => !knownNoticeIds.current.has(item.id));
    if (!fresh.length) return;
    fresh.forEach((item) => knownNoticeIds.current.add(item.id));
    const latest = fresh[0];
    toast(latest.title, latest.body);
  }, [notices, ready, toast, user]);

  const favourites = remote ? remoteFavourites : user ? favouritesByUser[user.email] ?? [] : [];
  const readIds = remote ? remoteReadIds : user ? readByUser[user.email] ?? [] : [];
  const unreadNotices = user ? notices.filter((item) => !readIds.includes(item.id)) : [];
  const unreadCount = unreadNotices.length;

  const login = useCallback(
    async (email: string, password: string, name?: string) => {
      const normalized = email.trim().toLowerCase();
      try {
        if (remote) {
          await firebaseLogin(normalized, password);
          toast("Welcome back", "Your account is live on Firebase.");
          return { ok: true };
        }
        const account =
          demoUsers[normalized] ?? {
            name: name || normalized.split("@")[0],
            email: normalized,
            role: isAdminEmail(normalized) ? "admin" : "client",
            emailVerified: true,
          };
        setUser(account);
        writeSessionUser(account);
        toast("Welcome back", "Connect Firebase in .env.local to persist accounts.");
        return { ok: true };
      } catch (error) {
        const message = await resolveAuthErrorMessage(normalized, error);
        toast("Sign in failed", message);
        return { ok: false, error: message };
      }
    },
    [toast],
  );

  const adminLogin = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();

      const fail = (message: string) => {
        reportAdminLoginFailed(normalized || email);
        return { ok: false as const, error: message };
      };

      if (!isPrimaryAdminEmail(normalized)) {
        return fail(ADMIN_INVALID_CREDENTIALS);
      }
      try {
        if (remote) {
          const { account, emailVerified } = await firebaseAdminLogin(normalized, password);
          setUser(account);
          toast("Welcome back", "Admin access granted.");
          return { ok: true };
        }
        const account = demoUsers[normalized];
        if (!account || account.role !== "admin") {
          return fail(ADMIN_INVALID_CREDENTIALS);
        }
        const session = { ...account, emailVerified: true };
        setUser(session);
        writeSessionUser(session);
        toast("Welcome back", "Connect Firebase in .env.local for production admin security.");
        return { ok: true };
      } catch (error) {
        reportAdminLoginFailed(normalized);
        const message = ADMIN_INVALID_CREDENTIALS;
        toast("Admin sign in failed", INVALID_CREDENTIALS);
        return { ok: false, error: message };
      }
    },
    [toast],
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      if (!remote) {
        const message = "Google sign-in needs Firebase connected in .env.local.";
        toast("Firebase required", message);
        return { account: null, error: message };
      }
      if (typeof window !== "undefined") {
        const next = new URLSearchParams(window.location.search).get("next") || "/";
        sessionStorage.setItem(AUTH_NEXT_KEY, next);
      }
      const result = await firebaseGoogleLogin();
      if (result && typeof result === "object" && "redirecting" in result) {
        return { account: null, redirecting: true };
      }
      setUser(result);
      writeSessionUser(result);
      return { account: result, redirecting: false };
    } catch (error) {
      const message = firebaseErrorMessage(error);
      if (message.toLowerCase().includes("closed") || message.toLowerCase().includes("cancelled")) {
        return { account: null, error: message };
      }
      toast("Google sign-in failed", message);
      return { account: null, error: message };
    }
  }, [toast]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (isAdminEmail(normalized)) {
        const message = "The studio admin account cannot be created here. Use the admin login.";
        toast("Not allowed", message);
        return { ok: false, error: message };
      }
      try {
        if (remote) {
          await firebaseRegister(name, normalized, password);
          toast("Account created", "You are signed in.");
          return { ok: true };
        }
        const loggedIn = await login(normalized, password, name);
        return loggedIn;
      } catch (error) {
        const message = await resolveAuthErrorMessage(normalized, error);
        toast("Could not register", message);
        return { ok: false, error: message };
      }
    },
    [login, toast],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        if (!remote) {
          toast("Firebase required", "Password reset needs the Firebase project connected.");
          return false;
        }
        await firebaseResetPassword(email.trim().toLowerCase());
        toast("Reset email sent", "Check your inbox for the link.");
        return true;
      } catch (error) {
        toast("Could not send reset", firebaseErrorMessage(error));
        return false;
      }
    },
    [toast],
  );

  const sendVerificationEmail = useCallback(async () => {
    try {
      if (!remote) {
        toast("Firebase required", "Email confirmation needs Firebase connected.");
        return false;
      }
      await firebaseSendVerificationEmail();
      toast("Confirmation sent", "Check your inbox for the verification link.");
      return true;
    } catch (error) {
      toast("Could not send email", firebaseErrorMessage(error));
      return false;
    }
  }, [toast]);

  const reloadAuthUser = useCallback(async () => {
    try {
      if (!remote) return user;
      const account = await firebaseReloadAuthUser();
      if (account) setUser(account);
      return account;
    } catch (error) {
      toast("Could not refresh session", firebaseErrorMessage(error));
      return null;
    }
  }, [toast, user]);

  const logout = useCallback(() => {
    if (remote) void firebaseLogout();
    setUser(null);
    writeSessionUser(null);
    toast("Signed out");
  }, [toast]);

  const isFavourite = useCallback(
    (projectId: string) => Boolean(user && favourites.includes(projectId)),
    [favourites, user],
  );

  const toggleFavourite = useCallback(
    (projectId: string) => {
      if (!user) {
        toast("Sign in required", "Login to save favourites to your account.");
        return false;
      }
      const on = !favourites.includes(projectId);
      if (remote && user.uid) {
        void toggleFavouriteRemote(user.uid, projectId, on).catch((error) => {
          toast("Could not save favourite", firebaseErrorMessage(error));
        });
        setRemoteFavourites((current) =>
          on ? [...current, projectId] : current.filter((id) => id !== projectId),
        );
        return true;
      }
      setFavouritesByUser((current) => {
        const mine = current[user.email] ?? [];
        const next = mine.includes(projectId) ? mine.filter((id) => id !== projectId) : [...mine, projectId];
        return { ...current, [user.email]: next };
      });
      return true;
    },
    [favourites, toast, user],
  );

  const startCheckout = useCallback((draft: CheckoutDraft) => setCheckout(draft), []);
  const clearCheckout = useCallback(() => setCheckout(null), []);

  const placeOrder = useCallback((expressFlag?: boolean) => {
    if (!user || !checkout) return null;
    const project = projects.find((item) => item.id === checkout.projectId);
    if (!project) return null;
    const express = expressFlag ?? checkout.express;
    const order: Order = {
      id: uid("ord"),
      projectId: project.id,
      projectTitle: project.title,
      slug: project.slug,
      price: project.price + (express ? 90 : 0),
      express,
      customized: checkout.customized,
      customization: checkout.customization,
      status: "paid",
      createdAt: new Date().toISOString(),
      deliveryDays: express ? Math.max(2, project.deliveryDays - 3) : project.deliveryDays,
      email: user.email,
    };
    if (remote) void saveOrder(order).catch((error) => toast("Order not saved", firebaseErrorMessage(error)));
    else setOrders((current) => [order, ...current]);
    setCheckout(null);
    return order;
  }, [checkout, projects, toast, user]);

  const addContact = useCallback(
    (input: Omit<ContactRequest, "id" | "createdAt">) => {
      const item: ContactRequest = { ...input, id: uid("msg"), createdAt: new Date().toISOString() };
      if (remote) void saveContact(item).catch((error) => toast("Could not send", firebaseErrorMessage(error)));
      else setContacts((current) => [item, ...current]);
      toast("Request sent", "The studio can see this in the inbox.");
    },
    [toast],
  );

  const addCustomization = useCallback(
    (input: Omit<CustomizationRequest, "id" | "createdAt">) => {
      const item: CustomizationRequest = { ...input, id: uid("cus"), createdAt: new Date().toISOString() };
      if (remote) void saveCustomization(item).catch((error) => toast("Could not save", firebaseErrorMessage(error)));
      else setCustomizations((current) => [item, ...current]);
      toast("Customization saved", "Admin can review this request.");
    },
    [toast],
  );

  const deleteContact = useCallback(
    (id: string) => {
      if (remote) void removeDoc("contacts", id).catch((error) => toast("Could not delete", firebaseErrorMessage(error)));
      setContacts((current) => current.filter((item) => item.id !== id));
      toast("Request deleted");
    },
    [toast],
  );

  const deleteCustomization = useCallback(
    (id: string) => {
      if (remote) void removeDoc("customizations", id).catch((error) => toast("Could not delete", firebaseErrorMessage(error)));
      setCustomizations((current) => current.filter((item) => item.id !== id));
      toast("Request deleted");
    },
    [toast],
  );

  const pushNotice = useCallback((input: { kind: NoticeKind; title: string; body: string; href?: string }) => {
    const notice: Notice = {
      id: uid("note"),
      kind: input.kind,
      title: input.title.trim(),
      body: input.body.trim(),
      href: input.href,
      createdAt: new Date().toISOString(),
    };
    knownNoticeIds.current.add(notice.id);
    if (remote) void saveNotice(notice).catch((error) => toast("Could not send", firebaseErrorMessage(error)));
    else setNotices((current) => [notice, ...current]);
    toast("Notification sent", "Logged-in clients will see this now.");
  }, [toast]);

  const addReview = useCallback(
    (input: { projectSlug: string; projectType: string; quote: string; rating: number }) => {
      if (!user) {
        toast("Sign in required", "Login to publish a review.");
        return false;
      }
      const quote = input.quote.trim();
      if (quote.length < 8) {
        toast("Write a little more", "Reviews need at least a sentence.");
        return false;
      }
      const review: Review = {
        id: uid("rev"),
        projectSlug: input.projectSlug,
        name: user.name,
        role: user.role === "admin" ? "Studio" : "Client",
        quote,
        rating: Math.min(5, Math.max(1, input.rating)),
        projectType: input.projectType,
        sample: false,
        email: user.email,
        createdAt: new Date().toISOString(),
      };
      if (remote) void saveReview(review).catch((error) => toast("Could not publish", firebaseErrorMessage(error)));
      else setReviews((current) => [review, ...current]);
      toast("Review published", "It is live for everyone on the site.");
      return true;
    },
    [toast, user],
  );

  const markNoticeRead = useCallback(
    (id: string) => {
      if (!user) return;
      if (remote && user.uid) {
        void markNoticeReadRemote(user.uid, [id]);
        setRemoteReadIds((current) => (current.includes(id) ? current : [...current, id]));
        return;
      }
      setReadByUser((current) => {
        const mine = current[user.email] ?? [];
        if (mine.includes(id)) return current;
        return { ...current, [user.email]: [...mine, id] };
      });
    },
    [user],
  );

  const markAllNoticesRead = useCallback(() => {
    if (!user) return;
    const ids = notices.map((item) => item.id);
    if (remote && user.uid) {
      if (ids.length) void markNoticeReadRemote(user.uid, ids);
      setRemoteReadIds((current) => Array.from(new Set([...current, ...ids])));
      return;
    }
    setReadByUser((current) => ({
      ...current,
      [user.email]: Array.from(new Set([...(current[user.email] ?? []), ...ids])),
    }));
  }, [notices, user]);

  const upsertProject = useCallback((project: Project) => {
    const prev = projects.find((item) => item.id === project.id);
    const newlyPublished = project.status === "published" && (!prev || prev.status !== "published");
    if (newlyPublished) {
      const notice: Notice = {
        id: uid("note"),
        kind: project.category === "features" ? "feature" : "project",
        title: prev ? "Project published" : "New project",
        body: `${project.title} is now in the portfolio.`,
        href: `/projects/${project.slug}`,
        createdAt: new Date().toISOString(),
      };
      knownNoticeIds.current.add(notice.id);
      if (remote) void saveNotice(notice);
      else setNotices((items) => [notice, ...items]);
    }
    if (remote) {
      void saveProject(project)
        .then(() => toast("Project saved"))
        .catch((error) => toast("Could not save project", firebaseErrorMessage(error)));
      return;
    }
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      return exists ? current.map((item) => (item.id === project.id ? project : item)) : [project, ...current];
    });
    toast("Project saved");
  }, [projects, toast]);

  const setProjectStatus = useCallback((id: string, status: Project["status"]) => {
    const project = projects.find((item) => item.id === id);
    if (remote && project) void patchProjectStatus(project, status);
    else setProjects((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }, [projects]);

  const deleteProject = useCallback((id: string) => {
    if (remote) void deleteProjectRemote(id).catch((error) => toast("Could not delete project", firebaseErrorMessage(error)));
    setProjects((current) => current.filter((item) => item.id !== id));
    toast("Project deleted");
  }, [toast]);

  const setOrderStatus = useCallback((id: string, status: Order["status"]) => {
    if (remote) void patchOrderStatus(id, status);
    else setOrders((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      firebaseReady: remote,
      user,
      favourites,
      orders,
      contacts,
      customizations,
      projects,
      reviews,
      notices,
      unreadNotices,
      unreadCount,
      toasts,
      checkout,
      login,
      adminLogin,
      loginWithGoogle,
      register,
      resetPassword,
      sendVerificationEmail,
      reloadAuthUser,
      logout,
      toggleFavourite,
      isFavourite,
      startCheckout,
      clearCheckout,
      placeOrder,
      addContact,
      addCustomization,
      deleteContact,
      deleteCustomization,
      addReview,
      pushNotice,
      markNoticeRead,
      markAllNoticesRead,
      upsertProject,
      deleteProject,
      setProjectStatus,
      setOrderStatus,
      toast,
    }),
    [
      addContact,
      addCustomization,
      deleteContact,
      deleteCustomization,
      addReview,
      checkout,
      clearCheckout,
      contacts,
      customizations,
      favourites,
      adminLogin,
      isFavourite,
      login,
      loginWithGoogle,
      logout,
      markAllNoticesRead,
      markNoticeRead,
      notices,
      orders,
      placeOrder,
      projects,
      pushNotice,
      ready,
      register,
      reloadAuthUser,
      resetPassword,
      reviews,
      sendVerificationEmail,
      startCheckout,
      toast,
      toasts,
      toggleFavourite,
      unreadNotices,
      unreadCount,
      upsertProject,
      deleteProject,
      user,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-[#16110e]">{item.title}</p>
            {item.detail ? <p className="mt-0.5 text-xs text-[#6d655d]">{item.detail}</p> : null}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
