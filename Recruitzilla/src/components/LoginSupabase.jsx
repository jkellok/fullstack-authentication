import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "../supabaseClient";
import { AppWithMFA } from "./MfaComponents";
import { ToastContainer } from "react-toastify";

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

const TokenForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [tokenSent, setTokenSent] = useState(false)

  const sendTokenToPhone = () => {
    const { data, error } = supabase.auth.signInWithOtp({
      "phone": phoneNumber,
      options: {
        // user will not be automatically signed up
        shouldCreateUser: false
      }
    })
    if (error) {
      console.log("error", error)
    } else {
      setTokenSent(true)
    }
  }

  return (
    <div className="flex justify-center items-center">
      {!tokenSent ?
      <div className="bg-white rounded-md px-4 py-3 mx-3 text-black w-3/4 flex flex-col justify-center items-center">
        <label className="block text-gray-700 text-m mb-2" htmlFor="phone">
          Send a token to your phone to login
        </label>
        <input
          className='p-3 flex w-full rounded-md text-black border-black border'
          type='phone'
          id="phone"
          placeholder='Your phone number'
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <p className="mt-5 text-sm">
          You can use this if you have set your phone number with your account
        </p>
        <Button value="Send Token" onClick={sendTokenToPhone}>Send token</Button>
      </div>
      :
      <div className="bg-white rounded-md px-4 py-3 mx-3 text-black w-500 flex flex-col justify-center items-center">
        Verify your token
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: { color: "black" },
            },
          }}
          magicLink={true}
          otpType="sms"
          view="verify_otp"
        />
        <Button value="Send again?" onClick={() => setTokenSent(false)}/>
      </div>
      }
    </div>
  )
}

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
        <div className="flex flex-col justify-center items-center w-3/4">
          <div className="flex justify-center items-center">
            <Button value="Log in with Keycloak" onClick={loginWithKeycloak} />
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
                providers={["google", "github", "linkedin", "keycloak"]}
                magicLink={true}
              />
            </div>
            <TokenForm />
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
        <div className="bg-[white]">
          <AppWithMFA />
        </div>
        {/* <ToastContainer autoClose={4000} /> */}
      </div>
    );
  }
};

export default LoginSupabase;
