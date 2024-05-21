import React from "react";
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'

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

// testing inserting data and RLS
const TestDataView = ({ session }) => {
  const [testData, setTestData] = useState([])
  //console.log("session", session)

  useEffect(() => {
    getTestData();
  }, []);

  async function getTestData() {
    const { data } = await supabase.from("test_table").select();
    setTestData(data);
    console.log("data getTestData", data)
  }

  // in Supabase SQL editor, RLS rule to see only own row
/*   alter table "data" enable row level security;

  create policy "Individuals can view their own data."
  on data for select
  using ( (select auth.uid()) = user_id ); */

  // RLS authenticated users can insert into data
  const insertData = async () => {
    const { error } = await supabase
      .from("test_table")
      .insert({
        //id: Math.random(),
        user_id: session.user.id,
        data: "test data",
        full_name: session.user.identities[0].identity_data.full_name,
        email: session.user.identities[0].identity_data.email
      })
    getTestData()
  }

  return (
    <div>
      <ul>
        {testData.map((data) => (
          <li key={data.id}>{data.id} {data.user_id} {data.data} {data.full_name} {data.email}</li>
        ))}
      </ul>
      <button
        className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        onClick={insertData}
        >
          insert data
        </button>
    </div>
  )
}

const LoginSupabase = () => {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

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
        <Countries />
      </div>
    )
  }
}

export default LoginSupabase