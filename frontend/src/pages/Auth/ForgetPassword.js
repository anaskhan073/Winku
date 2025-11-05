// import { useState, useEffect } from "react";
// import Authsidescreen from '../../components/auth/Authsidescreen'
// import { Link } from "react-router-dom";
// import SocialLogin from "../../components/auth/SocialLogin";

// const ForgetPassword = () => {
//     const [showPassword, setShowPassword] = useState(false);


//     return (
//         <>
//             <div className="authenctication-section">
//                 <Authsidescreen />

//                 <div className="formside">
//                     <div className="form-box">
//                         <div className='heading'>
//                             <h3>Forget Password</h3>
//                         </div>
//                         <div className="form">
//                             <form action="#">
//                                 <div class="input-wrapper">
//                                     <input type="text" id="email" placeholder=" " />
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={30} height={30} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12Z"></path><path strokeLinecap="round" d="m6 8l2.159 1.8c1.837 1.53 2.755 2.295 3.841 2.295s2.005-.765 3.841-2.296L18 8"></path></g></svg>
//                                     <label for="email">Email</label>
//                                 </div>
//                                 <div className="buttons flex gap-2">
//                                     <button className="submit-btn">Submit</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default ForgetPassword




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Authsidescreen from '../../components/auth/Authsidescreen';
import { Link } from "react-router-dom";
import SocialLogin from "../../components/auth/SocialLogin";

const ForgetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleBack = () => {
        navigate(-1); // This will take the user back to the previous page
    };

    return (
        <>
            <div className="authenctication-section">
                <Authsidescreen />

                <div className="formside">
                    <div className="form-box">
                        {/* Back Button */}
                        <div className="back-button-container">
                            <button onClick={handleBack} className="back-button">
                                &larr; Backc
                            </button>
                        </div>
                        <div className='heading'>
                            <h3>Forget Password</h3>
                        </div>
                        <div className="form">
                            <form action="#">
                                <div className="input-wrapper">
                                    <input type="text" id="email" placeholder=" " />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={30} height={30} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12Z"></path><path strokeLinecap="round" d="m6 8l2.159 1.8c1.837 1.53 2.755 2.295 3.841 2.295s2.005-.765 3.841-2.296L18 8"></path></g></svg>
                                    <label for="email">Email</label>
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
    );
}

export default ForgetPassword;
