import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "../supabaseClient";

const Button = ({ value, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black mx-1"
    >
      {value}
    </button>
  );
};

const LoginSupabase = () => {
  const {
    session,
    loginWithKeycloak,
    loginAnonymously,
    logout,
    redirectNewUser,
  } = useAuth();
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  console.log("session", session)

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="flex justify-center items-center">
            <Button value="Log in anonymously" onClick={loginAnonymously} />
            <Button value="Log in with Keycloak" onClick={loginWithKeycloak} />
            <Button
              value="To previous Login page"
              onClick={() => handleClick("/login")}
            />
            <div className="bg-white rounded-md px-4 py-3 mx-3 text-black w-1/2 flex flex-col justify-center items-center">
              Log in with Supabase
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: { color: "black" },
                  },
                }}
                providers={["google", "github", "linkedin"]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    redirectNewUser(navigate);
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <Button value="Log out" onClick={logout} />
        <Button value="To previous Login page" onClick={() => handleClick("/login")} />
        <Button value="To First Login Form" onClick={() => handleClick("/firstlogin")} />
        <Button value="To TestPage with test data" onClick={() => handleClick("/testpage")} />
        <Button value="To User Management" onClick={() => handleClick("/usermanagement")} />
      </div>
    );
  }
};

export default LoginSupabase;
