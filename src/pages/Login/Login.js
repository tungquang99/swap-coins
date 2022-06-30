import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./Login.scss"
import { loginUser } from './../../api/apiRequest';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { clientId } from '../../constants/constants';

function Login() {
    const [email, setEmail] = useState('');
    const authUser = useSelector(state => state.authState)
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const users = {
      user: [],
      loading: false,
      error: ''
    }
    // Login
    const login = (e) => {
      e.preventDefault();
      const profile = {
        givenName: email
      }
      users['user'] = {...authUser.user}
      users['user']['profile'] = profile;
      loginUser(users, dispatch, navigation);
    }

    // Login Google
    const onSuccess = (response) => {
      const profile = {
        token: response.accessToken,
        profile: response.profileObj,
        tokenId: response.tokenId
      }
      users['user'] = {...authUser.user, ...profile};
      loginUser(users, dispatch, navigation);
    }

    const onFailure = (response) => {
      users['loading'] = true;
      users['error'] = 'Failed to Login!';
      loginUser(users, dispatch, navigation);
    }

    return (
      <div className='container-login'>
          <div className='login'>
            <input type="email" className="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <button className="btn btn-next" onClick={login}>Continue</button>
            <p>or</p>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
            <button className="btn btn-with btn-with-ios">Continue with Apple</button>
        </div>
      </div>
    );
}

export default Login;