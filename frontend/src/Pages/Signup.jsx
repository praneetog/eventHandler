import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
      const response = await axios.post("http://localhost:3000/user/signup", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("fullName", response.data.fullName);
        localStorage.setItem("userId", response.data.userId);
        alert("Signup successful!");
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#392B58]">
      <div className="bg-[#A833B9] p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-white">Sign Up</h2>
        {error && <p className="text-red-400">{error}</p>}
        <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            value={formData.fullName} 
            onChange={handleChange} 
            required 
            className="p-2 rounded-md text-black" 
          />
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
            type="text" 
            name="phone" 
            placeholder="Phone" 
            value={formData.phone} 
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-white">
          Already have an account? 
          <Link to="/signin" className="underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
