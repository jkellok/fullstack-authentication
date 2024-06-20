import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Typography, TextField, Table, TableHead, TableContainer, Paper, TableRow, TableCell, TableBody } from "@mui/material";
import { toast } from 'react-toastify';

const notification = (message, type) => {
    type ? toast[type](message) : toast(message)
}

/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */

// onEnabled is a callback that notifies other components that enrollment has completed
// onCancelled is a callback that notifies other components that user has clicked the Cancel button
export function EnrollMFA({ onEnrolled, onCancelled }) {
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('') // holds the QR code image SVG
  const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user
  const [error, setError] = useState('') // holds an error message
  const [showMfa, setShowMfa] = useState(false)
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)

  const onEnable = async (event) => {
    event.preventDefault()
    setError('')
    const challenge = await supabase.auth.mfa.challenge({ factorId })
    if (challenge.error) {
      setError(challenge.error.message)
      notification(challenge.error.message, "error")
      throw challenge.error
    }

    const challengeId = challenge.data.id

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: verifyCode,
    })
    if (verify.error) {
      setError(verify.error.message)
      notification(verify.error.message, "error")
      throw verify.error
    }

    notification("MFA enabled!")
    onEnrolled()
  }

  const generateFriendlyName = () => {
    let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
      randomString += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1;
    }

    const friendlyName = 'authzilla-' + randomString;
    return friendlyName
  }

  const enrollMfa = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: generateFriendlyName(),
      issuer: 'authzilla.ilab.fi'
    })
    if (error) {
      setError(error.message)
      notification(error.message, "error")
      throw error
    }

    setFactorId(data.id)

    // Supabase Auth returns an SVG QR code which you can convert into a data
    // URL that you can place in an <img> tag.
    setQR(data.totp.qr_code)
    // if user is unable to scan QR code, show secret in plain text
    setSecret(data.totp.secret)
  }

  const toggleEnrollMfaButton = () => {
    if (!showMfa) enrollMfa()
    setShowMfa(!showMfa)
  }

  return (
    <>
    <Typography>
      Enroll MFA: Scan the code in an authenticator app and input the 6-digit code to enable MFA.
    </Typography>
    <button
      className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
      onClick={() => toggleEnrollMfaButton()}
    >
      Enroll MFA
    </button>
        <div className={showMfa ? 'visible' : 'hidden'}>
          {error && <div className="error">{error}</div>}
          <button
            className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
            onClick={() => enrollMfa()}
          >
            Refresh QR code
          </button>
          <img src={qr} />
          <Typography>
            Unable to scan the QR code? Click <button style={{ textDecoration: "underline" }} onClick={() => setShowSecret(!showSecret)}>here</button> to reveal a manual code
          </Typography>
          <Typography
            className={showSecret ? "visible" : "hidden"}
          >
            Input this to your authenticator app to enroll MFA: {secret}
          </Typography>
          <Typography>
            Finish enrolling by providing the OTP code from your authenticator app.
          </Typography>
          <form onSubmit={onEnable}>
            <TextField
              label="Verification code"
              variant="outlined"
              type="text"
              helperText="Input the 6-digit code from your authenticator app"
              fullWidth
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.trim())}
              style={{ marginBottom: "10px", width: "50%" }}
            />
            <input
              className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
              type="submit"
              value="Enable"
            />
            <input
              className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
              type="button"
              value="Cancel"
              onClick={() => { onCancelled(); setShowMfa(false) }}
            />
          </form>

        </div>
    </>
  )
}

  /**
 * UnenrollMFA shows a simple table with the list of factors together with a button to unenroll.
 * When a user types in the factorId of the factor that they wish to unenroll and clicks unenroll
 * the corresponding factor will be unenrolled.
 */
