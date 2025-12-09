import axios from "axios";
import { toast } from "react-hot-toast";
import { IS_LOGIN, AUTH_DETAIL, TOKENS_UPDATE, USERDETAIL } from "./authTypes";

const { REACT_APP_BASE_URL } = process.env;



export const check_auth = async (dispatch, token) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/check-auth`;
        const HEADERS = {
            headers: {
                "token": token,
            },
        };
        const res = await axios.get(urlPath, HEADERS);
        if (res.data?.success) {
            dispatch({ type: IS_LOGIN, payload: res.data });
        }
        return res;
    } catch (error) {
        return null;
    }
};

export const login = async (data, dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/login`;
        const res = await axios.post(urlPath, data);

        if (res.data && res.data.success === true) {
            localStorage.setItem("token", res.data.token);
            dispatch({ type: AUTH_DETAIL, payload: res.data });
            toast.success("Login Successful");
            return res;
        } else {
            const errorMsg = res.data?.message || "Login failed";
            toast.error(errorMsg);
            return { error: errorMsg };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        // console.log("Login error:", error.response || error);
        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

export const user_logout = async (dispatch, token) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}auth/logout`;
        const HEADERS = {
            headers: {
                "x-access-token": token,
            }
        };
        const res = await axios.get(urlPath, HEADERS);

        if (res.data && res.data.success === true) {
            toast.success(res.data.message, { toastId: "updatpwd", autoClose: 1000 });
            return true;
        } else {
            toast.error(res.data.message, { toastId: "updatedpwderr", autoClose: 1000 });
            return false;
        }
    } catch (error) {
        // toast.error(error.response.data.error, { toastId: "updatedwwwww", autoClose: 1000 });
        // check_token_expired_logout(error, dispatch);
    }
};

export const get_user = async (dispatch, token) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/get-user`;
        const HEADERS = {
            headers: {
                "token": token,
            },
        };
        const res = await axios.get(urlPath, HEADERS);

        if (res.data && res.data.success === true) {
            dispatch({ type: USERDETAIL, payload: res.data });
            return res;
        } else {
            const errorMsg = res.data?.message;
            toast.error(errorMsg);
            return { error: errorMsg };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        // console.log("Login error:", error.response || error);
        toast.error(errorMsg);
        return { error: errorMsg };
    }
}

export const user_register = async (formData, dispatch, navigate) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/register`;
        const res = await axios.post(urlPath, formData);

        if (res.data && res.data.success === true) {
            toast.success("Register Successful Please verify your email");
            navigate("/email-verification", { state: { email: formData.email } });
            return res;
        } else {
            const errorMsg = res.data?.message || "Register failed";
            toast.error(errorMsg);
            return { error: errorMsg };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        // console.log("Register error:", error.response || error);
        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

export const email_otp_verify = async (otp, dispatch, navigate) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/email-otp-verification`;
        const res = await axios.post(urlPath, otp);

        if (res.data && res.data.success === true) {
            console.log("Login response:", res);
            localStorage.setItem("token", res.data.token);
            // dispatch({ type: AUTH_DETAIL, payload: res.data });
            toast.success("Email verification successful");
            return res;
        } else {
            const errorMsg = res.data?.message || "Email verification failed";
            toast.error(errorMsg);
            return { error: errorMsg };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        // console.log("Register error:", error.response || error);
        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

export const resend_email_otp = async (email, dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/resend-email-otp`;
        const res = await axios.post(urlPath, { email });
        if (res.data && res.data.success === true) {
            toast.success(res.data.message || "OTP resent successfully");
            return res;
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";
        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

export const forget_password = async (data, dispatch, navigate) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/forget-password`;
        const res = await axios.post(urlPath, data);
        if (res.data && res.data.success === true) {
            navigate("/", { state: { email: data.email } });
            toast.success(res.data.message || "Password reset link sent to your email");
            return res;
        }

    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";
        toast.error(errorMsg);
        return { error: errorMsg };
    }

}

export const reset_password = async (data, token, dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/reset-password/${token}`;
        const res = await axios.put(urlPath, data);
        console.log(res)

        if (res.data && res.data.success === true) {
            localStorage.setItem("token", res.data.token);
            dispatch({ type: AUTH_DETAIL, payload: res.data });
            toast.success("Login Successful");
            return res;
        } else {
            const errorMsg = res.data?.message || "Login failed";
            toast.error(errorMsg);
            return { error: errorMsg };
        }
    } catch (error) {
        const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        // console.log("Login error:", error.response || error);
        toast.error(errorMsg);
        return { error: errorMsg };
    }
};

export const google_callback = async (dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/google/callback`;
        const res = await axios.get(urlPath);
        console.log("res", res);
        if (res.data?.success) {
            dispatch({ type: IS_LOGIN, payload: res.data });
        }
        return res;
    } catch (error) {
        return null;
    }
}

export const complete_google_register = async (data, token, dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/complete-google-register`;
        const HEADERS = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };
        const res = await axios.post(urlPath, data, HEADERS);

        if (res.data && res.data.success === true) {
            toast.success(res.data.message, { toastId: "updatpwd", autoClose: 1000 });
            localStorage.setItem("token", res.data.token);
            dispatch({ type: AUTH_DETAIL, payload: res.data });
            // toast.success("Your Account Successfully Create");
            return res;
        } else {
            toast.error(res.data.message, { toastId: "updatedpwderr", autoClose: 1000 });
        }
    } catch (err) {
        toast.error(err)
    }
}

export const google_direct_login = async (dispatch, token, user) => {
    try {
        localStorage.setItem("token", token);
        dispatch({ type: AUTH_DETAIL, payload: user });
        toast.success("Login Successful");
    } catch (error) {
        console.log("Login error:", error);
    }
};




