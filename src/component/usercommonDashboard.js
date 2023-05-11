import { Outlet } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import ClientUserprofile from './ClientUserprofile';
import {Link} from "react-router-dom";

import IMAGES from '../images';
const UserCommonDashboard = () => {
    
function openNav() {
var element = document.getElementById("sidebar");
element.classList.toggle("collapsed");
}
    
//assigning location variable
const location = useLocation();

//destructuring pathname from location
const { pathname } = location;

//Javascript split method to get the name of the path in array
const splitLocation = pathname.split("/");

const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = '/';
}

const current = new Date();
const date = `${current.getMonth()+1}.${current.getDate()}.${current.getFullYear()}`;
    
const [uProfile, setuProfile] = useState({});
let token = '';

useEffect(() => {
        const userToken = localStorage.getItem('userToken');
		 if(userToken){
			 const userType = JSON.parse(userToken);
             console.log(userType);
             token = userType.token;
         }
        axios.get("https://eml.tulieservices.org/server/wp-json/wp/v2/getcurrentuserprofile", 
                  {headers:{
                  'Authorization':'Bearer ' + token
                  }})
        .then((response) => {
          //console.log(response.data); 
          localStorage.setItem('userProfile',JSON.stringify(response.data[0]));
          setuProfile(JSON.parse(localStorage.getItem('userProfile')));
        console.log(uProfile);
        })
        .catch(error => {
         console.log(error?.response?.data?.code);
        
    })
    },[])
    
    return(
        <>
        <div className="body-slide body-pd" data-sidebar-behavior="sticky">
        <div className="wrapper dashboardSection">
        {/* sidebar start */}
        <nav id="sidebar" className="sidebar border-end border-secondary">
        <div className="sidebar-content" id="sidebar-sticky">
        
        <div className="sidebar-brand text-start pt-5">
        <figure className="m-0">
        <img className="img-fluid mx-auto" src={IMAGES.Avatar} alt="Avatar"/>
        </figure>
        </div>
        
        <div className="text-center mb-4 lft_panel_box px-3">
        <h5 className="userName fs-5 text-white text-break">{uProfile?.Username}</h5>
        
        
        <ul className="user-sidebar-nav fs-5 mt-4">
        <li className={`user-sidebar-item ${splitLocation[1] === "userdashboard" ? "active" : ""}`}><Link className="user-sidebar-link" to="/userdashboard">Home</Link></li>
        <li className={`user-sidebar-item ${splitLocation[1] === "clientuserprofile" ? "active" : ""}`}><Link className="user-sidebar-link" to="/clientuserprofile">Edit  Profile</Link></li>
        <li className={`user-sidebar-item ${splitLocation[1] === "changepassword" ? "active" : ""}`}><Link className="user-sidebar-link" to="/changepassword">Change Password</Link></li>
        </ul>
        </div>
        
        </div>
        </nav>
        {/* sidebar end */}
        
        {/* right panel start */}
        <div className="main">
        {/* top header start */}
        <nav className="navbar navbar-expand navbar-light border-bottom border-secondary">
<ul className="navbar-nav align-items-center">
<li className="nav-item px-2 py-0">
<button className="sidebar-toggle" onClick={openNav} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Navigation">
<img className="d-inline-block align-middle" src={IMAGES.Hamburger} alt="hamburger-icon"/>
</button>
</li>
<li className="nav-item px-2 py-0"><Link to="/userdashboard" className="text-white"><i className="fa-solid fa-house-chimney"></i></Link></li>
<li className="nav-item px-2 py-0"><h4 className="m-0 text-white">Emerging Markets Ltd.</h4></li>
<li className="nav-item px-2 py-0"><span className="text-info text-white">{date}</span></li>
</ul>
<div className="navbar-collapse collapse">
<ul className="navbar-nav navbar-align align-items-center">
<li className="nav-item p-0">
<span className="nav-link d-none d-sm-inline-block text-white-50 fs-4">Welcome {uProfile?.FirstName}</span>
</li>

<li className="nav-item p-0">
<button className="nav-link d-none d-sm-inline-block" onClick={handleLogout}>
<img src={IMAGES.Logout} className="avatar img-fluid rounded-circle me-1 d-sm-inline-block w-50" alt="logout" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Log Out"/></button></li>
</ul>
</div>
</nav>
{/* top header end */}
  
{/*Container Main start*/}
<main className="content">
<div className="container-fluid p-0">
        <Outlet />
</div>
</main>       

{/* Container Main end */}

{/* footer start */}
<footer className="mt-0 mb-2">
<div className="container-fluid px-5">
<div className="row">
<div className="col-12">
<address className="text-end"><small style={{color: "#94A3B8"}}>Copyright Protected by Emerging Markets Ltd. All Rights Reserved.</small></address>
</div>
</div>
</div>
</footer>
{/* footer end */}
</div>
{/* right panel end */}
        
        
        
</div>
</div>


        </>
    );
}

export default UserCommonDashboard;