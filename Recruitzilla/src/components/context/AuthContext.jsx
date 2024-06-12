import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setRole(session.user.app_metadata.userrole);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          setRole(session.user.app_metadata.userrole);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginWithKeycloak = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "keycloak",
      options: {
        scopes: "openid",
        redirectTo: "http://localhost:5173/login/supabase", // change later for production
      },
    });
    if (error) console.log("Error logging in:", error.message);
  };

  const loginAnonymously = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) console.log("Error logging in anonymously:", error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
  };

  const redirectNewUser = async (navigate) => {
    if (!session || !session.user) return;

    const { data, error } = await supabase
      .from("new_users")
      .select("is_new")
      .eq("id", session.user.id);

    if (error) {
      console.log("Error fetching new user status:", error.message);
      return;
    }

    if (data[0]?.is_new) {
      navigate("/firstlogin");
    }
  };

  const redirectBasedOnRole = (navigate) => {
    if (!session || !session.user) return;

    switch (session.user.app_metadata.userrole) {
      case "student":
        navigate("/student-console");
        break;
      case "admin":
        navigate("/admin-console");
        break;
      case "recruiter":
        navigate("/app/filter");
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        role,
        loading,
        loginWithKeycloak,
        loginAnonymously,
        logout,
        redirectNewUser,
        redirectBasedOnRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
