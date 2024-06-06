import React, { useState } from "react";
import { Container, Grid, Paper, Box, TextField } from "@mui/material";
import { supabase } from "../supabaseClient";
import { ToastContainer, toast } from 'react-toastify'
import { useSession } from '../hooks/useSession'
import { useAuth } from "./context/AuthContext";

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

const UserManagement = () => {
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const {
    session,
  } = useAuth();


  // sends "confirm email change" email to new email address
  const updateEmailTo = async () => {
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
      console.log("Error:", error.message)
      notification(error.message, "error")
    } else {
      setNewPhone('')
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
      setNewPassword('')
      notification("Password updated!", "success")
    }
  }

  const notification = (message, type) => {
    type ? toast[type](message) : toast(message)
  }

  const getIdentities = async () => {
    // email, phone, supabase linked providers
    const { data, error } = await supabase.auth.getUserIdentities()
    console.log("retrieved identities:", data)
    // remove later or add some message telling user what identities they have on supabase
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
    // could do with keycloak or supabase social login identities also
    const { data: { identities } } = await supabase.auth.getUserIdentities()

    const phoneIdentity = identities.find((identity) =>
      identity.provider === 'phone'
    )
    // show error is there is no phone number identity for user
    if (!phoneIdentity) {
      notification("No phone number found", "error")
      return
    }

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
        <Grid sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h4.fontSize', marginBottom: '30px', marginTop: '10px' }}>
           <p>Manage your user account</p>
        </Grid>
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
          <Grid sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 'h5.fontSize', marginBottom: '10px', marginTop: '20px' }}>
            <p>Add or delete identities</p>
          </Grid>
          <Grid container spacing={3} marginTop={ "10px" }>
            <Grid item xs={1}>
              <CustomButton value="Remove phone number" onClick={unlinkIdentity} />
              <CustomButton value="Get Identities" onClick={getIdentities} />
              <button
                onClick={linkIdentity}
                disabled
                className="bg-[grey] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
              >
                Add identity (WIP)
              </button>
            </Grid>
          </Grid>
      </Paper>
      <ToastContainer autoClose={4000} />
    </Container>
  )
};

export default UserManagement;
