import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      getRole()
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        getRole()
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getRole = async () => {
    const { data, error } = await supabase.rpc("get_my_claims", {});
    if (error) {
      console.error("Error fetching role:", error);
    } else {
      setRole(data.userrole);
    }
    console.log("userrole", data.userrole)
  }

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
        role,
        loading,
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
