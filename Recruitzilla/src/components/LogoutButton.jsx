import React from "react";
import { useAuth } from "./context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      className="bg-[#00df9a] text-bold hover:bg-[#00B27B] w-[95px] h-[50px] text-bold hover:bg-[#00B27B] rounded-md font-small py-4 text-black"
      onClick={logout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
