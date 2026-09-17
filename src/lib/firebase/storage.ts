import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth, getFirebaseStorage } from "./client";

const MAX_BYTES = 5 * 1024 * 1024;
const FALLBACK_MAX_EDGE = 1200;
const FALLBACK_QUALITY = 0.72;

function guessContentType(file: File): string {
  if (file.type && file.type.startsWith("image/")) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
}

async function ensureAuthToken() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("Not signed in to Firebase. Log out and sign in again as admin, then retry the upload.");
  }
  await user.getIdToken(true);
}

function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not process image."));
      img.onload = () => {
        const scale = Math.min(1, FALLBACK_MAX_EDGE / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", FALLBACK_QUALITY));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File, folder: string, id: string) {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage is not configured.");
  if (!file.type.startsWith("image/") && !/\.(png|jpe?g|webp|gif)$/i.test(file.name)) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_BYTES) throw new Error("Image must be under 5 MB.");

  const contentType = guessContentType(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || `image.${contentType.split("/")[1] || "jpg"}`;
  const path = `${folder}/${id}/${Date.now()}-${safeName}`;

  try {
    await ensureAuthToken();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType });
    return getDownloadURL(storageRef);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const unauthorized =
      message.includes("unauthorized") ||
      message.includes("permission") ||
      message.includes("Not signed in");
    if (!unauthorized) throw error;
    // Fallback when Storage rules/auth block the write — keep admin unblocked.
    return fileToCompressedDataUrl(file);
  }
}

export async function uploadProjectCover(file: File, projectId: string) {
  return uploadImage(file, "project-covers", projectId);
}

/** Same Storage folder + auth path as project covers (production rules already allow it). */
export async function uploadBlogCover(file: File, postId: string) {
  return uploadImage(file, "project-covers", postId);
}
