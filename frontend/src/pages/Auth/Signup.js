import { useState } from "react";
import Authsidescreen from "../../components/auth/Authsidescreen";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { user_register, check_auth } from "../../reduxData/auth/authAction";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    termsAccepted: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: "bg-red-500",
  });

  // Add this function inside your component
  const checkPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    if (checks.length) score += 25;
    if (checks.uppercase) score += 25;
    if (checks.number) score += 25;
    if (checks.special) score += 25;

    let label = "Weak";
    let color = "bg-red-500";

    if (score >= 100) { label = "Strong"; color = "bg-green-500"; }
    else if (score >= 75) { label = "Good"; color = "bg-lime-500"; }
    else if (score >= 50) { label = "Medium"; color = "bg-orange-500"; }
    else if (score >= 25) { label = "Weak"; color = "bg-yellow-500"; }

    setPasswordStrength({ score, label, color });
  };



  const handleSubmit = async (e) => {
    setIsSignup(true);
    e.preventDefault();
    await user_register(formData, dispatch, navigate);
    setIsSignup(false);
  };

  return (
    <div className="authenctication-section">
      <Authsidescreen socialuse={"Register"} />
      <div className="formside">
        <div className="form-box">
          <div className="heading">
            <h3>Register</h3>
            <p>
              Don’t use Winku Yet? <Link to="#">Take the tour</Link> or <Link to="#">Join now</Link>
            </p>
          </div>

          <div className="form">
            <form>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  placeholder=" "
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={30} height={30} viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx={12} cy={6} r={4}></circle>
                    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"></path>
                  </g>
                </svg>
                <label htmlFor="fullName">Full Name</label>
              </div>

              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={30} height={30} viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12Z"></path>
                    <path strokeLinecap="round" d="m6 8l2.159 1.8c1.837 1.53 2.755 2.295 3.841 2.295s2.005-.765 3.841-2.296L18 8"></path>
                  </g>
                </svg>
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  value={formData.password}
                  // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    checkPasswordStrength(e.target.value);
                  }}
                />
                {showPassword ? (
                  <svg onClick={() => setShowPassword(false)} className="cursor-pointer icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                      <path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 0 1 11.811-1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" />
                    </g>
                  </svg>
                ) : (
                  <svg onClick={() => setShowPassword(true)} className="cursor-pointer icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
                    <path fill="currentColor" fillRule="evenodd" d="M5.25 8v1.303q-.34.023-.642.064c-.9.12-1.658.38-2.26.981c-.602.602-.86 1.36-.981 2.26c-.117.867-.117 1.97-.117 3.337v.11c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h8.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26s-1.36-.86-2.26-.981a10 10 0 0 0-.642-.064V8a6.75 6.75 0 0 0-13.5 0M12 2.75A5.25 5.25 0 0 0 6.75 8v1.253q.56-.004 1.195-.003h8.11q.635 0 1.195.003V8c0-2.9-2.35-5.25-5.25-5.25m-7.192 8.103c-.734.099-1.122.28-1.399.556c-.277.277-.457.665-.556 1.4c-.101.755-.103 1.756-.103 3.191s.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h8c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191s-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.277-.277-.665-.457-1.4-.556c-.755-.101-1.756-.103-3.191-.103H8c-1.435 0-2.437.002-3.192.103" clipRule="evenodd" />
                  </svg>
                )}
                <label htmlFor="password">Password</label>

                {/* Password Strength Progress Bar */}
                {formData.password && (
                  <div className="mt-4 mb-5">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-600 font-medium">Password Strength</span>
                      <span className={`font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>

                    {/* Live Requirements Feedback */}
                    <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        {formData.password.length >= 8 ? (
                          <span className="text-green-600">Minimum 8 characters</span>
                        ) : (
                          <span className="text-red-500">Minimum 8 characters</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/[A-Z]/.test(formData.password) ? (
                          <span className="text-green-600">One uppercase letter</span>
                        ) : (
                          <span className="text-red-500">One uppercase letter</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/[0-9]/.test(formData.password) ? (
                          <span className="text-green-600">One number</span>
                        ) : (
                          <span className="text-red-500">One number</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? (
                          <span className="text-green-600">One special character</span>
                        ) : (
                          <span className="text-red-500">One special character</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="input-wrapper">
                <input
                  type={showconfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {showconfirmPassword ? (
                  <svg onClick={() => setShowConfirmPassword(false)} className="cursor-pointer icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
                      <path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 0 1 11.811-1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" />
                    </g>
                  </svg>
                ) : (
                  <svg onClick={() => setShowConfirmPassword(true)} className="cursor-pointer icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
                    <path fill="currentColor" fillRule="evenodd" d="M5.25 8v1.303q-.34.023-.642.064c-.9.12-1.658.38-2.26.981c-.602.602-.86 1.36-.981 2.26c-.117.867-.117 1.97-.117 3.337v.11c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h8.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26s-1.36-.86-2.26-.981a10 10 0 0 0-.642-.064V8a6.75 6.75 0 0 0-13.5 0M12 2.75A5.25 5.25 0 0 0 6.75 8v1.253q.56-.004 1.195-.003h8.11q.635 0 1.195.003V8c0-2.9-2.35-5.25-5.25-5.25m-7.192 8.103c-.734.099-1.122.28-1.399.556c-.277.277-.457.665-.556 1.4c-.101.755-.103 1.756-.103 3.191s.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h8c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191s-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.277-.277-.665-.457-1.4-.556c-.755-.101-1.756-.103-3.191-.103H8c-1.435 0-2.437.002-3.192.103" clipRule="evenodd" />
                  </svg>
                )}
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <div className="user-type-section">
                <label className="section-label">Select Sale Type *</label>
                <div className="sale-type-options mt-3">
                  <div
                    className={`sale-card ${formData.role === "user" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "user" })}
                  >
                    <h4>User</h4>
                  </div>
                  <div
                    className={`sale-card ${formData.role === "creator" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "creator" })}
                  >
                    <h4>Creator</h4>
                  </div>
                </div>
              </div>

              <div className="login-check">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    required
                  />
                  <span></span>
                  I agree with the Terms & Privacy Policy.
                </label>
              </div>




              <p className="mb-2">
                Already have an account? <Link to="/login" className="blue-a">Login</Link>
              </p>

              <div className="buttons flex gap-2">
                <button onClick={handleSubmit} type="submit" className="submit-btn" >{isSignup ? 'Register...' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;



