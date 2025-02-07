import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../Components/EventCard"; // Import EventCard Component

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [initials, setInitials] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fullName = localStorage.getItem("fullName");
    if (!fullName) {
      setInitials("");
    } else {
      const nameParts = fullName.split(" ");
      setInitials(
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : nameParts[0][0].toUpperCase()
      );
    }
  }, []);

  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
        const response = await axios.get("http://localhost:3000/event/bulk", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Fix: Correctly setting events array
        setEvents(response.data || []);
    } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]); // Prevents crashes
    }
};


  const handleCreateEvent = () => {
    if (localStorage.getItem("token")) {
      navigate("/create-event");
    } else {
      alert("You must be logged in to create an event!");
      navigate("/signin");
    }
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen bg-[#392B58] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#A833B9] p-6 flex flex-col justify-between fixed h-full">
        <div>
          <h1 className="text-2xl font-bold mb-6">Event Manager</h1>
          <ul className="space-y-4">
            {["dashboard", "events", "transactions"].map((tab) => (
              <li
                key={tab}
                className={`p-2 cursor-pointer rounded-xl transition-colors ${
                  activeTab === tab ? "bg-[#392B58]" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="space-y-4">
            {["settings", "help"].map((tab) => (
              <li
                key={tab}
                className={`p-2 cursor-pointer rounded-xl transition-colors ${
                  activeTab === tab ? "bg-[#392B58]" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full relative">
        {/* Top Bar */}
        <div className="fixed right-6 mb-6">
          {localStorage.getItem("token") ? (
            <div
              className="w-10 h-10 flex items-center justify-center bg-[#A833B9] rounded-full text-white font-bold text-lg cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {initials}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-[#A833B9] text-white p-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>

        {/* Tabs Content */}
        {activeTab === "events" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Events</h2>
            <p>Here you can view and manage all your events.</p>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))
              ) : (
                <p className="text-white text-lg">No events available.</p>
              )}
            </div>

            {/* Floating Create Event Button */}
            <button
              onClick={handleCreateEvent}
              className="fixed bottom-6 right-6 bg-[#A833B9] text-white p-4 rounded-2xl border border-white shadow-lg hover:bg-[#9229A5] transition"
            >
              + Create Event
            </button>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Transactions</h2>
            <p>View your transaction history and financial details.</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <p>Adjust your account settings here.</p>
          </div>
        )}
        {activeTab === "help" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Help & Support</h2>
            <p>Find answers to your questions and contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
