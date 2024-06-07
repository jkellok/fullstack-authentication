import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */
export function EnrollMFA({
    onEnrolled,
    onCancelled,
  }) {
    const [factorId, setFactorId] = useState('')
    const [qr, setQR] = useState('') // holds the QR code image SVG
    const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user
    const [error, setError] = useState('') // holds an error message

    const onEnableClicked = () => {
      setError('')
      ;(async () => {
        const challenge = await supabase.auth.mfa.challenge({ factorId })
        if (challenge.error) {
          setError(challenge.error.message)
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
          throw verify.error
        }

        onEnrolled()
      })()
    }

    useEffect(() => {
      ;(async () => {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
        })
        if (error) {
          throw error
        }

        setFactorId(data.id)

        // Supabase Auth returns an SVG QR code which you can convert into a data
        // URL that you can place in an <img> tag.
        setQR(data.totp.qr_code)
      })()
    }, [])

    return (
      <>
        {error && <div className="error">{error}</div>}
        <img src={qr} />
        <input
          type="text"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
        />
        <input type="button" value="Enable" onClick={onEnableClicked} />
        <input type="button" value="Cancel" onClick={onCancelled} />
      </>
    )
  }

  /**
 * UnenrollMFA shows a simple table with the list of factors together with a button to unenroll.
 * When a user types in the factorId of the factor that they wish to unenroll and clicks unenroll
 * the corresponding factor will be unenrolled.
 */
export function UnenrollMFA() {
    const [factorId, setFactorId] = useState('')
    const [factors, setFactors] = useState([])
    const [error, setError] = useState('') // holds an error message
    const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user

    useEffect(() => {
      ;(async () => {
        const { data, error } = await supabase.auth.mfa.listFactors()
        if (error) {
          throw error
        }

        setFactors(data.totp)
      })()
    }, [])

    return (
      <>
        {error && <div className="error">{error}</div>}
        <tbody>
          <tr>
            <td>Factor ID</td>
            <td>Friendly Name</td>
            <td>Factor Status</td>
          </tr>
          {factors.map((factor) => (
            <tr>
              <td>{factor.id}</td>
              <td>{factor.friendly_name}</td>
              <td>{factor.factor_type}</td>
              <td>{factor.status}</td>
            </tr>
          ))}
        </tbody>
        <input type="text" /* value={verifyCode} */ value={factorId} onChange={(e) => setFactorId(e.target.value.trim())} />
        <button onClick={() => supabase.auth.mfa.unenroll({ factorId })}>Unenroll</button>
      </>
    )
  }

  export function AppWithMFA() {
    const [readyToShow, setReadyToShow] = useState(false)
    const [showMFAScreen, setShowMFAScreen] = useState(false)

    useEffect(() => {
      ;(async () => {
        try {
          const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
          if (error) {
            throw error
          }

          console.log(data)

          if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
            setShowMFAScreen(true)
          }
        } finally {
          setReadyToShow(true)
        }
      })()
    }, [])

    if (readyToShow) {
      if (showMFAScreen) {
        return <AuthMFA />
      }

      return console.log("no more showing MFA screen")
    }

    return <></>
  }

  export function AuthMFA() {
    const [verifyCode, setVerifyCode] = useState('')
    const [error, setError] = useState('')

    const onSubmitClicked = () => {
      setError('')
      ;(async () => {
        const factors = await supabase.auth.mfa.listFactors()
        if (factors.error) {
          throw factors.error
        }

        const totpFactor = factors.data.totp[0]

        if (!totpFactor) {
          throw new Error('No TOTP factors found!')
        }

        const factorId = totpFactor.id

        const challenge = await supabase.auth.mfa.challenge({ factorId })
        if (challenge.error) {
          setError(challenge.error.message)
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
          throw verify.error
        }
      })()
    }

    return (
      <>
        <div>Please enter the code from your authenticator app.</div>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
        />
        <input type="button" value="Submit" onClick={onSubmitClicked} />
      </>
    )
  }

