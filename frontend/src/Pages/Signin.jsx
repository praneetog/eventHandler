import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/user/signin", formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("fullName", response.data.fullName);
        localStorage.setItem("userId", response.data.userId);
        alert("Signin successful!");
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Signin failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#392B58]">
      <div className="bg-[#A833B9] p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
        {error && <p className="text-red-400">{error}</p>}
        <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="p-2 rounded-md text-black" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="p-2 rounded-md text-black" 
          />
          <button 
            type="submit" 
            className="bg-[#392B58] text-white p-2 rounded-md"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-white">
          Don't have an account? 
          <Link to="/signup" className="underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
