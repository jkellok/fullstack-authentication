import React from "react";
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import { useSession } from "../hooks/useSession";
import { getNativeSelectUtilityClasses } from "@mui/material";

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

const initialUser = [
  { id: 0, name: 'initial name', roles: { name: 'initial role' } }
]

const RoleSelectionButton = ({ session }) => {
  // should be shown to user who has no role yet / first time login
  // maybe role could be changed in their own profile?

  // example data: show user name and role
  // click button to change role
  // update role and see the change
  // then figure out how to add new user to users and assign role

  const [users, setUsers] = useState(initialUser)
  const userId = session.user.id

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    // could modify to only get their own data
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        roles (name)
      `)
    console.log("getUsers", data)
    setUsers(data)
  }

  const selectRole = async (role, userId) => {
    console.log("selectrole role", role)
    console.log("userid", userId)
    switch (role) {
      case "student":
        role = "2bb77715-6a01-431b-8ca5-19db119f5d67"
        break
      case "recruiter":
        role = "b7ad4189-308f-4b99-a9f6-c93ff0a270bb"
        break
      default:
        // recruiter role as default
        role = "b7ad4189-308f-4b99-a9f6-c93ff0a270bb"
    }

    // make sure policy is set that update is allowed
    // should make so that user can update own data
    // using (( SELECT (auth.uid() = users.id)) )
    // should throw error if not allowed?
    console.log("role selected", role)
    const { data, error } = await supabase
      .from("users")
      .update({ role_id: role })
      .eq("id", userId)
      //.eq("id", "131a26c5-7750-493a-ba42-44a000f33a3b")
      //.eq("id", "09951f3f-cf81-446a-899a-1c13cdb95d94")
      .select()
    console.log("selectrole data", data)

    getUsers()
  }

  const DisplayUserAndRole = () => {
    return (
      <div>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}, Role: {user.roles.name}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-[#1e1f1f] flex flex-col justify-center items-center">
      <h1>Select your role</h1>
      <div>
        <button
          type="button"
          onClick={() => selectRole("recruiter", userId)}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Recruiter
        </button>
        {' '}
        <button
          type="button"
          onClick={() => selectRole("student", userId)}
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        >
          Student
        </button>
      </div>
      <DisplayUserAndRole />
    </div>
  )
}

const LoginSupabase = () => {
  const navigate = useNavigate()
  const session = useSession()

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
        <RoleSelectionButton session={session} />
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