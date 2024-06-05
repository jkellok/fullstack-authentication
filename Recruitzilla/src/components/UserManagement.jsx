import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Box, TextField } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { supabase } from "../supabaseClient";
import { ToastContainer, toast } from 'react-toastify'

const UpdateUser = () => {
  // use updateUser to update email, phone, password for authenticated user
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // sends "confirm email change" email to new email address
  const updateEmail = async () => {
    // add some validation
    // check that input looks like an email xxx@xxx.xxx
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
      options: {
        emailRedirectTo: 'http://localhost:5173/login/supabase'
      }
    })
    if (error) {
      console.log("Error:", error.message)
      notification(error.message, "error")
    }
    //else {
    if (data) {
      notification("Email updated!", "success")
      notification("Check your email for confirmation link", "info")
    }
  }
  // sends OTP to new phone number
  const updatePhone = async () => {
    // add validation?
    const { data, error } = await supabase.auth.updateUser({
      phone: newPhone
    })
    if (error) {
      console.log("Error:", error.message)
      notification(error.message, "error")
    } else {
      notification("Phone number updated!", "success")
    }
  }
  const updatePassword = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) {
      console.log("Error:", error)
      notification(error.message, "error")
    } else {
      notification("Password updated!", "success")
    }
  }

  const notification = (message, type) => {
    // type can be success, error, info, warning
    // if no type is defined, do a default toast
    type ? toast[type](message) : toast(message)
  }

  // requires supabase linked auths
  const getIdentities = async () => {
    const { data, error } = await supabase.auth.getUserIdentities()
    console.log("retrieved identities:", data)
  }
  const linkIdentity = async () => {
    // links an oauth identity to an existing user
    // Enable Manual Linking must be enabled in Supabase auth settings
    // if run in browser, user is automatically redirected to returned URL
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'github'
    })
  }
  const unlinkIdentity = async () => {
    // Enable Manual Linking must be enabled
    const { data: { identities } } = await supabase.auth.getUserIdentities()
/*     const googleIdentity = identities.find(
      identity => identity.provider === 'google'
    )
    const keycloakIdentity = identities.find(
      identity => identity.provider === 'keycloak'
    ) */
    console.log("identities", identities)
    const phoneIdentity = identities.find((identity) =>
      identity.provider === 'phone'
    )
    console.log("phoneidentity", phoneIdentity)
    const { error } = await supabase.auth.unlinkIdentity(phoneIdentity)
    if (error) {
      console.log(error.message)
      notification(error.message, "error")
    } else {
      notification("Removed phone number", "info")
    }
  }

  return (
    <Container style={{ marginTop: "50px"}}>
      <Paper style={{ padding: "40px", margin: '50px 50px 0 50px' }}>
        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h4.fontSize', marginBottom: '30px' }}>
           <h1>Manage your user details</h1>
        </Box>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="New Email"
                variant="outlined"
                type="email"
                fullWidth
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ marginBottom: "10px", width: "50%" }}
              />
              <CustomButton value="Change Email" onClick={updateEmail} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Phone Number"
                variant="outlined"
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
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginBottom: "10px", width: "50%" }}
              />
              <CustomButton value="Change Password" onClick={updatePassword} />
            </Grid>
            <CustomButton value="Remove phone number" onClick={unlinkIdentity} />
          </Grid>
      </Paper>
      <ToastContainer autoClose={4000} />
    </Container>
  )
}

const CustomButton = ({ value, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#00df9a] w-[170px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
    >
      {value}
    </button>
  )
}

const UserManagement = () => {
  const {
    session,
  } = useAuth();

  console.log("session", session)

  if (!session) {
    return (
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="flex justify-center items-center">
            No session
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <UpdateUser />
      </div>
    );
  }
};

export default UserManagement;
