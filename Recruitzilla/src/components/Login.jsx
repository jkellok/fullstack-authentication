import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("email");
  const [password, setPassword] = useState("password");
  const [users, setUsers] = useState([
    { email: "john.doe@example.com", password: "1234567" }
  ]);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        navigate("/app/filter");
      } else {
        console.log("Invalid email or password");
      }
    } else {
      setUsers([...users, { email: email, password: password }]);
      console.log("Signup successful with " + email + password);
      setIsLogin(true)
    }
  };

  const handleState = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <div className="bg-[#1e1f1f] flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-1/2">
          <div className="flex justify-center items-center">
            <h2 className="text-[white] text-center text-4xl font-bold ml-2">
              {isLogin ? "Login" : "Signup"}
            </h2>
          </div>
          <form
            className="mt-8 flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded text-black"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mt-4 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              {isLogin ? "Login" : "Signup"}
            </button>
            <button
              type="button"
              onClick={handleState}
              className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
            >
              {isLogin ? "Signup instead?" : "Login instead?"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
