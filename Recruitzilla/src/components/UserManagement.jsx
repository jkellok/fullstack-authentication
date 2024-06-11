import React, { useEffect, useState } from "react";
import { ListItem, List, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { supabase } from "../supabaseClient";
import { toast } from 'react-toastify'
import { EnrollMFA, UnenrollMFA, AppWithMFA } from "./MfaComponents";

const notification = (message, type) => {
  type ? toast[type](message) : toast(message)
}

const CustomButton = ({ value, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
    >
      {value}
    </button>
  )
}

const UpdateDetails = ({ getIdentities }) => {
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // sends "confirm email change" email to new email address
  const updateEmailTo = async () => {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
      options: {
        emailRedirectTo: 'http://localhost:5173/login/supabase'
      }
    })
    if (error) {
      notification(error.message, "error")
    }
    else {
      setNewEmail('')
      notification("Email updated!", "success")
      notification("Check your email for confirmation link", "info")
    }
  }
  // sends OTP to new phone number
  const updatePhone = async () => {
    // add nicer phone input form?
    const { data, error } = await supabase.auth.updateUser({
      phone: newPhone
    })
    if (error) {
      notification(error.message, "error")
    } else {
      setNewPhone('')
      notification("Phone number updated!", "success")
    }
    getIdentities()
  }

  const updatePassword = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) {
      notification(error.message, "error")
    } else {
      setNewPassword('')
      notification("Password updated!", "success")
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          label="New Email Address"
          variant="outlined"
          type="email"
          helperText="A confirmation email will be sent to your new email address"
          fullWidth
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ marginBottom: "10px", width: "50%" }}
        />
        <CustomButton value="Change Email Address" onClick={updateEmailTo} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="New Phone Number"
          variant="outlined"
          helperText="Add a phone number to use Phone OTP login"
          fullWidth
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          style={{ marginBottom: "10px", width: "50%" }}
        />
        <CustomButton value="Change Phone" onClick={updatePhone} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="New Password"
          variant="outlined"
          type="password"
          helperText="Password must be at least 6 characters long"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginBottom: "10px", width: "50%" }}
        />
        <CustomButton value="Change Password" onClick={updatePassword} />
      </Grid>
    </Grid>
  )
}

const IdentityManagement = ({ identities, getIdentities }) => {

  const linkIdentity = async (provider) => {
    // links an oauth identity to an existing user
    // Enable Manual Linking must be enabled in Supabase auth settings
    // if run in browser, user is automatically redirected to returned URL

    if (identities.includes(provider)) {
      notification(`Identity is already linked with ${provider}!`, "error")
      return
    }

    const { data, error } = await supabase.auth.linkIdentity({
      provider: provider,
      options: {
        redirectTo: "http://localhost:5173/usermanagement"
      }
    })
    if (error) {
      notification(error.message, "error")
    } else {
      notification(`Redirecting to ${provider} for linking the account...`, "info")
    }
    setTimeout(() => {
      // wait a bit before redirecting
    }, 4000)
    getIdentities()
  }

  const unlinkIdentity = async (provider) => {
    // Enable Manual Linking must be enabled
    const { data: { identities } } = await supabase.auth.getUserIdentities()

    const selectedIdentity = identities.find((identity) =>
      identity.provider === provider
    )
    if (!selectedIdentity) {
      notification(`No identity found for ${provider}`, "error")
      return
    }

    const { error } = await supabase.auth.unlinkIdentity(selectedIdentity)
    if (error) {
      notification(error.message, "error")
    } else {
      notification(`Removed identity: ${provider}`, "info")
    }
    getIdentities()
  }

  const showIdentities = identities.map((id) => <ListItem key={id}>{id}</ListItem>)

  return (
    <>
      <Grid sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h5.fontSize', marginBottom: '10px', marginTop: '20px' }}>
        <p>Add or delete identities</p>
      </Grid>
      <Typography>
        You have {identities.length} identities associated with your account.
        Your identities include:
        <List>
          {showIdentities}
        </List>
        Email cannot be removed from identities.
      </Typography>
      <Grid container spacing={3} marginTop={1}>
        <Grid item xs={1}>
          <CustomButton value="Link with Github" onClick={() => linkIdentity("github")} />
          <CustomButton value="Link with Google" onClick={() => linkIdentity("google")} />
          <CustomButton value="Link with Keycloak" onClick={() => linkIdentity("keycloak")} />
          <CustomButton value="Unlink phone number" onClick={() => unlinkIdentity("phone")} />
          <CustomButton value="Unlink Github" onClick={() => unlinkIdentity("github")} />
          <CustomButton value="Unlink Google" onClick={() => unlinkIdentity("google")} />
          <CustomButton value="Unlink Keycloak" onClick={() => unlinkIdentity("keycloak")} />
        </Grid>
      </Grid>
      <Grid sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h5.fontSize', marginBottom: '10px', marginTop: '20px' }}>
        <p>Enroll or unenroll MFA</p>
      </Grid>
    </>
  )
}

const MfaManagement = () => {

  const getAal = async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    console.log("aal data", data)
  }

  return (
    <>
      <Grid item xs={1}>
        <EnrollMFA />
        <UnenrollMFA />
        <Typography>
          Test MFA
        </Typography>
        <AppWithMFA />
      </Grid>
      <CustomButton value="get AAL levels (delete later)" onClick={getAal} />
    </>
  )
}

const UserManagement = () => {
  const [identities, setIdentities] = useState([])

  useEffect(() => {
    getIdentities()
  }, [])

  const getIdentities = async () => {
    // email, phone, supabase linked providers
    const { data, error } = await supabase.auth.getUserIdentities()
    if (error) {
      notification("An error happened while fetching identities", "error")
    }
    const fetchedIdentities = data.identities.map((identity) => {
      return identity.provider
    })
    setIdentities(fetchedIdentities)
  }

  return (
    <Container style={{ marginTop: "50px"}}>
      <Paper style={{ padding: "40px", margin: '50px 50px 0 50px' }}>
        <Grid sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h4.fontSize', marginBottom: '30px', marginTop: '10px' }}>
           <p>Manage your user account</p>
        </Grid>
        <UpdateDetails getIdentities={getIdentities}/>
        <IdentityManagement identities={identities} getIdentities={getIdentities}/>
        <MfaManagement />
      </Paper>
    </Container>
  )
};

export default UserManagement;
