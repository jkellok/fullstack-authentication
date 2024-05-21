import { supabase } from '../supabaseClient'

const LogoutButton = () => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <button
      className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4  text-black"
      onClick={signOut}
    >
      Logout{" "}
    </button>
  )
}

export default LogoutButton