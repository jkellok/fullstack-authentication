import React from "react";
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useSession } from "../hooks/useSession";

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
      getUsers();
    }, []);

    async function getUsers() {
      const { data, error } = await supabase.from("users").select(`
        id,
        name,
        email,
        roles (name)
      `);
      setUsers(data);
      console.log("get users data", data)
    }

    return (
      <div>
        <h2 className="text-[white] text-center font-bold ml-2">
          Example data from Supabase, users and their role
        </h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}, {user.email}, Role: {user.roles.name}</li>
          ))}
        </ul>
      </div>
    )
  }

// testing inserting data and RLS
const TestDataView = ({ session }) => {
  const [testData, setTestData] = useState([])

  useEffect(() => {
    getTestData();
  }, []);

  async function getTestData() {
    const { data } = await supabase.from("test_table").select();
    setTestData(data);
    console.log("data getTestData", data)
  }

  // in Supabase SQL editor, RLS rule to see only own row
/*   alter table "data" enable row level security;

  create policy "Individuals can view their own data."
  on data for select
  using ( (select auth.uid()) = user_id ); */

  // RLS authenticated users can insert into data
  // doesn't work for anons as they have no identity
  const insertData = async () => {
    const { error } = await supabase
      .from("test_table")
      .insert({
        user_id: session.user.id,
        data: "test data",
        full_name: session.user.identities[0].identity_data.full_name,
        email: session.user.identities[0].identity_data.email
      })
    getTestData()
  }

  return (
    <div>
      <ul>
        {testData.map((data) => (
          <li key={data.id}>{data.id} {data.user_id} {data.data} {data.full_name} {data.email}</li>
        ))}
      </ul>
      <button
        className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
        onClick={insertData}
        >
          insert data
        </button>
    </div>
  )
}

const TestPage = () => {
  const session = useSession()

  if (!session) return (<div style={{color: "black"}}>You need to login</div>)

  return (
    <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
    <h1>Logged in!</h1>
    <h2>test_table data, user can see their own inserted data</h2>
    <TestDataView session={session} />
    <Users />
    </div>
  )
}

export default TestPage