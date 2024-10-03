import React, { useState } from "react";
import { FaVideo } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlinePublic } from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const UploadPost = () => {
  const userData = useSelector((state) => state.user.user);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };
  const createPostHandlerWithMedia = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      const result = await axios.post(
        "http://localhost:5000/api/helper/upload-image",

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data", // important for file uploads
          },
          withCredentials: true,
        }
      );

      if (result.data.success) {
        console.log(result.data.data);
        try {
          const res = await axios.post(
            "http://localhost:5000/api/posts/create-post",
            {
              content: content || "",
              college: userData?.college,
              imageUrl: result.data?.data || "",
            },
            {
              withCredentials: true,
            }
          );

          if (res.data.success) {
            toast.success(res.data.message);
            setContent("");
          }
        } catch (error) {
          console.error(error);
          toast.error(error.response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const createPostHandler = async (e) => {
    e.preventDefault();
    if (image || video) {
      createPostHandlerWithMedia();
      return;
    }
    if (content.trim().length === 0) {
      toast.error("Post cannot be empty");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts/create-post",
        {
          content,
          college: userData?.college,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setContent("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mx-auto bg-gray-300 p-4 rounded-xl text-black dark:text-white dark:bg-gray-700">
      <form className="container" onSubmit={createPostHandler}>
        <div className="flex items-center gap-4 p-2">
          <img
            src={userData?.userProfile?.avatarUrl}
            alt="dp"
            className="w-[2rem] h-[2rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover"
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            placeholder="Share something..."
            className="w-full p-2 outline-none bg-white text-black rounded-2xl pl-6 lg:w-[500px]"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-2">
            <label className="flex items-center gap-2 text-gray-700 dark:text-white cursor-pointer">
              <FaVideo size={20} className="font-normal" />
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              Video
            </label>
            <label className="flex items-center gap-2 text-gray-700 dark:text-white cursor-pointer">
              <FaImages size={20} className="font-normal" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Image
            </label>
            <button className="flex items-center gap-2 text-gray-700 dark:text-white">
              <FaLocationArrow size={20} className="font-normal" />
              Location
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 text-gray-700 dark:text-white"
            >
              <MdOutlinePublic size={20} className="font-normal" />
              Public
            </button>
          </div>
          <button className="px-7 py-1 bg-black text-white rounded-2xl">
            Share
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPost;
