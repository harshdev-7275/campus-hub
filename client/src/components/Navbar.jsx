import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_URL } from "../constants";
import { logoutSuccess } from "../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async (e) => {
    console.log(AUTH_URL);
    e.preventDefault();
    try {
      const res = await axios(`${AUTH_URL}/logout`, {
        withCredentials: true,
      });

      console.log(res.data.status);
      if (!res.data.status) {
        throw new Error(res.data.message);
      }
      dispatch(logoutSuccess());
      toast.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  };
  return (
    <div
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-black max-h-[200px]"
      } w-full fixed`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-[1400px] h-full flex items-center justify-between py-4">
        <div className="text-xl font-semibold">
          <Link to={"/"} className="text-3xl dark:text-gray-300">
            CampusHub
          </Link>
        </div>
        <div className="flex space-x-4">
          {isAuthenticated && (
            <button
              onClick={logoutHandler}
              className="dark:bg-slate-500 bg-black dark:border-2 text-white px-10 rounded-lg hover:scale-105 transition-transform delay-150"
            >
              Logout
            </button>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
