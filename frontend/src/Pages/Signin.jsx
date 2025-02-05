import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#392B58]">
      <div className="bg-[#A833B9] p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
        <form className="mt-4 flex flex-col space-y-4">
          <input type="email" placeholder="Email" className="p-2 rounded-md text-white" />
          <input type="password" placeholder="Password" className="p-2 rounded-md text-white" />
          <button className="bg-[#392B58] text-white p-2 rounded-md">Sign In</button>
        </form>
        <p className="mt-4 text-white">
          Don't have an account? <Link to="/signup" className="underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;