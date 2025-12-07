
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import './css/app.css';
import { useDispatch, useSelector } from "react-redux";
import { check_auth, get_user } from "./reduxData/auth/authAction";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import EmailVerification from "./pages/Auth/EmailVerification";
import SelectUserType from "./pages/Auth/SelectUserType";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    check_auth(dispatch);
  }, [dispatch]);

  const islogin = localStorage.getItem("token") || isAuthenticated?.authenticated;

  if(islogin){
    get_user(dispatch)
  }

  console.log("userDetails",userDetails)
  return (
    <>
      <Routes>
        {/* before login */}
        <Route path="/login" element={islogin ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/select-user" element={islogin ? <Navigate to="/" replace /> : <SelectUserType />} />
        <Route path="/register" element={islogin ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/email-verification" element={islogin ? <Navigate to="/" replace /> : <EmailVerification />} />
        <Route path="/forget-password" element={islogin ? <Navigate to="/" replace /> : <ForgetPassword />} />
        <Route path="/reset-password" element={islogin ? <Navigate to="/" replace /> : <ResetPassword />} />
        <Route path="*" element={<Navigate to={islogin ? "/" : "/login"} replace />} />,

        {/* after login */}
        <Route path="/" element={islogin ? <Home /> : <Navigate to="/login" replace />} />

      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;