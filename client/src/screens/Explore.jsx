import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "axios";
import "ldrs/bouncy";
import { startLoading, stopLoading } from "../slices/loadingSlice";
import UploadPost from "../components/explore/UploadPost";
import Sidebar from "../components/explore/Sidebar";
import Feeds from "../components/explore/Feeds";

const Explore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return isLoading ? (
    <div
      className={`w-screen h-screen flex justify-center items-center ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <l-bouncy
        size="120"
        speed="1.50"
        color={`${isDarkMode ? "white" : "black"}`}
      ></l-bouncy>
    </div>
  ) : (
    <div className="w-full min-h-screen dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-[1400px] h-full gap-10">
        <div className="w-full h-full flex sm:flex-col md:flex-row items-center">
          {/* Sidebar remains unchanged */}
          <Sidebar />

          {/* Outlet will render the nested routes here */}
          <div className="min-h-[calc(100vh-6rem)] w-full mt-[6rem] lg:mt-[4rem] md:ml-[20%] md:w-[50%] ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
