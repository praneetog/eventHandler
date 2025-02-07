import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineLeft } from "react-icons/ai"; // Importing the left arrow icon from react-icons

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile. Please log in again.");
        navigate("/signin");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/signin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#392B58] text-white relative">
      {/* Left Arrow Button for navigating back to Dashboard */}
      <Link to="/dashboard" className="absolute top-4 left-4 text-white text-2xl">
        <AiOutlineLeft />
      </Link>

      <div className="bg-[#A833B9] p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        
        {userData ? (
          <div>
            <p className="text-lg"><strong>Name:</strong> {userData.fullName}</p>
            <p className="text-lg"><strong>Email:</strong> {userData.email}</p>
            <p className="text-lg"><strong>Phone:</strong> {userData.phone}</p>

            

            <button
              onClick={handleLogout}
              className="mt-6 bg-red-600 text-white p-2 rounded-md w-full hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
