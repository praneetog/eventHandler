import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: "",
    description: "",
    authorName: "",
    category: "",
    eventDate: "",
    capacity: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "capacity") {
      // Ensure the input is a valid number
      const value = e.target.value;
      if (!isNaN(value) && value.trim() !== "") {
        setEventData({ ...eventData, [e.target.name]: Number(value) });
      }
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(eventData);

    const response = await fetch("http://localhost:3000/event/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Event created successfully!");
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#392B58]">
      <form onSubmit={handleSubmit} className="bg-[#A833B9] p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-white text-2xl font-bold mb-4">Create Event</h2>
        
        <input type="text" name="eventName" placeholder="Event Name" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />
        <input type="text" name="authorName" placeholder="Organiser Name" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />
        <input type="date" name="eventDate" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />
        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} className="w-full p-2 mb-3 border rounded text-black" required />

        <button type="submit" className="w-full bg-white text-[#A833B9] font-bold py-2 rounded-lg hover:bg-gray-200 transition">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
