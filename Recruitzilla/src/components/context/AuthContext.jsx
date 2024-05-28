import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
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
    const { data, error } = await supabase
      .from("new_users")
      .select("is_new")
      .eq("id", session.user.id);

    if (data[0].is_new) {
      navigate("/firstlogin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loginWithKeycloak,
        loginAnonymously,
        logout,
        redirectNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
