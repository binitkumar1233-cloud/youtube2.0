"use client";

import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext({
  user: null,
  login: () => {},
  logout: async () => {},
  handlegoglesignin: async () => ({
    ok: false,
    code: "auth/not-initialized",
    domain: undefined,
    message: undefined,
  }),
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  const normalizeUser = (userData) => {
    if (!userData || typeof userData !== "object") return userData;
    const normalizedUser = { ...userData };
    normalizedUser.id =
      normalizedUser.id ||
      normalizedUser._id ||
      normalizedUser.uid ||
      normalizedUser.userId;
    return normalizedUser;
  };

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    await signOut(auth);
  };

  const syncUserWithBackend = async (firebaseUser) => {
    const payload = {
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      image: firebaseUser.photoURL || "https://github.com/shadcn.png",
    };

    try {
      const response = await axiosInstance.post("/user/login", payload);
      const normalizedUser = response.data?.result || payload;
      login(normalizedUser);
      return { ok: true, user: normalizedUser };
    } catch (axiosError) {
      const errorDetail =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Unknown error";
      console.warn(
        "Backend sync warning - continuing with local login:",
        errorDetail,
      );
      login(payload);
      return { ok: true, user: payload };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        void syncUserWithBackend(firebaseUser);
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return unsubscribe;
  }, []);

  const handlegoglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return await syncUserWithBackend(result.user);
    } catch (error) {
      const errorCode = error?.code;

      // User canceled popup or another popup request is active.
      if (
        errorCode === "auth/popup-closed-by-user" ||
        errorCode === "auth/cancelled-popup-request"
      ) {
        return { ok: false, code: errorCode };
      }

      // Firebase project is missing current host in authorized domains.
      if (errorCode === "auth/unauthorized-domain") {
        return {
          ok: false,
          code: errorCode,
          domain:
            typeof window !== "undefined" ? window.location.hostname : undefined,
        };
      }

      // Mobile Safari/Chrome frequently blocks popup auth flows.
      if (
        errorCode === "auth/popup-blocked" ||
        errorCode === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, provider);
        return { ok: true, redirected: true };
      }

      console.error("Firebase signin error:", error);
      return {
        ok: false,
        code: errorCode || "auth/unknown",
        message: error?.message || "An unknown authentication error occurred.",
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, handlegoglesignin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
