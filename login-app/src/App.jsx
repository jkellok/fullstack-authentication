import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloak from './keycloak'

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

const LoginComponent = () => {
  // can't use hook and provider in same component
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) {
    return <div>Loading...</div>
  }

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
      </ReactKeycloakProvider>
    </div>
  )
}

export default App
