import { projects as seedProjects } from "@/data/projects";
import type {
  ContactRequest,
  CustomizationRequest,
  Notice,
  Order,
  Project,
  Review,
  UserAccount,
} from "@/types";

export const SHARED_KEY = "novexahub.shared.v1";
export const SESSION_KEY = "novexahub.session.v1";
export const LEGACY_KEY = "novexahub.v1";
export const LIVE_CHANNEL = "novexahub-live";

export interface SharedState {
  projects: Project[];
  notices: Notice[];
  reviews: Review[];
  contacts: ContactRequest[];
  customizations: CustomizationRequest[];
  orders: Order[];
  favouritesByUser: Record<string, string[]>;
  readByUser: Record<string, string[]>;
}

interface LegacyState {
  user?: UserAccount | null;
  favourites?: string[];
  orders?: Order[];
  contacts?: ContactRequest[];
  customizations?: CustomizationRequest[];
  projects?: Project[];
}

function mergeProjects(saved: Project[] | undefined): Project[] {
  if (!saved?.length) return seedProjects;
  const byId = new Map(saved.map((item) => [item.id, item]));
  const extras = seedProjects.filter((item) => !byId.has(item.id));
  return extras.length ? [...saved, ...extras] : saved;
}

export function emptyShared(): SharedState {
  return {
    projects: seedProjects,
    notices: [],
    reviews: [],
    contacts: [],
    customizations: [],
    orders: [],
    favouritesByUser: {},
    readByUser: {},
  };
}

export function readShared(): SharedState {
  try {
    const raw = localStorage.getItem(SHARED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SharedState>;
      return {
        ...emptyShared(),
        ...parsed,
        projects: mergeProjects(parsed.projects),
        notices: parsed.notices ?? [],
        reviews: parsed.reviews ?? [],
        contacts: parsed.contacts ?? [],
        customizations: parsed.customizations ?? [],
        orders: parsed.orders ?? [],
        favouritesByUser: parsed.favouritesByUser ?? {},
        readByUser: parsed.readByUser ?? {},
      };
    }
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (!legacyRaw) return emptyShared();
    const legacy = JSON.parse(legacyRaw) as LegacyState;
    const favouritesByUser: Record<string, string[]> = {};
    if (legacy.user?.email && legacy.favourites?.length) {
      favouritesByUser[legacy.user.email] = legacy.favourites;
    }
    return {
      ...emptyShared(),
      projects: mergeProjects(legacy.projects),
      contacts: legacy.contacts ?? [],
      customizations: legacy.customizations ?? [],
      orders: legacy.orders ?? [],
      favouritesByUser,
    };
  } catch {
    return emptyShared();
  }
}

export function writeShared(state: SharedState) {
  const next = JSON.stringify(state);
  if (localStorage.getItem(SHARED_KEY) === next) return;
  localStorage.setItem(SHARED_KEY, next);
}

export function readSessionUser(): UserAccount | null {
  try {
    // localStorage so auth UI restores across refresh + other tabs (Firebase is still source of truth).
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserAccount) : null;
  } catch {
    return null;
  }
}

export function writeSessionUser(user: UserAccount | null) {
  try {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    const raw = JSON.stringify(user);
    localStorage.setItem(SESSION_KEY, raw);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode */
  }
}
