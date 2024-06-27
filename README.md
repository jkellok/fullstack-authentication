[![Made with Supabase](https://supabase.com/badge-made-with-supabase-dark.svg)](https://supabase.com)
# Fullstack-authentication: Authzilla 🔐

## Description
This project focuses on authentication and identity management for full stack web application. This was made for TAMK's Summer Practice 2024.  

[Supabase](https://supabase.com/) is used as the database. Users can have one of the three roles: student, recruiter or admin.

This app is deployed on Pouta at https://authzilla.ilab.fi.  
A smaller login app was made to test Keycloak and Supabase logins, which is available at https://loginapp.ilab.fi.

Refer to the [documentation](/docs) for more information.

Base for the app is [Recruitzilla](https://recruitzilla.ilab.fi/), which is also available on [GitHub](ttps://github.com/Dialex2006/TAMK-student-catalog-2023).

## Demo
![Authzilla user demo](/docs/videos/AuthzillaDemoCompr.mp4)

## Installation
- Ensure that you have at least Node v.18.18.2 installed  
```
node -v
```
- Clone project  
```
git clone https://gitlab.tamk.cloud/summer-practice-2024/fullstack-authentication.git
```
- Move to /Recruitzilla folder  
```
cd fullstack-authentication/Recruitzilla/
```
- Install dependencies  
```
npm install
```
- Configure environment variables in .env or .env.development
```
VITE_BASE_URL="http://localhost:5173
VITE_SUPABASE_URL="https://bmfjjujhrtssdmcbnrio.supabase.co"
VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZmpqdWpocnRzc2RtY2JucmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMjQ5NTIsImV4cCI6MjAzMDkwMDk1Mn0.rashuYNVgwqWxtIQmLYfQiaOHIeNfUSDR8C1pzQNn3U"
```
- Run in development mode  
```
npm run dev
```
- Navigate to http://localhost:5173/

## Usage
From the login page, you can sign up and login with
- email address and password
- social logins: Google, GitHub, LinkedIn
- Keycloak (IDM)
    - In Keycloak you can use your email or the same social logins
- email magic link
- phone OTP (after you've signed up in another way and have added your phone number in the settings)

Sending emails and SMS are rate limited, so magic link and OTP might not always work.

On the first login, user has to provide their name and choose a role (student or recruiter). The role authorizes their access to the console. Students see a student console, where they can add their details, courses and grades. Recruiters can view a list of students. Admin can access the admin console, where they can edit and delete users, students and courses.

Everyone can access settings, where they can update their email address, phone number, password and identities. Users can also enroll MFA and delete their own account.

Authentication settings can be accessed in Supabase Dashboard where you could enable email confirmation, set requirements for passwords, etc.

## Authors
Juska Kellokumpu, Ville Ollila, Ekaterina Zavyalova, Anushka Paudel
