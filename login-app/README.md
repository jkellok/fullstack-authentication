# Login App

## Description
A simple app to test and demo logging in Keycloak client that shares the same realm with supabase client that is used in Recruitzilla.

This app uses keycloak-js adapter, which automatically checks for authenticated user and can authenticate the user from another client to login-app client. Using logout will log out user from all Keycloak sessions.

The app is deployed on a Pouta server at https://www.loginapp.ilab.fi

## Demo
![Screenshot of login app](docs/pictures/login-app.png)
![Demo video of login app](docs/videos/LoginappDemo.mp4)

## Installation
- Git glone this project
- Move to login-app folder
- Install dependencies (npm install)
- Run in development mode (npm run dev)
    - Should run in port 5174 (Keycloak client configured to allow localhost:5174)

## Further information
You can read a more detailed documentation about this app in [/docs/keycloak-login-app.md](../docs/keycloak-login-app.md).