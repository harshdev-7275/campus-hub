import React from "react";
import { useSelector } from "react-redux";
import {
  Ellipsis,
  ThumbsUp,
  MessageCircle,
  ThumbsDown,
  CircleDotDashedIcon,
  Settings2,
  Heart,
  Forward,
  EllipsisVertical,
} from "lucide-react";

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
  // return (
  //   <div className="w-full">
  //     <div
  //       className={`container flex flex-col ${
  //         isDarkMode ? "bg-transparent" : "bg-white"
  //       } p-2 border`}
  //     >
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-2">
  //           <div className="w-8 h-8 ">
  //             <img
  //               src={post?.userProfileUrl}
  //               alt="avatar"
  //               className="w-full h-full rounded-full object-center"
  //             />
  //           </div>
  //           <div className="flex flex-col cursor-pointer">
  //             <h1>{post?.user}</h1>
  //             <p className="font-light">{post?.username}</p>
  //           </div>
  //         </div>
  //         <div className="flex flex-col">
  //           <Ellipsis />
  //           <div>
  //             <p className="text-sm font-extralight">
  //               {timeAgo(post?.createdAt)}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       <div
  //         className={`ml-10 ${
  //           post.content === null || post.content === "mt-1" ? "" : "mt-3"
  //         }`}
  //       >
  //         <p className="text-sm font-extralight text-gray-400">
  //           {post?.content}
  //         </p>
  //       </div>
  //       <div
  //         className="w-full relative overflow-hidden bg-black rounded-md"
  //         //   style={{ paddingTop: "56.25%" }}
  //       >
  //         <img
  //           src={post?.imageUrl}
  //           alt=""
  //           className="object-contain w-full h-auto"
  //           style={{ maxHeight: "300px" }} // S
  //         />
  //       </div>
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-2">
  //           <button>
  //             <ThumbsUp className="text-green-500 w-5 h-5" />
  //           </button>
  //           <button>
  //             <ThumbsDown className="text-red-500 w-5 h-5" />
  //           </button>
  //           <button>
  //             <MessageCircle className="text-blue-500 w-5 h-5" />
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-[50%] h-[50%]">
      {post.imageUrl && (
        <>
          <div className="container mx-auto relative rounded-xl cursor-pointer">
            <img
              src={post?.imageUrl}
              alt=""
              className="w-full h-full rounded-2xl"
            />
            <div className="absolute top-3 left-0 flex items-center justify-between w-full px-3">
              <div className=" rounded-full flex glass items-center gap-1">
                <img
                  src={post?.userProfileUrl}
                  alt="dp"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm font-thin cursor-pointer select-none">{post?.user}</p>
                  <p className="text-sm font-thin select-none hover:underline cursor-pointer">@{post?.username}</p>
                </div>
              </div>

              <button className="glass rounded-full">
              <EllipsisVertical />
              </button>
            </div>
            <div className="absolute bottom-5 flex flex-col gap-1 ml-4 z-50">
              <div className="flex items-center gap-3">
                <button><Heart className="w-5 h-5" /></button>
                <button> <MessageCircle className="w-5 h-5" /></button>
                <button><Forward className="w-5 h-5" /></button>
              </div>
              <div>
                <h1 className="text-sm font-medium tracking-wide">{post?.content}</h1>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
