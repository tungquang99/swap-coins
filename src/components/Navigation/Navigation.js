import React, { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import './Navigation.scss';
import { RENDER_IMAGE } from './../../constants/render-image';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getToken, getUser } from './../../Auth/token';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Auth/authSlice';
function Navigation() {
    const getInfo= useSelector(state => state.authState).profile; 
    const user = getInfo ? getInfo :  getUser();
    const [outSide, setOutSide] =  useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
   
    useEffect(() => {
        setOutSide(false);
    }, [getToken()])
    
   
    const handleLogout = () => {
        setOutSide(true);
        dispatch(logout());
        navigate('/gear-shop');
    }

    return (
        <div className='navigation'>
            <div className='navigation-sidebar'>
                <div className="navigation-header">
                    <img src={RENDER_IMAGE.LOGO} className="logo" />
                </div>
                <hr />
                <div className="navigation-body">
                    <div className="nav">
                        <ul className='nav-menu'>
                            {getToken() && <NavLink to="/" className='nav-item'><span className='nav-link'>Storage</span></NavLink>}
                            <NavLink to="gear-shop" className='nav-item'><span className='nav-link'>Gearbox shop</span></NavLink>
                            <NavLink to="vicgem-shop" className='nav-item'><span className='nav-link'>Vicgem shop</span></NavLink>
                            <NavLink to="vicgem-pool" className='nav-item'><span className='nav-link'>Vic/Vicgem pool</span></NavLink>
                            <NavLink to="martket-place" className='nav-item'><span className='nav-link'>Martketplace</span></NavLink>
                        </ul>
                    </div>
                </div>
                <hr />
                <div className="navigation-wallet">
                    <img src={RENDER_IMAGE.ICON.ICON_3} />
                    {
                        outSide ? 
                            <div className='btn btn-primary' onClick={handleLogout}>Logout</div> 
                            : <ConnectWallet />
                    }
                    <div className='user'>
                    { getToken() 
                        ? <div className='btn btn-primary' onClick={() => setOutSide(!outSide)}> 
                            <span className='user-name' title={user.givenName}>{user.givenName}</span>
                            {
                            user.imageUrl ? <img className='user-image' src={user.imageUrl} alt={user.givenName} /> : <span></span>
                            } 
                        </div> 
                        : <Link to='/login' className='btn btn-primary'>Login</Link> 
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navigation;