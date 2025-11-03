import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import './css/app.css';


import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";



const App = () => {
  return (
    <>
      <Routes>
         {/* after login  */}
        <Route path="/" element={<Home />} />

        {/* before login  */}
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Signup />}/>

        
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
