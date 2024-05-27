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
  const [users, setUsers] = useState([]);
  const userId = session.user.id;

  useEffect(() => {
    getUsers();
  }, []);

  //Supabase doesn't have name by default using this and testuser for testing purposes 
  async function getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        roles (name)
      `);
    if (error) console.error(error);
    setUsers(data);
  }

  const selectRole = async (role, userId) => {
    const { data, error } = await supabase
      .from("new_users")
      .update({ role_name: role }) 
      .eq("id", userId);
    if (error) console.error(error);

    getUsers();
    set_claim(userId, 'userrole', role);
  }

  const set_claim = async (uid, claim, value) => {
    try {
      console.log('uid:', uid);
      console.log('claim:', claim);
      console.log('value:', value);
      const { data, error } = await supabase
        .rpc('set_claim', { uid, claim, value });
      if (error) throw error;
      return { data, error };
    } catch (error) {
      console.error('Error in set_claim:', error);
    }
  };

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
      <h1>Select testuser's role</h1>
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