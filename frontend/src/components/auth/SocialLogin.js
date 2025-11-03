import React from 'react';
import GoogleIcon from '../../images/auth/google.png';
import FacebookIcon from '../../images/auth/facebook.png';

const SocialLogin = () => {


    return (
        <div className="social-login-btns">
            <button
                className="social-login-btn"
                type="button">
                <img src={GoogleIcon} alt="Google" /> Continue with Google
            </button>
            <button
                className="social-login-btn"
                type="button">
                <img src={FacebookIcon} alt="FacebookIcon" /> Continue with Facebook
            </button>
        </div>
    );
};


export default SocialLogin;

