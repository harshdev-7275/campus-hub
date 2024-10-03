import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaCompass } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdOutlineForum } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { MdPermMedia } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addUserData } from "../../slices/userSlice";
import { startLoading } from "../../slices/loadingSlice";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const fetchCompleteUserData = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await axios.get(
        "http://localhost:5000/api/helper/get-complete-user-data",
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setUserData(res.data.data);
      dispatch(addUserData(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/get-complete-data",
        {
          withCredentials: true,
        }
      );
      if (res.data.data) {
        // setUserData(res.data.data);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Update the preview
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    if (!file) return; // Ensure file is selected before proceeding
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.patch(
        "http://localhost:5000/api/user/update-user-profile",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("res", data);
      alert("File uploaded successfully!");
      // Reset file and preview after upload
      setFile(null);
      setPreview("");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };
  useEffect(() => {
    fetchCompleteUserData();
  }, [file]);
  useEffect(() => {
    fetchUserProfile();
    // fetchCompleteUserData();
    console.log("complete", userData);
  }, []);

  return (
    <div className="min-h-screen w-full top-12 md:top-[5rem] md:w-[250px] fixed">
      <div className="w-full flex sm:flex-row md:flex-col items-center justify-between md:justify-center py-8 px-4 md:gap-10">
        <div className="md:flex flex-col items-center hidden md:mt-0 md:w-full">
          <form onSubmit={updateProfileHandler}>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <img
                  src={
                    preview ||
                    userData?.userProfile?.avatarUrl ||
                    "https://i.pinimg.com/736x/c3/e8/c8/c3e8c8abdfa16c2d577623c8610729f4.jpg"
                  }
                  alt="dp"
                  className="w-[3rem] h-[3rem] md:w-[5rem] md:h-[5rem] rounded-full object-cover"
                />
                <CiEdit className="absolute top-[90%] left-[70%] cursor-pointer" />
              </label>
            </div>
            {file && (
              <button type="submit" className="mt-2">
                Upload
              </button>
            )}
          </form>
          <h1 className="text-lg font-semibold dark:text-white mt-2">
            {userData?.name}
          </h1>
          <p className="text-xs md:text-sm dark:text-gray-400">
            {userData?.username}
          </p>
        </div>

        <ul className="flex sm:flex-row md:flex-col items-center justify-center w-full md:gap-4">
          <NavLink
            to=""
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <FaCompass size={20} />
            <li>Feed</li>
          </NavLink>
          <NavLink
            to="message"
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <IoIosMail size={20} />
            <li>Message</li>
          </NavLink>
          <NavLink
            to="forums"
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <MdOutlineForum size={20} />
            <li>Forums</li>
          </NavLink>
          <NavLink
            to="friends"
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <FaUserGroup size={20} />
            <li>Friends</li>
          </NavLink>
          <NavLink
            to="media"
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <MdPermMedia size={20} />
            <li>Media</li>
          </NavLink>
          <NavLink
            to="settings"
            className="flex items-center sm:gap-2 sm:p-1 md:px-12 w-full md:gap-3 md:p-2 dark:text-white hover:text-white font-medium hover:bg-black dark:hover:bg-white dark:hover:text-gray-900 rounded-md transition-all md:w-full"
          >
            <IoSettings size={20} />
            <li className="hidden sm:flex">Settings</li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
