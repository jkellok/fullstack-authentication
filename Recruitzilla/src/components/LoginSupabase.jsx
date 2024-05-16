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

  const anonymousSignIn = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
  }

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        TEMPLATE LOGIN WITH SUPABASE
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        <button
          onClick={anonymousSignIn}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Log in anonymously
        </button>
      </div>
    )
  }
  else {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <h1>Logged in!</h1>
        <button
          onClick={signOut}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          sign out
        </button>
        <Countries />
      </div>
    )
  }
}

export default LoginSupabase