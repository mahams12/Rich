import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { projects as seedProjects, sortProjectsNewestFirst } from "@/data/projects";
import { posts as seedPosts, sortPostsNewestFirst } from "@/data/posts";
import type {
  BlogPost,
  ContactRequest,
  CustomizationRequest,
  Notice,
  Order,
  Project,
  Review,
} from "@/types";
import { getFirebaseDb } from "./client";

function isBlogRemoteDoc(data: Record<string, unknown>, id: string) {
  return data._kind === "blog" || id.startsWith("blog_");
}

function mergeProjects(remote: Project[]) {
  const onlyProjects = remote.filter((item) => !isBlogRemoteDoc(item as unknown as Record<string, unknown>, item.id));
  if (!onlyProjects.length) return seedProjects;
  const byId = new Map(seedProjects.map((item) => [item.id, item]));
  for (const item of onlyProjects) {
    if (item.deleted) {
      byId.delete(item.id);
      continue;
    }
    byId.set(item.id, item);
  }
  return sortProjectsNewestFirst(Array.from(byId.values()));
}

function mergePosts(remote: BlogPost[]) {
  if (!remote.length) return seedPosts;
  const byId = new Map(seedPosts.map((item) => [item.id, item]));
  for (const item of remote) {
    if (item.deleted) {
      byId.delete(item.id);
      continue;
    }
    byId.set(item.id, item);
  }
  return sortPostsNewestFirst(Array.from(byId.values()));
}

function mapBlogDoc(id: string, data: Record<string, unknown>): BlogPost {
  const rawId = typeof data.id === "string" ? data.id : id.replace(/^blog_/, "");
  return {
    ...(data as unknown as BlogPost),
    id: rawId,
  };
}

function sortByDate<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export function subscribeCollection<T extends { id: string }>(
  name: string,
  onData: (items: T[]) => void,
  map: (id: string, data: Record<string, unknown>) => T,
) {
  const db = getFirebaseDb();
  if (!db) return () => undefined;
  return onSnapshot(collection(db, name), (snap) => {
    onData(snap.docs.map((item) => map(item.id, item.data() as Record<string, unknown>)));
  });
}

export function subscribeProjects(onData: (items: Project[]) => void) {
  return subscribeCollection<Project>("projects", (items) => onData(mergeProjects(items)), (id, data) => ({
    ...(data as unknown as Project),
    id,
  }));
}

/**
 * Blog posts are stored in the public `projects` collection as `_kind: "blog"` docs
 * (doc id `blog_{id}`) because production Firestore rules already allow public read /
 * admin write there. Dedicated `posts` rules can be added later without breaking this.
 */
export function subscribePosts(onData: (items: BlogPost[]) => void) {
  const db = getFirebaseDb();
  if (!db) return () => undefined;
  return onSnapshot(collection(db, "projects"), (snap) => {
    const remote = snap.docs
      .map((item) => {
        const data = item.data() as Record<string, unknown>;
        if (!isBlogRemoteDoc(data, item.id)) return null;
        return mapBlogDoc(item.id, data);
      })
      .filter((item): item is BlogPost => Boolean(item));
    onData(mergePosts(remote));
  });
}

export function subscribeReviews(onData: (items: Review[]) => void) {
  return subscribeCollection<Review>("reviews", (items) => onData(sortByDate(items)), (id, data) => ({
    ...(data as unknown as Review),
    id,
  }));
}

export function subscribeNotices(onData: (items: Notice[]) => void) {
  return subscribeCollection<Notice>("notices", (items) => onData(sortByDate(items)), (id, data) => ({
    ...(data as unknown as Notice),
    id,
  }));
}

export function subscribeOwned<T extends { id: string; createdAt?: string }>(
  name: string,
  email: string | null,
  admin: boolean,
  onData: (items: T[]) => void,
  map: (id: string, data: Record<string, unknown>) => T,
) {
  const db = getFirebaseDb();
  if (!db || !email) {
    onData([]);
    return () => undefined;
  }
  const ref = admin
    ? collection(db, name)
    : query(collection(db, name), where("email", "==", email));
  return onSnapshot(ref, (snap) => {
    onData(sortByDate(snap.docs.map((item) => map(item.id, item.data() as Record<string, unknown>))));
  });
}

