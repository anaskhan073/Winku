import { IS_LOGIN } from "./authTypes";
const initialState = {
    isAuthenticated: false,
};


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case IS_LOGIN:
            return {
                ...state,
                isAuthenticated: action.payload,
            };

        default:
            return state;
    }
};

export default authReducer;
