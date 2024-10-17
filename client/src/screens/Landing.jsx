import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { loginSuccess, logoutSuccess } from "../slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [isUsername, setIsUsername] = useState(false);
  const [isCollege, setIsCollege] = useState(false);
  const [isUserNameLabel, setIsUserNameLabel] = useState(false);
  const [isCollegeLabel, setIsCollegeLabel] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [collegeSearchMsg, setCollegeSearchMsg] = useState(null);
  const [filteredColleges, setFilteredCollege] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null); // To store the selected college
  const [selectedCollegeName, setSelectedCollegeName] = useState(""); // Store the selected college name in the input
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getColleges = async () => {
    try {
      console.log(BASE_URL);

      const res = await axios.get(
        `http://localhost:5000/api/helper/get-all-colleges`,
        {
          withCredentials: true,
        }
      );
      if(res.data.statusCode === 401){

      }

      if (!res.data.success) {
        throw new Error(res.data.message || "Something went wrong");
      }
      // console.log(res.data.colleges);
      setColleges(res.data.colleges);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message||"Something went wrong!");
      navigate("/")
      setIsUsername(false)
      setIsCollege(false)
      dispatch(logoutSuccess())
    }
  };

  const getData = async (token) => {
    try {
      const response = await axios("http://localhost:5000/api/user/user-data", {
        withCredentials: true,
      });
      console.log(response.data);
      if (!response.data.success) {
        throw new Error("Failed to fetch user data");
      }
      toast.success("Login Successful");
      dispatch(loginSuccess(response.data.data));
     setTimeout(() => {
      if(fetchUserData() === true){
        setIsUsername(true);
        setIsCollege(true);
        getColleges();
      }else {
       
        navigate("/explore")
       
      } 
     }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", JSON.stringify(tokenFromUrl));

      getData(tokenFromUrl);
      const url = new URL(window.location.href);
      // url.searchParams.delete("token");

      // window.history.replaceState({}, document.title, url);
    }
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }
    
  }, [location, navigate]);

  useEffect(() => {
    if (!user) {
      setIsUsername(false);
      setIsCollege(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user) {
      setIsUsername(false);
      setIsCollege(false);
    } else {
      setIsUsername(true);
      setIsCollege(true);
      getColleges();
    }
  }, []);

  const getStartHandler = (e) => {
    toast.loading("Logging in...", {
      style: {
        background: "#fff",
        color: "#000",
        fontWeight: "bold",
      },
    });
    window.location.href = "http://localhost:5000/auth/google";
  };

  const userNameHandler = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > 0) {
      setIsUserNameLabel(true);
    } else {
      setIsUserNameLabel(false);
      setIsUsernameAvailable(null); // Reset the state when input is cleared
    }

    // Clear the previous timeout to debounce
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to call the API after 500ms of inactivity
    setTypingTimeout(
      setTimeout(() => {
        if (inputValue.length > 0) {
          checkUserNameAvailable(inputValue);
        }
      }, 500)
    );
  };
  const collegeHandler = (e) => {
    const inputValue = e.target.value;
    setSelectedCollegeName(inputValue);

    if (inputValue.length > 0) {
      setIsCollegeLabel(true);

      const filteredColleges = colleges.filter((college) =>
        college.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      console.log("Filtered Colleges:", filteredColleges);
      if (filteredColleges.length === 0) {
        setCollegeSearchMsg("No colleges found!");
        setFilteredCollege([]);
      } else {
        setCollegeSearchMsg(null);
        setFilteredCollege(filteredColleges);
      }
    } else {
      setIsCollegeLabel(false);
      setFilteredCollege([]);
    }
  };
  const handleCollegeClick = (college) => {
    setSelectedCollege(college);
    setSelectedCollegeName(college.name);
    // toast.success(`Selected: ${college.name}`);

    console.log("Selected College Details: ", {
      name: college.name,
      location: college.location,
      type: college.type,
    });
    setFilteredCollege([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting...", selectedCollege);
    console.log("username", username);
    
    if (username === "" || username === null) {
      toast.error("Enter a valid username", {
        duration: 1000,
      });
      return;
    }
    if (selectedCollege === null) {
      console.log("selectedCollege", selectedCollege);
      toast.error("Please select a valid college", {
        duration: 1000,
      });
      return;
    }

    try {
      const payload = {
        username,
        collegename: selectedCollege.name,
        type: selectedCollege.type,
        location: selectedCollege.location,
      };
      console.log("payload", payload);
      const res = await axios.patch(
        "http://localhost:5000/api/user/update-user",
        payload,
        { withCredentials: true },
        
      );

      console.log(res.data);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      toast.success("Details submitted successfully!", {
        duration:1000
      });
      setTimeout(() => {
        toast.loading("Redirecting to explore page!", {
          duration:1000
        })
      }, 1000);
      
      setTimeout(() => {
        navigate("/explore");
      }, 1000);
      

   
    } catch (error) {
      console.error(error);
      toast.error("Submission failed!", error);
    }
  };
  const checkUserNameAvailable = async (name) => {
    try {
      if(name.length <3){
        toast.error("Username can not be less than 3 character long!")
        return;
      }
      const usernameCheckPromise = axios.get(
        `http://localhost:5000/api/user/username-check?username=${name}`,
        { withCredentials: true }
      );

      toast.promise(usernameCheckPromise, {
        loading: "Checking availability...",
        success: "Username is available!",
        error: "Not Available",
      });

      const res = await usernameCheckPromise;
      console.log(res.data);
      if (res.data.success) {
        setUsername(name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async( )=>{
    try {
      const res = await axios.get("http://localhost:5000/api/user/get-complete-data", {
        withCredentials:true
      })
      console.log("in fetch user datas",res.data.data)
      if(res?.data?.data?.username === null){
        console.log("if username is null")
        return true
      }
      console.log("if username is not null")
      return false
    } catch (error) {
      console.error(error)   
      return false
    }
  }

  return (
    <div
      className={`w-full h-screen dark:bg-black dark:text-white overflow-hidden`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-[1400px] h-full flex flex-col items-center gap-10">
        <div
          className={`flex flex-col items-center gap-4 justify-center ${
            isAuthenticated ? "mt-[8rem]" : " mt-[12rem]"
          } delay-200 duration-500 transition-all ease-linear`}
        >
          <h1 className=" text-center text-5xl md:text-7xl font-bold text-gray-500 tracking-tight">
            {" "}
            <span className="text-pink-300">Welcome</span> To{" "}
            <span className="text-blue-300">CampusHub</span>
          </h1>
          <p className="tracking-widest dark:text-gray-200 text-gray-800 text-center text-sm md:text-base">
            Connect, Collaborate, and Thrive with Your College Community
          </p>
        </div>

        <div>
          {!isAuthenticated && (
            <button
              onClick={getStartHandler}
              className="flex items-center gap-3 px-[2rem] py-2 bg-blue-300 text-gray-800 border-2 font-bold rounded-sm shadow-gray-400 hover:scale-105 transition-transform"
            >
              <FcGoogle size={32} />
              Get Started
            </button>
          )}
          {isUsername && (
            <form
              className="flex flex-col items-center justify-center gap-10"
              onSubmit={handleSubmit}
            >
              <div className="flex gap-10">
                <div className="">
                  <p
                    className={`transform transition-transform duration-700 ${
                      isUserNameLabel
                        ? "opacity-100 translate-y-0"
                        : "-translate-y-4 opacity-0"
                    } text-gray-600`}
                  >
                    UserName
                  </p>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    onChange={userNameHandler}
                    required
                    className="p-2 pl-4 outline-none dark:border-white bg-transparent border-2 border-pink-400 rounded-md"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label
                    className={`transition-transform duration-700 ${
                      isCollegeLabel
                        ? "opacity-100 translate-y-0"
                        : "-translate-y-4 opacity-0"
                    } text-gray-600`}
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    value={selectedCollegeName}
                    placeholder="Enter your college"
                    onChange={collegeHandler}
                    required
                    className="p-2 pl-4 w-[300px] outline-none dark:border-white bg-transparent border-2 border-pink-400 rounded-md"
                  />
                  <ul className="max-w-[300px] max-h-[200px] overflow-y-auto bg-gray-300 rounded-md mt-2 ">
                    {collegeSearchMsg ? (
                      <li>{collegeSearchMsg}</li>
                    ) : (
                      filteredColleges?.map((college) => (
                        <li
                          key={college.id}
                          className="cursor-pointer w-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-black py-2 px-4 border-2"
                          onClick={() => handleCollegeClick(college)}
                        >
                          {college.name}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <button className=" hover:scale-105 bg-black text-white dark:bg-gray-500 transition-transform duration-300 font-semibold px-10 py-2 border-2 border- rounded-md shadow-white ">
                Update User
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
