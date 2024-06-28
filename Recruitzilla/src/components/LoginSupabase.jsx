import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "../supabaseClient";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Button = ({ value, onClick, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black mx-1"
    >
      {value}
    </button>
  );
};

const TokenForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tokenSent, setTokenSent] = useState(false);

  const sendTokenToPhone = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
      options: {
        shouldCreateUser: false
      }
    });
    if (error) {
      console.log("error", error);
    } else {
      setTokenSent(true);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {!tokenSent ? (
        <div className="bg-white rounded-md px-4 py-3 mx-3 text-black w-3/4 flex flex-col justify-center items-center">
          <form onSubmit={sendTokenToPhone} className="flex flex-col justify-center items-center">
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
              <strong>NOTE: Due to Twilio trial account, only one phone number works with this!</strong>
            </p>
            <p className="mt-5 text-sm">
              You can use this if you have set your phone number with your account
            </p>
            <Button value="Send Token" type="submit">Send token</Button>
          </form>
        </div>
      ) : (
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
            redirectTo={`${baseUrl}/login/supabase`}
          />
          <Button value="Send again?" onClick={() => setTokenSent(false)} type="button" />
        </div>
      )}
    </div>
  );
};

const LoginSupabase = () => {
  const {
    session,
    role,
    redirectNewUser,
    redirectBasedOnRole,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      (async () => {
        await redirectNewUser(navigate);
        redirectBasedOnRole(navigate);
      })();
    }
  }, [session, redirectNewUser, redirectBasedOnRole, navigate]);

  console.log("session", session);
  console.log("role", role);

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-3/4">
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-md px-4 py-3 mx-3 text-black w-1/2 flex flex-col justify-center items-center">
              <p>Log in</p>
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
                redirectTo={`${baseUrl}/login/supabase`}
                queryParams={{
                  scopes: "openid"
                }}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
            {/* Email OTP login, didn't get it working, requires OTP token to be added in Supabase email template */}
              {/*<div className="bg-white rounded-md px-4 py-3 mx-3 mb-5 text-black w-1/2 flex flex-col justify-center items-center">
                <p className="block text-gray-700 text-m mb-2">
                  Email OTP login
                </p>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    style: {
                      button: { color: "black" },
                    },
                  }}
                  redirectTo={`${baseUrl}/login/supabase`}
                  otpType="EmailOtpType"
                  view="verify_otp"
                />
                <p className="mt-5 text-sm">
                  If you ask for a magic link to your email, you can also use the OTP to login
                </p>
              </div> */}
              <TokenForm />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-white bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <p>Redirecting...</p>
      </div>
    );
  }
};

export default LoginSupabase;
