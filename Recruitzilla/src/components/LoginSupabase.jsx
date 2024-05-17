import React from "react";
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

// just an example, delete later
const Countries = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <div>
      <h2 className="text-[white] text-center font-bold ml-2">
        Example data from Supabase
      </h2>
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>
    </div>
  )
}

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
        redirectTo: 'http://localhost:5173/login/supabase' // change later
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
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        TEMPLATE LOGIN WITH SUPABASE
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        <LoginAnonymouslyButton />
        <LoginWithKeycloakButton />
      </div>
    )
  }
  else {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <SignOutButton />
        <Countries />
      </div>
    )
  }
}

export default LoginSupabase