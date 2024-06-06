import Keycloak from 'keycloak-js'

/* const keycloak = new Keycloak({
  realm: 'fullstackauth',
  url: 'https://keycloak.ilab.fi:8443',
  clientId: 'supabase',
  onLoad: 'check-sso', // default check-sso, other option login-required
  enableLogging: true
}); */

/* const initKeycloak = (onAuthenticatedCallback) => {
  keycloak.init({ onLoad: keycloak.onLoad })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("not authenticated")
      }
      onAuthenticatedCallback()
    })
    .catch(console.error)
} */

let initOptions = {
  realm: 'fullstackauth',
  url: 'https://keycloak.ilab.fi:8443',
  clientId: 'supabase',
  onLoad: 'check-sso', // default check-sso, other option login-required
  enableLogging: true,
  KeycloakResponseType: 'code',
}

const kc = new Keycloak(initOptions);

const initKeycloak = () => {
  kc.init({
    onLoad: initOptions.onLoad,
    KeycloakResponseType: 'code',
  }).then((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
      console.log('auth', auth)
      console.log('Keycloak', kc)
      kc.onTokenExpired = () => {
        console.log('token expired')
      }
    }
  }, () => {
    console.error("Authenticated Failed");
  });
}


const isAuthenticated = () => kc.authenticated

const keycloakService = {
  initKeycloak,
  isAuthenticated
}

export default keycloakService