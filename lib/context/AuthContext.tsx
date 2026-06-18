"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  email: string;
  name: string;
};

type RegisteredUser = AuthUser & {
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string,
  ) => { ok: boolean; error?: string };
  logout: () => void;
};

const SESSION_KEY = "code-blonde-auth";
const USERS_KEY = "code-blonde-users";

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email || !parsed?.name) return null;

    return parsed;
  } catch {
    return null;
  }
}

function readUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as RegisteredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: RegisteredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(user: AuthUser | null) {
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { ok: false, error: "E-posta ve şifre zorunludur." };
    }

    const registered = readUsers().find(
      (item) => item.email.toLowerCase() === trimmedEmail,
    );

    if (!registered || registered.password !== trimmedPassword) {
      return { ok: false, error: "E-posta veya şifre hatalı." };
    }

    const sessionUser = {
      email: registered.email,
      name: registered.name,
    };

    setUser(sessionUser);
    writeSession(sessionUser);
    return { ok: true };
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        return { ok: false, error: "Tüm alanları doldurun." };
      }

      if (trimmedPassword.length < 6) {
        return {
          ok: false,
          error: "Şifre en az 6 karakter olmalıdır.",
        };
      }

      const users = readUsers();

      if (users.some((item) => item.email.toLowerCase() === trimmedEmail)) {
        return { ok: false, error: "Bu e-posta ile kayıtlı bir hesap var." };
      }

      const nextUser: RegisteredUser = {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      };

      writeUsers([...users, nextUser]);

      const sessionUser = {
        email: nextUser.email,
        name: nextUser.name,
      };

      setUser(sessionUser);
      writeSession(sessionUser);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isReady,
      login,
      register,
      logout,
    }),
    [user, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth yalnızca AuthProvider içinde kullanılabilir.");
  }

  return context;
}
