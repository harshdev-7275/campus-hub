import axios from "axios";
import React, { useEffect, useState } from "react";
import UploadPost from "./UploadPost";
import Suggestions from "./Suggestions";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../slices/loadingSlice";
import Post from "./Post";
import Notification from "../Notification";

const Feeds = ({}) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
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
    console.log("posts", posts);
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

  return (
    <div className="md:w-[900px]">
      <Notification/>
      <div className="container w-full mx-auto px-4 flex">
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-3xl font-bold">Feeds</h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-lg font-semibold cursor-pointer">
                Recents
              </p>
              <p className="text-gray-500 text-lg font-semibold cursor-pointer">
                Popular
              </p>
            </div>
          </div>
          <div className="w-full">
            {!posts.length > 0 ? (
              <div className="text-center min-h-[50vh] flex justify-center items-center">
                <h1 className="text-3xl font-bold tracking-widest">NO POSTS</h1>
              </div>
            ) : (
              <div>
                {posts.map((post) => (
                  <Post key={post._id} post={post} user={user} />
                ))}
              </div>
            )}
          </div>
         
          <div className="fixed -bottom-2 md:w-[900px] flex items-center justify-center">
            <UploadPost />
          </div>
        </div>
        <div className="">{/* <Suggestions /> */}</div>
      </div>
    </div>
  );
};

export default Feeds;
