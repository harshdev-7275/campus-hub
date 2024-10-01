import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { CiEdit } from "react-icons/ci";

import "ldrs/tailspin";

// Default values shown

const Settings = () => {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    email: "",
    name: "",
    username: "",
    college: "",
    location: "",
  });

  const [userProfileData, setUserProfileData] = useState({
    bio: "",
    avatarUrl: "",
  });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/get-complete-data",
        {
          withCredentials: true,
        }
      );
      setUserData(res.data.data);
      setName(res.data.data.name);
      setUsername(res.data.data.username);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to fetch user data.");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/get-user-profile",
        {
          withCredentials: true,
        }
      );
      if (res.data.data) {
        setUserProfileData(res.data.data);
        setBio(res.data.data.bio || "");
        setAvatarUrl(res.data.data.avatarUrl || "");
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to fetch user profile.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserProfile();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setUserData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUserData((prev) => ({ ...prev, username: e.target.value }));
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    setUserProfileData((prev) => ({ ...prev, bio: e.target.value }));
  };

  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
    setUserProfileData((prev) => ({ ...prev, avatarUrl: e.target.value }));
  };

  const updateFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
    };

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/update-user",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-5 ml-0 mt-5 md:mt-0 md:ml-20">
      <div className="container mx-auto flex gap-5 tracking-widest md:gap-0 md:flex-col">
        <h1 className="text-3xl font-bold mt-4 md:mt-0 uppercase">Settings</h1>
        <div className="md:mt-5 lg:mt-10 w-full">
          <form
            className="flex flex-col items-start lg:gap-4"
            onSubmit={updateFormHandler}
          >
            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="email" className="text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userData.email || ""}
                readOnly
                className=" md:w-full w-full outline-none dark:bg-transparent border-b-2 border-pink-500 dark:border-white text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="name" className="text-gray-400">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
                className="md:w-full w-full outline-none dark:bg-transparent border-b-2 border-pink-500 dark:border-white text-gray-400"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="username" className="text-gray-400">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                required
                className="md:w-full w-full outline-none dark:bg-transparent border-b-2 border-pink-500 dark:border-white text-gray-400"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="college" className="text-gray-400">
                College
              </label>
              <input
                type="text"
                id="college"
                value={userData.college || ""}
                readOnly
                className="md:w-full w-full outline-none dark:bg-transparent border-b-2 border-pink-500 dark:border-white text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="location" className="text-gray-400">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={userData.location || ""}
                readOnly
                className="md:w-full w-full outline-none dark:bg-transparent border-b-2 border-pink-500 dark:border-white text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col items-start lg:gap-2 w-full">
              <label htmlFor="bio" className="text-gray-400">
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Enter Bio"
                value={bio}
                onChange={handleBioChange}
                rows={4}
                className="md:w-full w-full p-2 rounded-md outline-none dark:bg-transparent border-2 border-pink-500 dark:border-white text-gray-400"
              ></textarea>
            </div>
            {error && <div className="w-full text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "hover:cursor-wait dark:bg-purple-500 "
                  : "hover:scale-105 transition-transform duration-200"
              } text-white rounded-md py-2 bg-black dark:bg-purple-500 mt-4 lg:mt-0 `}
            >
              {isLoading ? (
                <l-tailspin
                  size="20"
                  stroke="5"
                  speed="0.9"
                  color="white"
                ></l-tailspin>
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
