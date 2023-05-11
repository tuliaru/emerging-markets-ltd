import {Routes, Route, useLocation} from 'react-router-dom';
import React, { useEffect, useState } from "react";
import UserCommonDashboard from './component/usercommonDashboard';
import AdminCommonDashboard from './component/admincommonDashboard';
import AdminDashboard from './component/adminDashboard';
import AdminUserManagement from './component/adminUserManagement';
import AdminRateUpload from './component/adminRateUpload';
import AdminMasterData from './component/adminMasterData';
import AdminCurrencyAndCountry from './component/adminCurrencyandCountry';
import AdminReport from './component/adminReport';
import UserDashboard from './component/usersDashboard';
import Signin from "./component/Signin";
import Forgotpassword from "./component/Forgotpassword";
import ClientProtectedRoute from './ClientProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import UserComponent from './UserComponent';
import AdminComponent from './AdminComponent';
import Registration from './component/Registration';
import Userprofile from './component/Userprofile';
import TokenModal from './component/TokenModal';
import ClientUserprofile from './component/ClientUserprofile';
import ChangePassword from './component/ChangePassword';
import OTP from './component/OTP';
import MasterOrganization from './component/MasterOrganization';
import MasterOrganizationEdit from './component/MasterOrganizationEdit';
import BuyRequestList from './component/BuyRequestList';
import BuyRequestView from './component/BuyRequestView';
import axios from "axios";

const App = () => {
    
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
	
	const okBtnClick = ()=>{
		setShowModal(false);
		localStorage.clear();
		window.location.pathname = '/';
	}
    
    useEffect(() =>{
		const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             let token = userType.token;
			 axios.post("https://eml.tulieservices.org/server/wp-json/eml-api/token/validation",{},{headers: {
    'Content-Type': 'application/json','Authorization': 'Bearer ' + token
					}})
					.then((res)=>{})
					.catch(error => {
						if(error?.response?.data?.code == "invalid_or_expired_token"){
							setShowModal(true);
							console.log(showModal);
						}
					});
         }
       
    },[location,showModal]);
    
    return(
    <>
        {
            showModal ? <TokenModal btnCallback={okBtnClick} /> : ''
        }
   <Routes>
		<Route path="/" element={<Signin/>} />
        <Route path="/verify-otp" element={<OTP/>} />
		<Route path="/forgotpassword" element={<Forgotpassword/>} />
		<Route element={<ClientProtectedRoute />}>
           <Route path="/" element={<UserCommonDashboard />}>
                <Route path="/userdashboard" element={<UserDashboard />} />
                <Route path="/clientuserprofile" element={<ClientUserprofile />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                
           </Route>
       </Route>
		<Route element={<AdminProtectedRoute />}>
			<Route path="/" element={<AdminCommonDashboard/>}>
				<Route path="admindashboard" element={<AdminDashboard/>} />
				<Route path="adminusermanagement" element={<AdminUserManagement/>} />
				<Route path="adminrateupload" element={<AdminRateUpload/>} />
				<Route path="adminmasterdata" element={<AdminMasterData/>} />
				<Route path="admincurrencyandcountry" element={<AdminCurrencyAndCountry/>} />
                <Route path="adminorganizationmaster" element={<MasterOrganization/>} />
				<Route path="adminreport" element={<AdminReport/>} />
                <Route path="buyrequestlist" element={<BuyRequestList/>} />        
                <Route path="registration" element={<Registration/>} />
                <Route path="/user-profile/:id" element={<Userprofile/>} />
                <Route path="/master-edit/:id" element={<MasterOrganizationEdit/>} />
                <Route path="/buy-request-view/:id" element={<BuyRequestView/>} />
			</Route>
		</Route>
	</Routes>
    </>
    );
}

export default App;
