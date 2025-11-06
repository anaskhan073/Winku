import axios from "axios";
import { toast } from "react-hot-toast";
import { IS_LOGIN } from "./authTypes";

const { REACT_APP_BASE_URL } = process.env;

export const check_auth = async (dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/check-auth`;
        const res = await axios.get(urlPath);
        if (res.data && res.data.status) {
            dispatch({ type: IS_LOGIN, payload: res.data });
            return res;
        }
    } catch (error) {
        console.log(error);
    }
};


export const login = async (data, dispatch) => {
    try {
        const urlPath = `${REACT_APP_BASE_URL}api/auth/login`;
        const res = await axios.post(urlPath, data);
        if (res.data && res.data.status) {
            dispatch({ type: IS_LOGIN, payload: res.data });
            toast.success("Login Successful");
            return res;
        }
    } catch (error) {
        toast.error("Login Failed");
    }
};

