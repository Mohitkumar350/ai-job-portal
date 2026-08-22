import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, reload, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await reload(user);
          setFirebaseUser(user);
        } else {
          setFirebaseUser(null);
        }

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const portalUser = storedUser ? JSON.parse(storedUser) : null;

        if (
          token &&
          portalUser &&
          user &&
          (!user.email || user.emailVerified === true)
        ) {
          setCurrentUser(portalUser);
        } else if (portalUser?.email && user?.emailVerified !== true) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          await signOut(auth);
          setCurrentUser(null);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("AUTH LOAD ERROR:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setFirebaseUser(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = (user, token) => {
    try {
      console.log("AUTH LOGIN:", user);

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      // IMPORTANT
      // Update React state immediately
      setCurrentUser(user);

      return true;
    } catch (error) {
      console.error("AUTH LOGIN ERROR:", error);

      return false;
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    console.log("AUTH LOGOUT");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    signOut(auth).catch((error) => {
      console.error("FIREBASE LOGOUT ERROR:", error);
    });

    setFirebaseUser(null);
    setCurrentUser(null);
  };

  // =====================================================
  // REFRESH USER
  // =====================================================

  const refreshUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setCurrentUser(null);
        return;
      }

      const user = JSON.parse(storedUser);

      setCurrentUser(user);

      console.log("AUTH USER REFRESHED:", user);
    } catch (error) {
      console.error("AUTH REFRESH ERROR:", error);

      setCurrentUser(null);
    }
  };

  // =====================================================
  // CONTEXT
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        setCurrentUser,
        login,
        logout,
        refreshUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
