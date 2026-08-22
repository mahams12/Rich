import { isPrimaryAdminEmail } from "@/lib/firebase/config";
import type { UserAccount } from "@/types";

export function isStudioAdmin(user: UserAccount | null | undefined) {
  return Boolean(user?.role === "admin" && user.email && isPrimaryAdminEmail(user.email));
}
