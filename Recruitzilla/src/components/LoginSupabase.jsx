import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; 
import { supabase } from "../supabaseClient";


const LoginSupabase = () => {
  const {
    session,
    loginWithKeycloak,
    loginAnonymously,
    logout,
    redirectNewUser,
  } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="flex justify-center items-center">
            <button
              onClick={loginAnonymously}
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              Log in anonymously
            </button>
            <button
              onClick={loginWithKeycloak}
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              Log in with Keycloak
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              To previous Login page
            </button>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
          </div>
        </div>
      </div>
    );
  } else {
    redirectNewUser(navigate);
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <button
          onClick={logout}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          To previous Login page
        </button>
        <button
          type="button"
          onClick={() => navigate("/firstlogin")}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          To First Login page
        </button>
        <button
          type="button"
          onClick={() => navigate("/testpage")}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          To TestPage with test data
        </button>
      </div>
    );
  }
};

export default LoginSupabase;
