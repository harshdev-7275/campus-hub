import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// Import the CSS for toast notifications if necessary
import { useDispatch, useSelector } from "react-redux";


const Notification = () => {
    const userData = useSelector(state => state.user.user)
    console.log("user in noti", userData)
    useEffect(() => {
        // Set up WebSocket connection
        const socket = new WebSocket("ws://localhost:5002");
      
        socket.onopen = () => {
          // Send the user's college ID to the server
          if (userData?.college) {
            socket.send(JSON.stringify({ college: userData.college }));
          }
        };
      
        // Listen for WebSocket messages (real-time notifications)
        socket.onmessage = (event) => {
          const newNotification = JSON.parse(event.data);
          console.log("Received WebSocket notification", newNotification);
      
          // Show the real-time notification as a toast
          toast.success(newNotification.message);
        };
      
        // Clean up WebSocket connection on unmount
        return () => {
          socket.close();
        };
      }, [userData]); // Dependency array ensures the WebSocket is set up with the correct user data
      

  return <div></div>;
};

export default Notification;
