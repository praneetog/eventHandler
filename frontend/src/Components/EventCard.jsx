import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCard = ({ event }) => {
  const [joinedCount, setJoinedCount] = useState(event.joinedCount || 0);
  const [isJoined, setIsJoined] = useState(false);
  const userId = localStorage.getItem("userId"); // Store user ID in localStorage when logging in

  useEffect(() => {
    // Check if the user has already joined the event
    if (event.joinedUsers.includes(userId)) {
      setIsJoined(true);
    }
  }, [event.joinedUsers, userId]);

  const handleJoinEvent = async () => {
    if (joinedCount >= event.capacity) {
      alert("This event is full.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/event/join/${event._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        setJoinedCount(joinedCount + 1);
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join the event.");
    }
  };

  return (
    <div className="bg-[#A833B9] p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
      <h3 className="text-xl font-bold text-white">{event.eventName}</h3>
      <p className="text-white">{event.description}</p>
      <p className="text-white">Author: {event.authorName}</p>
      <p className="text-white">Date: {new Date(event.eventDate).toLocaleString()}</p>

      <div className="flex items-center justify-between w-full">
        <button
          onClick={handleJoinEvent}
          disabled={isJoined || joinedCount >= event.capacity}
          className="bg-[#392B58] text-white p-2 rounded-md w-1/2 hover:bg-[#9229A5] transition"
        >
          {isJoined ? "Joined" : "Join"}
        </button>

        <div className="text-white text-sm">
          {joinedCount}/{event.capacity} people joined
        </div>
      </div>
    </div>
  );
};

export default EventCard;
