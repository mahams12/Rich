import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "./client";

const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadProjectCover(file: File, projectId: string) {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase Storage is not configured.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_BYTES) throw new Error("Image must be under 5 MB.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `project-covers/${projectId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
