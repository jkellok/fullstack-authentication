import React from "react";
import { useState, useEffect } from "react"
import { useSession } from "../hooks/useSession";
import { FormControlLabel, FormLabel, Radio, RadioGroup, FormControl } from "@mui/material"
import { Radio as Rad, Typography } from '@material-tailwind/react'


const FirstLoginPage = () => {
  const session = useSession()
  // session.user.app_metadata
  //console.log(session)

  // stuff here
  // do we need to figure out how to show this on first login?
  // if user_role is unassigned or something
  // check from session token

  // select role
  // give other info like first name, last name, email
  // whatever is needed in our database

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("recruiter")

  const handleSubmit = async (e) => {
    // either force logout immediately
    // or notify that info has been submitted successfully
    // flowing notification bar?
    // and user has to press logout
    // could implement logging out in 10s?
    e.preventDefault();
    console.log(e)
    if (isSubmitted) {
      console.log("successfully submitted!")
      console.log("firstname:", firstName, "\nlastname:", lastName, "\nrole:", role)
    } else {
      console.log("isSubmitted is false", isSubmitted)
    }
  }

  const handleState = () => {
    setIsSubmitted(!isSubmitted)
  }

  const handleRadioChange = (e) => {
    setRole(e.target.value)
  }

  return (
    <div className="bg-[#1e1f1f]">
      <h2 className='text-2xl font-bold text-center py-8'>
        First login page
      </h2>
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="bg-[grey] flex flex-col justify-center items-center w-1/2">
          <form
            className="mt-8 flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            First name
            <input
              type="text"
              placeholder="First name"
              className="w-full p-2 border border-gray-300 rounded text-black"
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            Last name
            <input
              type="text"
              placeholder="Last name"
              className="w-full p-2 border border-gray-300 rounded mt-4 text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            Select your Role
            <div className="">
              <input
              type="radio"
              value="student"
              id="radioStudent"
              checked={ role === "student" }
              onChange={(handleRadioChange)}
              />
              <label
                className=""
                htmlFor="radioStudent"
              >
                Student
              </label>
            </div>
            <div className="">
              <input
              type="radio"
              value="recruiter"
              id="radioRecruiter"
              checked={ role === "recruiter" }
              onChange={(handleRadioChange)}
              />
              <label
                className=""
                htmlFor="radioRecruiter"
              >
                Recruiter
              </label>
            </div>
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

          <span>&nbsp;</span>
          <p>Testing MUI library</p>
          <FormControl>
            <FormLabel style={{color: 'white'}}>
              Select your role
            </FormLabel>
            <RadioGroup
              row
              name="controlled-radio-buttons-group"
              value={role}
              onChange={handleRadioChange}
            >
              <FormControlLabel value="student" control={<Radio style={{color: "white"}} />} label="Student" />
              <FormControlLabel value="recruiter" control={<Radio style={{color: "white"}} />} label="Recruiter" />
            </RadioGroup>
          </FormControl>

          <p>Testing Tailwind</p>
          <div className="flex flex-col gap-8">
            <Rad
              name="description"
              label={
                <div>
                <Typography color="blue-gray" className="font-medium">
                  Student
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  Possible description here.
                </Typography>
                </div>
              }
              containerProps={{
                className: "-mt-5",
              }}
            />
            <Rad
              name="description"
              defaultChecked
              label={
                <div>
                <Typography color="blue-gray" className="font-medium">
                  Recruiter
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  Possible description here.
                </Typography>
                </div>
              }
              containerProps={{
                className: "-mt-5",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstLoginPage