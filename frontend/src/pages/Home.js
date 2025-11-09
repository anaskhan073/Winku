import React from 'react'
import { user_logout } from '../reduxData/auth/authAction'
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await user_logout(dispatch, localStorage.getItem('token'));
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>


      <button onClick={handleLogout}>logout</button>

    </>
  )
}

export default Home