export function UnenrollMFA({ factors, setFactors, onUnenrolled }) {
  const [factorId, setFactorId] = useState('')
  const [error, setError] = useState('') // holds an error message
  const [showMfa, setShowMfa] = useState(false)

  useEffect(() => {
    const getFactors = async () => {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) {
        throw error
      }
      setFactors(data.totp)
    }
    getFactors()
  }, [])

  const unenrollFactorId = async (event) => {
    event.preventDefault()
    const { data, error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) {
      notification(error.message, "error")
    } else {
      notification(`${factorId} unenrolled!`, "info")
      const factorsAfterUnenroll = factors.filter(f => f.id !== factorId)
      setFactors(factorsAfterUnenroll)
      /* unenrolling a factor will downgrade aal2 -> aal1 only after refresh interval has lapsed
      for immediate downgrade, call refreshSession() manually */
      await supabase.auth.refreshSession()
      onUnenrolled()
    }
  }

  return (
    <>
      <Typography>
        Unenroll MFA: Input Factor ID to unenroll MFA. You must have AAL2 level to do this.
      </Typography>
      <button
        className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
        onClick={() => setShowMfa(!showMfa)}
      >
        Unenroll MFA
      </button>
      <div className={showMfa ? 'visible' : 'hidden'}>
        {error && <div className="error">{error}</div>}
        <TableContainer component={Paper} sx={{ my: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="factor ID table">
            <TableHead>
              <TableRow>
                <TableCell>Factor ID</TableCell>
                <TableCell>Friendly Name</TableCell>
                <TableCell>Factor Type</TableCell>
                <TableCell>Factor Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {factors.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell component="th" scope="row">
                    {factor.id}
                  </TableCell>
                  <TableCell>{factor.friendly_name}</TableCell>
                  <TableCell>{factor.factor_type}</TableCell>
                  <TableCell>{factor.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <form onSubmit={unenrollFactorId}>
          <TextField
              label="Factor ID"
              variant="outlined"
              type="text"
              helperText="Input the factor ID which you want to unenroll"
              fullWidth
              value={factorId}
              onChange={(e) => setFactorId(e.target.value.trim())}
              style={{ marginBottom: "10px", width: "50%" }}
            />
          <button
            className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
            type="submit"
          >
            Unenroll
          </button>
        </form>
      </div>
    </>
  )
}

export function AppWithMFA({ showRequest, setShowRequest }) {
  const [readyToShow, setReadyToShow] = useState(false)
  const [showMFAScreen, setShowMFAScreen] = useState(false)

  useEffect(() => {
    const checkAalLevel = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (error) {
          throw error
        }

        if (data.nextLevel === 'aal1') {
          setShowMFAScreen(true)
          setShowRequest(true)
        }
        else if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
          setShowMFAScreen(true)
          setShowRequest(false)
        }
        else if (data.nextLevel === 'aal2') {
          setShowRequest(false)
        }
      } finally {
        setReadyToShow(true)
      }
    }
    checkAalLevel()
  }, [setShowRequest])

  const onSubmit = async () => {
    // when user presses submit, check if aal levels changed
    // set showMFAScreen to false if MFA successful
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      notification(error.message, "error")
      throw error
    }
    if (data.currentLevel === 'aal1') {
      notification("MFA not enabled")
    }
    else if (data.nextLevel === 'aal2' && data.currentLevel === 'aal2') {
      setShowMFAScreen(false)
      notification("Successfully enabled MFA!")
    }
  }

  if (showRequest) return <p>Please enroll MFA first!</p>

  if (readyToShow) {
    if (showMFAScreen) {
      return <AuthMFA onSubmit={onSubmit}/>
    }
    return <p>You have MFA enabled!</p>
  }

  return <></>
}

export function AuthMFA({onSubmit}) {
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')

  const onSubmitCode = async (event) => {
    event.preventDefault()
    setError('')
    const factors = await supabase.auth.mfa.listFactors()
    if (factors.error) {
      notification(factors.error.message, "error")
      throw factors.error
    }

    const totpFactor = factors.data.totp[0]

    if (!totpFactor) {
      notification("No TOTP factors found!", "error")
      throw new Error('No TOTP factors found!')
    }

    const factorId = totpFactor.id

    const challenge = await supabase.auth.mfa.challenge({ factorId })
    if (challenge.error) {
      setError(challenge.error.message)
      notification(challenge.error.message, "error")
      throw challenge.error
    }

    const challengeId = challenge.data.id

    const verify = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code: verifyCode,
    })
    if (verify.error) {
      setError(verify.error.message)
      notification(verify.error.message, "error")
      throw verify.error
    }

    onSubmit()
  }

  return (
    <>
      <div>Please enter the code from your authenticator app.</div>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmitCode}>
        <TextField
          label="Verification Code"
          variant="outlined"
          type="text"
          helperText="Input the 6-digit code from your authenticator app"
          fullWidth
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
          style={{ marginBottom: "10px", width: "50%" }}
        />
        <input
          className="bg-[#00df9a] w-[190px] rounded-md font-medium mx-auto py-3 text-black mx-6 my-1"
          type="submit"
          value="Submit"
        />
      </form>
    </>
  )
}