export function subscribeContacts(email: string | null, admin: boolean, onData: (items: ContactRequest[]) => void) {
  return subscribeOwned<ContactRequest>("contacts", email, admin, onData, (id, data) => ({
    ...(data as unknown as ContactRequest),
    id,
  }));
}

export function subscribeCustomizations(email: string | null, admin: boolean, onData: (items: CustomizationRequest[]) => void) {
  return subscribeOwned<CustomizationRequest>("customizations", email, admin, onData, (id, data) => ({
    ...(data as unknown as CustomizationRequest),
    id,
  }));
}

export function subscribeOrders(email: string | null, admin: boolean, onData: (items: Order[]) => void) {
  return subscribeOwned<Order>("orders", email, admin, onData, (id, data) => ({
    ...(data as unknown as Order),
    id,
  }));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (entry === undefined) continue;
      out[key] = stripUndefined(entry);
    }
    return out;
  }
  return value;
}

async function write(path: string, id: string, data: Record<string, unknown>) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  const clean = stripUndefined({ ...data, updatedAt: serverTimestamp() }) as Record<string, unknown>;
  await setDoc(doc(db, path, id), clean, { merge: true });
}

export function saveProject(project: Project) {
  const payload = { ...project } as Record<string, unknown>;
  if (project.cover === "") {
    payload.cover = deleteField();
  } else if (!project.cover) {
    delete payload.cover;
  }
  if (project.gallery) {
    const cleaned = project.gallery.map((item) => item.trim()).filter(Boolean);
    if (cleaned.length) payload.gallery = cleaned;
    else payload.gallery = deleteField();
  } else {
    delete payload.gallery;
  }
  const now = new Date().toISOString();
  if (!project.createdAt) payload.createdAt = now;
  payload.publishedAt = project.publishedAt || now;
  return write("projects", project.id, payload);
}

export function savePost(post: BlogPost) {
  const payload = { ...post, _kind: "blog" } as Record<string, unknown>;
  if (post.cover === "") {
    payload.cover = deleteField();
  } else if (!post.cover) {
    delete payload.cover;
  }
  if (post.gallery) {
    const cleaned = post.gallery.map((item) => item.trim()).filter(Boolean);
    if (cleaned.length) payload.gallery = cleaned;
    else payload.gallery = deleteField();
  } else {
    delete payload.gallery;
  }
  // Firestore docs max ~1MB — keep local data-URL covers from blowing up the write.
  if (typeof payload.cover === "string" && payload.cover.startsWith("data:") && payload.cover.length > 700_000) {
    throw new Error("Image is too large to save. Use a smaller JPG/PNG (under ~1 MB) or re-upload after signing in again.");
  }
  const now = new Date().toISOString();
  if (!post.createdAt) payload.createdAt = now;
  payload.publishedAt = post.publishedAt || now;
  payload.updatedAt = now;
  // Public-readable path (same rules as portfolio projects).
  return write("projects", `blog_${post.id}`, payload);
}

export async function deleteProjectRemote(id: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(
    doc(db, "projects", id),
    { id, deleted: true, status: "archived", updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function deletePostRemote(id: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(
    doc(db, "projects", `blog_${id}`),
    { id, _kind: "blog", deleted: true, status: "archived", updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function saveReview(review: Review) {
  return write("reviews", review.id, { ...review });
}

export function saveNotice(notice: Notice) {
  return write("notices", notice.id, { ...notice });
}

export function saveContact(item: ContactRequest) {
  return write("contacts", item.id, { ...item });
}

export function saveCustomization(item: CustomizationRequest) {
  return write("customizations", item.id, { ...item });
}

export function saveOrder(item: Order) {
  return write("orders", item.id, { ...item });
}

export async function patchProjectStatus(project: Project, status: Project["status"]) {
  return saveProject({ ...project, status });
}

export async function patchPostStatus(post: BlogPost, status: BlogPost["status"]) {
  return savePost({ ...post, status });
}

export async function patchOrderStatus(id: string, status: Order["status"]) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "orders", id), { status, updatedAt: serverTimestamp() });
}

export async function toggleFavouriteRemote(uid: string, projectId: string, on: boolean) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "users", uid), {
    favourites: on ? arrayUnion(projectId) : arrayRemove(projectId),
  });
}

export async function markNoticeReadRemote(uid: string, ids: string[]) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "users", uid), { readNoticeIds: arrayUnion(...ids) });
}

export async function removeDoc(path: string, id: string) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, path, id));
}
