import React from "react";
import { useState } from "react"
import { useSession } from "../hooks/useSession";
import { FormControlLabel, FormLabel, Radio, RadioGroup, FormControl } from "@mui/material"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";


const FirstLoginPage = () => {
  const session = useSession()
  const navigate = useNavigate()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("student")
  const [isNew, setIsNew] = useState(false)
  const fullName = firstName + ' ' + lastName

  const handleSubmit = async (e) => {
    // either force logout immediately
    // if we want role info from token
    // or notify that info has been submitted successfully
    // flowing notification bar?
    // and user has to press logout
    // could implement logging out in 10s?
    e.preventDefault();
    if (isSubmitted) {
      console.log("successfully submitted!")
      console.log("firstname:", firstName, "\nlastname:", lastName, "\nrole:", role, "\nfullname:", fullName)
      sendDatatoSupabase()
    } else {
      console.log("isSubmitted is false", isSubmitted)
    }
  }

  const sendDatatoSupabase = async () => {
    // send submitted data to supabase and set is_new to false
    // RLS policy update based on email
    // doesn't send role yet
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, is_new: false })
      .eq('email', session.user.email)

    redirectUserAfterSubmit()
  }

  const redirectUserAfterSubmit = () => {
    // check if user is no longer new and redirect (or force logout)
    const isUserNew = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_new")

        const isNew = data[0].is_new
        setIsNew(isNew)
    }
    isUserNew()

    if(!isNew) {
      console.log("user is no longer new!")
      navigate('/login/supabase')
    }
  }

  const handleState = () => {
    setIsSubmitted(true)
  }

  const handleRadioChange = (e) => {
    setRole(e.target.value)
  }

  return (
    <div className="bg-[#1e1f1f]">
      <div className="text-black bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="bg-[#f0f0f0] shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form
            className="text-black mt-8 flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold text-center mb-6">
              Please fill in your details
            </h2>
            <div className="mb-4">
            <label className="block mb-2" htmlFor="firstname">
              First name
            </label>
            <input
              type="text"
              placeholder="First name"
              id="firstname"
              className="w-full p-2 border border-gray-300 rounded text-black"
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            </div>
            <div className="mb-6">
            <label className="block mb-2" htmlFor="lastname">
              Last name
            </label>
            <input
              type="text"
              placeholder="Last name"
              id="lastname"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            </div>
            <FormControl>
              <FormLabel style={{color: 'black'}}>
              Select your role
              </FormLabel>
              <RadioGroup
                row
                name="controlled-radio-buttons-group"
                value={role}
                onChange={handleRadioChange}
              >
              <FormControlLabel value="student" control={<Radio style={{color: "black"}} />} label="Student" />
              <FormControlLabel value="recruiter" control={<Radio style={{color: "black"}} />} label="Recruiter" />
              </RadioGroup>
            </FormControl>
            <button
              type="submit"
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[#00B27B] active:bg-[#009265]"
              onClick={handleState}
            >
              Submit
            </button>
          </form>
          <p>
            (Please login again to apply the changes)
          </p>
        </div>
      </div>
    </div>
  )
}

export default FirstLoginPage