import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ClientProtectedRoute = (props) => {

    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState("");

    const checkUserToken = () => {
        const userToken = localStorage.getItem('userToken');
		
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return navigate('/');
        }
		
        setIsLoggedIn(true);
		setUserType(JSON.parse(userToken));		
    }

    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    return (
        <>
            {
                (isLoggedIn && (userType.user_type_id==="3" || userType.user_type_id==="0")) ? <Outlet /> : <h1 className="text-white text-center m-5 py-5">Unauthorize to access this page</h1>
            }
        </>
    );
}

export default ClientProtectedRoute;