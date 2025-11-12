import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first.");
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6  shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Address:</strong> {profile.address}</p>
    </div>
  );
};

export default ProfilePage;
