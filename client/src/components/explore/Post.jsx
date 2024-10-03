import React from "react";
import { useSelector } from "react-redux";
import { Ellipsis, ThumbsUp, MessageCircle, ThumbsDown } from "lucide-react";

const Post = ({ post }) => {
  const user = useSelector((state) => state.user.user);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  console.log("dadad", post, user);
  function timeAgo(timestamp) {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = now - postDate; // Difference in milliseconds

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }
  return (
    <div className="w-full">
      <div
        className={`container flex flex-col ${
          isDarkMode ? "glass" : "bg-white"
        } p-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 ">
              <img
                src={post?.userProfileUrl}
                alt="avatar"
                className="w-full h-full rounded-full object-center"
              />
            </div>
            <div className="flex flex-col cursor-pointer">
              <h1>{post?.user}</h1>
              <p className="font-light">{post?.username}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <Ellipsis />
            <div>
              <p className="text-sm font-extralight">
                {timeAgo(post?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`ml-10 ${
            post.content === null || post.content === "mt-1" ? "" : "mt-3"
          }`}
        >
          <p className="text-sm font-extralight text-gray-400">
            {post?.content}
          </p>
        </div>
        <div
          className="w-full relative overflow-hidden bg-black rounded-md"
          //   style={{ paddingTop: "56.25%" }}
        >
          <img
            src={post?.imageUrl}
            alt=""
            className="object-contain w-full h-auto"
            style={{ maxHeight: "300px" }} // S
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button>
              <ThumbsUp className="text-green-500 w-5 h-5" />
            </button>
            <button>
              <ThumbsDown className="text-red-500 w-5 h-5" />
            </button>
            <button>
              <MessageCircle className="text-blue-500 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
