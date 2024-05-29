import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  realm: 'fullstackauth',
  url: 'https://keycloak.ilab.fi:8443',
  clientId: 'login-app'
})

export default keycloak