import axios from "axios";
import React, { useEffect, useState } from "react";
import UploadPost from "./UploadPost";
import Suggestions from "./Suggestions";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../slices/loadingSlice";
import Post from "./Post";
import Notification from "../Notification";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";

const Feeds = ({}) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const user = useSelector((state) => state.auth.user);

  const fetchCompleteUserData = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      dispatch(startLoading());
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
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/posts/get-allPost-by-College",
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Internal server error!");
      }
      setPosts(res.data.posts);
      console.log(res.data.posts);
    } catch (error) {
      console.log(error || "Internal server error");
    }
  };

  const singlePostHandler = (post) => {
    setSelectedPost(post); // Set the clicked post as selected
    setIsModalOpen(true); // Open the modal
    document.body.style.overflow = "hidden"; // Disable scroll
  };

  const closeModalHandler = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedPost(null); // Reset the selected post
    document.body.style.overflow = "auto"; // Enable scroll
  };

  return (
    <div className="md:w-[900px] relative">
      <Notification />
      <div className="container ml-20 w-full mx-auto px-4 flex">
        <div className="w-full flex items-start mx-auto">
          <div className="w-[70%]">
            {!posts.length > 0 ? (
              <div className="text-center min-h-[50vh] flex justify-center items-center">
                <h1 className="text-3xl font-bold tracking-widest">NO POSTS</h1>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 w-full">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.1,
                      ease: "linear",
                    }}
                    className="w-full"
                    // onClick={() => singlePostHandler(post)}
                  >
                    <Post post={post} user={user} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="w-[30%]">Suggestions</div>
        </div>
      </div>
      <div className="absolute md:w-[900px] flex items-center justify-center z-50 top-0 -right-16">
        <UploadPost />
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className="absolute top-0 -left-[370px] w-[1494px] h-[100%] overflow-y- glass flex items-center justify-center">
          <div className="container w-full h-full mx-auto flex flex-col items-center text-white glass" >
          <span className="cursor-pointer absolute right-10 text-5xl" onClick={closeModalHandler}><CircleX /></span>
            <div className="">
              <img src={selectedPost?.imageUrl} alt="image" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feeds;
