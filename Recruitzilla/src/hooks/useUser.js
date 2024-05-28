// not yet in use but maybe something like this or React Context
// or do login stuff in App and pass down user state in props?

import { useEffect, useState } from "react"
import { useSession } from "./useSession"

export function useUser() {
  const [user, setUser] = useState(null)
  const session = useSession()
  useEffect(() => {
    if(session) {
      setUser(session.user)
      console.log("session user", session.user)
    }
  }, [session])
  return user
}
