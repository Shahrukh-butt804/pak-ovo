import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminRole = "admin" | "manager" | "editor";

interface AdminUser {
  email: string;
  role: AdminRole;
  name: string;
}

interface AuthState {
  user: AdminUser | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  hasRole: (roles: AdminRole[]) => boolean;
}

// Hardcoded authorized admin accounts (client-side gate; for production swap for Lovable Cloud auth + user_roles table)
const ADMIN_ACCOUNTS: { email: string; password: string; role: AdminRole; name: string }[] = [
  { email: "admin@pakovo.com", password: "Admin@123", role: "admin", name: "Site Admin" },
  { email: "manager@pakovo.com", password: "Manager@123", role: "manager", name: "Store Manager" },
];

export const useAdminAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, password) => {
        const match = ADMIN_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
        );
        if (!match) return { ok: false, error: "Invalid email or password." };
        set({ user: { email: match.email, role: match.role, name: match.name } });
        return { ok: true };
      },
      logout: () => set({ user: null }),
      hasRole: (roles) => {
        const u = get().user;
        return !!u && roles.includes(u.role);
      },
    }),
    { name: "pakovo-admin-auth" }
  )
);
