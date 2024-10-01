import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Check if there's a token in the URL
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');

    // If token is in URL, store it in localStorage
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean the URL
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If no token, redirect to login
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch the user profile
    fetchUserProfile(token);
  }, [location, navigate]);

  const logoutHandler = async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/logout');
      const data = await response.json()
      console.log(data)
      if(!data.success){
        throw new Error("Something went wrong")
      }
      localStorage.removeItem("token")
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  if (error) {
    return (<div>
      Error: {error}
      <button onClick={logoutHandler}>Logout</button>
      </div>);
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <div>
        <h1>User Profile</h1>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
      <div>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
