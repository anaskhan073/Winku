import { useState, useEffect } from "react";
import Authsidescreen from "../../components/auth/Authsidescreen";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { complete_google_register, check_auth, google_callback, google_direct_login } from "../../reduxData/auth/authAction";
import { jwtDecode } from "jwt-decode";   // ← named import, not default
import { toast } from "react-hot-toast";

const SelectUserType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    role: "user",
    termsAccepted: false,
  });

  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract token from URL and decode user
  useEffect(() => {
    google_callback(dispatch)
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const user = query.get("user");

    if(user!=null){
      google_direct_login(dispatch, token, user)
      check_auth(dispatch)
    } else{
      toast.success("Your Account Successfully Create. Select Your Role!")
    }
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setGoogleUser(decoded);
      } catch (err) {
        toast.error("Invalid token", err);
      }
    }
    setLoading(false);
  }, [location]);

  const handleSubmit = async (e) => {    
    e.preventDefault();
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      toast.error("Missing token");
      navigate("/login");
      return;
    }
    let response;
    if(formData.termsAccepted==false){
      toast.error("You must be Agree Term & Conditions!")
    } else{
      response = await complete_google_register(formData, token, dispatch, navigate)
    }
    if (response) {
      check_auth(dispatch);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="authenctication-section">
      <Authsidescreen />
      <div className="formside">
        <div className="form-box">
          <div className="heading">
            <h3>Select Your Role</h3>
            {googleUser ? (
              <p>Welcome, <strong>{googleUser.name || "User"}</strong>! Choose how you'd like to continue:</p>
            ) : (
              <p>Please select your account type to continue.</p>
            )}
          </div>

          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="user-type-section">
                <div className="sale-type-options mt-3">
                  <div
                    className={`sale-card ${formData.role === "user" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "user" })}
                  >
                    <h4>User</h4>
                    <p>Browse and enjoy content</p>
                  </div>
                  <div
                    className={`sale-card ${formData.role === "creator" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "creator" })}
                  >
                    <h4>Creator</h4>
                    <p>Upload and monetize content</p>
                  </div>
                </div>
              </div>

              <div className="login-check">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  />
                  <span></span>
                  I agree with the <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.
                </label>
              </div>

              <div className="buttons flex gap-2">
                <button type="submit" className="submit-btn">
                  Continue as {formData.role === "creator" ? "Creator" : "User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectUserType;