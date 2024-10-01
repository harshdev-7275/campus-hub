import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './slices/authSlice'; // Import your action creator

const GoogleLoginButton = () => {


  



  return (
    <div>
      <button >Login with Google</button>
    </div>
  );
};

export default GoogleLoginButton;
