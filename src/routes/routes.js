import React from 'react';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import RequireAuth from '../Auth/RequireAuth';
import Dashboard from '../pages/Dashboard/Dashboard';
import GearShop from '../pages/GearShop/GearShop';
import Login from '../pages/Login/Login';
import MartketPlace from '../pages/MartketPlace/MartketPlace';
import VicGemPool from '../pages/VicGemPool/VicGemPool';
import VicGemShop from '../pages/VicGemShop/VicGemShop';
import Notfound404 from './../pages/Notfound404/Notfound404';
import { getToken } from './../Auth/token';

function Routers() {

    let element = useRoutes([
        { path: "/", element: <VicGemPool /> },
    ])
    return element;
}
export default Routers;