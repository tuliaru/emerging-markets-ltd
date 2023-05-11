import { Outlet } from 'react-router-dom';
import {Link} from "react-router-dom";
import { useLocation } from "react-router-dom";
import IMAGES from '../images';
import { useState, useEffect } from "react";
import axios from 'axios';

const AdminCommonDashboard = () => {

function openNav() {
var element = document.getElementById("sidebar");
element.classList.toggle("collapsed");
}
    
function openToggle() {
var element = document.getElementById("adminmasterdata");
element.classList.toggle("show");
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
    console.log('Moumita Click');
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
    },[Link])

    return(
        <>
        <div className="body-slide body-pd" data-sidebar-behavior="sticky">
        <div className="wrapper dashboardSection">
        {/* sidebar start */}
        <nav id="sidebar" className="sidebar border-end border-secondary">
        <div className="sidebar-content " id="sidebar-sticky">
        
        <div className="sidebar-brand text-start pt-5">
        <figure className="m-0">
        <img className="img-fluid mx-auto" src={IMAGES.Avatar} alt="Avatar"/>
        </figure>
        </div>
        
        <div className="text-center mb-5 lft_panel_box px-3">
        <h5 className="userName fs-5 text-white text-break">{uProfile?.Username}</h5>
        
        
        {/*<ul className="sidebar-nav fs-5 mt-4">
        <li className="sidebar-item pb-0 px-4 mb-0"><Link to="/userdashboard">User type</Link></li>
        <li className="sidebar-item pb-0 px-4 mb-0"><Link className="active"  to="/admindashboard">Admin User</Link></li>
        </ul>*/}
        
        </div>
        
        <ul className="sidebar-nav">
        <li className={`sidebar-item ${splitLocation[1] === "admindashboard" ? "active" : ""}`}>
        <Link to="/admindashboard" className="sidebar-link">
        <img className="d-inline-block align-middle me-2" src={IMAGES.Dashboard} alt="AdminDashboard"/>
        <span className="align-middle">Dashboard</span>
        </Link>
        </li>
        <li className={`sidebar-item ${splitLocation[1] === "adminusermanagement" ? "active" : ""}`}>
        <Link to="/adminusermanagement" className="sidebar-link">
        <img className="d-inline-block align-middle me-2" src={IMAGES.UserManagement} alt="AdminUserManagement"/>
        <span className="align-middle">User Management</span>
        </Link>
        </li>
        <li className={`sidebar-item ${splitLocation[1] === "adminrateupload" ? "active" : ""}`}>
        <Link to="/adminrateupload" className="sidebar-link">
        <img className="d-inline-block align-middle me-2" src={IMAGES.RateUpload} alt="AdminRateUpload"/>
        <span className="align-middle">Rate Upload</span>
        </Link>
        </li>
        <li className={`sidebar-item ${splitLocation[1] === "adminmasterdata" ? "active" : ""}`}>
        <Link className="sidebar-link" onClick={openToggle}>
        <img className="d-inline-block align-middle me-2" src={IMAGES.MasterData} alt="AdminMasterData"/>
        <span className="align-middle">Master Data</span>
        <span className="d-inline-block align-middle mt-2  float-end" ><img  src={IMAGES.AddIcon} alt="AddIcon"/></span>
        </Link>
        
        <ul id="adminmasterdata" className="sidebar-dropdown list-unstyled" style={{height:"0",opacity:"0"}}>
        <li className={`sidebar-item mb-0 ${splitLocation[1] === "admincurrencyandcountry" ? "active" : ""}`}><Link to="/admincurrencyandcountry" className="sidebar-link" href="/">
        <img className="d-inline-block align-middle me-2" src={IMAGES.RightArrow} alt="circle-list"/>Currency &amp; Country</Link></li>
        
        <li className={`sidebar-item mb-0 ${splitLocation[1] === "adminorganizationmaster" ? "active" : ""}`}><Link to="/adminorganizationmaster" className="sidebar-link" href="/">
        <img className="d-inline-block align-middle me-2" src={IMAGES.RightArrow} alt="circle-list"/>Organization</Link></li>
        </ul>
        </li>

        
        
        <li className={`sidebar-item ${splitLocation[1] === "adminreport" ? "active" : ""}`}>
        <Link to="/adminreport" className="sidebar-link">
        <img className="d-inline-block align-middle me-2" src={IMAGES.Report} alt="adminreport"/>
        <span className="align-middle">Reports</span>
        </Link>
        </li>
        
        </ul>
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
<li className="nav-item px-2 py-0"><h4 className="m-0 text-white">Emerging Markets Ltd.</h4></li>
<li className="nav-item px-2 py-0"><span className="text-info text-white">{date}</span></li>
</ul>
<div className="navbar-collapse collapse">
<ul className="navbar-nav navbar-align align-items-center">
<li className="nav-item p-0">
<span className="nav-Link d-none d-sm-inline-block text-white-50 fs-4">Welcome {uProfile?.FirstName}</span>
</li>

<li className="nav-item p-0">
<button className="nav-Link d-none d-sm-inline-block" onClick={handleLogout}>
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
 
 export default AdminCommonDashboard;