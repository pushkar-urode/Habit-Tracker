import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(
        "/api/auth/login",
        {
          email,
          password
        }
      );

      console.log(data);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch(error) {

      console.log(error);

      alert("Login Failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-[350px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center">

          No account?

          <Link
            to="/signup"
            className="text-blue-500 ml-2"
          >
            Signup
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;