import React from "react";
import { FaVideo } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlinePublic } from "react-icons/md";

const UploadPost = () => {
  return (
    <div className="mx-auto bg-gray-300 p-4 rounded-xl text-black dark:text-white dark:bg-[#dc2f2f]">
      <div className="container">
        <div className="flex items-center gap-4 p-2">
          <img
            src="https://i.pinimg.com/736x/c3/e8/c8/c3e8c8abdfa16c2d577623c8610729f4.jpg"
            alt="dp"
            className="w-[2rem] h-[2rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover"
          />
          <input
            type="text"
            placeholder="Share something..."
            className="w-full p-2 outline-none bg-white rounded-2xl pl-6 lg:w-[500px]"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-2">
            <button className="flex items-center gap-2 text-gray-700 dark:text-white">
              <FaVideo size={20} />
              Video
            </button>
            <button className="flex items-center gap-2 text-gray-700 dark:text-white">
              <FaImages size={20} />
              Image
            </button>
            <button className="flex items-center gap-2 text-gray-700 dark:text-white">
              <FaLocationArrow size={20} />
              Location
            </button>
            <button className="flex items-center gap-2 text-gray-700 dark:text-white">
              <MdOutlinePublic size={20} />
              Public
            </button>
          </div>
          <button className="px-7 py-1 bg-black text-white rounded-2xl">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPost;
