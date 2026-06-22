import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(
        "/api/auth/signup",
        {
          name,
          email,
          password
        }
      );

      console.log(data);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch(error) {

      console.log(error);

      alert("Signup Failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-[350px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          className="w-full bg-green-500 text-white p-3 rounded"
        >
          Signup
        </button>

        <p className="mt-4 text-center">

          Already have an account?

          <Link
            to="/"
            className="text-blue-500 ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;