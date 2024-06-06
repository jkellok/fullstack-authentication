import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloak from './keycloak'
import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'

// Keycloak client uses localhost:5174

const Projects = () => {
  const projects = [
    {
      "id": 1,
      "name": "Recruitzilla on localhost (port 5173)",
      "url": "http://localhost:5173/login/supabase"
    },
    {
      "id": 2,
      "name": "Authzilla on Pouta",
      "url": "https://www.authzilla.ilab.fi/"
    }
  ]

  return (
    <div>
      <h2>List of projects</h2>
      <ul>
        {projects.map(p =>
          <li key={p.id}><a href={p.url}>{p.name}</a></li>
        )}
      </ul>
    </div>
  )
}

const SupabaseLoginComponent = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  console.log("supabase session", session)

  const loginWithKeycloak = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "keycloak",
      options: {
        scopes: "openid",
        redirectTo: "http://localhost:5174",
      },
    });
    if (error) console.log("Error logging in:", error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error logging out:", error.message);
  };

  return session ? (
    <button onClick={logout}>Logout from Supabase keycloak</button>
  ) : (
    <button onClick={loginWithKeycloak}>Login to Supabase with Keycloak</button>
  )
}

const LoginComponent = () => {
  // can't use hook and provider in same component
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) {
    return <div>Loading...</div>
  }

  if (keycloak.authenticated) console.log("keycloak", keycloak)

  return keycloak.authenticated ? (
    <div>
      <div>Welcome, {keycloak.tokenParsed.preferred_username}</div>
      <button onClick={() => keycloak.logout()}>Logout</button> {' '}
      <button onClick={() => keycloak.accountManagement()}>
        Manage your account on Keycloak
      </button>
      <Projects />
    </div>

  ) : (
    <div>
      <button onClick={() => keycloak.login()}>Login</button> {' '}
      <button onClick={() => keycloak.register()}>Register</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <h1>Login app to test SSO</h1>
      <ReactKeycloakProvider authClient={keycloak}>
        <LoginComponent />
        <SupabaseLoginComponent />
      </ReactKeycloakProvider>
    </div>
  )
}

export default App
