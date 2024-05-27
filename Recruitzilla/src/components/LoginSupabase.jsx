import React from "react";
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import { useSession } from "../hooks/useSession";

const LoginAnonymouslyButton = () => {
  const anonymousSignIn = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()
  }

  return (
    <button
      onClick={anonymousSignIn}
      className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
    >
      Log in anonymously
    </button>
  )
}

// login with keycloak with supabase client library
const LoginWithKeycloakButton = () => {
  async function signInWithKeycloak() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'keycloak',
      options: {
        scopes: 'openid',
        redirectTo: 'http://localhost:5173/login/supabase' // change later for production
      },
    })
  }

  return (
    <button
      onClick={signInWithKeycloak}
      className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
    >
      Log in with Keycloak
    </button>
  )

}

const SignOutButton = () => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <button
      onClick={signOut}
      className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
    >
      sign out
    </button>
  )
}

const LoginSupabase = () => {
  const session = useSession()
  const navigate = useNavigate()

  const redirectNewUser = async () => {
    // check if is_new is true and redirect new user
    const { data, error } = await supabase
      .from("new_users")
      .select("is_new")
      .eq("id", session.user.id)

    if (data[0].is_new) {
      navigate('/firstlogin')
    }
  }

  if (!session) {
    return (
      <div>
        <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center w-1/2">
            <div className="flex justify-center items-center">
              <LoginAnonymouslyButton />
              <LoginWithKeycloakButton />
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
      </div>
    )
  }
  else {
    console.log("user", session.user)
    redirectNewUser()
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <SignOutButton />
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
    )
  }
}

export default LoginSupabase