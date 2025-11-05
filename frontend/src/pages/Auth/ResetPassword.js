import { useState, useEffect } from "react";
import Authsidescreen from '../../components/auth/Authsidescreen'
import { Link } from "react-router-dom";
import SocialLogin from "../../components/auth/SocialLogin";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);


    return (
        <>
            <div className="authenctication-section">
                <Authsidescreen />

                <div className="formside">
                    <div className="form-box">
                        <div className='heading'>
                            <h3>Reset Password</h3>
                        </div>
                        <div className="form">
                            <form action="#">


                                <div class="input-wrapper">
                                    <input type={showPassword ? "text" : "password"} id="password" placeholder=" " />
                                    {showPassword ? <svg onClick={() => setShowPassword(!showPassword)} className='cursor-pointer icon' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" /><path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 0 1 11.811-1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" /></g></svg>
                                        : <svg onClick={() => setShowPassword(!showPassword)} className='cursor-pointer icon' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" /><path fill="currentColor" fillRule="evenodd" d="M5.25 8v1.303q-.34.023-.642.064c-.9.12-1.658.38-2.26.981c-.602.602-.86 1.36-.981 2.26c-.117.867-.117 1.97-.117 3.337v.11c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h8.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26s-1.36-.86-2.26-.981a10 10 0 0 0-.642-.064V8a6.75 6.75 0 0 0-13.5 0M12 2.75A5.25 5.25 0 0 0 6.75 8v1.253q.56-.004 1.195-.003h8.11q.635 0 1.195.003V8c0-2.9-2.35-5.25-5.25-5.25m-7.192 8.103c-.734.099-1.122.28-1.399.556c-.277.277-.457.665-.556 1.4c-.101.755-.103 1.756-.103 3.191s.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h8c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191s-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.277-.277-.665-.457-1.4-.556c-.755-.101-1.756-.103-3.191-.103H8c-1.435 0-2.437.002-3.192.103" clipRule="evenodd" /></svg>}
                                    <label for="password">New Password</label>
                                </div>

                                <div class="input-wrapper">
                                    <input type={showconfirmPassword ? "text" : "password"} id="password" placeholder=" " />
                                    {showconfirmPassword ? <svg onClick={() => setShowConfirmPassword(!showconfirmPassword)} className='cursor-pointer icon' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" /><path strokeLinecap="round" strokeWidth="1.5" d="M6 10V8a6 6 0 0 1 11.811-1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.009m3.982 0H12m3.991 0H16" /></g></svg>
                                        : <svg onClick={() => setShowConfirmPassword(!showconfirmPassword)} className='cursor-pointer icon' xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" /><path fill="currentColor" fillRule="evenodd" d="M5.25 8v1.303q-.34.023-.642.064c-.9.12-1.658.38-2.26.981c-.602.602-.86 1.36-.981 2.26c-.117.867-.117 1.97-.117 3.337v.11c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h8.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26s-1.36-.86-2.26-.981a10 10 0 0 0-.642-.064V8a6.75 6.75 0 0 0-13.5 0M12 2.75A5.25 5.25 0 0 0 6.75 8v1.253q.56-.004 1.195-.003h8.11q.635 0 1.195.003V8c0-2.9-2.35-5.25-5.25-5.25m-7.192 8.103c-.734.099-1.122.28-1.399.556c-.277.277-.457.665-.556 1.4c-.101.755-.103 1.756-.103 3.191s.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h8c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191s-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.277-.277-.665-.457-1.4-.556c-.755-.101-1.756-.103-3.191-.103H8c-1.435 0-2.437.002-3.192.103" clipRule="evenodd" /></svg>}
                                    <label for="password">Confirm Password</label>
                                </div>

                                <div className="buttons flex gap-2">
                                    <button className="submit-btn">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ResetPassword