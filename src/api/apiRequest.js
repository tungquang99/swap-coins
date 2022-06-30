import { loginError, loginStart, loginSuccess } from "../Auth/authSlice";

export const loginUser = async(user, dispatch, navigate) => {
    dispatch(loginStart());
    
    if (user !== '') {
        dispatch(loginSuccess(user));
        navigate('/');
    } else {
        dispatch(loginError('Login Failed!'))
    }
}