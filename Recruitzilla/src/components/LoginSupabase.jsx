import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { supabase } from "../supabaseClient";

const UserIdentities = () => {
  // use updateUser to update email, phone, password for authenticated user
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // sends "confirm email change" email to new email address
  const updateEmail = async () => {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
      options: {
        emailRedirectTo: 'http://localhost:5173/login/supabase'
      }
    })
    if (error) console.log("Error:", error.message);
    console.log("data", data)
  }
  // sends OTP to new phone number
  const updatePhone = async () => {
    const { data, error } = await supabase.auth.updateUser({
      phone: newPhone
    })
    if (error) console.log("Error:", error.message);
    console.log("data", data)
  }
  const updatePassword = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) console.log("Error:", error.message);
    console.log("data", data)
  }

  // requires supabase linked auths
  const getIdentities = async () => {
    const { data, error } = await supabase.auth.getUserIdentities()
    console.log("retrieved identities:", data)
  }
  const linkIdentity = async () => {
    // links an oauth identity to an existing user
    // Enable Manual Linking must be enabled in Supabase auth settings
    // if run in browser, user is automatically redirected to returned URL
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'github'
    })
  }
  const unlinkIdentity = async () => {
    // Enable Manual Linking must be enabled
    const identities = await supabase.auth.getUserIdentities()
    const googleIdentity = identities.find(
      identity => identity.provider === 'google'
    )
    const keycloakIdentity = identities.find(
      identity = identity.provider === 'keycloak'
    )
    const { error } = await supabase.auth.unlinkIdentity(googleIdentity)
  }

  return (
    <div className="bg-[#1e1f1f]">
      <div className="text-black bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="bg-[#f0f0f0] shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form
            className="text-black mt-8 flex flex-col justify-center items-center"
          >
            <h2 className="text-xl font-bold text-center mb-6">
              Update your details
            </h2>
            <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              required
              type="text"
              placeholder="New email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded text-black"
              defaultValue={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            </div>
            <div className="mb-6">
            <label className="block mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              required
              type="text"
              placeholder="New phone"
              id="phone"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              placeholder="New Password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </form>
        <Button value="Change email" onClick={updateEmail} />
        <Button value="Change phone" onClick={updatePhone} />
        <Button value="Change password" onClick={updatePassword} />
      </div>
    </div>
  </div>
  )
}

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
        <UserIdentities />
      </div>
    );
  }
};

export default LoginSupabase;
