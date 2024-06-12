# Supabase MFA

## Multi-factor Authentication
Multi-factor authentication (MFA) adds another layer of security by verifying user's identity through additional verification steps.

MFA requires user to provide
- something they **know**: password, social-login account
- something they **have**: access to an authenticator app (TOTP), mobile phone

## Supabase Auth
Supabase documentation about MFA here: https://supabase.com/docs/guides/auth/auth-mfa

Supabase JS methods: https://supabase.com/docs/reference/javascript/auth-mfa-api

Supanase Auth implements Time-based One Time Password (TOTP) MFA. TOTP is generated from an authenticator app. MFA API is enabled on all Supabase projects by default.
For now, Supabase Auth only supports TOTP.

Two flows are required in apps using MFA:
1. **Enrollment flow**: users set up and control MFA
2. **Authentication flow**: users sign in using any factors after conventional login steps

Supabase Auth provides:
- Enrollment API
- Challenge and Verify APIs
- List Factors API

Here's a chart illustrating how these APIs work together.
![Flow chart of Supabase MFA APIs](/pictures/supabase-mfa-apis.png)

Supabase Auth adds additional metadata to user's access token (JWT) that application can use to allow or deny access.

Authenticator Assurance Level (AAL) is a standard measure about assurance of the user's identity Supabase Auth for a session, which includes two levels:
1. Assurance Level 1: aal1, user's identity was verified using a conventional login method (password, magic link, OTP, etc...)
2. Assurance Level 2: aal2, user's identity was additionally verified using at least one second factor (TOTP code)

### Adding MFA to your app

Steps:
1. Add enrollment flow (provide UI for users to setup MFA in, e.g. after sign-up or in settings)
2. Add unenrollment flow (provide UI where users can unenroll devices)
3. Add challenge step to login (present challenge screen asking TOTP)
4. Enforce rules for MFA logins (add authorization rules across your app)

See example code for React in the link.

You can enforce rules for MFA logins, three ways:
1. Enforce for all users (new and existing): any user account has to enroll MFA to use your app
2. Enforce for new users only: new users are forced to enroll MFA, old users are encouraged
3. Enforce only for users that have opted-in: users that want MFA can enroll in it

Link also has some RLS examples you can use in Supabase.

## MFA in this application

The code is based on Supabase's API. User can go to the user management page (/usermanagement) to enroll, unenroll and test MFA.

Microsoft Authenticator for phone was used to test MFA but it should also work on other authenticator apps.

Currently in our project we have not defined authorization rules based on MFA/AAL levels!

To enroll:
1. Click "Enroll MFA" to reveal the QR code and input field
2. Scan the QR code with your authenticator app (e.g. Microsoft Authenticator)
3. If that doesn't work, you can press "Click here" to reveal a secret code in plain text, you can copy that to your authenticator app
3. Authenticator provides you a 30-second TOTP, a 6-digit code
4. Input code in the input field and press "Enable"
5. You now should have aal2

NOTE: Currently other parts (Unenroll MFA, Test MFA) do not update when you enroll  
NOTE: If you want to test MFA, you need to login again to get your AAL back to aal1

![Enrolling MFA](/pictures/enroll-mfa.png)

To unenroll:
1. Click "Unenroll MFA" to open up a table of factors and input field
2. Copy Factor ID into input field and press "Unenroll"
3. Delete the account from the authenticator app

NOTE: You have to have aal2 to unenroll  
NOTE: By default user will retain aal2, you need to use supabase.auth.refreshSession() if you want to immediately change it to aal1

![Unenrolling MFA](/pictures/unenroll-mfa.png)

To test MFA:
1. Open authenticator app to get the TOTP
2. Input TOTP to the input field and press "Submit"
3. After successful submit, the view is changed to a text "You have MFA enabled!"

NOTE: You need to currently have aal1 and you have enrolled MFA (ie. AAL next level is aal2)

![Test MFA](/pictures/test-mfa.png)

### Graphs

Enrolling MFA

![Graph of MFA enroll](/graphs/MfaEnroll.png)

How MFA could be used to login

![Graph of MFA login](/graphs/MfaLogin.png)  
(Currently we don't ask for MFA right after logging in to authorize access)