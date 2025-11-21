import { useState, useRef, useEffect } from "react";
import Authsidescreen from "../../components/auth/Authsidescreen";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { check_auth, email_otp_verify, resend_email_otp } from "../../reduxData/auth/authAction";
import { useResendTimer } from "../../hooks/useResendTimer";

const EmailVerification = () => {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const { remaining, isDisabled, start } = useResendTimer(60);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const email = location.state?.email;

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last digit
        setOtp(newOtp);

        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // const handleResend = async () => {
    //     setIsLoading(true);
    //     await resend_email_otp(email, dispatch);
    //     setIsLoading(false);
    // };


    const handleResend = async () => {
        if (isDisabled) return;

        setIsLoading(true);
        try {
            await resend_email_otp(email, dispatch);
            start();                     // start the 60-second cooldown
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const btnText = (() => {
        if (isLoading) return 'Resend OTP...';
        if (remaining > 0) {
            const mins = Math.floor(remaining / 60);
            const secs = (remaining % 60).toString().padStart(2, '0');
            return `Resend in ${mins}:${secs}`;
        }
        return 'Resend OTP';
    })();

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
        const digits = paste.split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
            if (i < 5) newOtp[i] = digit;
        });
        setOtp(newOtp);
        const nextFocus = Math.min(digits.length, 4);
        inputRefs.current[nextFocus]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { email: email, otp: otp.join("") };
        const response = await email_otp_verify(payload, dispatch);
        if (response) {
            check_auth(dispatch);
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        navigate(-1); // This will take the user back to the previous page
    };

    const isComplete = otp.every(digit => digit !== "");

    return (
        <div className="authenctication-section">
            <Authsidescreen />
            <div className="formside">
                <div className="form-box">
                    <div className="back-button-container">
                        <button onClick={handleBack} className="back-button">
                            &larr; Back
                        </button>
                    </div>
                    <div className="heading">
                        <h3>Email Verification</h3>
                        <p>
                            We sent a 5-digit code to <strong>{email}</strong>
                        </p>
                    </div>

                    <div className="form">
                        <form onSubmit={handleVerify}>
                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="otp-input"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <p className="resend-text">
                                Didn't receive it?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={remaining > 0 || isLoading}
                                    className={`resend-link ${remaining > 0 || !isLoading && 'resend-link-hover'}`}
                                >
                                    {/* {isLoading ? "Resend OTP..." : "Resend OTP"} */}                                    
                                    {btnText}
                                    </button>
                            </p>

                            <div className="buttons">
                                <button
                                    type="submit"
                                    disabled={!isComplete || isLoading}
                                    className="submit-btn"
                                >
                                    {isLoading ? "Verifying..." : "Verify Otp"}

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;


