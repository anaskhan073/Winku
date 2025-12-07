import { IS_LOGIN, TOKENS_UPDATE, AUTH_DETAIL, USERDETAIL } from "./authTypes";


const initialState = {
    isAuthenticated: false,
    accessToken: null,
    user: [],
    userDetails: [],
};


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case IS_LOGIN:
            return {
                ...state,
                isAuthenticated: action.payload,
            };
        case TOKENS_UPDATE:
            return {
                ...state,
                accessToken: action.payload,
            };
        case AUTH_DETAIL:
            return {
                ...state,
                user: action.payload,
            };
        case USERDETAIL:
            return {
                ...state,
                userDetails: action.payload,
            };

        default:
            return state;
    }
};

export default authReducer;
